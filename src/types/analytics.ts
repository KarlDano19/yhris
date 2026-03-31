// Analytics API response types

// --- Workforce Overview ---

export type T_WorkforceKPIs = {
  total_active_employees: number;
  new_hires: number;
  separated_employees: number;
  attrition_rate: number;
  average_tenure_years: number;
  total_active_prev_q4: number;
  new_hires_prev_q4: number;
  separated_prev_q4: number;
  prev_q4_year: number;
};

export type T_ApplicantsSummary = {
  total_applied: number;
  hired: { count: number; percentage: number };
  ongoing: { count: number; percentage: number };
  rejected: { count: number; percentage: number };
  withdrawn: { count: number; percentage: number };
};

export type T_DemographicBreakdown = {
  gender: {
    female_count: number;
    female_percentage: number;
    male_count: number;
    male_percentage: number;
  };
  age_groups: Array<{ label: string; count: number; percentage: number }>;
  regions: Array<{ label: string; count: number; percentage: number }>;
};

export type T_ApplicantVsHired = {
  applicants_summary: T_ApplicantsSummary;
  demographic_breakdown: T_DemographicBreakdown;
};

export type T_RolePipelineRecord = {
  id: number;
  role: string;
  number_of_applicants: number;
  status: string;
  date_job_opened: string | null;
  date_job_closed: string | null;
  turnaround_days: number | null;
  pipeline_stages: Array<{ stage: string; count: number }>;
};

export type T_RolePipeline = {
  records: T_RolePipelineRecord[];
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
};

export type T_AttritionTrendItem = {
  month: string;
  year: number;
  attrition_rate: number;
  total_exits: number;
};

export type T_ExitReason = {
  reason: string;
  count: number;
};

export type T_AttritionRate = {
  attrition_trend: T_AttritionTrendItem[];
  exit_reasons: T_ExitReason[];
};

// --- Employee Performance ---

export type T_EmployeePerformanceKPIs = {
  average_performance: number;
  evaluation_count: number;
  resolved_issues: number;
  ongoing_issues: number;
  total_issues: number;
  resolved_percentage: number;
  ongoing_percentage: number;
};

export type T_PerformanceByDept = {
  name: string;
  score: number;
  count: number;
};

export type T_PerformanceTrendItem = {
  month: string;
  year: number;
  score: number;
  count: number;
};

export type T_PerformanceTableRecord = {
  id: number;
  employee_name: string;
  department: string;
  score_percentage: number;
  total_score: number | null;
  max_total_score: number | null;
  date_of_evaluation: string | null;
  status: string;
};

export type T_PerformanceRate = {
  performance_by_department: T_PerformanceByDept[];
  performance_trend: T_PerformanceTrendItem[];
  performance_table: {
    records: T_PerformanceTableRecord[];
    total_records: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
};

export type T_IssueTypeDist = {
  issue_type: string;
  count: number;
  percentage: number;
};

export type T_MonthlyIssueVolume = {
  month: string;
  year: number;
  count: number;
};

export type T_IssueTableRecord = {
  id: number;
  employee_name: string;
  department: string;
  issue_type: string;
  date_reported: string | null;
  status: string;
};

export type T_EmployeeIssueRate = {
  issue_type_distribution: T_IssueTypeDist[];
  monthly_issue_volume: T_MonthlyIssueVolume[];
  issues_table: {
    records: T_IssueTableRecord[];
    total_records: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
};

// --- Compliance & Policy ---

export type T_DOLERow = {
  dole_requirement: string;
  frequency: string;
  last_submitted: string | null;
  next_due_date: string | null;
  compliance_status: string;
};

export type T_CompliancePolicy = {
  overall_compliance_rate: number;
  overdue_count: number;
  policies_due_count: number;
  dole_compliance_table: T_DOLERow[];
};
