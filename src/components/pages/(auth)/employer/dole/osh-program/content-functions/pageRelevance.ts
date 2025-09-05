// Function to determine which pages contain changes based on changes description
export const getRelevantPagesFromChanges = (changes: string): number[] => {
  if (!changes) return [];
  
  const changesLower = changes.toLowerCase();
  const relevantPages: number[] = [];
  
  // Define page-specific keywords based on backend readable field names from get_version_changes_summary
  // Using more specific keywords to avoid cross-page matches
  const pageKeywords = [
    // Page 1 - Company Profile (based on backend field_groups['Company Profile'])
    {
      page: 1,
      keywords: [
        'company name', 'date established', 'complete address', 'phone number', 'fax number',
        'website url', 'company owner', 'number of male employees', 'number of female employees',
        'total number of employees', 'business description', 'product description', 'services description'
      ]
    },
    // Page 2 - Basic Components (based on backend field_groups['OSH Program Policy'])
    {
      page: 2,
      keywords: [
        'basic components'
      ]
    },
    // Page 3 - Company Commitment (based on backend field_groups['OSH Program Policy'])
    {
      page: 3,
      keywords: [
        'company commitment', 'signature', 'signature source'
      ]
    },
    // Page 4 - General Safety and Health Programs (based on backend field_groups['Health Welfare'])
    {
      page: 4,
      keywords: [
        'routine medical surveillance', 'special medical surveillance', 'schedule of annual medical examination',
        'random drug testing', 'number of treatment rooms/first aid rooms', 'number of clinics in the workplace',
        'hospitals you\'re affiliated with'
      ]
    },
    // Page 5 - Health Programs and Safety Committee (based on backend field_groups['Health Welfare'])
    {
      page: 5,
      keywords: [
        'duties and responsibilities'
      ]
    },
    // Page 6 - OSH Personnel and Facilities (based on backend field_groups['Health Welfare'])
    {
      page: 6,
      keywords: [
        'health training'
      ]
    },
    // Page 7 - Safety Training and Meetings (based on backend field_groups['Health Welfare'])
    {
      page: 7,
      keywords: [
        'risk assessment', 'safety meeting', 'reported incidents'
      ]
    },
    // Page 8 - PPE and Safety Measures (based on backend field_groups['Safety Measures'])
    {
      page: 8,
      keywords: [
        'personal protective equipment (ppe)', 'ppe description', 'safety signage',
        'adequate supply of drinking water', 'adequate sanitary and washing facilities'
      ]
    },
    // Page 9 - Emergency and Waste Management (based on backend field_groups['Safety Measures'])
    {
      page: 9,
      keywords: [
        'suitable living accommodation', 'separate sanitary, washing and sleeping facilities',
        'lactation station', 'ramps, railings and the like', 'other workers\' welfare facilities',
        'written emergency and disaster program', 'emergency drills', 'written pollution control program',
        'pollution control officer', 'waste management system'
      ]
    },
    // Page 10 - Compliance and Prohibited Acts (based on backend field_groups['Safety Measures'])
    {
      page: 10,
      keywords: [
        'prohibited acts and penalties'
      ]
    },
    // Page 11 - Cost Implementation (based on backend field_groups['Compliance & Cost'])
    {
      page: 11,
      keywords: [
        'cost of osh program', 'ppe cost', 'osh training cost', 'safety signages cost',
        'machine guards cost', 'medical examinations cost', 'medical supplies cost',
        'other items', 'other items cost'
      ]
    },
    // Page 12 - Annex A Health Policy (based on backend field_groups['Compliance & Cost'])
    {
      page: 12,
      keywords: [
        'annex a health policy', 'name of owner/manager', 'employees\' representative', 'date filled'
      ]
    }
  ];
  
  // Check for exact matches first (most specific)
  for (const { page, keywords } of pageKeywords) {
    for (const keyword of keywords) {
      if (changesLower.includes(keyword.toLowerCase())) {
        if (!relevantPages.includes(page)) {
          relevantPages.push(page);
        }
      }
    }
  }
  
  // If no specific matches found, try broader category matching
  if (relevantPages.length === 0) {
    if (changesLower.includes('health welfare') || changesLower.includes('medical surveillance')) {
      relevantPages.push(4);
    } else if (changesLower.includes('safety measures') || changesLower.includes('ppe')) {
      relevantPages.push(8);
    } else if (changesLower.includes('risk management') || changesLower.includes('emergency')) {
      relevantPages.push(3);
    } else if (changesLower.includes('company profile') || changesLower.includes('company name')) {
      relevantPages.push(1);
    } else if (changesLower.includes('cost') || changesLower.includes('budget')) {
      relevantPages.push(11);
    } else {
      // Default to page 1 if no matches found
      relevantPages.push(1);
    }
  }
  
  // Debug logging
  console.log('Changes:', changes);
  console.log('Detected relevant pages:', relevantPages);
  
  return relevantPages;
};
