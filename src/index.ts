#!/usr/bin/env node

/**
 * FDA API MCP Server
 * 
 * This MCP server provides comprehensive access to FDA datasets including:
 * - Drug adverse events, labels, NDC directory, recalls, approvals, and shortages
 * - Device 510(k) clearances, classifications, adverse events, and recalls
 * - Food adverse events and recalls
 * - Other datasets including substance data, UNII, and tobacco reports
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Import handler functions
import {
  handleSearchDrugAdverseEvents,
  handleSearchDrugLabels,
  handleSearchDrugNDC,
  handleSearchDrugRecalls,
  handleSearchDrugsFDA,
  handleSearchDrugShortages
} from './handlers/drug-handlers.js';

import {
  handleSearchDevice510K,
  handleSearchDeviceClassifications,
  handleSearchDeviceAdverseEvents,
  handleSearchDeviceRecalls
} from './handlers/device-handlers.js';

/**
 * FDA MCP Server
 */
class FDAServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "fda-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Drug Tools
        {
          name: 'search_drug_adverse_events',
          description: 'Search FDA drug adverse event reports (FAERS)',
          inputSchema: {
            type: 'object',
            properties: {
              drug_name: {
                type: 'string',
                description: 'Name of the drug or medication'
              },
              brand_name: {
                type: 'string',
                description: 'Brand/trade name of the drug'
              },
              generic_name: {
                type: 'string',
                description: 'Generic name of the drug'
              },
              manufacturer: {
                type: 'string',
                description: 'Manufacturer name'
              },
              reaction: {
                type: 'string',
                description: 'Adverse reaction or side effect'
              },
              serious_only: {
                type: 'boolean',
                description: 'Only return serious adverse events'
              },
              patient_sex: {
                type: 'string',
                description: 'Patient sex (1=Male, 2=Female)',
                enum: ['1', '2']
              },
              country: {
                type: 'string',
                description: 'Country where event occurred'
              },
              date_from: {
                type: 'string',
                description: 'Start date for date range (YYYYMMDD format)'
              },
              date_to: {
                type: 'string',
                description: 'End date for date range (YYYYMMDD format)'
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting (e.g., "patient.drug.openfda.brand_name.exact")'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_drug_labels',
          description: 'Search FDA drug product labeling information',
          inputSchema: {
            type: 'object',
            properties: {
              brand_name: {
                type: 'string',
                description: 'Brand/trade name of the drug'
              },
              generic_name: {
                type: 'string',
                description: 'Generic name of the drug'
              },
              manufacturer: {
                type: 'string',
                description: 'Manufacturer name'
              },
              active_ingredient: {
                type: 'string',
                description: 'Active ingredient name'
              },
              indication: {
                type: 'string',
                description: 'Medical indication or condition'
              },
              route: {
                type: 'string',
                description: 'Route of administration (e.g., ORAL, TOPICAL)'
              },
              product_type: {
                type: 'string',
                description: 'Product type (e.g., HUMAN PRESCRIPTION DRUG)'
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_drug_ndc',
          description: 'Search National Drug Code (NDC) directory',
          inputSchema: {
            type: 'object',
            properties: {
              product_ndc: {
                type: 'string',
                description: 'Product NDC number'
              },
              package_ndc: {
                type: 'string',
                description: 'Package NDC number'
              },
              proprietary_name: {
                type: 'string',
                description: 'Proprietary/brand name'
              },
              nonproprietary_name: {
                type: 'string',
                description: 'Nonproprietary/generic name'
              },
              labeler_name: {
                type: 'string',
                description: 'Labeler/manufacturer name'
              },
              dosage_form: {
                type: 'string',
                description: 'Dosage form (e.g., TABLET, CAPSULE, INJECTION)'
              },
              route: {
                type: 'string',
                description: 'Route of administration'
              },
              substance_name: {
                type: 'string',
                description: 'Active substance name'
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_drug_recalls',
          description: 'Search drug recall enforcement reports',
          inputSchema: {
            type: 'object',
            properties: {
              product_description: {
                type: 'string',
                description: 'Product description or name'
              },
              recalling_firm: {
                type: 'string',
                description: 'Name of the recalling firm'
              },
              classification: {
                type: 'string',
                description: 'Recall classification (Class I, Class II, Class III)',
                enum: ['Class I', 'Class II', 'Class III']
              },
              status: {
                type: 'string',
                description: 'Recall status',
                enum: ['Ongoing', 'Completed', 'Pending', 'Terminated']
              },
              state: {
                type: 'string',
                description: 'State where recall occurred'
              },
              country: {
                type: 'string',
                description: 'Country where recall occurred'
              },
              reason_for_recall: {
                type: 'string',
                description: 'Reason for the recall'
              },
              date_from: {
                type: 'string',
                description: 'Start date for recall initiation (YYYYMMDD format)'
              },
              date_to: {
                type: 'string',
                description: 'End date for recall initiation (YYYYMMDD format)'
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_drugs_fda',
          description: 'Search Drugs@FDA database for approved drug products',
          inputSchema: {
            type: 'object',
            properties: {
              sponsor_name: {
                type: 'string',
                description: 'Sponsor/applicant name'
              },
              application_number: {
                type: 'string',
                description: 'FDA application number (NDA, ANDA, BLA)'
              },
              brand_name: {
                type: 'string',
                description: 'Brand/trade name of the drug'
              },
              generic_name: {
                type: 'string',
                description: 'Generic name of the drug'
              },
              active_ingredient: {
                type: 'string',
                description: 'Active ingredient name'
              },
              dosage_form: {
                type: 'string',
                description: 'Dosage form'
              },
              marketing_status: {
                type: 'string',
                description: 'Marketing status',
                enum: ['Prescription', 'Over-the-counter', 'Discontinued', 'None']
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_drug_shortages',
          description: 'Search current drug shortages reported to FDA',
          inputSchema: {
            type: 'object',
            properties: {
              product_name: {
                type: 'string',
                description: 'Product name'
              },
              generic_name: {
                type: 'string',
                description: 'Generic name'
              },
              brand_name: {
                type: 'string',
                description: 'Brand name'
              },
              active_ingredient: {
                type: 'string',
                description: 'Active ingredient name'
              },
              shortage_status: {
                type: 'string',
                description: 'Current shortage status',
                enum: ['Currently in Shortage', 'Resolved', 'Discontinued', 'Available']
              },
              shortage_designation: {
                type: 'string',
                description: 'Shortage designation',
                enum: ['Yes', 'No']
              },
              dosage_form: {
                type: 'string',
                description: 'Dosage form'
              },
              count: {
                type: 'string',
                description: 'Field to group results by for counting'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },

        // Device Tools
        {
          name: 'search_device_510k',
          description: 'Search FDA 510(k) device clearances',
          inputSchema: {
            type: 'object',
            properties: {
              device_name: {
                type: 'string',
                description: 'Name of the medical device'
              },
              applicant: {
                type: 'string',
                description: 'Applicant company name'
              },
              contact: {
                type: 'string',
                description: 'Contact information'
              },
              product_code: {
                type: 'string',
                description: 'FDA product code'
              },
              clearance_type: {
                type: 'string',
                description: 'Type of 510(k) clearance'
              },
              decision_date_from: {
                type: 'string',
                description: 'Start date for decision date range (YYYYMMDD format)'
              },
              decision_date_to: {
                type: 'string',
                description: 'End date for decision date range (YYYYMMDD format)'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_device_classifications',
          description: 'Search FDA device classifications',
          inputSchema: {
            type: 'object',
            properties: {
              device_name: {
                type: 'string',
                description: 'Name of the medical device'
              },
              device_class: {
                type: 'string',
                description: 'Device class (I, II, III)',
                enum: ['1', '2', '3']
              },
              medical_specialty: {
                type: 'string',
                description: 'Medical specialty'
              },
              product_code: {
                type: 'string',
                description: 'FDA product code'
              },
              regulation_number: {
                type: 'string',
                description: 'FDA regulation number'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_device_adverse_events',
          description: 'Search FDA device adverse events (MDR)',
          inputSchema: {
            type: 'object',
            properties: {
              device_name: {
                type: 'string',
                description: 'Name of the medical device'
              },
              brand_name: {
                type: 'string',
                description: 'Brand name of the device'
              },
              manufacturer: {
                type: 'string',
                description: 'Device manufacturer name'
              },
              product_code: {
                type: 'string',
                description: 'FDA product code'
              },
              event_type: {
                type: 'string',
                description: 'Type of adverse event'
              },
              patient_sex: {
                type: 'string',
                description: 'Patient sex (F=Female, M=Male)',
                enum: ['F', 'M']
              },
              date_from: {
                type: 'string',
                description: 'Start date for event date range (YYYYMMDD format)'
              },
              date_to: {
                type: 'string',
                description: 'End date for event date range (YYYYMMDD format)'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        },
        {
          name: 'search_device_recalls',
          description: 'Search FDA device recall enforcement reports',
          inputSchema: {
            type: 'object',
            properties: {
              product_description: {
                type: 'string',
                description: 'Product description or name'
              },
              recalling_firm: {
                type: 'string',
                description: 'Name of the recalling firm'
              },
              classification: {
                type: 'string',
                description: 'Recall classification (Class I, Class II, Class III)',
                enum: ['Class I', 'Class II', 'Class III']
              },
              status: {
                type: 'string',
                description: 'Recall status',
                enum: ['Ongoing', 'Completed', 'Pending', 'Terminated']
              },
              product_code: {
                type: 'string',
                description: 'FDA product code'
              },
              date_from: {
                type: 'string',
                description: 'Start date for recall initiation (YYYYMMDD format)'
              },
              date_to: {
                type: 'string',
                description: 'End date for recall initiation (YYYYMMDD format)'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100
              },
              skip: {
                type: 'number',
                description: 'Number of results to skip for pagination',
                minimum: 0
              }
            }
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          // Drug Tools
          case 'search_drug_adverse_events':
            return await handleSearchDrugAdverseEvents(request.params.arguments);
          case 'search_drug_labels':
            return await handleSearchDrugLabels(request.params.arguments);
          case 'search_drug_ndc':
            return await handleSearchDrugNDC(request.params.arguments);
          case 'search_drug_recalls':
            return await handleSearchDrugRecalls(request.params.arguments);
          case 'search_drugs_fda':
            return await handleSearchDrugsFDA(request.params.arguments);
          case 'search_drug_shortages':
            return await handleSearchDrugShortages(request.params.arguments);
          
          // Device Tools
          case 'search_device_510k':
            return await handleSearchDevice510K(request.params.arguments);
          case 'search_device_classifications':
            return await handleSearchDeviceClassifications(request.params.arguments);
          case 'search_device_adverse_events':
            return await handleSearchDeviceAdverseEvents(request.params.arguments);
          case 'search_device_recalls':
            return await handleSearchDeviceRecalls(request.params.arguments);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('FDA API MCP Server running on stdio');
  }
}

const server = new FDAServer();
server.run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
