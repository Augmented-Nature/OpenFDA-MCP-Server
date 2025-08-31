/**
 * FDA Device Handlers
 * 
 * This module contains handlers for FDA device-related endpoints including
 * 510(k) clearances, classifications, adverse events, and recalls.
 */

import { fdaAPIClient } from '../utils/api-client.js';

/**
 * Handles searching FDA 510(k) device clearances
 */
export async function handleSearchDevice510K(args: any) {
  try {
    const searchQuery = buildDevice510KQuery(args);
    const response = await fdaAPIClient.searchDevice510K({ search: searchQuery, ...args });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            search_criteria: args,
            total_results: response.meta?.results?.total || 0,
            results_shown: response.results?.length || 0,
            device_510k_clearances: response.results?.map(formatDevice510K) || [],
            api_usage: fdaAPIClient.getUsageInfo()
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Device 510(k) search failed: ${(error as Error).message}`);
  }
}

/**
 * Handles searching FDA device classifications
 */
export async function handleSearchDeviceClassifications(args: any) {
  try {
    const searchQuery = buildDeviceClassificationQuery(args);
    const response = await fdaAPIClient.searchDeviceClassifications({ search: searchQuery, ...args });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            search_criteria: args,
            total_results: response.meta?.results?.total || 0,
            results_shown: response.results?.length || 0,
            device_classifications: response.results?.map(formatDeviceClassification) || [],
            api_usage: fdaAPIClient.getUsageInfo()
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Device classification search failed: ${(error as Error).message}`);
  }
}

/**
 * Handles searching FDA device adverse events
 */
export async function handleSearchDeviceAdverseEvents(args: any) {
  try {
    const searchQuery = buildDeviceAdverseEventQuery(args);
    const response = await fdaAPIClient.searchDeviceAdverseEvents({ search: searchQuery, ...args });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            search_criteria: args,
            total_results: response.meta?.results?.total || 0,
            results_shown: response.results?.length || 0,
            device_adverse_events: response.results?.map(formatDeviceAdverseEvent) || [],
            api_usage: fdaAPIClient.getUsageInfo()
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Device adverse event search failed: ${(error as Error).message}`);
  }
}

/**
 * Handles searching FDA device recalls
 */
export async function handleSearchDeviceRecalls(args: any) {
  try {
    const searchQuery = buildDeviceRecallQuery(args);
    const response = await fdaAPIClient.searchDeviceRecalls({ search: searchQuery, ...args });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            search_criteria: args,
            total_results: response.meta?.results?.total || 0,
            results_shown: response.results?.length || 0,
            device_recalls: response.results?.map(formatDeviceRecall) || [],
            api_usage: fdaAPIClient.getUsageInfo()
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Device recall search failed: ${(error as Error).message}`);
  }
}

// Query building functions for device endpoints

function buildDevice510KQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.device_name) {
    queryParts.push(`device_name:"${args.device_name}"`);
  }

  if (args.applicant) {
    queryParts.push(`applicant:"${args.applicant}"`);
  }

  if (args.contact) {
    queryParts.push(`contact:"${args.contact}"`);
  }

  if (args.product_code) {
    queryParts.push(`product_code:"${args.product_code}"`);
  }

  if (args.clearance_type) {
    queryParts.push(`clearance_type:"${args.clearance_type}"`);
  }

  if (args.decision_date_from || args.decision_date_to) {
    const dateQuery = buildDateRangeQuery(
      'decision_date',
      args.decision_date_from,
      args.decision_date_to
    );
    if (dateQuery) queryParts.push(dateQuery);
  }

  return queryParts.length > 0 ? queryParts.join(' AND ') : '';
}

function buildDeviceClassificationQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.device_name) {
    queryParts.push(`device_name:"${args.device_name}"`);
  }

  if (args.device_class) {
    queryParts.push(`device_class:"${args.device_class}"`);
  }

  if (args.medical_specialty) {
    queryParts.push(`medical_specialty:"${args.medical_specialty}"`);
  }

  if (args.product_code) {
    queryParts.push(`product_code:"${args.product_code}"`);
  }

  if (args.regulation_number) {
    queryParts.push(`regulation_number:"${args.regulation_number}"`);
  }

  return queryParts.length > 0 ? queryParts.join(' AND ') : '';
}

function buildDeviceAdverseEventQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.device_name) {
    queryParts.push(`device.brand_name:"${args.device_name}" OR device.generic_name:"${args.device_name}"`);
  }

  if (args.brand_name) {
    queryParts.push(`device.brand_name:"${args.brand_name}"`);
  }

  if (args.manufacturer) {
    queryParts.push(`device.manufacturer_d_name:"${args.manufacturer}"`);
  }

  if (args.product_code) {
    queryParts.push(`device.openfda.fei_number:"${args.product_code}"`);
  }

  if (args.event_type) {
    queryParts.push(`event_type:"${args.event_type}"`);
  }

  if (args.patient_sex) {
    queryParts.push(`patient.sex:"${args.patient_sex}"`);
  }

  if (args.date_from || args.date_to) {
    const dateQuery = buildDateRangeQuery(
      'date_received',
      args.date_from,
      args.date_to
    );
    if (dateQuery) queryParts.push(dateQuery);
  }

  return queryParts.length > 0 ? queryParts.join(' AND ') : '';
}

function buildDeviceRecallQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.product_description) {
    queryParts.push(`product_description:"${args.product_description}"`);
  }

  if (args.recalling_firm) {
    queryParts.push(`recalling_firm:"${args.recalling_firm}"`);
  }

  if (args.classification) {
    queryParts.push(`classification:"${args.classification}"`);
  }

  if (args.status) {
    queryParts.push(`status:"${args.status}"`);
  }

  if (args.product_code) {
    queryParts.push(`openfda.device_class:"${args.product_code}"`);
  }

  if (args.date_from || args.date_to) {
    const dateQuery = buildDateRangeQuery(
      'recall_initiation_date',
      args.date_from,
      args.date_to
    );
    if (dateQuery) queryParts.push(dateQuery);
  }

  return queryParts.length > 0 ? queryParts.join(' AND ') : '';
}

// Formatting functions for device responses

function formatDevice510K(item: any) {
  return {
    k_number: item.k_number,
    device_name: item.device_name,
    applicant: item.applicant,
    contact: item.contact,
    product_code: item.product_code,
    clearance_type: item.clearance_type,
    regulation_number: item.regulation_number,
    decision_date: item.decision_date,
    decision: item.decision,
    statement_or_summary: item.statement_or_summary,
    openfda: {
      device_name: item.openfda?.device_name?.[0],
      device_class: item.openfda?.device_class?.[0],
      regulation_number: item.openfda?.regulation_number?.[0]
    }
  };
}

function formatDeviceClassification(item: any) {
  return {
    product_code: item.product_code,
    device_name: item.device_name,
    device_class: item.device_class,
    medical_specialty: item.medical_specialty,
    medical_specialty_description: item.medical_specialty_description,
    regulation_number: item.regulation_number,
    submission_type_id: item.submission_type_id,
    definition: item.definition,
    openfda: {
      device_name: item.openfda?.device_name?.[0],
      device_class: item.openfda?.device_class?.[0]
    }
  };
}

function formatDeviceAdverseEvent(item: any) {
  return {
    report_number: item.report_number,
    event_type: item.event_type,
    date_received: item.date_received,
    device: item.device?.map((d: any) => ({
      brand_name: d.brand_name,
      generic_name: d.generic_name,
      manufacturer_d_name: d.manufacturer_d_name,
      model_number: d.model_number,
      catalog_number: d.catalog_number,
      device_class: d.openfda?.device_class?.[0]
    }))?.[0] || {},
    patient: {
      age: item.patient?.age,
      sex: item.patient?.sex,
      age_unit: item.patient?.age_unit
    },
    event_description: item.mdr_text?.[0]?.text,
    manufacturer_narrative: item.manufacturer_narrative
  };
}

function formatDeviceRecall(item: any) {
  return {
    recall_number: item.recall_number,
    product_description: item.product_description,
    recalling_firm: item.recalling_firm,
    classification: item.classification,
    status: item.status,
    reason_for_recall: item.reason_for_recall,
    recall_initiation_date: item.recall_initiation_date,
    distribution_pattern: item.distribution_pattern,
    product_quantity: item.product_quantity,
    openfda: {
      device_name: item.openfda?.device_name?.[0],
      device_class: item.openfda?.device_class?.[0]
    }
  };
}

// Utility functions

function buildDateRangeQuery(field: string, from: string, to: string): string {
  if (!from && !to) return '';

  if (from && to) {
    return `${field}:[${from} TO ${to}]`;
  } else if (from) {
    return `${field}:[${from} TO *]`;
  } else {
    return `${field}:[* TO ${to}]`;
  }
}
