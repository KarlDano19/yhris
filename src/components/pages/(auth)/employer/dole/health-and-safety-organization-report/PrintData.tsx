import React from 'react';

import DocumentPageOne from './print/DocumentPageOne';
import DocumentPageTwo from './print/DocumentPageTwo';

interface HealthAndSafetyReportData {
  dateFiled: string;
  regionalLaborOfficeNo: string;
  fileNumber: string;
  establishmentName: string;
  address: string;
  natureOfBusiness: string;
  personsEmployed: {
    management: {
      shifts: Array<{
        male: number;
        female: number;
      }>;
    };
    total: {
      male: number;
      female: number;
    };
  };
  policyAndProgram: string;
  safetyCommittee: {
    type: string;
    members: {
      chairman: {
        name: string;
        position: string;
      };
      members: Array<{
        name: string;
        position: string;
      }>;
      secretary: {
        name: string;
        position: string;
      };
    };
  };
  technicalInformation: {
    processDescription: string;
  };
  submittedBy: {
    name: string;
    position: string;
  };
}

interface SafetyCommitteeData {
  generalRequirement: string;
  safetyCommitteeTypes: {
    typeA: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeB: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeC: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeD: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeE: {
      description: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
  };
}

export const prepareHealthAndSafetyReportData = (item: any): HealthAndSafetyReportData => {
  // Process shift employees data
  const shiftEmployees = Array.isArray(item.shift_employees) ? item.shift_employees : [];
  
  // Helper function to safely parse shift data
  const parseShiftData = (shiftData: any) => {
    if (shiftData && typeof shiftData === 'object') {
      return {
        male: parseInt(shiftData.male || '0') || 0,
        female: parseInt(shiftData.female || '0') || 0,
      };
    }
    return { male: 0, female: 0 };
  };
  
  // Process all shifts dynamically
  const shifts = shiftEmployees.map(parseShiftData);
  
  return {
    dateFiled: item.date_of_report || '\u00A0',
    regionalLaborOfficeNo: item.regional_labor_office_no || '\u00A0',
    fileNumber: item.file_number || '\u00A0',
    establishmentName: item.company_name || '\u00A0',
    address: item.address || '\u00A0',
    natureOfBusiness: item.type_of_industry || '\u00A0',
    personsEmployed: {
      management: {
        shifts: shifts,
      },
      total: {
        male: item.total_employees_male || 0,
        female: item.total_employees_female || 0,
      },
    },
    policyAndProgram: item.policy_and_program || '\u00A0',
    safetyCommittee: {
      type: item.comittee_type || '\u00A0',
      members: {
        chairman: {
          name: item.chairman_name && item.chairman_name !== 'Update' && item.chairman_name !== 'null' ? item.chairman_name : '\u00A0',
          position: item.chairman_position && item.chairman_position !== 'Update' && item.chairman_position !== 'null' ? item.chairman_position : '\u00A0',
        },
        members: [
          ...(item.member_name_1 && item.member_position_1 && item.member_name_1 !== 'null' && item.member_position_1 !== 'null' ? [{
            name: item.member_name_1 !== 'Update' ? item.member_name_1 : '\u00A0',
            position: item.member_position_1 !== 'Update' ? item.member_position_1 : '\u00A0',
          }] : []),
          ...(item.member_name_2 && item.member_position_2 && item.member_name_2 !== 'null' && item.member_position_2 !== 'null' ? [{
            name: item.member_name_2 !== 'Update' ? item.member_name_2 : '\u00A0',
            position: item.member_position_2 !== 'Update' ? item.member_position_2 : '\u00A0',
          }] : []),
          ...(item.member_name_3 && item.member_position_3 && item.member_name_3 !== 'null' && item.member_position_3 !== 'null' ? [{
            name: item.member_name_3 !== 'Update' ? item.member_name_3 : '\u00A0',
            position: item.member_position_3 !== 'Update' ? item.member_position_3 : '\u00A0',
          }] : []),
        ],
        secretary: {
          name: item.secretary_name && item.secretary_name !== 'Update' && item.secretary_name !== 'null' ? item.secretary_name : '\u00A0',
          position: item.secretary_position && item.secretary_position !== 'Update' && item.secretary_position !== 'null' ? item.secretary_position : '\u00A0',
        },
      },
    },
    technicalInformation: {
      processDescription: item.technical_information || '\u00A0',
    },
    submittedBy: {
      name: item.submitted_by && item.submitted_by !== 'Update' ? item.submitted_by : '\u00A0',
      position: item.position && item.position !== 'Update' ? item.position : '\u00A0',
    },
  };
};

export const prepareSafetyCommitteeData = (): SafetyCommitteeData => {
  return {
    generalRequirement: "A safety committee must be organized within sixty (60) days after standards take effect for existing establishments, or within one (1) month from the business start date for new establishments. The Safety Committee shall reorganize every January of the following year.",
    safetyCommitteeTypes: {
      typeA: {
        workerRange: "For workplaces having a total of over four hundred (400) workers",
        chairman: "The Manager or authorized representative",
        members: [
          "Two workers (must be union workers)",
          "The company physician"
        ],
        secretary: "The safety man"
      },
      typeB: {
        workerRange: "For workplaces having 200 - 400 workers",
        chairman: "The Manager or his authorized representative",
        members: [
          "One supervisor",
          "One worker",
          "The company physician or company nurse"
        ],
        secretary: "The safety man"
      },
      typeC: {
        workerRange: "For workplaces having 100 - 200 workers",
        chairman: "The Manager or his authorized representative",
        members: [
          "One foreman",
          "One worker",
          "The first aider"
        ],
        secretary: "Appointed by the chairman"
      },
      typeD: {
        workerRange: "For workplaces with less than 100 workers",
        chairman: "Manager",
        members: [
          "One foreman",
          "One worker"
        ],
        secretary: "Appointed by the Chairman"
      },
      typeE: {
        description: "When two or more establishments are housed under one building, their individual safety committees shall organize into a joint coordination committee to plan and implement activities.",
        chairman: "The chairman of an established committee",
        members: [
          "Two supervisors from two different establishments"
        ],
        secretary: "Appointed by the Chairman (in high rise buildings, the secretary shall be the building administrator)"
      }
    }
  };
};

export const createHealthAndSafetyDocumentComponent = (healthAndSafetyReportData: HealthAndSafetyReportData, safetyCommitteeData: SafetyCommitteeData) => {
  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <DocumentPageOne data={healthAndSafetyReportData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageTwo data={safetyCommitteeData} />
    </div>
  );
};

export const generateHealthAndSafetyFilename = (item: any) => {
  return `health-safety-report-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>) => {
  // Prepare data for Health and Safety Report document (Page One)
  const healthAndSafetyReportData = prepareHealthAndSafetyReportData(item);

  // Prepare data for Safety Committee document (Page Two)
  const safetyCommitteeData = prepareSafetyCommitteeData();

  // Create document component with both pages
  const documentComponent = createHealthAndSafetyDocumentComponent(healthAndSafetyReportData, safetyCommitteeData);
  
  const filename = generateHealthAndSafetyFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};

export type { HealthAndSafetyReportData, SafetyCommitteeData };
