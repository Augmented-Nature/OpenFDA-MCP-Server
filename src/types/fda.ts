/**
 * FDA API Type Definitions
 * 
 * This file contains TypeScript interfaces for all FDA API response structures
 * and common data types used across different endpoints.
 */

// Base FDA API Response Structure
export interface FDAResponse<T> {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results: T[];
}

// Common OpenFDA fields structure
export interface OpenFDAFields {
  application_number?: string[];
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_ndc?: string[];
  product_type?: string[];
  route?: string[];
  substance_name?: string[];
  spl_id?: string[];
  spl_set_id?: string[];
  package_ndc?: string[];
  nui?: string[];
  pharm_class_epc?: string[];
  pharm_class_moa?: string[];
  pharm_class_cs?: string[];
  pharm_class_pe?: string[];
}

// Drug Adverse Event interfaces
export interface DrugAdverseEvent {
  safetyreportversion?: string;
  safetyreportid?: string;
  primarysourcecountry?: string;
  occurcountry?: string;
  transmissiondateformat?: string;
  transmissiondate?: string;
  reporttype?: string;
  serious?: string;
  seriousnesscongenitalanomali?: string;
  seriousnessdeath?: string;
  seriousnessdisabling?: string;
  seriousnesshospitalization?: string;
  seriousnesslifethreatening?: string;
  seriousnessother?: string;
  receivedate?: string;
  receiptdateformat?: string;
  fulfillexpeditecriteria?: string;
  companynumb?: string;
  duplicate?: string;
  reportduplicate?: {
    duplicatesource?: string;
    duplicatenumb?: string;
  };
  primarysource?: {
    reportercountry?: string;
    qualification?: string;
    literaturereference?: string;
  };
  patient?: {
    patientonsetage?: string;
    patientonsetageunit?: string;
    patientsex?: string;
    patientweight?: string;
    patientdeath?: {
      patientdeathdate?: string;
      patientdeathdateformat?: string;
    };
    drug?: Array<{
      drugcharacterization?: string;
      medicinalproduct?: string;
      drugbatchnumb?: string;
      drugauthorizationnumb?: string;
      drugstructuredosagenumb?: string;
      drugstructuredosageunit?: string;
      drugdosagetext?: string;
      drugdosageform?: string;
      drugadministrationroute?: string;
      drugindication?: string;
      drugstartdate?: string;
      drugstartdateformat?: string;
      drugenddate?: string;
      drugenddateformat?: string;
      drugtreatmentduration?: string;
      drugtreatmentdurationunit?: string;
      actiondrug?: string;
      drugrecurrence?: {
        drugrecurreadministration?: string;
        drugrecurrenceaction?: string;
      };
      openfda?: OpenFDAFields;
      activesubstance?: Array<{
        activesubstancename?: string;
      }>;
    }>;
    reaction?: Array<{
      reactionmeddraversionpt?: string;
      reactionmeddrapt?: string;
      reactionmeddraversionllt?: string;
      reactionmeddrallt?: string;
      reactionoutcome?: string;
    }>;
    summary?: {
      narrativeincludeclinical?: string;
    };
  };
  sender?: {
    sendertype?: string;
    senderorganization?: string;
  };
  receiver?: {
    receivertype?: string;
    receiverorganization?: string;
  };
}

// Drug Label interfaces
export interface DrugLabel {
  id?: string;
  set_id?: string;
  version?: string;
  effective_time?: string;
  inactive_ingredient?: string[];
  purpose?: string[];
  active_ingredient?: string[];
  warnings?: string[];
  do_not_use?: string[];
  stop_use?: string[];
  ask_doctor?: string[];
  ask_doctor_or_pharmacist?: string[];
  when_using?: string[];
  directions?: string[];
  other_information?: string[];
  questions?: string[];
  package_label_principal_display_panel?: string[];
  indications_and_usage?: string[];
  contraindications?: string[];
  dosage_and_administration?: string[];
  warnings_and_cautions?: string[];
  adverse_reactions?: string[];
  drug_interactions?: string[];
  use_in_specific_populations?: string[];
  overdosage?: string[];
  description?: string[];
  clinical_pharmacology?: string[];
  nonclinical_toxicology?: string[];
  clinical_studies?: string[];
  how_supplied?: string[];
  patient_counseling_information?: string[];
  openfda?: OpenFDAFields;
}

// Drug NDC interfaces
export interface DrugNDC {
  product_number?: string;
  product_id?: string;
  product_ndc?: string;
  product_type?: string;
  proprietary_name?: string;
  proprietary_name_suffix?: string;
  nonproprietary_name?: string[];
  dosage_form?: string;
  route?: string[];
  marketing_start_date?: string;
  marketing_end_date?: string;
  marketing_category?: string;
  application_number?: string;
  labeler_name?: string;
  substance_name?: string[];
  active_ingredients?: Array<{
    name?: string;
    strength?: string;
  }>;
  packaging?: Array<{
    package_ndc?: string;
    description?: string;
    marketing_start_date?: string;
    marketing_end_date?: string;
    sample?: boolean;
  }>;
  listing_expiration_date?: string;
  openfda?: OpenFDAFields;
}

// Drug Recall/Enforcement interfaces
export interface DrugEnforcement {
  recall_number?: string;
  reason_for_recall?: string;
  status?: string;
  distribution_pattern?: string;
  product_quantity?: string;
  recall_initiation_date?: string;
  state?: string;
  event_id?: string;
  product_type?: string;
  product_description?: string;
  country?: string;
  city?: string;
  recalling_firm?: string;
  report_date?: string;
  voluntary_mandated?: string;
  classification?: string;
  code_info?: string;
  initial_firm_notification?: string;
  termination_date?: string;
  more_code_info?: string;
  openfda?: OpenFDAFields;
}

// Drug Shortage interfaces
export interface DrugShortage {
  product_id?: number;
  product_name?: string;
  active_ingredients?: Array<{
    name?: string;
    strength?: string;
  }>;
  generic_name?: string;
  brand_name?: string;
  ndc?: string[];
  dosage_form?: string;
  route?: string[];
  shortage_status?: string;
  shortage_designation?: string;
  estimated_resupply_date?: string;
  fda_shortage_url?: string;
  created_date?: string;
  last_updated_date?: string;
  revision_number?: number;
}

// Drugs@FDA interfaces
export interface DrugsFDA {
  application_number?: string;
  sponsor_name?: string;
  openfda?: OpenFDAFields;
  products?: Array<{
    product_number?: string;
    reference_drug?: string;
    brand_name?: string;
    active_ingredients?: Array<{
      name?: string;
      strength?: string;
    }>;
    reference_standard?: string;
    dosage_form?: string;
    route?: string;
    marketing_status?: string;
    te_code?: string;
  }>;
  submissions?: Array<{
    submission_type?: string;
    submission_number?: string;
    submission_status?: string;
    submission_status_date?: string;
    submission_class_code?: string;
    submission_class_code_description?: string;
    review_priority?: string;
    application_docs?: Array<{
      id?: string;
      url?: string;
      date?: string;
      type?: string;
    }>;
  }>;
}

// Device interfaces
export interface Device510K {
  k_number?: string;
  fei_number?: string;
  applicant?: string;
  contact?: string;
  date_received?: string;
  decision_date?: string;
  decision_code?: string;
  decision_description?: string;
  statement_or_summary?: string;
  clearance_type?: string;
  expedited_review_flag?: string;
  product_code?: string;
  advisory_committee?: string;
  advisory_committee_description?: string;
  third_party_flag?: string;
  device_name?: string;
  openfda?: {
    device_name?: string[];
    medical_specialty_description?: string[];
    device_class?: string[];
    fei_number?: string[];
    k_number?: string[];
    pma_number?: string[];
    regulation_number?: string[];
    registration_number?: string[];
  };
}

export interface DeviceClassification {
  device_name?: string;
  medical_specialty?: string;
  medical_specialty_description?: string;
  device_class?: string;
  gmp_exempt_flag?: string;
  implant_flag?: string;
  life_sustain_support_flag?: string;
  product_code?: string;
  regulation_number?: string;
  review_code?: string;
  review_panel?: string;
  summary_malfunction_reporting?: string;
  third_party_flag?: string;
  openfda?: {
    device_name?: string[];
    medical_specialty_description?: string[];
    device_class?: string[];
    regulation_number?: string[];
  };
}

export interface DeviceAdverseEvent {
  mdr_report_key?: string;
  event_key?: string;
  report_number?: string;
  report_source_code?: string;
  manufacturer_name?: string;
  date_received?: string;
  adverse_event_flag?: string;
  product_problem_flag?: string;
  date_report?: string;
  date_of_event?: string;
  reprocessed_and_reused_flag?: string;
  device_date_of_manufacturer?: string;
  single_use_flag?: string;
  previous_use_code?: string;
  remedial_action?: string[];
  removal_correction_number?: string;
  event_location?: string;
  report_to_fda?: string;
  report_to_manufacturer?: string;
  source_type?: string[];
  date_manufacturer_received?: string;
  device?: Array<{
    brand_name?: string;
    generic_name?: string;
    manufacturer_d_name?: string;
    model_number?: string;
    product_code?: string;
    catalog_number?: string;
    lot_number?: string;
    other_id_number?: string;
    device_report_product_code?: string;
    device_age_text?: string;
    device_availability?: string;
    date_returned_to_manufacturer?: string;
    device_evaluated_by_manufacturer?: string;
    openfda?: {
      device_name?: string[];
      medical_specialty_description?: string[];
      device_class?: string[];
      regulation_number?: string[];
    };
  }>;
  patient?: Array<{
    date_received?: string;
    sequence_number_treatment?: string;
    sequence_number_outcome?: string[];
  }>;
  mdr_text?: Array<{
    mdr_text_key?: string;
    text_type_code?: string;
    patient_sequence_number?: string;
    date_report?: string;
    text?: string;
  }>;
}

// Food interfaces
export interface FoodAdverseEvent {
  report_number?: string;
  outcomes?: string[];
  date_created?: string;
  date_started?: string;
  reactions?: string[];
  products?: Array<{
    name_brand?: string;
    industry_code?: string;
    industry_name?: string;
    role?: string;
  }>;
  consumer?: {
    gender?: string;
    age?: string;
    age_unit?: string;
  };
}

export interface FoodEnforcement {
  recall_number?: string;
  reason_for_recall?: string;
  status?: string;
  distribution_pattern?: string;
  product_quantity?: string;
  recall_initiation_date?: string;
  state?: string;
  event_id?: string;
  product_type?: string;
  product_description?: string;
  country?: string;
  city?: string;
  recalling_firm?: string;
  report_date?: string;
  voluntary_mandated?: string;
  classification?: string;
  code_info?: string;
  initial_firm_notification?: string;
  termination_date?: string;
  more_code_info?: string;
  openfda?: {
    manufacturer_name?: string[];
    product_type?: string[];
  };
}

// Search parameters interfaces
export interface SearchParams {
  search?: string;
  count?: string;
  limit?: number;
  skip?: number;
}

// Utility types for tool responses
export interface FDAToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

// Error response interface
export interface FDAErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
