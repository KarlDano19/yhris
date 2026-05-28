import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function submitApproval(personnel_movement_id: number, data: any) {
  try {
    const token = getCookie('token');
    
    // Check if data is already a FormData object
    let formData: FormData;
    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();

      // Handle signature if it's a base64 string
      if (data.signature && typeof data.signature === 'string' && data.signature.startsWith('data:')) {
        try {
          const signatureBlob = await fetch(data.signature).then((res) => res.blob());
          formData.append('signature', signatureBlob, 'signature.jpg');
        } catch (error) {
          console.error('Error processing signature:', error);
          // Fallback to using the string directly
          formData.append('signature', data.signature);
        }
      } else if (data.signature) {
        formData.append('signature', data.signature);
      }

      // Add other fields
      formData.append('recommendation', data.recommendation || '');
      formData.append('status', data.status || 'approved');
    }

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/${personnel_movement_id}/approvals/`,
      config
    );
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

function useSubmitApproval() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    (props: any) => submitApproval(props.personnel_movement_id, props.data),
    {
      onSuccess: (data, variables) => {
        // Update the cache with the new data
        queryClient.setQueryData(
          ['personnelMovementApprovalsCache', variables.personnel_movement_id],
          {
            approvals: data.approvals,
            current_user_approval: data.current_user_approval
          }
        );
        
        // Update the movement details cache
        if (data.personnel_movement) {
          queryClient.setQueryData(
            ['personnelMovementDetails', variables.personnel_movement_id],
            (oldData: any) => ({
              ...oldData,
              current_approval_stage: data.personnel_movement.current_approval_stage,
              status: data.personnel_movement.status
            })
          );
        }
        
        // Invalidate queries to ensure fresh data
        queryClient.invalidateQueries(['personnelMovementApprovalsCache', variables.personnel_movement_id]);
        queryClient.invalidateQueries(['personnelMovementDetails', variables.personnel_movement_id]);
      },
    }
  );
  
  return mutation;
}

export default useSubmitApproval; 