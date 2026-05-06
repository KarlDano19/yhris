import { useMutation, useQueryClient } from "@tanstack/react-query"
import { T_AnswerEntry } from "@/types/form"

async function submitFormResponse({
  uuid,
  answers,
}: {
  uuid: string
  answers: T_AnswerEntry[]
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/public/form/${uuid}/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to submit form.")
  }
  return res.json()
}

function useSubmitFormResponse() {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { uuid: string; answers: T_AnswerEntry[] }) =>
      submitFormResponse(params),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(["formResponseCache", variables.uuid])
      },
    }
  )
}

export default useSubmitFormResponse
