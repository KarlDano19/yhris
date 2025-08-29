// Tab interfaces for better organization

// Company Profile Tab
interface CompanyProfileTab {
  company_name: string;
  date_established: string;
  complete_address: string;
  phone_number: string;
  fax_number: string;
  website_url: string;
  company_owner: string;
  number_of_male_employees: number;
  number_of_female_employees: number;
  total_number_of_employees: number;
  business_description: string[] | string;
  manufacturing_description: string;
  bank_and_financial_institution_description: string;
  service_description: string;
  security_agency_description: string;
  agri_fishing_description: string;
  maintenance_description: string;
  wholesale_retail_description: string;
  construction_description: string;
  utilities_description: string;
  others_description: string;
  product_description: string;
  services_description: string;
}

// Policy Tab
interface PolicyTab {
  basic_components: string;
  company_commitment: string;
  date: string;
  name_of_owner: string;
  signature: File | string;
  signature_source: 'draw' | 'upload' | null;
}

// Risk Management Tab
interface RiskManagementTab {
  emergency_and_disaster_preparedness: Array<{
    task: string;
    hazard_identified: string;
    risk_description: string;
    priority: string;
    control_measures: string;
  }> | string;
}

// Health Welfare Tab
interface HealthWelfareTab {
  routine_medical_surveillance: string[];
  special_medical_surveillance: string[];
  schedule_of_annual_medical_examination: string[];
  random_drug_testing: boolean;
  no_of_treatment_rooms_first_aid_rooms: number;
  no_of_clinics_in_the_workplace: number;
  hospitals_youre_affiliated_with: string;
  
  // Committee Members
  chairperson_less_than_ten: string;
  secretary_less_than_ten: string;
  member_less_than_ten: string;
  chairperson_medium_to_high: string;
  secretary_medium_to_high: string;
  ex_officio_members: string;
  ex_officio_members_1: string;
  ex_officio_members_2: string;
  members: string;
  members_2: string;
  chairperson_joint_coordinating: string;
  secretary_joint_coordinating: string;
  ex_officio_members_3: string;
  ex_officio_members_4: string;
  duties_and_responsibilities: boolean;

  // OSH Personnel
  safety_officers: T_SafetyOfficer[];
  health_personnel: T_HealthPersonnel[];
  health_training: any;
  risk_assessment: any;
  safety_meeting: any;
  reported_incidents: any;
}

// Base types for nested objects
export type T_SafetyOfficer = {
  id?: number | string;
  name: string;
  training_and_hours: string;
  certificate?: File | string | null;
};

export type T_HealthPersonnel = {
  id?: number | string;
  shift_area_department: string;
  total_workers: number;
  health_personnel_name: string;
  facilities: string;
  attachment?: File | string | null;
};

// Safety Measures Tab
interface SafetyMeasuresTab {
  ppe: any;
  ppe_description: string;
  safety_signage: File | string;
  
  // Facilities - using a consistent pattern
  adequate_supply_of_drinking_water: boolean;
  adequate_supply_of_drinking_water_remarks: string;
  adequate_supply_of_drinking_water_attachment: File | string;
  adequate_sanitary_and_washing_facilities: boolean;
  adequate_sanitary_and_washing_facilities_remarks: string;
  adequate_sanitary_and_washing_facilities_attachment: File | string;
  suitable_living_accommodation: boolean;
  suitable_living_accommodation_remarks: string;
  suitable_living_accommodation_attachment: File | string;
  separate_sanitary_washing_and_sleeping_facilities: boolean;
  separate_sanitary_washing_and_sleeping_facilities_remarks: string;
  separate_sanitary_washing_and_sleeping_facilities_attachment: File | string;
  lactation_station: boolean;
  lactation_station_remarks: string;
  lactation_station_attachment: File | string;
  ramps_railings_and_like: boolean;
  ramps_railings_and_like_remarks: string;
  ramps_railings_and_like_attachment: File | string;
  other_workers_welfare_facilities: boolean;
  other_workers_welfare_facilities_remarks: string;
  other_workers_welfare_facilities_attachment: File | string;

  // Emergency and Disaster
  written_emergency_and_disaster_program: boolean;
  drills: any;
  written_pollution_control_program: boolean;
  polution_control_officer: string;
  waste_management_system_message: string;
  prohibited_acts_and_penalties_message: string;
}

// Type for facility fields that follow the same pattern
export type FacilityField = {
  active: boolean;
  remarks: string;
  attachment: File | string | null;
};

// Compliance Cost Tab
interface ComplianceCostTab {
  cost_osh_program: number;
  ppe_cost: number;
  osh_training_cost: number;
  safety_signages_cost: number;
  machine_guards_cost: number;
  medical_examinations_cost: number;
  medical_supplies_cost: number;
  others_name: string;
  others_cost: number;
  annex_a_message: string;
  name_of_owner_manager: string;
  employees_representative: string;
  date_filled: string;
}

// Main type combining all tabs
export type T_OshProgram = CompanyProfileTab & 
  PolicyTab & 
  RiskManagementTab & 
  HealthWelfareTab & 
  SafetyMeasuresTab & 
  ComplianceCostTab & {
    id?: string;
    [key: string]: any; // For dynamic access
  };

// Define field groups by category for better organization
export const OSH_PROGRAM_FIELDS = {
  // File fields
  FILE_FIELDS: [
    'signature',
    'safety_signage',
    'adequate_supply_of_drinking_water_attachment',
    'adequate_sanitary_and_washing_facilities_attachment',
    'suitable_living_accommodation_attachment',
    'separate_sanitary_washing_and_sleeping_facilities_attachment',
    'lactation_station_attachment',
    'ramps_railings_and_like_attachment',
    'other_workers_welfare_facilities_attachment'
  ],

  // Boolean fields
  BOOLEAN_FIELDS: [
    'duties_and_responsibilities',
    'random_drug_testing',
    'adequate_sanitary_and_washing_facilities',
    'adequate_supply_of_drinking_water',
    'suitable_living_accommodation',
    'separate_sanitary_washing_and_sleeping_facilities',
    'lactation_station',
    'ramps_railings_and_like',
    'other_workers_welfare_facilities',
    'written_emergency_and_disaster_program',
    'written_pollution_control_program'
  ],

  // JSON fields
  JSON_FIELDS: [
    'drills',
    'emergency_and_disaster_preparedness',
    'health_training',
    'ppe',
    'reported_incidents',
    'risk_assessment',
    'safety_meeting',
    'business_description',
    'routine_medical_surveillance',
    'special_medical_surveillance',
    'schedule_of_annual_medical_examination'
  ],

  // Date fields
  DATE_FIELDS: [
    'date_established',
    'date',
    'date_filled'
  ],

  // Field mappings for case sensitivity
  FIELD_MAPPINGS: {
    'Company_name': 'company_name',
    'Business_description': 'business_description',
    'Date_established': 'date_established',
    'Complete_address': 'complete_address',
    'Website_url': 'website_url',
    'Number_of_male_employees': 'number_of_male_employees',
    'Number_of_female_employees': 'number_of_female_employees',
    'Total_number_of_employees': 'total_number_of_employees',
    'Date': 'date',
    'Name_of_owner': 'name_of_owner',
    'Signature': 'signature',
    'Date_policy': 'date_policy'
  },

  // Add this new entry
  SAFETY_MEASURES_BOOLEAN_FIELDS: [
    'adequate_supply_of_drinking_water',
    'adequate_sanitary_and_washing_facilities',
    'suitable_living_accommodation',
    'separate_sanitary_washing_and_sleeping_facilities',
    'lactation_station',
    'ramps_railings_and_like',
    'other_workers_welfare_facilities',
    'written_emergency_and_disaster_program',
    'written_pollution_control_program'
  ],
};

// Tab number type
export type OSH_PROGRAM_TAB_NUMBER = 1 | 2 | 3 | 4 | 5 | 6;

// Create a single source of truth for tab fields
export const OSH_PROGRAM_TABS = {
  // Tab field definitions
  FIELDS: {
    1: [
      'company_name', 'date_established', 'complete_address', 'phone_number', 'fax_number', 
      'website_url', 'company_owner', 'number_of_male_employees', 'number_of_female_employees', 
      'total_number_of_employees', 'business_description', 'manufacturing_description', 
      'bank_and_financial_institution_description', 'service_description', 'security_agency_description', 
      'agri_fishing_description', 'maintenance_description', 'wholesale_retail_description', 
      'construction_description', 'utilities_description', 'others_description', 'product_description', 
      'services_description'
    ] as (keyof T_OshProgram)[],
    
    2: [
      'basic_components', 'company_commitment', 'date', 'name_of_owner', 'signature', 
      'signature_source'
    ] as (keyof T_OshProgram)[],
    
    3: [
      'emergency_and_disaster_preparedness'
    ] as (keyof T_OshProgram)[],
    
    4: [
      'routine_medical_surveillance', 'special_medical_surveillance', 'schedule_of_annual_medical_examination',
      'random_drug_testing', 'no_of_treatment_rooms_first_aid_rooms', 'no_of_clinics_in_the_workplace',
      'hospitals_youre_affiliated_with', 'chairperson_less_than_ten', 'secretary_less_than_ten',
      'member_less_than_ten', 'chairperson_medium_to_high', 'secretary_medium_to_high',
      'ex_officio_members', 'ex_officio_members_1', 'ex_officio_members_2', 'members',
      'members_2', 'chairperson_joint_coordinating', 'secretary_joint_coordinating',
      'ex_officio_members_3', 'ex_officio_members_4', 'duties_and_responsibilities',
      'safety_officers', 'health_personnel', 'health_training', 'risk_assessment', 
      'safety_meeting', 'reported_incidents'
    ] as (keyof T_OshProgram)[],
    
    5: [
      'ppe', 'ppe_description', 'safety_signage', 
      'adequate_supply_of_drinking_water', 'adequate_supply_of_drinking_water_remarks', 'adequate_supply_of_drinking_water_attachment',
      'adequate_sanitary_and_washing_facilities', 'adequate_sanitary_and_washing_facilities_remarks', 'adequate_sanitary_and_washing_facilities_attachment',
      'suitable_living_accommodation', 'suitable_living_accommodation_remarks', 'suitable_living_accommodation_attachment',
      'separate_sanitary_washing_and_sleeping_facilities', 'separate_sanitary_washing_and_sleeping_facilities_remarks', 'separate_sanitary_washing_and_sleeping_facilities_attachment',
      'lactation_station', 'lactation_station_remarks', 'lactation_station_attachment',
      'ramps_railings_and_like', 'ramps_railings_and_like_remarks', 'ramps_railings_and_like_attachment',
      'other_workers_welfare_facilities', 'other_workers_welfare_facilities_remarks', 'other_workers_welfare_facilities_attachment',
      'written_emergency_and_disaster_program', 'drills', 'written_pollution_control_program',
      'polution_control_officer', 'waste_management_system_message', 'prohibited_acts_and_penalties_message'
    ] as (keyof T_OshProgram)[],
    
    6: [
      'cost_osh_program', 'ppe_cost', 'osh_training_cost', 'safety_signages_cost',
      'machine_guards_cost', 'medical_examinations_cost', 'medical_supplies_cost',
      'others_name', 'others_cost', 'annex_a_message', 'name_of_owner_manager',
      'employees_representative', 'date_filled'
    ] as (keyof T_OshProgram)[]
  },
  
  // Required fields by tab (subset of FIELDS)
  REQUIRED_FIELDS: {
    1: [
      'company_name', 'date_established', 'complete_address', 'website_url', 
      'number_of_male_employees', 'number_of_female_employees', 'product_description', 'services_description'
    ] as (keyof T_OshProgram)[],
    
    2: [
      'date', 'name_of_owner', 'signature' 
    ] as (keyof T_OshProgram)[],
    
    3: [
      'emergency_and_disaster_preparedness'
    ] as (keyof T_OshProgram)[],
    
    4: [
      'no_of_treatment_rooms_first_aid_rooms', 'no_of_clinics_in_the_workplace', 
      'hospitals_youre_affiliated_with', 'chairperson_less_than_ten', 'secretary_less_than_ten', 
      'member_less_than_ten', 'chairperson_medium_to_high', 'secretary_medium_to_high', 
      'ex_officio_members', 'members', 'chairperson_joint_coordinating', 
      'secretary_joint_coordinating', 'ex_officio_members_1'
    ] as (keyof T_OshProgram)[],
    
    5: [] as (keyof T_OshProgram)[],
    
    6: [
      'name_of_owner_manager', 'employees_representative', 'date_filled'
    ] as (keyof T_OshProgram)[]
  }
};

