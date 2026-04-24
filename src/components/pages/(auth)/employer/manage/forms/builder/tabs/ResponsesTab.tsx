"use client"

import { useState } from "react"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js"
import toast from "react-hot-toast"

import CustomToast from "@/components/CustomToast"

import useExportFormResponses from "../../hooks/useExportFormResponses"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

type ResponseSubTab = "summary" | "question" | "individual"

const DUMMY_INDIVIDUAL = [
  {
    id: 1,
    respondent: "Anonymous",
    submitted_at: "2026-04-20T09:15:00Z",
    answers: [
      { question: "How satisfied are you with your role?", answer: "4 / 5" },
      { question: "Would you recommend this company to a friend?", answer: "8 / 10" },
      { question: "What do you enjoy most about working here?", answer: "The team culture and flexible work setup." },
    ],
  },
  {
    id: 2,
    respondent: "Anonymous",
    submitted_at: "2026-04-21T11:30:00Z",
    answers: [
      { question: "How satisfied are you with your role?", answer: "5 / 5" },
      { question: "Would you recommend this company to a friend?", answer: "9 / 10" },
      { question: "What do you enjoy most about working here?", answer: "Growth opportunities and management support." },
    ],
  },
  {
    id: 3,
    respondent: "Anonymous",
    submitted_at: "2026-04-22T14:00:00Z",
    answers: [
      { question: "How satisfied are you with your role?", answer: "3 / 5" },
      { question: "Would you recommend this company to a friend?", answer: "7 / 10" },
      { question: "What do you enjoy most about working here?", answer: "Work-life balance." },
    ],
  },
]

const DUMMY_QUESTIONS = [
  {
    id: "q1",
    label: "How satisfied are you with your role?",
    type: "rating",
    total: 3,
    avg: 4.0,
    distribution: { "1": 0, "2": 0, "3": 1, "4": 1, "5": 1 },
  },
  {
    id: "q2",
    label: "Would you recommend this company to a friend?",
    type: "nps",
    total: 3,
    avg: 8.0,
    distribution: { "7": 1, "8": 1, "9": 1 },
  },
  {
    id: "q3",
    label: "What do you enjoy most about working here?",
    type: "text",
    total: 3,
    answers: [
      "The team culture and flexible work setup.",
      "Growth opportunities and management support.",
      "Work-life balance.",
    ],
  },
]

const DIST_LABELS = ["1", "2", "3", "4", "5"]
const DIST_VALUES = [0, 0, 1, 1, 1]

const ResponsesTab = ({ formId }: { formId?: number }) => {
  const [subTab, setSubTab] = useState<ResponseSubTab>("summary")
  const [expandedIndividual, setExpandedIndividual] = useState<number | null>(null)

  const { exportResponses, isExporting } = useExportFormResponses()

  const handleExport = async () => {
    if (!formId) return
    try {
      await exportResponses(formId)
    } catch (err: any) {
      toast.custom(
        () => <CustomToast message={err?.message ?? 'Failed to export responses.'} type="error" />,
        { duration: 4000 }
      )
    }
  }

  const subTabs: { key: ResponseSubTab; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "question", label: "Question" },
    { key: "individual", label: "Individual" },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      {/* Response count + sub-tabs header */}
      <div className="mb-4 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {DUMMY_INDIVIDUAL.length} responses
          </h2>
          {formId && (
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          )}
        </div>

        <div className="flex gap-8 border-t border-gray-100 px-6">
          {subTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${
                subTab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {subTab === "summary" && (
        <div className="space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Average Rating" value="4.0 / 5" />
            <StatCard label="NPS Average" value="8.0 / 10" />
            <StatCard label="Completion Rate" value="100%" />
          </div>

          {/* Distribution chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-center text-sm font-medium text-gray-700">
              Rating distribution (Q1)
            </p>
            <Bar
              data={{
                labels: DIST_LABELS,
                datasets: [
                  {
                    data: DIST_VALUES,
                    backgroundColor: "#6366f1",
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
                scales: {
                  x: { title: { display: true, text: "Rating", font: { size: 11 } }, grid: { display: false } },
                  y: { title: { display: true, text: "No. of respondents", font: { size: 11 } }, ticks: { stepSize: 1 }, beginAtZero: true },
                },
              }}
            />
          </div>

          {/* Text answers summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-800">
              Open-ended responses
            </p>
            <div className="space-y-2">
              {DUMMY_QUESTIONS.find((q) => q.type === "text")?.answers?.map((ans, i) => (
                <p key={i} className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                  {ans}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      {subTab === "question" && (
        <div className="space-y-4">
          {DUMMY_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                Question {idx + 1} · {q.type}
              </p>
              <p className="mb-4 font-medium text-gray-800">{q.label}</p>
              <p className="mb-3 text-xs text-gray-500">{q.total} responses</p>

              {(q.type === "rating" || q.type === "nps") && q.distribution && (
                <div className="space-y-2">
                  {Object.entries(q.distribution).map(([val, cnt]) => {
                    const pct = q.total > 0 ? Math.round(((cnt as number) / q.total) * 100) : 0
                    return (
                      <div key={val} className="flex items-center gap-3 text-sm">
                        <span className="w-5 text-right text-gray-500">{val}</span>
                        <div className="flex-1 rounded-full bg-gray-100 h-3">
                          <div
                            className="h-3 rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs text-gray-400">{cnt as number}</span>
                      </div>
                    )
                  })}
                  <p className="mt-2 text-sm text-gray-600">
                    Average: <span className="font-semibold text-gray-800">{q.avg}</span>
                  </p>
                </div>
              )}

              {q.type === "text" && q.answers && (
                <div className="space-y-2">
                  {q.answers.map((ans, i) => (
                    <p key={i} className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                      {ans}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Individual */}
      {subTab === "individual" && (
        <div className="space-y-3">
          {DUMMY_INDIVIDUAL.map((resp, idx) => (
            <div key={resp.id} className="rounded-xl bg-white shadow-sm overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
                onClick={() => setExpandedIndividual(expandedIndividual === resp.id ? null : resp.id)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Response #{idx + 1} · {resp.respondent}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(resp.submitted_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-indigo-600 font-medium">
                  {expandedIndividual === resp.id ? "Hide" : "View"}
                </span>
              </button>

              {expandedIndividual === resp.id && (
                <div className="border-t border-gray-100 px-6 py-4 space-y-4">
                  {resp.answers.map((a, i) => (
                    <div key={i}>
                      <p className="text-xs font-medium text-gray-500 mb-1">{a.question}</p>
                      <p className="text-sm text-gray-800">{a.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm text-center">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
  </div>
)

export default ResponsesTab
