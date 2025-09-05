import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getWorkEnvironmentRequestItems() {
  try {
    let newFilters = { view_type: 'analytics' };
    const searchParams = new URLSearchParams(newFilters);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-environment-measures/?${searchParams}`,
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

function useGetWorkEnvironmentRequestItems() {
  const query = useQuery(
    ["workEnvironmentRequestItemsCache"],
    () => getWorkEnvironmentRequestItems(),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetWorkEnvironmentRequestItems;
