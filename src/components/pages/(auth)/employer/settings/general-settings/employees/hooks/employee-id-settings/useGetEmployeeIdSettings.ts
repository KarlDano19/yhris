import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getEmployeeIdSettings() {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-id-settings/`, config);
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

function useGetEmployeeIdSettings() {
    const query = useQuery({
        queryKey: ["employeeIdSettings"],
        queryFn: () => getEmployeeIdSettings(),
    });
    return query;
}

export default useGetEmployeeIdSettings;
