import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function updateForm({ formId, data }: { formId: number; data: any }) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/`,
    config
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to update form.")
  }
  return res.json()
}

function useUpdateForm() {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { formId: number; data: any }) => updateForm(params),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(["formsCache"])
        queryClient.invalidateQueries(["formDetailsCache", variables.formId])
      },
    }
  )
}

export default useUpdateForm
