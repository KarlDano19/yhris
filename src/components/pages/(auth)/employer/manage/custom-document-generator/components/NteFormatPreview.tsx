'use client';

import { useEffect, useMemo, useState } from 'react';

import DocumentPreview from './DocumentPreview';

import useGetDocumentTemplateEmployeeValues from '../hooks/useGetDocumentTemplateEmployeeValues';

import { DEFAULT_MARGIN_MM } from '../functions/detectLetterheadMargins';

import { T_DocumentTemplate, T_TemplateField } from '@/types/custom-document-generator';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';

// Same as NTE_SIGNATURE_SOURCES / NTE_HTML_SOURCES in yahshua-hris-be/utils/document_template.py
const NTE_SIGNATURE_SOURCES = ['nte.hr_signature', 'nte.employee_signature'];
const NTE_HTML_SOURCES = ['nte.brief_background', 'nte.employee_explanation', 'nte.investigation_results', 'nte.management_decision'];

const sourceOf = (field: T_TemplateField) => field.source || field.key;

// "2026-10-15" as the NTE prints its dates ("October 15, 2026"), read as a calendar date so no timezone shifts it
const formatIssuedDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

/**
 * The Document Generator form as the template's typed values (keyed by field key). From an issue only the
 * fields saved onto it at Proceed: everything else comes from the issue record and cannot be changed here.
 * Without an issue the whole form is typed.
 */
export const nteFormValues = (
  template: T_DocumentTemplate,
  data: NoticeToExplainFormData,
  signature: string,
  fromIssue: boolean
): Record<string, string> => {
  const bySource: Record<string, string> = {
    ...(!fromIssue && {
      'nte.reference_no': data.referenceNumber || '',
      'nte.employee_name': data.employeeName,
      'nte.position': data.position,
      'nte.department': data.department || '',
      'nte.incident_date': formatIssuedDate(data.incidentDate || ''),
      'nte.place_of_incident': data.incidentPlace,
    }),
    'nte.company_name': data.companyName,
    'nte.date_issued': formatIssuedDate(data.dateIssued || data.dateOfIssuance || ''),
    'nte.brief_background': data.briefBackground,
    'nte.prepared_by': data.preparedBy,
    'nte.reviewed_by': data.reviewedBy,
    'nte.hr_signature': signature,
  };
  // Blanks are skipped: Proceed does not save them, so the issue's value still prints
  return Object.fromEntries(
    template.fields
      .filter((field) => bySource[sourceOf(field)]?.trim())
      .map((field) => [field.key, bySource[sourceOf(field)]])
  );
};

/** The signature picked in the form as a data URL (an uploaded file is read in the browser). */
export const useSignatureDataUrl = (signature: NoticeToExplainFormData['signature']) => {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (!(signature instanceof File)) {
      setDataUrl(typeof signature === 'string' && signature.startsWith('data:') ? signature : '');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDataUrl(String(reader.result));
    reader.readAsDataURL(signature);
  }, [signature]);
  return dataUrl;
};

type NteFormatPreviewProps = {
  template: T_DocumentTemplate;
  employeeIssueId: number | null;
  formValues: Record<string, string>;
};

// The company's NTE format filled from the Address Employee Issue (or only the form), as the PDF will print it.
const NteFormatPreview = ({ template, employeeIssueId, formValues }: NteFormatPreviewProps) => {
  const { data: issueValues } = useGetDocumentTemplateEmployeeValues(template.id as number, null, employeeIssueId);

  const values = useMemo(() => ({ ...(issueValues ?? {}), ...formValues }), [issueValues, formValues]);
  const signatureKeys = useMemo(
    () =>
      template.fields
        .filter((field) => field.type === 'signature' || NTE_SIGNATURE_SOURCES.includes(sourceOf(field)))
        .map((field) => field.key),
    [template.fields]
  );
  const htmlKeys = useMemo(
    () => template.fields.filter((field) => NTE_HTML_SOURCES.includes(sourceOf(field))).map((field) => field.key),
    [template.fields]
  );

  return (
    <DocumentPreview
      html={template.html}
      values={values}
      signatureKeys={signatureKeys}
      htmlKeys={htmlKeys}
      blankEmpty
      layout={{
        letterheadUrl: template.letterhead ?? null,
        firstPageOnly: template.letterhead_first_page_only ?? false,
        topMm: template.margin_top_mm ?? DEFAULT_MARGIN_MM,
        bottomMm: template.margin_bottom_mm ?? DEFAULT_MARGIN_MM,
      }}
    />
  );
};

export default NteFormatPreview;
