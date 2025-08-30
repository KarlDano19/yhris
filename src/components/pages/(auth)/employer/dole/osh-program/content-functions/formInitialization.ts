import { OSH_PROGRAM_FIELDS } from "@/types/osh-program";

/**
 * Initialize form values from OSH Program details
 */
export const initializeFormValues = (
  oshProgramDetails: any,
  setValue: (name: string, value: any, options?: any) => void,
  cachedProfile: any,
  setSafetySignageUrl: (url: string) => void,
  setSafetySignageAttachmentExist: (exists: boolean) => void
) => {
  if (!oshProgramDetails) return;

  // Tab 1: Company Profile
  // Only set company_name from backend if no cached profile data is available
  if (!cachedProfile?.state?.data?.name) {
    setValue("company_name", oshProgramDetails.company_name);
  }
  setValue("date_established", oshProgramDetails.date_established);
  // Only set complete_address from backend if no cached profile data is available
  if (!cachedProfile?.state?.data?.building && !cachedProfile?.state?.data?.street && !cachedProfile?.state?.data?.locality && !cachedProfile?.state?.data?.city && !cachedProfile?.state?.data?.country && !cachedProfile?.state?.data?.zip_code) {
    setValue("complete_address", oshProgramDetails.complete_address);
  }
  // Only set phone_number from backend if no cached profile data is available
  if (!cachedProfile?.state?.data?.mobile_number) {
    setValue("phone_number", oshProgramDetails.phone_number);
  }
  setValue("fax_number", oshProgramDetails.fax_number);
  setValue("website_url", oshProgramDetails.website_url);
  setValue("company_owner", oshProgramDetails.company_owner);
  setValue("number_of_male_employees", oshProgramDetails.number_of_male_employees);
  setValue("number_of_female_employees", oshProgramDetails.number_of_female_employees);
  setValue("total_number_of_employees", oshProgramDetails.total_number_of_employees);
  setValue("business_description", oshProgramDetails.business_description);
  setValue("manufacturing_description", oshProgramDetails.manufacturing_description);
  setValue("bank_and_financial_institution_description", oshProgramDetails.bank_and_financial_institution_description);
  setValue("service_description", oshProgramDetails.service_description);
  setValue("security_agency_description", oshProgramDetails.security_agency_description);
  setValue("agri_fishing_description", oshProgramDetails.agri_fishing_description);
  setValue("maintenance_description", oshProgramDetails.maintenance_description);
  setValue("wholesale_retail_description", oshProgramDetails.wholesale_retail_description);
  setValue("construction_description", oshProgramDetails.construction_description);
  setValue("utilities_description", oshProgramDetails.utilities_description);
  setValue("others_description", oshProgramDetails.others_description);
  setValue("product_description", oshProgramDetails.product_description);
  setValue("services_description", oshProgramDetails.services_description);

  // Tab 2: OSH Program and Policy
  setValue("basic_components", oshProgramDetails.basic_components);
  setValue("company_commitment", oshProgramDetails.company_commitment);
  setValue("date", oshProgramDetails.date);
  setValue("name_of_owner", oshProgramDetails.name_of_owner);
  setValue("signature", oshProgramDetails.signature);
  setValue("signature_source", oshProgramDetails.signature_source);

  // Tab 3: Risk Management
  setValue("emergency_and_disaster_preparedness", oshProgramDetails.emergency_and_disaster_preparedness);

  // Tab 4: Health and Welfare Program
  // Medical Surveillance Section
  setValue("routine_medical_surveillance", oshProgramDetails.routine_medical_surveillance);
  setValue("special_medical_surveillance", oshProgramDetails.special_medical_surveillance);
  setValue("schedule_of_annual_medical_examination", oshProgramDetails.schedule_of_annual_medical_examination);
  setValue("random_drug_testing", oshProgramDetails.random_drug_testing);

  // First-Aid, Health Care Medicines and Equipment Facilities
  setValue("no_of_treatment_rooms_first_aid_rooms", oshProgramDetails.no_of_treatment_rooms_first_aid_rooms);
  setValue("no_of_clinics_in_the_workplace", oshProgramDetails.no_of_clinics_in_the_workplace);
  setValue("hospitals_youre_affiliated_with", oshProgramDetails.hospitals_youre_affiliated_with);

  // Committee Members
  // A. For establishments with less than ten workers
  setValue("chairperson_less_than_ten", oshProgramDetails.chairperson_less_than_ten);
  setValue("secretary_less_than_ten", oshProgramDetails.secretary_less_than_ten);
  setValue("member_less_than_ten", oshProgramDetails.member_less_than_ten);

  // B. For medium to high risk establishments
  setValue("chairperson_medium_to_high", oshProgramDetails.chairperson_medium_to_high);
  setValue("secretary_medium_to_high", oshProgramDetails.secretary_medium_to_high);
  setValue("ex_officio_members", oshProgramDetails.ex_officio_members);
  setValue("ex_officio_members_1", oshProgramDetails.ex_officio_members_1);
  setValue("ex_officio_members_2", oshProgramDetails.ex_officio_members_2);
  setValue("members", oshProgramDetails.members);
  setValue("members_2", oshProgramDetails.members_2);

  // C. Joint Coordinating Committee
  setValue("chairperson_joint_coordinating", oshProgramDetails.chairperson_joint_coordinating);
  setValue("secretary_joint_coordinating", oshProgramDetails.secretary_joint_coordinating);
  setValue("ex_officio_members_3", oshProgramDetails.ex_officio_members_3);
  setValue("ex_officio_members_4", oshProgramDetails.ex_officio_members_4);

  // Safety and Health Committee Minutes/Reports
  setValue("duties_and_responsibilities", oshProgramDetails.duties_and_responsibilities);

  // OSH Personnel and Facilities - Safety Officer
  setValue("safety_officers", oshProgramDetails.safety_officers || []);
  
  // Emergency Occupational Health Personnel and Facilities
  setValue("health_personnel", oshProgramDetails.health_personnel || []);

  // Safety and Health Promotion, training and education
  setValue("health_training", oshProgramDetails.health_training);

  // Risk Assessment Table
  setValue("risk_assessment", oshProgramDetails.risk_assessment);

  // Tool Box Meetings/Safety Meetings
  setValue("safety_meeting", oshProgramDetails.safety_meeting);

  // Accident/Incident/Injury Reports
  setValue("reported_incidents", oshProgramDetails.reported_incidents);

  // Tab 5: Safety Measures
  // Provision and use of PPE Section
  setValue("ppe", oshProgramDetails.ppe);
  setValue("ppe_description", oshProgramDetails.ppe_description);
  
  // Safety Signage Section
  setValue("safety_signage", oshProgramDetails.safety_signage);
  
  // Dust Control and Management Section - Facilities Table
  setValue("adequate_supply_of_drinking_water", oshProgramDetails.adequate_supply_of_drinking_water);
  setValue("adequate_supply_of_drinking_water_remarks", oshProgramDetails.adequate_supply_of_drinking_water_remarks);
  setValue("adequate_supply_of_drinking_water_attachment", oshProgramDetails.adequate_supply_of_drinking_water_attachment);

  setValue("adequate_sanitary_and_washing_facilities", oshProgramDetails.adequate_sanitary_and_washing_facilities);
  setValue("adequate_sanitary_and_washing_facilities_remarks", oshProgramDetails.adequate_sanitary_and_washing_facilities_remarks);
  setValue("adequate_sanitary_and_washing_facilities_attachment", oshProgramDetails.adequate_sanitary_and_washing_facilities_attachment);
  
  setValue("suitable_living_accommodation", oshProgramDetails.suitable_living_accommodation);
  setValue("suitable_living_accommodation_remarks", oshProgramDetails.suitable_living_accommodation_remarks);
  setValue("suitable_living_accommodation_attachment", oshProgramDetails.suitable_living_accommodation_attachment);
  
  setValue("separate_sanitary_washing_and_sleeping_facilities", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities);
  setValue("separate_sanitary_washing_and_sleeping_facilities_remarks", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_remarks);
  setValue("separate_sanitary_washing_and_sleeping_facilities_attachment", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_attachment);
  
  setValue("lactation_station", oshProgramDetails.lactation_station);
  setValue("lactation_station_remarks", oshProgramDetails.lactation_station_remarks);
  setValue("lactation_station_attachment", oshProgramDetails.lactation_station_attachment);
  
  setValue("ramps_railings_and_like", oshProgramDetails.ramps_railings_and_like);
  setValue("ramps_railings_and_like_remarks", oshProgramDetails.ramps_railings_and_like_remarks);
  setValue("ramps_railings_and_like_attachment", oshProgramDetails.ramps_railings_and_like_attachment);
  
  setValue("other_workers_welfare_facilities", oshProgramDetails.other_workers_welfare_facilities);
  setValue("other_workers_welfare_facilities_remarks", oshProgramDetails.other_workers_welfare_facilities_remarks);
  setValue("other_workers_welfare_facilities_attachment", oshProgramDetails.other_workers_welfare_facilities_attachment);
  
  // Emergency and Disaster Preparedness Section
  setValue("written_emergency_and_disaster_program", oshProgramDetails.written_emergency_and_disaster_program);
  setValue("drills", oshProgramDetails.drills);
  
  // Solid Waste Management System Section
  setValue("written_pollution_control_program", oshProgramDetails.written_pollution_control_program);
  setValue("polution_control_officer", oshProgramDetails.polution_control_officer);
  setValue("waste_management_system_message", oshProgramDetails.waste_management_system_message);
  
  // Prohibited Acts and Penalties Section
  setValue("prohibited_acts_and_penalties_message", oshProgramDetails.prohibited_acts_and_penalties_message);

  // Tab 6: Compliance and Cost
  // Cost of implementing company OSH program
  setValue("cost_osh_program", oshProgramDetails.cost_osh_program);
  
  // Annual estimated amount for OSH program implementation
  setValue("ppe_cost", oshProgramDetails.ppe_cost);
  setValue("osh_training_cost", oshProgramDetails.osh_training_cost);
  setValue("safety_signages_cost", oshProgramDetails.safety_signages_cost);
  setValue("machine_guards_cost", oshProgramDetails.machine_guards_cost);
  setValue("medical_examinations_cost", oshProgramDetails.medical_examinations_cost);
  setValue("medical_supplies_cost", oshProgramDetails.medical_supplies_cost);
  setValue("others_name", oshProgramDetails.others_name);
  setValue("others_cost", oshProgramDetails.others_cost);
  
  // ANNEX A Section
  setValue("annex_a_message", oshProgramDetails.annex_a_message);
  
  // Signature Section
  setValue("name_of_owner_manager", oshProgramDetails.name_of_owner_manager);
  setValue("employees_representative", oshProgramDetails.employees_representative);
  setValue("date_filled", oshProgramDetails.date_filled);

  // Set file fields
  if (oshProgramDetails.safety_signage) {
    if (typeof oshProgramDetails.safety_signage === 'string') {
      setSafetySignageUrl(oshProgramDetails.safety_signage);
    }
    setSafetySignageAttachmentExist(true);
  }

  // Handle boolean fields - preserve null values
  OSH_PROGRAM_FIELDS.BOOLEAN_FIELDS.forEach(field => {
    // Only set the value if it exists in oshProgramDetails
    if (field in oshProgramDetails) {
      setValue(field, oshProgramDetails[field]);
    } else {
      setValue(field, null);
    }
  });
};
