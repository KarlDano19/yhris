import { useQuery } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

async function getFormDetails(formId: number) {
  try {
    const token = getCookie("token")
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}/`,
        config
      )
      if (!res.ok) throw res.json()
      const json = await res.json()
      return { data: json }
    }
    return { data: null }
  } catch (err: any) {
    const errStringify = await err
    if (Object.hasOwn(errStringify, "detail")) throw errStringify
    throw new Error(errStringify?.message ?? "Failed to fetch form details.")
  }
}

function useGetFormDetails(formId: number | null) {
  return useQuery(
    ["formDetailsCache", formId],
    () => getFormDetails(formId!),
    {
      enabled: !!formId,
      refetchOnWindowFocus: false,
    }
  )
}

export default useGetFormDetails
