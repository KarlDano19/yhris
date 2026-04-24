import { useMutation, useQueryClient } from "@tanstack/react-query"

function useDeleteForm() {
  const queryClient = useQueryClient()
  return useMutation(
    async (_formId: number) => {
      await new Promise((r) => setTimeout(r, 300))
      return { success: true }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
      },
    }
  )
}

export default useDeleteForm
