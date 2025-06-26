import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface newFiltersProps {
  search?: string;
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
}

async function getWorkAccidentIlnessReportsItems(filters: any) {
  try {
    let newFilters: newFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    if (!newFilters.from) delete newFilters.from;
    if (!newFilters.to) delete newFilters.to;
    const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/?${searchParams}`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetWorkAccidentIlnessReportsItems(filters: any) {
  const query = useQuery(
    [
      'workAccidentIlnessReportsItemsCache',
      filters.currentPage,
      filters.pageSize,
      filters.search,
      filters.from,
      filters.to
    ],
    () => getWorkAccidentIlnessReportsItems(filters),
    {
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetWorkAccidentIlnessReportsItems;
