export type T_FormType = "engagement" | "exit" | "onboarding" | "training" | "custom"

export type T_QuestionType =
  | "rating"
  | "nps"
  | "text"
  | "multiple_choice"
  | "checkbox"
  | "file_upload"

export interface T_QuestionItem {
  id: string
  label: string
  question_type: T_QuestionType
  is_required: boolean
  options: string[]
  max_score: number
}

export interface T_FormSection {
  id: string
  section_title: string
  section_description: string
  items: T_QuestionItem[]
}

export interface T_HRForm {
  id: number
  title: string
  description: string
  form_type: T_FormType
  form_type_display: string
  is_anonymous: boolean
  questions: T_FormSection[] | null
  response_count: number
  can_edit: boolean
  is_active: boolean
  created_at: string
}

export interface T_FormDistribution {
  id: number
  name: string
  form_title: string
  form_id: number
  total_sent: number
  completed: number
  completion_rate: number
  deadline: string | null
  is_email_sent: boolean
  is_closed: boolean
  created_at: string
}

export interface T_FormResponsePublic {
  respondent_uuid: string
  is_completed: boolean
  is_anonymous: boolean
  form_title: string
  form_description: string
  questions: T_FormSection[] | null
  is_closed: boolean
  deadline: string | null
}

export interface T_AnswerEntry {
  question_id: string
  answer: string | number | string[] | null
}

export interface T_FormInsight {
  id: number
  form_id: number
  from_date: string | null
  to_date: string | null
  summary: string
  trends: { topic: string; sentiment: "positive" | "neutral" | "negative"; count: number }[]
  risks: { risk: string; affected_count: number }[]
  generated_at: string
}

export interface T_GoogleFormSync {
  id: number
  form_id: number
  form_title: string
  google_form_id: string
  field_mapping: Record<string, string> | null
  last_synced_at: string | null
  is_active: boolean
  created_at: string
}

export interface T_FormsOverview {
  total_forms: number
  total_responses: number
  avg_completion_rate: number
  active_distributions: number
  by_form_type: Record<string, number>
}

export interface T_QuestionAggregation {
  question_id: string
  label: string
  question_type: T_QuestionType
  total_responses: number
  avg?: number
  distribution?: Record<string, number>
  options?: { option: string; count: number; percentage: number }[]
  answers?: string[]
  file_count?: number
}
