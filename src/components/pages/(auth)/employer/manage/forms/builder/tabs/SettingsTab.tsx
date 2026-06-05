"use client"

import { useState } from "react"
import { ChevronUpIcon } from "@heroicons/react/24/outline"

interface Props {}

const SettingsTab = ({}: Props) => {
  // Responses
  const [collectEmail, setCollectEmail] = useState<"none" | "verified" | "responder">("none")
  const [sendCopy, setSendCopy] = useState<"off" | "always" | "if_requested">("off")
  const [allowEditing, setAllowEditing] = useState(false)
  // Presentation
  const [showProgressBar, setShowProgressBar] = useState(true)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("Your response has been recorded.")
  const [editingConfirmation, setEditingConfirmation] = useState(false)
  const [showResubmitLink, setShowResubmitLink] = useState(true)
  const [viewResultsSummary, setViewResultsSummary] = useState(false)
  const [disableAutoSave, setDisableAutoSave] = useState(false)

  // Defaults
  const [makeQuestionsRequired, setMakeQuestionsRequired] = useState(false)

  // Quiz
  const [isQuiz, setIsQuiz] = useState(false)
  const [releaseMarks, setReleaseMarks] = useState<"immediately" | "later">("immediately")
  const [showMissedQuestions, setShowMissedQuestions] = useState(true)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true)
  const [showPointValues, setShowPointValues] = useState(true)
  const [defaultPointValue, setDefaultPointValue] = useState(1)

  // Section open/close
  const [openSections, setOpenSections] = useState({
    responses: true,
    presentation: true,
    defaults: true,
    quiz: true,
  })

  function toggle(section: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">

      {/* Responses */}
      <Section
        title="Responses"
        description="Manage how responses are collected and protected"
        open={openSections.responses}
        onToggle={() => toggle("responses")}
      >
        <SettingRow label="Collect email addresses">
          <select
            value={collectEmail}
            onChange={(e) => setCollectEmail(e.target.value as typeof collectEmail)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="none">Do not collect</option>
            <option value="verified">Verified</option>
            <option value="responder">Responder input</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Send responders a copy of their response"
          description={
            collectEmail === "none" ? (
              <span>Requires <strong>Collect email addresses</strong></span>
            ) : undefined
          }
        >
          <select
            value={sendCopy}
            onChange={(e) => setSendCopy(e.target.value as typeof sendCopy)}
            disabled={collectEmail === "none"}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
          >
            <option value="off">Off</option>
            <option value="always">Always</option>
            <option value="if_requested">If they request it</option>
          </select>
        </SettingRow>

        <SettingRow label="Allow response editing" description="Responses can be changed after being submitted">
          <Toggle value={allowEditing} onChange={setAllowEditing} />
        </SettingRow>

      </Section>

      {/* Presentation */}
      <Section
        title="Presentation"
        description="Manage how the form and responses are presented"
        open={openSections.presentation}
        onToggle={() => toggle("presentation")}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Form Presentation</p>
        <SettingRow label="Show progress bar">
          <Toggle value={showProgressBar} onChange={setShowProgressBar} />
        </SettingRow>
        <SettingRow label="Shuffle question order">
          <Toggle value={shuffleQuestions} onChange={setShuffleQuestions} />
        </SettingRow>

        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">After Submission</p>
        <SettingRow
          label="Confirmation message"
          description={
            editingConfirmation ? undefined : (
              <span className="italic text-gray-400">{confirmationMessage}</span>
            )
          }
        >
          {editingConfirmation ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={confirmationMessage}
                onChange={(e) => setConfirmationMessage(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setEditingConfirmation(false)}
                className="rounded p-1 text-indigo-600 hover:bg-indigo-50"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingConfirmation(true)}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Edit
            </button>
          )}
        </SettingRow>
        <SettingRow label="Show link to submit another response">
          <Toggle value={showResubmitLink} onChange={setShowResubmitLink} />
        </SettingRow>
        <SettingRow label="View results summary" description="Share results summary with respondents">
          <Toggle value={viewResultsSummary} onChange={setViewResultsSummary} />
        </SettingRow>

        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">Restrictions</p>
        <SettingRow label="Disable auto-save for all respondents">
          <Toggle value={disableAutoSave} onChange={setDisableAutoSave} />
        </SettingRow>
      </Section>

      {/* Defaults */}
      <Section
        title="Defaults"
        description="Default settings applied to this form and new questions"
        open={openSections.defaults}
        onToggle={() => toggle("defaults")}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Question Defaults</p>
        <SettingRow label="Make questions required by default">
          <Toggle value={makeQuestionsRequired} onChange={setMakeQuestionsRequired} />
        </SettingRow>
      </Section>

      {/* Quiz */}
      <Section
        title="Quiz"
        description="Turn this form into a graded quiz"
        open={openSections.quiz}
        onToggle={() => toggle("quiz")}
      >
        <SettingRow label="Make this a quiz" description="Assign point values and automatically provide feedback">
          <Toggle value={isQuiz} onChange={setIsQuiz} />
        </SettingRow>

        {isQuiz && (
          <>
            <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">Release Marks</p>
            <div className="space-y-3 mb-4">
              {(["immediately", "later"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="releaseMarks"
                    value={opt}
                    checked={releaseMarks === opt}
                    onChange={() => setReleaseMarks(opt)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <p className="text-sm text-gray-800">
                      {opt === "immediately" ? "Immediately after each submission" : "Later, after manual review"}
                    </p>
                    {opt === "later" && (
                      <p className="text-xs text-gray-500">Turns on responses → collect email addresses</p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Respondent Settings</p>
            <SettingRow label="Missed questions" description="Respondents can see which questions were answered incorrectly">
              <Toggle value={showMissedQuestions} onChange={setShowMissedQuestions} />
            </SettingRow>
            <SettingRow label="Correct answers" description="Respondents can see correct answers after grades are released">
              <Toggle value={showCorrectAnswers} onChange={setShowCorrectAnswers} />
            </SettingRow>
            <SettingRow label="Point values" description="Respondents can see total points and points received for each question">
              <Toggle value={showPointValues} onChange={setShowPointValues} />
            </SettingRow>

            <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">Global Quiz Defaults</p>
            <SettingRow label="Default question point value" description="Point value for every new question">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={defaultPointValue}
                  onChange={(e) => setDefaultPointValue(Number(e.target.value))}
                  className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-500">points</span>
              </div>
            </SettingRow>
          </>
        )}
      </Section>

    </div>
  )
}

const Section = ({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string
  description: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <div className="rounded-xl bg-white shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="flex w-full items-start justify-between px-6 py-5 text-left hover:bg-gray-50"
    >
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-sm text-gray-500">{description}</p>
      </div>
      <ChevronUpIcon
        className={`mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`}
      />
    </button>
    {open && (
      <div className="border-t border-gray-100 px-6 py-5 space-y-5">
        {children}
      </div>
    )}
  </div>
)

const SettingRow = ({
  label,
  description,
  children,
}: {
  label: string
  description?: React.ReactNode
  children: React.ReactNode
}) => (
  <div className="flex items-start justify-between gap-6">
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-800">{label}</p>
      {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
)

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
      value ? "bg-indigo-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        value ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
)

export default SettingsTab
