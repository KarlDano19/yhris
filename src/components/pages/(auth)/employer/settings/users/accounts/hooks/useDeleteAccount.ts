import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function deleteAccount(account_id: number) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/${account_id}/`, config);
        if (!res.ok) {
            throw res.json();
        }
        return res.json();
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, 'response')) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useDeleteAccount() {
    const query = useMutation((account_id: number) => deleteAccount(account_id));
    return query;
}

export default useDeleteAccount;