/**
 * FDA API Client Utility
 * 
 * This module provides HTTP client functionality for communicating with the FDA API,
 * including error handling, rate limiting awareness, and response formatting.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { FDAResponse, FDAErrorResponse, SearchParams } from '../types/fda.js';

// FDA API configuration
const FDA_API_BASE_URL = 'https://api.fda.gov';
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Rate limiting constants
const REQUESTS_PER_MINUTE = 240; // With API key
const REQUESTS_PER_HOUR = 120000; // With API key
const REQUESTS_PER_MINUTE_NO_KEY = 40; // Without API key
const REQUESTS_PER_HOUR_NO_KEY = 1000; // Without API key

// API key from environment variable
const FDA_API_KEY = process.env.FDA_API_KEY || 'sNQRRzbOvngzuFVbiajF6AelXY7QncaX3OKN8YQD';

/**
 * FDA API Client class
 */
export class FDAAPIClient {
  private axiosInstance: AxiosInstance;
  private hasAPIKey: boolean;

  constructor() {
    this.hasAPIKey = !!FDA_API_KEY;
    
    this.axiosInstance = axios.create({
      baseURL: FDA_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FDA-MCP-Server/1.0.0',
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleAPIError(error)
    );
  }

  /**
   * Makes a GET request to the FDA API
   */
  async get<T>(endpoint: string, params: SearchParams = {}): Promise<FDAResponse<T>> {
    // Add API key if available
    const requestParams: any = { ...params };
    if (this.hasAPIKey) {
      requestParams.api_key = FDA_API_KEY;
    }

    // Ensure limit is within bounds
    if (requestParams.limit) {
      requestParams.limit = Math.min(requestParams.limit, MAX_LIMIT);
    } else {
      requestParams.limit = DEFAULT_LIMIT;
    }

    // Remove undefined parameters
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key] === undefined || requestParams[key] === null) {
        delete requestParams[key];
      }
    });

    try {
      const response: AxiosResponse<FDAResponse<T>> = await this.axiosInstance.get(endpoint, {
        params: requestParams
      });

      return response.data;
    } catch (error) {
      // Error is already handled by interceptor
      throw error;
    }
  }

  /**
   * Search drug adverse events
   */
  async searchDrugAdverseEvents(searchParams: DrugAdverseEventSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/event.json', params);
  }

  /**
   * Search drug labels
   */
  async searchDrugLabels(searchParams: DrugLabelSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/label.json', params);
  }

  /**
   * Search drug NDC directory
   */
  async searchDrugNDC(searchParams: DrugNDCSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/ndc.json', params);
  }

  /**
   * Search drug recalls
   */
  async searchDrugRecalls(searchParams: DrugRecallSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/enforcement.json', params);
  }

  /**
   * Search Drugs@FDA
   */
  async searchDrugsFDA(searchParams: DrugsFDASearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/drugsfda.json', params);
  }

  /**
   * Search drug shortages
   */
  async searchDrugShortages(searchParams: DrugShortageSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/drug/drugshortages.json', params);
  }

  /**
   * Search device 510(k) clearances
   */
  async searchDevice510K(searchParams: Device510KSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/device/510k.json', params);
  }

  /**
   * Search device classifications
   */
  async searchDeviceClassifications(searchParams: DeviceClassificationSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/device/classification.json', params);
  }

  /**
   * Search device adverse events
   */
  async searchDeviceAdverseEvents(searchParams: DeviceAdverseEventSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/device/event.json', params);
  }

  /**
   * Search device recalls
   */
  async searchDeviceRecalls(searchParams: DeviceRecallSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/device/enforcement.json', params);
  }

  /**
   * Search food adverse events
   */
  async searchFoodAdverseEvents(searchParams: FoodAdverseEventSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/food/event.json', params);
  }

  /**
   * Search food recalls
   */
  async searchFoodRecalls(searchParams: FoodRecallSearchParams): Promise<FDAResponse<any>> {
    const params = this.buildSearchParams(searchParams);
    return this.get('/food/enforcement.json', params);
  }

  /**
   * Get API usage statistics
   */
  getUsageInfo(): APIUsageInfo {
    return {
      hasAPIKey: this.hasAPIKey,
      rateLimits: {
        requestsPerMinute: this.hasAPIKey ? REQUESTS_PER_MINUTE : REQUESTS_PER_MINUTE_NO_KEY,
        requestsPerHour: this.hasAPIKey ? REQUESTS_PER_HOUR : REQUESTS_PER_HOUR_NO_KEY,
      },
      recommendations: this.hasAPIKey 
        ? 'API key configured - higher rate limits available'
        : 'Consider setting FDA_API_KEY environment variable for higher rate limits'
    };
  }

  /**
   * Builds search parameters from user input
   */
  private buildSearchParams(searchParams: any): SearchParams {
    const params: SearchParams = {};

    // Handle search query
    if (searchParams.search) {
      params.search = searchParams.search;
    }

    // Handle count/grouping
    if (searchParams.count) {
      params.count = searchParams.count;
    }

    // Handle pagination
    if (searchParams.limit) {
      params.limit = Math.min(searchParams.limit, MAX_LIMIT);
    }

    if (searchParams.skip) {
      params.skip = searchParams.skip;
    }

    return params;
  }

  /**
   * Handles API errors and provides meaningful error messages
   */
  private handleAPIError(error: AxiosError): never {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${data?.error?.message || 'Invalid search parameters'}`);
        case 404:
          throw new Error('No results found for the given search criteria');
        case 429:
          throw new Error(`Rate limit exceeded. ${this.hasAPIKey ? 'API key rate limits' : 'Consider using an API key for higher limits'}`);
        case 500:
          throw new Error('FDA API server error. Please try again later');
        case 503:
          throw new Error('FDA API service temporarily unavailable');
        default:
          throw new Error(`FDA API error (${status}): ${data?.error?.message || error.message}`);
      }
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to FDA API');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

// Search parameter interfaces for different endpoints
export interface DrugAdverseEventSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DrugLabelSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DrugNDCSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DrugRecallSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DrugsFDASearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DrugShortageSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface Device510KSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DeviceClassificationSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DeviceAdverseEventSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface DeviceRecallSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface FoodAdverseEventSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface FoodRecallSearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

export interface APIUsageInfo {
  hasAPIKey: boolean;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  recommendations: string;
}

// Singleton instance
export const fdaAPIClient = new FDAAPIClient();
