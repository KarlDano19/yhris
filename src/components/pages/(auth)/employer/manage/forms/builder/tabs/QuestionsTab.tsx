"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline"

import BackButton from "@/components/BackButton"
import CustomToast from "@/components/CustomToast"
import useCreateForm from "../../hooks/useCreateForm"
import useUpdateForm from "../../hooks/useUpdateForm"
import useGetFormDetails from "../../hooks/useGetFormDetails"
import ResponsesTab from "./ResponsesTab"
import SettingsTab from "./SettingsTab"
import { T_FormSection, T_QuestionItem, T_FormType, T_QuestionType } from "@/types/form"

const QUESTION_TYPES: { value: T_QuestionType; label: string }[] = [
  { value: "text", label: "Short / Paragraph Text" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "rating", label: "Rating (1–N)" },
  { value: "nps", label: "NPS (0–10)" },
  { value: "file_upload", label: "File Upload" },
]

const QuestionCard = ({ item, onChange, onDelete }: {
  item: T_QuestionItem
  onChange: (updated: T_QuestionItem) => void
  onDelete: () => void
}) => {
  const update = (fields: Partial<T_QuestionItem>) => onChange({ ...item, ...fields })
  const addOption = () => update({ options: [...item.options, ""] })
  const updateOption = (index: number, value: string) =>
    update({ options: item.options.map((o, i) => (i === index ? value : o)) })
  const removeOption = (index: number) =>
    update({ options: item.options.filter((_, i) => i !== index) })

  return (
    <div className="rounded-xl border-l-4 border-indigo-400 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <input
            value={item.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="Question"
            className="w-full border-0 border-b border-gray-200 pb-1 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <select
          value={item.question_type}
          onChange={(e) => update({ question_type: e.target.value as T_QuestionType, options: [] })}
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          onClick={onDelete}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Delete question"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 pl-1">
        {item.question_type === "rating" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Max score:</span>
            <input
              type="number" min={1} max={10} value={item.max_score}
              onChange={(e) => update({ max_score: parseInt(e.target.value) || 5 })}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <span className="text-xs text-gray-400">(1 to {item.max_score})</span>
          </div>
        )}
        {item.question_type === "nps" && (
          <div className="flex gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-xs text-gray-400">
                {i}
              </div>
            ))}
          </div>
        )}
        {item.question_type === "text" && (
          <div className="rounded border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400">
            Long answer text
          </div>
        )}
        {(item.question_type === "multiple_choice" || item.question_type === "checkbox") && (
          <div className="space-y-2">
            {item.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`h-4 w-4 shrink-0 ${item.question_type === "checkbox" ? "rounded" : "rounded-full"} border border-gray-400`} />
                <input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 border-0 border-b border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:border-indigo-400 focus:outline-none"
                />
                <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button onClick={addOption} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
              <PlusIcon className="h-3.5 w-3.5" />
              Add option
            </button>
          </div>
        )}
        {item.question_type === "file_upload" && (
          <div className="rounded border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400">
            File upload input (respondents can attach a file)
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-2">
        <span className="text-xs text-gray-500">Required</span>
        <button
          type="button"
          onClick={() => update({ is_required: !item.is_required })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.is_required ? "bg-indigo-600" : "bg-gray-200"}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.is_required ? "translate-x-4" : "translate-x-1"}`} />
        </button>
      </div>
    </div>
  )
}

type Tab = "questions" | "responses" | "settings"

interface Props {
  formId?: number
}

const QuestionsTabPage = ({ formId }: Props) => {
  const router = useRouter()
  const isEditing = !!formId

  const { data: existingFormData, isLoading: isLoadingForm } = useGetFormDetails(formId ?? null)
  const { mutateAsync: createForm, isLoading: isCreating } = useCreateForm()
  const { mutateAsync: updateForm, isLoading: isUpdating } = useUpdateForm()

  const [activeTab, setActiveTab] = useState<Tab>("questions")
  const [title, setTitle] = useState("Untitled Form")
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState<T_FormSection[]>([
    { id: uuidv4(), section_title: "Section 1", section_description: "", items: [] },
  ])
  const [formType, setFormType] = useState<T_FormType>("custom")
  const [currentFormId, setCurrentFormId] = useState<number | null>(formId ?? null)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const form = existingFormData?.data
    if (form) {
      setTitle(form.title ?? "")
      setDescription(form.description ?? "")
      setFormType(form.form_type ?? "custom")
      setSections(form.questions ?? [
        { id: uuidv4(), section_title: "Section 1", section_description: "", items: [] },
      ])
    }
  }, [existingFormData])

  const buildPayload = useCallback(() => ({
    title,
    description,
    form_type: formType,
    questions: sections,
  }), [title, description, formType, sections])

  const triggerAutoSave = useCallback(() => {
    if (!currentFormId) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateForm({ formId: currentFormId, data: buildPayload() })
      } catch {
        // silent
      }
    }, 1500)
  }, [currentFormId, updateForm, buildPayload])

  useEffect(() => {
    if (currentFormId) triggerAutoSave()
  }, [title, description, sections, formType])

  async function handleSave() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    try {
      if (!currentFormId) {
        const res = await createForm(buildPayload())
        const newId = res?.data?.id
        setCurrentFormId(newId)
        toast.custom(() => <CustomToast type="success" message="Form created." />)
        router.replace(`/manage/forms/${newId}`)
      } else {
        await updateForm({ formId: currentFormId, data: buildPayload() })
        toast.custom(() => <CustomToast type="success" message="Form saved." />)
      }
    } catch {
      toast.custom(() => <CustomToast type="error" message="Failed to save form." />)
    }
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      { id: uuidv4(), section_title: `Section ${prev.length + 1}`, section_description: "", items: [] },
    ])
  }

  function updateSection(sectionId: string, field: "section_title" | "section_description", value: string) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s)))
  }

  function deleteSection(sectionId: string) {
    if (sections.length === 1) {
      toast.custom(() => <CustomToast type="error" message="A form must have at least one section." />)
      return
    }
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
  }

  function addQuestion(sectionId: string) {
    const newItem: T_QuestionItem = {
      id: uuidv4(),
      label: "",
      question_type: "text",
      is_required: false,
      options: [],
      max_score: 5,
    }
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s))
    )
  }

  function updateQuestion(sectionId: string, item: T_QuestionItem) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((q) => (q.id === item.id ? item : q)) }
          : s
      )
    )
  }

  function deleteQuestion(sectionId: string, questionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((q) => q.id !== questionId) }
          : s
      )
    )
  }

  if (isEditing && isLoadingForm) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading form...
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "questions", label: "Questions" },
    { key: "responses", label: "Responses" },
    { key: "settings", label: "Settings" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          {/* Top row: back + title + save */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <BackButton label="Forms" onClick={() => router.push("/manage/forms")} />
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {title || "Untitled Form"}
              </span>
              {currentFormId && (
                <span className="text-xs text-gray-400">Auto-saving...</span>
              )}
            </div>
            {(activeTab === "questions" || activeTab === "settings") && (
              <button
                onClick={handleSave}
                disabled={isCreating || isUpdating}
                className="flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4" />
                {isCreating || isUpdating ? "Saving..." : activeTab === "settings" ? "Save Settings" : "Save"}
              </button>
            )}
          </div>

          {/* Tab row */}
          <div className="flex justify-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="mx-auto max-w-3xl">
            {/* Form Header Card */}
            <div className="mb-4 rounded-xl border-t-8 border-indigo-600 bg-white p-6 shadow-sm">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form title"
                className="w-full border-0 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900 placeholder-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-0"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description (optional)"
                rows={2}
                className="mt-3 w-full resize-none border-0 text-sm text-gray-600 placeholder-gray-300 focus:outline-none"
              />
            </div>

            {sections.map((section, sIdx) => (
              <div key={section.id} className="mb-4 space-y-3">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Section {sIdx + 1} of {sections.length}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        value={section.section_title}
                        onChange={(e) => updateSection(section.id, "section_title", e.target.value)}
                        placeholder="Section title"
                        className="w-full border-0 border-b border-gray-200 pb-1 text-lg font-semibold text-gray-800 placeholder-gray-300 focus:border-indigo-400 focus:outline-none"
                      />
                      <input
                        value={section.section_description}
                        onChange={(e) => updateSection(section.id, "section_description", e.target.value)}
                        placeholder="Section description (optional)"
                        className="mt-2 w-full border-0 text-sm text-gray-500 placeholder-gray-300 focus:outline-none"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="mt-1 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        title="Delete section"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {section.items.map((item) => (
                  <QuestionCard
                    key={item.id}
                    item={item}
                    onChange={(updated) => updateQuestion(section.id, updated)}
                    onDelete={() => deleteQuestion(section.id, item.id)}
                  />
                ))}

                <button
                  onClick={() => addQuestion(section.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add question
                </button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <PlusIcon className="h-4 w-4" />
              Add section
            </button>
          </div>
        )}

        {/* Responses Tab */}
        {activeTab === "responses" && <ResponsesTab formId={formId} />}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsTab />
        )}
      </div>
    </div>
  )
}

export default QuestionsTabPage
