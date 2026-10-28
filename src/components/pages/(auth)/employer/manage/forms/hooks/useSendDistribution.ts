import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function sendDistribution(distributionId: number) {
  const token = getCookie("token")
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/forms/distributions/${distributionId}/send/`,
    config
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.message ?? "Failed to send distribution.")
  }
  return res.json()
}

function useSendDistribution() {
  const queryClient = useQueryClient()
  return useMutation((distributionId: number) => sendDistribution(distributionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["formsCache"])
    },
  })
}

export default useSendDistribution
