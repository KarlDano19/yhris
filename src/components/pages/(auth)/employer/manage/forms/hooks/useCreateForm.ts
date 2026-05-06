import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function createForm(data: any) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/`, config)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to create form.")
  }
  const json = await res.json()
  return { data: json }
}

function useCreateForm() {
  const queryClient = useQueryClient()
  return useMutation((data: any) => createForm(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["formsCache"])
    },
  })
}

export default useCreateForm
