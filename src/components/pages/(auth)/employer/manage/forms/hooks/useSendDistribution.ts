import { useMutation, useQueryClient } from "@tanstack/react-query"

function useSendDistribution() {
  const queryClient = useQueryClient()
  return useMutation(
    async (_distributionId: number) => {
      await new Promise((r) => setTimeout(r, 400))
      return { success: true }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
      },
    }
  )
}

export default useSendDistribution
