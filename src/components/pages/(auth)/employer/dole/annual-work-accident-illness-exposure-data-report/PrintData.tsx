import React from 'react';
import DocumentPageOne from './print/DocumentPageOne';

interface AnnualWorkAccidentIllnessData {
  date: string;
  establishmentName: string;
  natureOfBusiness: string;
  address: string;
  exposureData: string;
  numberOfEmployees: number;
  totalHoursWorked: number;
  injurySummary: {
    totalDisablingInjuries: number;
    totalNonDisablingInjuries: number;
    frequencyRate: number;
    severityRate: number;
  };
  submittedBy: {
    name: string;
    position: string;
  };
}

export const prepareAnnualWorkAccidentIllnessData = (item: any): AnnualWorkAccidentIllnessData => {
  // Get the year from the item or use current year as fallback
  const year = item.year || new Date().getFullYear();
  
  return {
    date: item.date_of_report || '\u00A0',
    establishmentName: item.company_name || '\u00A0',
    natureOfBusiness: item.type_of_industry || '\u00A0',
    address: item.address || '\u00A0',
    exposureData: item.exposure_data || `JANUARY 1 TO DECEMBER 31, ${year}`,
    numberOfEmployees: item.number_of_employees || 0,
    totalHoursWorked: item.total_hours_worked || 0,
    injurySummary: {
      totalDisablingInjuries: item.total_disabling_injuries || 0,
      totalNonDisablingInjuries: item.total_non_disabling_injuries || 0,
      frequencyRate: item.frequency_rate || 0,
      severityRate: item.severity_rate || 0,
    },
    submittedBy: {
      name: item.name_signature && item.name_signature !== 'Update' ? item.name_signature : '\u00A0',
      position: item.position && item.position !== 'Update' ? item.position : '\u00A0',
    },
  };
};

export const createAnnualWorkAccidentIllnessDocumentComponent = (annualWorkAccidentIllnessData: AnnualWorkAccidentIllnessData) => {
  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <DocumentPageOne data={annualWorkAccidentIllnessData} />
    </div>
  );
};

export const generateAnnualWorkAccidentIllnessFilename = (item: any) => {
  return `annual-work-accident-illness-report-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>) => {
  // Prepare data for Annual Work Accident/Illness Exposure Data Report
  const annualWorkAccidentIllnessData = prepareAnnualWorkAccidentIllnessData(item);

  // Create document component
  const documentComponent = createAnnualWorkAccidentIllnessDocumentComponent(annualWorkAccidentIllnessData);
  
  const filename = generateAnnualWorkAccidentIllnessFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};

export type { AnnualWorkAccidentIllnessData };
