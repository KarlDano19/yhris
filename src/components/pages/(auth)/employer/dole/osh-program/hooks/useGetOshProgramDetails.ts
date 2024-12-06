import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getOshProgramDetails() {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`, config);
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

function useGetOshProgramDetails() {
    const query = useQuery({
        queryKey: ["oshProgramDetails"],
        queryFn: () => getOshProgramDetails(),
    });
    return query;
}

export default useGetOshProgramDetails;
