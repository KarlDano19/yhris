import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function createDistribution({
  formId,
  data,
}: {
  formId: number
  data: any
}) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/distributions/`,
    config
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to create distribution.")
  }
  const json = await res.json()
  return { data: json }
}

function useCreateDistribution() {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { formId: number; data: any }) => createDistribution(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
      },
    }
  )
}

export default useCreateDistribution
