/**
 * Drug Handler Functions
 * 
 * This module contains all handler functions for drug-related FDA API endpoints.
 * Each function corresponds to a specific MCP tool and handles the business logic
 * for querying different drug databases.
 */

import { fdaAPIClient } from '../utils/api-client.js';

/**
 * Search drug adverse events
 */
export async function handleSearchDrugAdverseEvents(args: any) {
  try {
    const searchQuery = buildDrugAdverseEventQuery(args);
    const response = await fdaAPIClient.searchDrugAdverseEvents({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugAdverseEvent);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          adverse_events: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Drug adverse events search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

/**
 * Search drug product labeling
 */
export async function handleSearchDrugLabels(args: any) {
  try {
    const searchQuery = buildDrugLabelQuery(args);
    const response = await fdaAPIClient.searchDrugLabels({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugLabel);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          drug_labels: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Drug labels search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

/**
 * Search NDC (National Drug Code) directory
 */
export async function handleSearchDrugNDC(args: any) {
  try {
    const searchQuery = buildDrugNDCQuery(args);
    const response = await fdaAPIClient.searchDrugNDC({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugNDC);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          ndc_entries: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `NDC directory search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

/**
 * Search drug recall enforcement reports
 */
export async function handleSearchDrugRecalls(args: any) {
  try {
    const searchQuery = buildDrugRecallQuery(args);
    const response = await fdaAPIClient.searchDrugRecalls({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugRecall);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          drug_recalls: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Drug recalls search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

/**
 * Search Drugs@FDA database
 */
export async function handleSearchDrugsFDA(args: any) {
  try {
    const searchQuery = buildDrugsFDAQuery(args);
    const response = await fdaAPIClient.searchDrugsFDA({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugsFDA);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          fda_approved_drugs: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Drugs@FDA search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

/**
 * Search drug shortages
 */
export async function handleSearchDrugShortages(args: any) {
  try {
    const searchQuery = buildDrugShortageQuery(args);
    const response = await fdaAPIClient.searchDrugShortages({
      search: searchQuery,
      count: args.count,
      limit: args.limit || 10,
      skip: args.skip || 0
    });

    const results = response.results || [];
    const formattedResults = results.map(formatDrugShortage);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          search_criteria: args,
          total_results: response.meta.results.total,
          results_shown: results.length,
          drug_shortages: formattedResults,
          api_usage: fdaAPIClient.getUsageInfo()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Drug shortages search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }
}

// Query building functions
function buildDrugAdverseEventQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.drug_name) {
    queryParts.push(`patient.drug.medicinalproduct:"${args.drug_name}"`);
  }
  
  if (args.brand_name) {
    queryParts.push(`patient.drug.openfda.brand_name:"${args.brand_name}"`);
  }

  if (args.generic_name) {
    queryParts.push(`patient.drug.openfda.generic_name:"${args.generic_name}"`);
  }

  if (args.reaction) {
    queryParts.push(`patient.reaction.reactionmeddrapt:"${args.reaction}"`);
  }

  if (args.manufacturer) {
    queryParts.push(`patient.drug.openfda.manufacturer_name:"${args.manufacturer}"`);
  }

  if (args.serious_only === true) {
    queryParts.push('serious:1');
  }

  if (args.patient_sex) {
    queryParts.push(`patient.patientsex:"${args.patient_sex}"`);
  }

  if (args.country) {
    queryParts.push(`occurcountry:"${args.country}"`);
  }

  if (args.date_from || args.date_to) {
    const dateQuery = buildDateQuery('receivedate', args.date_from, args.date_to);
    if (dateQuery) queryParts.push(dateQuery);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDrugLabelQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.brand_name) {
    queryParts.push(`openfda.brand_name:"${args.brand_name}"`);
  }

  if (args.generic_name) {
    queryParts.push(`openfda.generic_name:"${args.generic_name}"`);
  }

  if (args.manufacturer) {
    queryParts.push(`openfda.manufacturer_name:"${args.manufacturer}"`);
  }

  if (args.indication) {
    queryParts.push(`indications_and_usage:"${args.indication}"`);
  }

  if (args.active_ingredient) {
    queryParts.push(`active_ingredient:"${args.active_ingredient}"`);
  }

  if (args.route) {
    queryParts.push(`openfda.route:"${args.route}"`);
  }

  if (args.product_type) {
    queryParts.push(`openfda.product_type:"${args.product_type}"`);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDrugNDCQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.product_ndc) {
    queryParts.push(`product_ndc:"${args.product_ndc}"`);
  }

  if (args.package_ndc) {
    queryParts.push(`packaging.package_ndc:"${args.package_ndc}"`);
  }

  if (args.proprietary_name) {
    queryParts.push(`proprietary_name:"${args.proprietary_name}"`);
  }

  if (args.nonproprietary_name) {
    queryParts.push(`nonproprietary_name:"${args.nonproprietary_name}"`);
  }

  if (args.labeler_name) {
    queryParts.push(`labeler_name:"${args.labeler_name}"`);
  }

  if (args.dosage_form) {
    queryParts.push(`dosage_form:"${args.dosage_form}"`);
  }

  if (args.route) {
    queryParts.push(`route:"${args.route}"`);
  }

  if (args.substance_name) {
    queryParts.push(`substance_name:"${args.substance_name}"`);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDrugRecallQuery(args: any): string {
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

  if (args.state) {
    queryParts.push(`state:"${args.state}"`);
  }

  if (args.country) {
    queryParts.push(`country:"${args.country}"`);
  }

  if (args.reason_for_recall) {
    queryParts.push(`reason_for_recall:"${args.reason_for_recall}"`);
  }

  if (args.date_from || args.date_to) {
    const dateQuery = buildDateQuery('recall_initiation_date', args.date_from, args.date_to);
    if (dateQuery) queryParts.push(dateQuery);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDrugsFDAQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.sponsor_name) {
    queryParts.push(`sponsor_name:"${args.sponsor_name}"`);
  }

  if (args.application_number) {
    queryParts.push(`application_number:"${args.application_number}"`);
  }

  if (args.brand_name) {
    queryParts.push(`products.brand_name:"${args.brand_name}"`);
  }

  if (args.generic_name) {
    queryParts.push(`openfda.generic_name:"${args.generic_name}"`);
  }

  if (args.active_ingredient) {
    queryParts.push(`products.active_ingredients.name:"${args.active_ingredient}"`);
  }

  if (args.dosage_form) {
    queryParts.push(`products.dosage_form:"${args.dosage_form}"`);
  }

  if (args.marketing_status) {
    queryParts.push(`products.marketing_status:"${args.marketing_status}"`);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDrugShortageQuery(args: any): string {
  const queryParts: string[] = [];

  if (args.product_name) {
    queryParts.push(`product_name:"${args.product_name}"`);
  }

  if (args.generic_name) {
    queryParts.push(`generic_name:"${args.generic_name}"`);
  }

  if (args.brand_name) {
    queryParts.push(`brand_name:"${args.brand_name}"`);
  }

  if (args.active_ingredient) {
    queryParts.push(`active_ingredients.name:"${args.active_ingredient}"`);
  }

  if (args.shortage_status) {
    queryParts.push(`shortage_status:"${args.shortage_status}"`);
  }

  if (args.shortage_designation) {
    queryParts.push(`shortage_designation:"${args.shortage_designation}"`);
  }

  if (args.dosage_form) {
    queryParts.push(`dosage_form:"${args.dosage_form}"`);
  }

  return queryParts.join(' AND ') || '*';
}

function buildDateQuery(field: string, dateFrom?: string, dateTo?: string): string | null {
  if (!dateFrom && !dateTo) return null;

  if (dateFrom && dateTo) {
    return `${field}:[${dateFrom} TO ${dateTo}]`;
  } else if (dateFrom) {
    return `${field}:[${dateFrom} TO *]`;
  } else if (dateTo) {
    return `${field}:[* TO ${dateTo}]`;
  }

  return null;
}

// Formatting functions
function formatDrugAdverseEvent(event: any): any {
  return {
    safety_report_id: event.safetyreportid,
    report_date: event.receivedate,
    serious: event.serious === '1' ? 'Yes' : 'No',
    country: event.occurcountry,
    patient: {
      age: event.patient?.patientonsetage,
      age_unit: event.patient?.patientonsetageunit,
      sex: event.patient?.patientsex
    },
    drugs: event.patient?.drug?.slice(0, 3)?.map((drug: any) => ({
      name: drug.medicinalproduct,
      brand_name: drug.openfda?.brand_name?.[0],
      generic_name: drug.openfda?.generic_name?.[0],
      manufacturer: drug.openfda?.manufacturer_name?.[0],
      indication: drug.drugindication,
      dosage: drug.drugdosagetext
    })) || [],
    reactions: event.patient?.reaction?.slice(0, 3)?.map((reaction: any) => ({
      term: reaction.reactionmeddrapt,
      outcome: reaction.reactionoutcome
    })) || []
  };
}

function formatDrugLabel(label: any): any {
  return {
    id: label.id,
    set_id: label.set_id,
    version: label.version,
    brand_name: label.openfda?.brand_name?.[0],
    generic_name: label.openfda?.generic_name?.[0],
    manufacturer: label.openfda?.manufacturer_name?.[0],
    product_type: label.openfda?.product_type?.[0],
    active_ingredients: label.active_ingredient?.slice(0, 3) || [],
    indications_and_usage: label.indications_and_usage?.[0]?.substring(0, 200) + '...',
    warnings: label.warnings?.slice(0, 2) || [],
    dosage_and_administration: label.dosage_and_administration?.[0]?.substring(0, 200) + '...',
    contraindications: label.contraindications?.slice(0, 2) || []
  };
}

function formatDrugNDC(ndc: any): any {
  return {
    product_ndc: ndc.product_ndc,
    proprietary_name: ndc.proprietary_name,
    nonproprietary_name: ndc.nonproprietary_name,
    labeler_name: ndc.labeler_name,
    dosage_form: ndc.dosage_form,
    route: ndc.route,
    marketing_category: ndc.marketing_category,
    application_number: ndc.application_number,
    marketing_start_date: ndc.marketing_start_date,
    marketing_end_date: ndc.marketing_end_date,
    active_ingredients: ndc.active_ingredients?.slice(0, 3) || [],
    packaging: ndc.packaging?.slice(0, 2)?.map((pkg: any) => ({
      package_ndc: pkg.package_ndc,
      description: pkg.description
    })) || []
  };
}

function formatDrugRecall(recall: any): any {
  return {
    recall_number: recall.recall_number,
    product_description: recall.product_description,
    recalling_firm: recall.recalling_firm,
    classification: recall.classification,
    status: recall.status,
    reason_for_recall: recall.reason_for_recall,
    recall_initiation_date: recall.recall_initiation_date,
    distribution_pattern: recall.distribution_pattern,
    product_quantity: recall.product_quantity,
    state: recall.state,
    country: recall.country,
    voluntary_mandated: recall.voluntary_mandated
  };
}

function formatDrugsFDA(drug: any): any {
  return {
    application_number: drug.application_number,
    sponsor_name: drug.sponsor_name,
    brand_name: drug.openfda?.brand_name?.[0],
    generic_name: drug.openfda?.generic_name?.[0],
    manufacturer: drug.openfda?.manufacturer_name?.[0],
    products: drug.products?.slice(0, 2)?.map((product: any) => ({
      brand_name: product.brand_name,
      dosage_form: product.dosage_form,
      route: product.route,
      marketing_status: product.marketing_status,
      active_ingredients: product.active_ingredients?.slice(0, 2) || []
    })) || [],
    submissions: drug.submissions?.slice(0, 2)?.map((sub: any) => ({
      submission_type: sub.submission_type,
      submission_status: sub.submission_status,
      submission_status_date: sub.submission_status_date
    })) || []
  };
}

function formatDrugShortage(shortage: any): any {
  return {
    product_id: shortage.product_id,
    product_name: shortage.product_name,
    generic_name: shortage.generic_name,
    brand_name: shortage.brand_name,
    dosage_form: shortage.dosage_form,
    route: shortage.route,
    shortage_status: shortage.shortage_status,
    shortage_designation: shortage.shortage_designation,
    estimated_resupply_date: shortage.estimated_resupply_date,
    created_date: shortage.created_date,
    last_updated_date: shortage.last_updated_date,
    active_ingredients: shortage.active_ingredients?.slice(0, 3) || []
  };
}
