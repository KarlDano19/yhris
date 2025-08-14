import React from 'react';

import DocumentPageOne from './print/DocumentPageOne';
import DocumentPageTwo from './print/DocumentPageTwo';

export const createHealthAndSafetyDocumentComponent = (item: any) => {
  
  // Page One Data
  const pageOneData = {
    dateFiled: item.date_of_report || '\u00A0',
    regionalLaborOfficeNo: item.regional_labor_office_no || '\u00A0',
    fileNumber: item.file_number || '\u00A0',
    establishmentName: item.company_name || '\u00A0',
    address: item.address || '\u00A0',
    natureOfBusiness: item.type_of_industry || '\u00A0',
    personsEmployed: {
      management: {
        shifts: (() => {
          const shiftEmployees = Array.isArray(item.shift_employees) ? item.shift_employees : [];
          
          const parseShiftData = (shiftData: any) => {
            if (shiftData && typeof shiftData === 'object') {
              return {
                male: parseInt(shiftData.male || '0') || 0,
                female: parseInt(shiftData.female || '0') || 0,
              };
            }
            return { male: 0, female: 0 };
          };
          
          return shiftEmployees.map(parseShiftData);
        })(),
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
      signature: item.signature || undefined,
    },
  };

  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <DocumentPageOne data={pageOneData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageTwo />
    </div>
  );
};

export const generateHealthAndSafetyFilename = (item: any) => {
  return `health-safety-report-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>) => {
  // Create document component with all pages
  const documentComponent = createHealthAndSafetyDocumentComponent(item);
  
  const filename = generateHealthAndSafetyFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};
