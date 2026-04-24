import { useMutation, useQueryClient } from "@tanstack/react-query"

function useCreateDistribution() {
  const queryClient = useQueryClient()
  return useMutation(
    async (_params: { formId: number; data: any }) => {
      await new Promise((r) => setTimeout(r, 400))
      return { data: { id: Math.floor(Math.random() * 1000) + 1 } }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
      },
    }
  )
}

export default useCreateDistribution
