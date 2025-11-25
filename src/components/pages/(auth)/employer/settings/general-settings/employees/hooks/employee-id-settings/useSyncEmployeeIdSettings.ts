import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function pullEmployeeIdSettingsFromPayroll() {
    try{
        const token = getCookie("token");
        const config = {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            }
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll-settings/sync-third-party-integration/`, config);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to sync from payroll");
        }
        return res.json();
    } catch (err: any) {
        if (err.message) {
            throw err.message;
        }
        throw "Failed to sync settings from payroll system";
    }
}

function usePullEmployeeIdSettingsFromPayroll() {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: pullEmployeeIdSettingsFromPayroll,
        onSuccess: () => {
            // Refresh the employee ID settings after successful pull
            queryClient.invalidateQueries(['employee-id-settings']);
        }
    });
    
    return mutation;
}

export default usePullEmployeeIdSettingsFromPayroll;