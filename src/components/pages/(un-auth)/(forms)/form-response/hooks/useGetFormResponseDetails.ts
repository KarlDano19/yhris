import { useQuery } from "@tanstack/react-query"
import { T_FormResponsePublic } from "@/types/form"

async function getFormResponseDetails(uuid: string): Promise<{ data: T_FormResponsePublic }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/public/form/${uuid}/`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Form not found.")
  }
  const json = await res.json()
  const raw = json.data ?? json

  const transformed: T_FormResponsePublic = {
    respondent_uuid: uuid,
    form_title: raw.title ?? "",
    form_description: raw.description ?? "",
    questions: raw.questions ?? null,
    is_completed: raw.is_completed ?? false,
    is_anonymous: raw.is_anonymous ?? false,
    is_closed: raw.is_closed ?? false,
    deadline: raw.deadline ?? null,
  }

  return { data: transformed }
}

function useGetFormResponseDetails(uuid: string) {
  return useQuery(
    ["formResponseCache", uuid],
    () => getFormResponseDetails(uuid),
    { refetchOnWindowFocus: false, retry: false }
  )
}

export default useGetFormResponseDetails
