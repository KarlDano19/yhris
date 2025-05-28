import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { T_OshProgram } from "@/types/osh-program";

async function getOshProgramDetails(): Promise<T_OshProgram> {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`, config);
        if (!res.ok) {
            throw res.json();
        }
        const data = await res.json();
        return data;
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
