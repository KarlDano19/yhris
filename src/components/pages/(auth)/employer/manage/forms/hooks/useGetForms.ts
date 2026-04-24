import { useQuery } from "@tanstack/react-query"

import { T_HRForm } from "@/types/form"

interface Filters {
  from?: string
  to?: string
  search?: string
  currentPage?: number
  pageSize?: number
  form_type?: string
  view_type?: string
}

const DUMMY_FORMS: T_HRForm[] = [
  {
    id: 1,
    title: "Employee Engagement Survey Q1",
    description: "Quarterly engagement check-in for all employees.",
    form_type: "engagement",
    form_type_display: "Employee Engagement",
    is_anonymous: true,
    questions: null,
    response_count: 42,
    can_edit: false,
    is_active: true,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: 2,
    title: "Onboarding Feedback — March Batch",
    description: "Feedback form for new hires onboarded in March.",
    form_type: "onboarding",
    form_type_display: "Onboarding Feedback",
    is_anonymous: false,
    questions: null,
    response_count: 8,
    can_edit: true,
    is_active: true,
    created_at: "2026-03-05T09:30:00Z",
  },
  {
    id: 3,
    title: "Exit Survey",
    description: "Exit interview form for departing employees.",
    form_type: "exit",
    form_type_display: "Exit Survey",
    is_anonymous: true,
    questions: null,
    response_count: 3,
    can_edit: true,
    is_active: true,
    created_at: "2026-02-20T14:00:00Z",
  },
  {
    id: 4,
    title: "Training Feedback — Leadership Program",
    description: "Post-training survey for the leadership development program.",
    form_type: "training",
    form_type_display: "Training Feedback",
    is_anonymous: false,
    questions: null,
    response_count: 15,
    can_edit: false,
    is_active: true,
    created_at: "2026-03-18T11:00:00Z",
  },
  {
    id: 5,
    title: "Custom Satisfaction Survey",
    description: "",
    form_type: "custom",
    form_type_display: "Custom",
    is_anonymous: false,
    questions: null,
    response_count: 0,
    can_edit: true,
    is_active: true,
    created_at: "2026-04-01T07:00:00Z",
  },
]

function filterForms(forms: T_HRForm[], filters: Filters): T_HRForm[] {
  let result = [...forms]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter((f) => f.title.toLowerCase().includes(q))
  }
  if (filters.form_type) {
    result = result.filter((f) => f.form_type === filters.form_type)
  }
  return result
}

function useGetForms(filters: Filters) {
  return useQuery(
    ["formsCache", filters],
    () => {
      const filtered = filterForms(DUMMY_FORMS, filters)
      const pageSize = filters.pageSize ?? 5
      const currentPage = filters.currentPage ?? 1
      const start = (currentPage - 1) * pageSize
      const records = filtered.slice(start, start + pageSize)
      return {
        data: {
          records,
          total_records: filtered.length,
          total_pages: Math.ceil(filtered.length / pageSize),
        },
      }
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useGetForms
