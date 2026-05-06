import { useQuery } from "@tanstack/react-query"
import { getCookie } from "cookies-next"

interface Filters {
  from?: string
  to?: string
  search?: string
  currentPage?: number
  pageSize?: number
  form_type?: string
}

async function getForms(filters: Filters) {
  try {
    const token = getCookie("token")
    const params: Record<string, string> = {}
    if (filters.from) params.from = filters.from
    if (filters.to) params.to = filters.to
    if (filters.search) params.search = filters.search
    if (filters.form_type) params.form_type = filters.form_type
    if (filters.currentPage) params.current_page = String(filters.currentPage)
    if (filters.pageSize) params.page_size = String(filters.pageSize)

    const searchParams = new URLSearchParams(params)
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forms/?${searchParams}`,
        config
      )
      if (!res.ok) throw res.json()
      const json = await res.json()
      return { data: json }
    }
    return { data: {} }
  } catch (err: any) {
    const errStringify = await err
    if (Object.hasOwn(errStringify, "detail")) throw errStringify
    throw new Error(errStringify?.message ?? "Failed to fetch forms.")
  }
}

function useGetForms(filters: Filters) {
  return useQuery(["formsCache", filters], () => getForms(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })
}

export default useGetForms
