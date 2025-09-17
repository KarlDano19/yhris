import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function submitApplication(data: any) {
  try {
    const finalData = {
      firstname: data.firstName,
      middlename: data.middleName,
      lastname: data.lastName,
      email: data.email,
      mobile: data.mobileNo,
      address: data.address,
      nationality: data.nationality,
      gender: data.gender,
      religion: data.religion,
      portfolio_url: data.portfolio,
      work_experience: data.exp,
      setup_preference: (data.setupPreference || '').join(),
      screening_answers: data.screeningAnswers || []
    };
    
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('application_form', JSON.stringify(finalData));
    formData.append('job_posting', data.jobPosting);

    if (data.profilePicture) {
      if (data.profilePicture instanceof File) {
        formData.append("photo", data.profilePicture);
      } else if (typeof data.profilePicture === "string") {
        const res = await fetch(data.profilePicture);
        const blob = await res.blob();

        // Draw blob onto canvas → always export as PNG
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);

        const pngBlob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );

        const file = new File([pngBlob], "photo.png", { type: "image/png" });
        formData.append("photo", file);
      }
    }
    if (data.resume.length !== 0) {
      formData.append('resume', data.resume[0]);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/`, config);
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

export default function useSubmitApplication() {
  return useMutation({
    mutationFn: submitApplication,
  });
}
