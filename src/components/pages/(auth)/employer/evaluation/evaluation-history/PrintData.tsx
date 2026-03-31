import React from 'react';
import EvaluationTemplateResponseDocument from './print/EvaluationTemplateResponseDocument';
import EvaluationIndividualResponseDocument from './print/EvaluationIndividualResponseDocument';

export const createEvaluationTemplateResponseDocumentComponent = (
  templateData: any,
  dateFilter?: { from: string; to: string },
  departmentFilter?: string[]
) => {
  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <EvaluationTemplateResponseDocument
        templateData={templateData}
        dateFilter={dateFilter}
        departmentFilter={departmentFilter}
      />
    </div>
  );
};

export const createEvaluationIndividualResponseDocumentComponent = (
  evaluationData: any[],
  dateFilter?: { from: string; to: string },
  searchText?: string
) => {
  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <EvaluationIndividualResponseDocument
        evaluationData={evaluationData}
        dateFilter={dateFilter}
        searchText={searchText}
      />
    </div>
  );
};

export const generateEvaluationTemplateFilename = (templateName: string, dateFilter?: { from: string; to: string }) => {
  const dateFrom = dateFilter?.from ? new Date(dateFilter.from).toISOString().split('T')[0] : 'all-time';
  const dateTo = dateFilter?.to ? new Date(dateFilter.to).toISOString().split('T')[0] : 'all-time';
  const sanitizedTemplateName = templateName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return `evaluation-template-response-${sanitizedTemplateName}-${dateFrom}-to-${dateTo}.pdf`;
};

export const generateIndividualEvaluationsFilename = (dateFilter?: { from: string; to: string }) => {
  const dateFrom = dateFilter?.from ? new Date(dateFilter.from).toISOString().split('T')[0] : 'all-time';
  const dateTo = dateFilter?.to ? new Date(dateFilter.to).toISOString().split('T')[0] : 'all-time';
  return `evaluation-individual-evaluations-${dateFrom}-to-${dateTo}.pdf`;
};

export const handlePrintEvaluationTemplateResponse = async (
  generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>,
  templateData: any,
  dateFilter?: { from: string; to: string },
  departmentFilter?: string[]
) => {
  // Create document component
  const documentComponent = createEvaluationTemplateResponseDocumentComponent(
    templateData,
    dateFilter,
    departmentFilter
  );

  const filename = generateEvaluationTemplateFilename(
    templateData.template?.name || 'template',
    dateFilter
  );

  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};

export const handlePrintIndividualEvaluations = async (
  generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>,
  evaluationData: any[],
  dateFilter?: { from: string; to: string },
  searchText?: string
) => {
  // Create document component
  const documentComponent = createEvaluationIndividualResponseDocumentComponent(
    evaluationData,
    dateFilter,
    searchText
  );

  const filename = generateIndividualEvaluationsFilename(dateFilter);

  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};