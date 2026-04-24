import { useMutation, useQueryClient } from "@tanstack/react-query"

let dummyIdCounter = 100

function useCreateForm() {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: any) => {
      await new Promise((r) => setTimeout(r, 400))
      const id = ++dummyIdCounter
      return { data: { id, ...data } }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["formsCache"])
      },
    }
  )
}

export default useCreateForm
