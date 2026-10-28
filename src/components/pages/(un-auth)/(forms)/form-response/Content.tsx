"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import confetti from "canvas-confetti"

import useGetFormResponseDetails from "./hooks/useGetFormResponseDetails"
import useSubmitFormResponse from "./hooks/useSubmitFormResponse"
import CustomToast from "@/components/CustomToast"
import { T_AnswerEntry, T_FormSection, T_QuestionItem } from "@/types/form"

interface Props {
  uuid: string
}

function QuestionInput({
  item,
  value,
  onChange,
  onToggleCheckbox,
}: {
  item: T_QuestionItem
  value: T_AnswerEntry["answer"]
  onChange: (v: T_AnswerEntry["answer"]) => void
  onToggleCheckbox: (opt: string) => void
}) {
  const { question_type, options, max_score } = item
  const numVal = typeof value === "number" ? value : null
  const strVal = typeof value === "string" ? value : ""
  const arrVal = Array.isArray(value) ? value : []

  if (question_type === "text") {
    return (
      <textarea
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Your answer"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    )
  }

  if (question_type === "multiple_choice") {
    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={item.id}
              checked={strVal === opt}
              onChange={() => onChange(opt)}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    )
  }

  if (question_type === "checkbox") {
    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={arrVal.includes(opt)}
              onChange={() => onToggleCheckbox(opt)}
              className="h-4 w-4 rounded text-indigo-600"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    )
  }

  if (question_type === "rating") {
    return (
      <div className="flex gap-2">
        {Array.from({ length: max_score }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              numVal === n
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-gray-300 text-gray-600 hover:border-indigo-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    )
  }

  if (question_type === "nps") {
    return (
      <div className="space-y-1">
        <div className="flex gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={`flex h-9 w-9 items-center justify-center rounded border text-sm font-medium transition-colors ${
                numVal === i
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 text-gray-600 hover:border-indigo-400"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Not likely</span>
          <span>Extremely likely</span>
        </div>
      </div>
    )
  }

  if (question_type === "file_upload") {
    return (
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange(file.name)
        }}
        className="w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-indigo-600 hover:file:bg-indigo-100"
      />
    )
  }

  return null
}

const FormResponseContent = ({ uuid }: Props) => {
  const { data, isLoading, isError } = useGetFormResponseDetails(uuid)
  const { mutateAsync: submitResponse, isLoading: isSubmitting } = useSubmitFormResponse()

  const [answers, setAnswers] = useState<Record<string, T_AnswerEntry["answer"]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)

  const formData = data?.data

  const updateAnswer = (questionId: string, value: T_AnswerEntry["answer"]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const toggleCheckbox = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) ?? []
    const updated = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option]
    updateAnswer(questionId, updated)
  }

  const validateRequired = (sections: T_FormSection[]): string | null => {
    for (const section of sections) {
      for (const item of section.items) {
        if (item.is_required) {
          const ans = answers[item.id]
          const empty =
            ans === undefined ||
            ans === null ||
            ans === "" ||
            (Array.isArray(ans) && ans.length === 0)
          if (empty) return `"${item.label || "A required question"}" is required.`
        }
      }
    }
    return null
  }

  const handleSubmit = async () => {
    if (!formData?.questions) return

    const validationError = validateRequired(formData.questions)
    if (validationError) {
      toast.custom(() => <CustomToast type="error" message={validationError} />)
      return
    }

    const answerEntries: T_AnswerEntry[] = Object.entries(answers).map(
      ([question_id, answer]) => ({ question_id, answer })
    )

    try {
      await submitResponse({ uuid, answers: answerEntries })
      setSubmitted(true)
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    } catch (error: any) {
      toast.custom(() => (
        <CustomToast type="error" message={error?.message ?? "Failed to submit form."} />
      ))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Loading form...</div>
      </div>
    )
  }

  if (isError || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-sm rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-800">Form not found</p>
          <p className="mt-2 text-sm text-gray-500">
            This link is invalid or the form is no longer available.
          </p>
        </div>
      </div>
    )
  }

  if (formData.is_completed || submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-sm rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-5xl">🎉</div>
          <h1 className="text-xl font-bold text-gray-900">Thank you!</h1>
          <p className="mt-2 text-sm text-gray-500">Your response has been recorded.</p>
        </div>
      </div>
    )
  }

  if (formData.is_closed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-sm rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-800">Form closed</p>
          <p className="mt-2 text-sm text-gray-500">
            This form is no longer accepting responses.
          </p>
        </div>
      </div>
    )
  }

  const sections: T_FormSection[] = formData.questions ?? []
  const isLastSection = currentSectionIdx === sections.length - 1
  const currentSection = sections[currentSectionIdx]

  const handleNext = () => {
    if (!currentSection) return
    const requiredError = currentSection.items.find((item) => {
      if (!item.is_required) return false
      const ans = answers[item.id]
      return ans === undefined || ans === null || ans === "" || (Array.isArray(ans) && ans.length === 0)
    })
    if (requiredError) {
      toast.custom(() => (
        <CustomToast type="error" message={`"${requiredError.label || "A required question"}" is required.`} />
      ))
      return
    }
    setCurrentSectionIdx((i) => i + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-2xl px-4">
        {/* Form Header */}
        <div className="mb-5 rounded-xl border-t-8 border-indigo-600 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{formData.form_title}</h1>
          {formData.form_description && (
            <p className="mt-2 text-sm text-gray-600">{formData.form_description}</p>
          )}
          {formData.deadline && (
            <p className="mt-3 text-xs text-amber-600">
              Deadline: {new Date(formData.deadline).toLocaleString()}
            </p>
          )}
          {formData.is_anonymous && (
            <p className="mt-2 text-xs text-gray-400">
              Your response is anonymous and will not be linked to your name.
            </p>
          )}
          {sections.length > 1 && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-400">
                <span>Section {currentSectionIdx + 1} of {sections.length}</span>
                <span>{Math.round(((currentSectionIdx + 1) / sections.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${((currentSectionIdx + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Current Section */}
        {currentSection && (
          <div className="mb-5 space-y-4">
            {(currentSection.section_title || currentSection.section_description) && (
              <div className="rounded-xl bg-white p-5 shadow-sm">
                {currentSection.section_title && (
                  <h2 className="font-semibold text-gray-800">{currentSection.section_title}</h2>
                )}
                {currentSection.section_description && (
                  <p className="mt-1 text-sm text-gray-500">{currentSection.section_description}</p>
                )}
              </div>
            )}

            {currentSection.items.map((item) => (
              <div key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-800">
                  {item.label}
                  {item.is_required && <span className="ml-1 text-red-500">*</span>}
                </p>
                <QuestionInput
                  item={item}
                  value={answers[item.id] ?? null}
                  onChange={(v) => updateAnswer(item.id, v)}
                  onToggleCheckbox={(opt) => toggleCheckbox(item.id, opt)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {currentSectionIdx > 0 ? (
            <button
              onClick={() => { setCurrentSectionIdx((i) => i - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {isLastSection ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormResponseContent
