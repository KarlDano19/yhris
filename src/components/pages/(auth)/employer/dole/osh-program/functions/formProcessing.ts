import { UseFormWatch } from "react-hook-form";

import { T_OshProgram, OSH_PROGRAM_FIELDS, OSH_PROGRAM_TABS } from "@/types/osh-program";

type ExtendedOshProgram = Partial<T_OshProgram> & {
  id?: string;
  [key: string]: any;
};

// Helper function to get facility fields (assuming this exists in the original context)
const getFacilityFields = (): string[] => {
  // This should match the facility fields from the original implementation
  return [
    'adequate_supply_of_drinking_water_attachment',
    'adequate_sanitary_and_washing_facilities_attachment',
    'suitable_living_accommodation_attachment',
    'separate_sanitary_washing_and_sleeping_facilities_attachment',
    'lactation_station_attachment',
    'ramps_railings_and_like_attachment',
    'other_workers_welfare_facilities_attachment'
  ];
};

// Process attachments based on the current tab
export const processAttachments = (
  data: ExtendedOshProgram, 
  processedData: ExtendedOshProgram, 
  selectedTab: number
): void => {
  // Special handling for file attachments in Tab 4
  if (selectedTab === 4) {
    // Explicitly include file attachments for safety officer and health personnel
    if (data.safety_officer_attachment !== undefined) {
      processedData.safety_officer_attachment = data.safety_officer_attachment;
    }
    
    if (data.health_personnel_attachment !== undefined) {
      processedData.health_personnel_attachment = data.health_personnel_attachment;
    }
  }

  // Special handling for file attachments in Tab 5 (Safety Measures)
  if (selectedTab === 5) {
    // Include all the facility attachment fields
    getFacilityFields().forEach(field => {
      if (data[field] !== undefined) {
        processedData[field] = data[field];
      }
    });
  }
};

// Process boolean fields based on the current tab
export const processBooleanFields = (
  processedData: ExtendedOshProgram, 
  selectedTab: number
): void => {
  // Special handling for boolean fields in tabs 4 and 5
  if (selectedTab === 4) {
    // Handle boolean fields for Health and Welfare tab
    if ('duties_and_responsibilities' in processedData) {
      const value = processedData.duties_and_responsibilities as boolean | string | null | undefined;
      if (value === true || value === 'true') processedData.duties_and_responsibilities = true;
      else if (value === false || value === 'false') processedData.duties_and_responsibilities = false;
    }
    if ('random_drug_testing' in processedData) {
      const value = processedData.random_drug_testing as boolean | string | null | undefined;
      if (value === true || value === 'true') processedData.random_drug_testing = true;
      else if (value === false || value === 'false') processedData.random_drug_testing = false;
    }
  }

  if (selectedTab === 5) {
    // Handle boolean fields for Safety Measures tab
    OSH_PROGRAM_FIELDS.SAFETY_MEASURES_BOOLEAN_FIELDS.forEach(field => {
      if (field in processedData) {
        // Preserve null values, only convert explicit true/false
        const value = processedData[field] as boolean | string | null | undefined;
        if (value === true || value === 'true') processedData[field] = true;
        else if (value === false || value === 'false') processedData[field] = false;
        // Leave null/undefined values as is
      }
    });
  }
};

// Process JSON fields
export const processJsonFields = (processedData: ExtendedOshProgram): void => {
  OSH_PROGRAM_FIELDS.JSON_FIELDS.forEach(field => {
    if (field in processedData) {
      if (typeof processedData[field] === 'object') {
        processedData[field] = JSON.stringify(processedData[field]);
      } else if (typeof processedData[field] === 'string') {
        try {
          JSON.parse(processedData[field]); // Validate it's valid JSON
        } catch (e) {
          processedData[field] = JSON.stringify({}); // Default to empty object if invalid
        }
      }
    }
  });
};

// Process signature field for tab 2
export const processSignatureField = (
  data: ExtendedOshProgram, 
  processedData: ExtendedOshProgram, 
  watch: UseFormWatch<ExtendedOshProgram>
): void => {
  const currentSignature = watch("signature");
  const signatureSource = watch("signature_source");
  
  if (currentSignature instanceof File) {
    // Keep the File object as is for FormData
    processedData.signature = currentSignature;
    processedData.signature_source = signatureSource;
  } else if (typeof currentSignature === 'string') {
    processedData.signature = currentSignature;
    processedData.signature_source = signatureSource;
  }
};

// Process safety officers and health personnel data
export const processPersonnelData = (processedData: ExtendedOshProgram): void => {
  // Process safety officers
  if (processedData.safety_officers && Array.isArray(processedData.safety_officers)) {
    // Filter out empty entries
    processedData.safety_officers = processedData.safety_officers.filter(officer => 
      officer && (officer.name || officer.training_and_hours || officer.certificate)
    );
  }
  
  // Process health personnel
  if (processedData.health_personnel && Array.isArray(processedData.health_personnel)) {
    // Filter out empty entries
    processedData.health_personnel = processedData.health_personnel.filter(personnel => 
      personnel && (
        personnel.shift_area_department || 
        personnel.health_personnel_name || 
        personnel.facilities || 
        personnel.attachment
      )
    );
  }
};

// Process the form data for the current tab
export const processFormData = (
  data: ExtendedOshProgram,
  selectedTab: number,
  oshProgramDetails: T_OshProgram | undefined,
  watch: UseFormWatch<ExtendedOshProgram>
): ExtendedOshProgram => {
  // Get the fields for the current tab
  const currentTabFields = OSH_PROGRAM_TABS.FIELDS[selectedTab as keyof typeof OSH_PROGRAM_TABS.FIELDS];
  
  // Create a new object with only the fields from the current tab
  const processedData: ExtendedOshProgram = {};
  
  // Add the ID if it exists
  if (oshProgramDetails?.id) {
    processedData.id = oshProgramDetails.id;
  }

  // Only process fields from the current tab
  currentTabFields.forEach((field: keyof T_OshProgram) => {
    // Skip boolean fields if they're not in the current tab
    if (OSH_PROGRAM_FIELDS.BOOLEAN_FIELDS.includes(field as string) && ![4, 5].includes(selectedTab)) {
      return;
    }
    
    if (data[field] !== undefined) {
      processedData[field] = data[field];
    }
  });

  // Process file attachments based on tab
  processAttachments(data, processedData, selectedTab);

  // Process boolean fields based on tab
  processBooleanFields(processedData, selectedTab);

  // Handle JSON fields if they exist in the current tab
  processJsonFields(processedData);

  // Handle file fields
  if (selectedTab === 2) {
    processSignatureField(data, processedData, watch);
  }

  // Handle safety officers and health personnel arrays
  if (selectedTab === 4) {
    processPersonnelData(processedData);
  }

  return processedData;
};
