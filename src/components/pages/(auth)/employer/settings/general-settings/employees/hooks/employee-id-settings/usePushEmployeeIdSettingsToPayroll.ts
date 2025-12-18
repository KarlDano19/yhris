import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function pushEmployeeIdSettingsToPayroll() {
    try {
        const token = getCookie("token");
        const config = {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            }
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll-settings/push-to-payroll/`, config);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to push settings to payroll");
        }
        return res.json();
    } catch (err: any) {
        if (err.message) {
            throw err.message;
        }
        throw "Failed to push settings to payroll system";
    }
}

function usePushEmployeeIdSettingsToPayroll() {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: pushEmployeeIdSettingsToPayroll,
        onSuccess: () => {
            // Optionally refresh the employee ID settings after successful push
            queryClient.invalidateQueries(['employee-id-settings']);
        }
    });
    
    return mutation;
}

export default usePushEmployeeIdSettingsToPayroll;
