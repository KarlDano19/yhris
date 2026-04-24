import { useQuery } from "@tanstack/react-query"

import { T_FormResponsePublic } from "@/types/form"

// http://localhost:3000/form-response/test-uuid-123

const DUMMY_FORM: T_FormResponsePublic = {
  respondent_uuid: "test-uuid-123",
  is_completed: false,
  is_anonymous: true,
  form_title: "Employee Engagement Survey Q1",
  form_description: "Quarterly engagement check-in for all employees. Your feedback helps us improve.",
  is_closed: false,
  deadline: null,
  questions: [
    {
      id: "section-1",
      section_title: "General Satisfaction",
      section_description: "Rate your overall experience at the company.",
      items: [
        {
          id: "q1",
          label: "How satisfied are you with your current role?",
          question_type: "rating",
          is_required: true,
          options: [],
          max_score: 5,
        },
        {
          id: "q2",
          label: "Would you recommend this company as a great place to work?",
          question_type: "nps",
          is_required: true,
          options: [],
          max_score: 10,
        },
      ],
    },
    {
      id: "section-2",
      section_title: "Work Environment",
      section_description: "",
      items: [
        {
          id: "q3",
          label: "Which of the following best describes your work setup?",
          question_type: "multiple_choice",
          is_required: true,
          options: ["Fully remote", "Hybrid", "On-site"],
          max_score: 5,
        },
        {
          id: "q4",
          label: "What aspects of the work environment do you value most? (Select all that apply)",
          question_type: "checkbox",
          is_required: false,
          options: ["Team collaboration", "Flexible hours", "Career growth", "Compensation", "Work-life balance"],
          max_score: 5,
        },
      ],
    },
    {
      id: "section-3",
      section_title: "Open Feedback",
      section_description: "",
      items: [
        {
          id: "q5",
          label: "What do you enjoy most about working here?",
          question_type: "text",
          is_required: false,
          options: [],
          max_score: 5,
        },
      ],
    },
  ],
}

function useGetFormResponseDetails(uuid: string) {
  return useQuery(
    ["formResponseCache", uuid],
    async () => {
      await new Promise((r) => setTimeout(r, 300))
      return { data: DUMMY_FORM }
    },
    { refetchOnWindowFocus: false, retry: false }
  )
}

export default useGetFormResponseDetails
