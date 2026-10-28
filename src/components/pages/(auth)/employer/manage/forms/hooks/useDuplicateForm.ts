import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function duplicateForm(formId: number) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/duplicate/`,
    config
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to duplicate form.")
  }
  return res.json()
}

function useDuplicateForm() {
  const queryClient = useQueryClient()
  return useMutation((formId: number) => duplicateForm(formId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["formsCache"])
    },
  })
}

export default useDuplicateForm
