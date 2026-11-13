// The Document Generator documents a custom template can replace
export type T_StandardType = 'employee-certificate' | 'employment-agreement' | 'notice-to-explain';

export type T_TemplateFieldType = 'text' | 'longtext' | 'date' | 'number' | 'signature';

export type T_TemplateField = {
  key: string;
  label: string;
  type: T_TemplateFieldType;
  required: boolean;
  source: string; // one of TEMPLATE_SOURCES' values, or '' when typed by hand
};

export type T_DocumentTemplateRow = {
  id: number;
  title: string;
  field_count: number;
  has_letterhead: boolean;
  standard_type: T_StandardType | '';
  is_sample?: boolean;
  updated_at: string;
};

export type T_DocumentTemplatesResponse = {
  records: T_DocumentTemplateRow[];
  total_records: number;
  total_pages: number;
  starting: number;
  ending: number;
};

export type T_DocumentTemplate = {
  id?: number;
  title: string;
  html: string;
  fields: T_TemplateField[];
  letterhead?: string | null; // URL of the saved letterhead
  letterhead_image?: string | null; // data URI of the letterhead found in an uploaded PDF or image (extract only)
  letterhead_first_page_only?: boolean;
  margin_top_mm?: number;
  margin_bottom_mm?: number;
  original_file?: string | null; // URL of the uploaded file the template was made from
  original_file_name?: string | null;
  standard_type?: T_StandardType | ''; // offered in place of that standard document (the NTE is also printed by Address Employee Issue)
};

export type T_SaveDocumentTemplate = {
  id?: number;
  title: string;
  html: string;
  fields: T_TemplateField[];
  letterhead?: File | null; // a newly picked letterhead
  removeLetterhead?: boolean;
  letterheadFirstPageOnly: boolean;
  marginTopMm: number;
  marginBottomMm: number;
  originalFile?: File | null; // only sent on the first save of an uploaded document
  standardType: T_StandardType | '';
};

// What the page preview needs to lay out the document like the PDF
export type T_PageLayout = {
  letterheadUrl: string | null;
  firstPageOnly: boolean;
  topMm: number;
  bottomMm: number;
};

export type T_RenderDocumentTemplate = {
  id: number;
  employeeId?: number | null;
  employeeIssueId?: number | null;
  values: Record<string, string>;
};
