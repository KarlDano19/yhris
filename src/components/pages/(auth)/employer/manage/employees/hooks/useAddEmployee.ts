import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEmployee(data: any) {
    try {
        const token = getCookie('token');
        data.date_hired = data.date_hired.toLocaleDateString('en-CA');
        const config = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(data),
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/`, config);
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

function useAddEmployee() {
    const query = useMutation((data: any) => addEmployee(data));
    return query;
}

export default useAddEmployee;
