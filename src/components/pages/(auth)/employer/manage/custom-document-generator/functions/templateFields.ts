import { T_TemplateField, T_TemplateFieldType } from '@/types/custom-document-generator';

// Mirrors SOURCES in yahshua-hris-be/utils/document_template.py — the backend ignores anything else.
export const TEMPLATE_SOURCES: { value: string; label: string }[] = [
  { value: '', label: 'Typed by hand' },
  { value: 'employee.full_name', label: 'Employee — full name' },
  { value: 'employee.first_name', label: 'Employee — first name' },
  { value: 'employee.last_name', label: 'Employee — last name' },
  { value: 'employee.position', label: 'Employee — position' },
  { value: 'employee.department', label: 'Employee — department' },
  { value: 'employee.employment_status', label: 'Employee — employment status' },
  { value: 'employee.date_hired', label: 'Employee — date hired' },
  { value: 'employee.address', label: 'Employee — address' },
  { value: 'employee.employee_id', label: 'Employee — employee ID' },
  { value: 'employee.email', label: 'Employee — email' },
  { value: 'employer.name', label: 'Company name' },
  { value: 'employer.address', label: 'Company address' },
  // Filled only when the template is the employer's NTE format, from the Address Employee Issue record
  { value: 'nte.reference_no', label: 'NTE — reference no.' },
  { value: 'nte.employee_name', label: 'NTE — employee name' },
  { value: 'nte.position', label: 'NTE — position' },
  { value: 'nte.department', label: 'NTE — department' },
  { value: 'nte.company_name', label: 'NTE — company name' },
  { value: 'nte.issue_type', label: 'NTE — issue type' },
  { value: 'nte.date_issued', label: 'NTE — date issued' },
  { value: 'nte.incident_date', label: 'NTE — incident date' },
  { value: 'nte.place_of_incident', label: 'NTE — place of incident' },
  { value: 'nte.brief_background', label: 'NTE — brief background' },
  { value: 'nte.prepared_by', label: 'NTE — prepared by' },
  { value: 'nte.reviewed_by', label: 'NTE — reviewed by' },
  { value: 'nte.hr_signature', label: 'NTE — HR signature' },
  { value: 'nte.employee_signature', label: 'NTE — employee signature' },
  { value: 'nte.employee_explanation', label: 'NTE — employee explanation' },
  { value: 'nte.investigation_date', label: 'NTE — hearing date' },
  { value: 'nte.witness', label: 'NTE — hearing witness' },
  { value: 'nte.presider', label: 'NTE — hearing presider' },
  { value: 'nte.investigation_results', label: 'NTE — hearing results' },
  { value: 'nte.investigation_decision', label: 'NTE — hearing decision' },
  { value: 'nte.management_decision', label: 'NTE — management decision' },
];

/** The field a {{key}} gets when it is first typed or inserted: a known source links itself. */
export const newField = (key: string): T_TemplateField => {
  const source = TEMPLATE_SOURCES.find((option) => option.value && option.value === key);
  return {
    key,
    label: source?.label ?? key.replace(/[_.]/g, ' '),
    type: key.endsWith('_signature') && source ? 'signature' : 'text',
    required: false,
    source: source ? key : '',
  };
};

export const FIELD_TYPES: { value: T_TemplateFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'longtext', label: 'Paragraph' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'signature', label: 'Signature' },
];

/** Turns a typed name ("Employee Name") into a placeholder key ("employee_name"); null if nothing usable is left. */
export const toFieldKey = (name: string): string | null => {
  const key = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^[^a-z]+|_+$/g, '');
  return /^[a-z][a-z0-9_.]{0,59}$/.test(key) ? key : null;
};
