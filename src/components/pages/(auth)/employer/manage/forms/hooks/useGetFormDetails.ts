import { useQuery } from "@tanstack/react-query"

import { T_HRForm } from "@/types/form"

const DUMMY_FORM_DETAILS: Record<number, T_HRForm> = {
  1: {
    id: 1,
    title: "Employee Engagement Survey Q1",
    description: "Quarterly engagement check-in for all employees.",
    form_type: "engagement",
    form_type_display: "Employee Engagement",
    is_anonymous: true,
    response_count: 42,
    can_edit: false,
    is_active: true,
    created_at: "2026-01-10T08:00:00Z",
    questions: [
      {
        id: "section-1",
        section_title: "General Satisfaction",
        section_description: "Rate your overall experience.",
        items: [
          {
            id: "q1",
            label: "How satisfied are you with your role?",
            question_type: "rating",
            is_required: true,
            options: [],
            max_score: 5,
          },
          {
            id: "q2",
            label: "Would you recommend this company to a friend?",
            question_type: "nps",
            is_required: true,
            options: [],
            max_score: 10,
          },
        ],
      },
      {
        id: "section-2",
        section_title: "Open Feedback",
        section_description: "",
        items: [
          {
            id: "q3",
            label: "What do you enjoy most about working here?",
            question_type: "text",
            is_required: false,
            options: [],
            max_score: 5,
          },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "Onboarding Feedback — March Batch",
    description: "Feedback form for new hires onboarded in March.",
    form_type: "onboarding",
    form_type_display: "Onboarding Feedback",
    is_anonymous: false,
    response_count: 8,
    can_edit: true,
    is_active: true,
    created_at: "2026-03-05T09:30:00Z",
    questions: [
      {
        id: "section-1",
        section_title: "Onboarding Experience",
        section_description: "",
        items: [
          {
            id: "q1",
            label: "How would you rate your onboarding experience?",
            question_type: "rating",
            is_required: true,
            options: [],
            max_score: 5,
          },
        ],
      },
    ],
  },
}

function useGetFormDetails(formId: number | null) {
  return useQuery(
    ["formDetailsCache", formId],
    () => {
      const form = formId ? DUMMY_FORM_DETAILS[formId] : undefined
      return { data: form ?? null }
    },
    {
      enabled: !!formId,
      refetchOnWindowFocus: false,
    }
  )
}

export default useGetFormDetails
