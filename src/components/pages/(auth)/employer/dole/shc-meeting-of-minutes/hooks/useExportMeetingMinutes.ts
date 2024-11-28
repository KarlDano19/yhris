import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface newFiltersProps {
  search?: string;
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
}

async function getExportShcMeetingMinutes(filters: any) {
  try {
    let newFilters: newFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.from)
      newFilters.from = filters.from.toLocaleDateString("en-CA");
    if (filters.to) newFilters.to = filters.to.toLocaleDateString("en-CA");
    const searchParams = new URLSearchParams(
      Object.entries(newFilters).map(([key, value]) => [key, String(value)])
    );
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shc-meeting-minutes/?${searchParams}`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    if (err.response) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useGetExportShcMeetingMinutes(filters: any) {
  const query = useQuery([], () => getExportShcMeetingMinutes(filters), {
    enabled: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetExportShcMeetingMinutes;
