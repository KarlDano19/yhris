import { T_ApplicantOrientEmail } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateApplicantOrient(data: any) {
  try {
    let payload: any = {};
    if (data.actionType == 'sending') {
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        subject: '',
        to: '',
        cc: '',
        bcc: '',
        context: '',
      };
      if (data.emailType == 'contract') {
        payload.subject = data.sendContract.subject
          ? data.sendContract.subject
          : `Send Contract | ${data.sendContract.template}`;
        payload.to = data.sendContract.to;
        payload.cc = data.sendContract.cc;
        payload.bcc = data.sendContract.bcc;
        payload.context = data.sendContract.message;
        // Handle multiple attachments (new format)
        if (data.sendContract.attachments && Array.isArray(data.sendContract.attachments) && data.sendContract.attachments.length > 0) {
          payload.attachments = data.sendContract.attachments;
        }
        // Legacy support: single attachment
        else if (data.sendContract.attachment) {
          payload.attachment = data.sendContract.attachment;
        }
      }
      if (data.emailType == 'introduce') {
        payload.subject = data.introduceTeam.subject
          ? data.introduceTeam.subject
          : `Introduce to the team | ${data.introduceTeam.template}`;
        payload.to = data.introduceTeam.to;
        payload.cc = data.introduceTeam.cc;
        payload.bcc = data.introduceTeam.bcc;
        payload.context = data.introduceTeam.message;
        // Handle multiple attachments (new format)
        if (data.introduceTeam.attachments && Array.isArray(data.introduceTeam.attachments) && data.introduceTeam.attachments.length > 0) {
          payload.attachments = data.introduceTeam.attachments;
        }
        // Legacy support: single attachment
        else if (data.introduceTeam.attachment) {
          payload.attachment = data.introduceTeam.attachment;
        }
      }
    } else if (data.actionType == 'received') {
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        date_received: data.dateReceived,
      };
    } else if (data.actionType == 'update_status' && data.emailType == 'location_department') {
      // Updated: Handle location/department/employment status assignment
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        location: data.location_name, // Send as string (CharField)
        department: data.department_id, // Send as ID (ForeignKey)
        employment_status_id: data.employment_status_id, // Send as ID (ForeignKey)
      };
    } else {
      payload = {
        type_of_action: data.actionType,
      };
    }
    
    const token = getCookie('token');
    let config: any;
    
    // Check if there are attachments (multiple or single) or other file uploads
    const hasAttachments = (payload.attachments && Array.isArray(payload.attachments) && payload.attachments.length > 0) || payload.attachment;
    
    // If attachments exist, use FormData
    if (hasAttachments) {
      const formData = new FormData();
      
      // Separate File objects from URL strings
      const fileAttachments: File[] = [];
      const urlAttachments: string[] = [];
      
      if (payload.attachments && Array.isArray(payload.attachments)) {
        payload.attachments.forEach((attachment: File | string) => {
          if (attachment instanceof File) {
            fileAttachments.push(attachment);
          } else if (typeof attachment === 'string') {
            urlAttachments.push(attachment);
          }
        });
      } else if (payload.attachment) {
        if (payload.attachment instanceof File) {
          fileAttachments.push(payload.attachment);
        } else if (typeof payload.attachment === 'string') {
          urlAttachments.push(payload.attachment);
        }
      }
      
      // Append all fields to FormData (excluding attachment fields - handled separately)
      Object.keys(payload).forEach(key => {
        if (key === 'attachment' || key === 'attachments') {
          // Skip these - we handle them separately below
          return;
        } else if (key === 'to' || key === 'cc' || key === 'bcc') {
          // Ensure email fields are arrays before stringifying
          const emailArray = Array.isArray(payload[key]) ? payload[key] : [payload[key]];
          formData.append(key, JSON.stringify(emailArray));
        } else {
          formData.append(key, payload[key]);
        }
      });
      
      // Append file attachments as files (these go to request.FILES)
      fileAttachments.forEach((file) => {
        formData.append('attachments', file);
      });
      
      // Append URL attachments as JSON array string (these go to payload)
      if (urlAttachments.length > 0) {
        // Always use 'attachment_urls' key for URL strings to distinguish from files
        formData.append('attachment_urls', JSON.stringify(urlAttachments));
      }
      
      config = {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      };
    } else {
      // No attachment, use JSON
      config = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      };
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant-orientations/${data.id}/`, config);
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

function useUpdateApplicantOrient() {
  const query = useMutation((data: any) =>
    updateApplicantOrient(data)
  );

  return query;
}

export default useUpdateApplicantOrient;
