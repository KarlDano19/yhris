import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getDisablingInjuryData() {
  try {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/disabling-injury/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return { records: [] };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetDisablingInjuryData() {
  const query = useQuery(
    ["disablingInjuryDataCache"],
    () => getDisablingInjuryData(),
    {
      enabled: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetDisablingInjuryData; 