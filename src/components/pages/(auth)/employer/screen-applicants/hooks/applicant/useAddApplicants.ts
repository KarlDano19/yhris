import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addApplicant(data: any, jobPostingId: string) {
    try {
        const formData = new FormData();
        
        // Add form fields to FormData
        formData.append('firstname', data.firstname);
        if (data.middlename) {
            formData.append('middlename', data.middlename);
        }
        formData.append('lastname', data.lastname);
        formData.append('email', data.email);
        
        // Add resume file if provided
        if (data.resume && data.resume.length > 0) {
            formData.append('resume', data.resume[0]);
        }
        
        const token = getCookie('token');
        const config = {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
            },
            body: formData,
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/applicants/add/`, config);
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

function useAddApplicant(jobPostingId: string) {
    const query = useMutation((data: any) => addApplicant(data, jobPostingId));

    return query;
}

export default useAddApplicant;