import { useMutation, useQueryClient } from "@tanstack/react-query"

function useUpdateForm() {
  const queryClient = useQueryClient()
  return useMutation(
    async (_params: { formId: number; data: any }) => {
      await new Promise((r) => setTimeout(r, 300))
      return { success: true }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
        queryClient.invalidateQueries(["formDetailsCache"])
      },
    }
  )
}

export default useUpdateForm
