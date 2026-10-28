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
import { useQuery } from "@tanstack/react-query"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"

import CustomToast from "@/components/CustomToast"
import LoadingSpinner from "@/components/LoadingSpinner"
import useExportFormResponses from "../../hooks/useExportFormResponses"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

type ResponseSubTab = "summary" | "question" | "individual"

async function fetchAggregation(formId: number) {
  const token = getCookie("token")
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/forms/${formId}/questions/`,
    { headers: { Authorization: `Token ${token}` } }
  )
  if (!res.ok) throw new Error("Failed to load response data.")
  const json = await res.json()
  return (json.data ?? json) as any[]
}

async function fetchIndividualResponses(formId: number) {
  const token = getCookie("token")
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/responses/`,
    { headers: { Authorization: `Token ${token}` } }
  )
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

const ResponsesTab = ({ formId }: { formId?: number }) => {
  const [subTab, setSubTab] = useState<ResponseSubTab>("summary")
  const [expandedIndividual, setExpandedIndividual] = useState<number | null>(null)

  const { exportResponses, isExporting } = useExportFormResponses()

  const { data: aggregation = [], isLoading } = useQuery(
    ["formAggregation", formId],
    () => fetchAggregation(formId!),
    { enabled: !!formId, refetchOnWindowFocus: false }
  )

  const totalResponses = aggregation.length > 0 ? (aggregation[0]?.total ?? 0) : 0

  const ratingQuestions = aggregation.filter((q) => q.question_type === "rating" || q.question_type === "nps")
  const avgRating =
    ratingQuestions.length > 0
      ? (ratingQuestions.reduce((sum: number, q: any) => sum + (q.avg ?? 0), 0) / ratingQuestions.length).toFixed(1)
      : "—"

  const handleExport = async () => {
    if (!formId) return
    try {
      await exportResponses(formId)
    } catch (err: any) {
      toast.custom(
        () => <CustomToast message={err?.message ?? "Failed to export responses."} type="error" />,
        { duration: 4000 }
      )
    }
  }

  const subTabs: { key: ResponseSubTab; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "question", label: "Question" },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {totalResponses} response{totalResponses !== 1 ? "s" : ""}
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
              {isExporting ? "Exporting..." : "Export CSV"}
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
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Responses" value={String(totalResponses)} />
            <StatCard
              label={ratingQuestions.length > 0 ? "Avg Rating / NPS" : "Questions"}
              value={ratingQuestions.length > 0 ? String(avgRating) : String(aggregation.length)}
            />
          </div>

          {aggregation.filter((q) => q.question_type === "rating" || q.question_type === "nps").map((q: any) => (
            <div key={q.question_id} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm font-medium text-gray-700">{q.label}</p>
              {q.distribution && (
                <Bar
                  data={{
                    labels: Object.keys(q.distribution),
                    datasets: [{ data: Object.values(q.distribution), backgroundColor: "#6366f1", borderRadius: 4 }],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { ticks: { stepSize: 1 }, beginAtZero: true },
                    },
                  }}
                />
              )}
              <p className="mt-2 text-sm text-gray-600">Average: <span className="font-semibold">{q.avg}</span></p>
            </div>
          ))}

          {aggregation.filter((q) => q.question_type === "text" && q.answers?.length > 0).map((q: any) => (
            <div key={q.question_id} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-gray-800">{q.label}</p>
              <div className="space-y-2">
                {q.answers.map((ans: string, i: number) => (
                  <p key={i} className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-700">{ans}</p>
                ))}
              </div>
            </div>
          ))}

          {aggregation.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-400">No responses yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Question */}
      {subTab === "question" && (
        <div className="space-y-4">
          {aggregation.map((q: any, idx: number) => (
            <div key={q.question_id} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                Question {idx + 1} · {q.question_type}
              </p>
              <p className="mb-4 font-medium text-gray-800">{q.label}</p>
              <p className="mb-3 text-xs text-gray-500">{q.total} response{q.total !== 1 ? "s" : ""}</p>

              {(q.question_type === "rating" || q.question_type === "nps") && q.distribution && (
                <div className="space-y-2">
                  {Object.entries(q.distribution).map(([val, cnt]) => {
                    const pct = q.total > 0 ? Math.round(((cnt as number) / q.total) * 100) : 0
                    return (
                      <div key={val} className="flex items-center gap-3 text-sm">
                        <span className="w-5 text-right text-gray-500">{val}</span>
                        <div className="flex-1 rounded-full bg-gray-100 h-3">
                          <div className="h-3 rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
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

              {(q.question_type === "multiple_choice" || q.question_type === "checkbox") && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt: any) => (
                    <div key={opt.option} className="flex items-center gap-3 text-sm">
                      <span className="w-24 truncate text-gray-600">{opt.option}</span>
                      <div className="flex-1 rounded-full bg-gray-100 h-3">
                        <div className="h-3 rounded-full bg-indigo-500 transition-all" style={{ width: `${opt.percentage}%` }} />
                      </div>
                      <span className="w-12 text-xs text-gray-400">{opt.count} ({opt.percentage}%)</span>
                    </div>
                  ))}
                </div>
              )}

              {q.question_type === "text" && q.answers && (
                <div className="space-y-2">
                  {q.answers.map((ans: string, i: number) => (
                    <p key={i} className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-700">{ans}</p>
                  ))}
                  {q.answers.length === 0 && <p className="text-sm text-gray-400">No text responses yet.</p>}
                </div>
              )}
            </div>
          ))}

          {aggregation.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-400">No responses yet.</p>
            </div>
          )}
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
