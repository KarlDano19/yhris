import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getAddPersonelMovementDetails(
  personel_movement_id: number | null
) {
  try {
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/${personel_movement_id}/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetAddPersonelMovementDetails(
  personel_movement_id: number | null
) {
  const query = useQuery(
    ["addPersonelMovementDetailsCache"],
    () =>
      getAddPersonelMovementDetails(personel_movement_id),
    { enabled: false, refetchOnWindowFocus: false, keepPreviousData: true }
  );
  return query;
}

export default useGetAddPersonelMovementDetails;
