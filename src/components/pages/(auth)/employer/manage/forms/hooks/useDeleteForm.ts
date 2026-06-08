import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function deleteForm(formId: number) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/`,
    config
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to delete form.")
  }
  return res.json()
}

function useDeleteForm() {
  const queryClient = useQueryClient()
  return useMutation((formId: number) => deleteForm(formId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["formsCache"])
    },
  })
}

export default useDeleteForm
