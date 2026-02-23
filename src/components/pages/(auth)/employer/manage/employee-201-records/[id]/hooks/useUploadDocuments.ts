import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_DocumentResponse } from '@/types/employee-201-records/document-repository';

type UploadParams = {
  employeeId: number;
  files: FileList;
  folderId?: number | null;
  description?: string;
};

async function uploadDocuments(params: UploadParams): Promise<T_DocumentResponse> {
  const { employeeId, files, folderId, description } = params;
  const token = getCookie('token');

  const formData = new FormData();

  // Append multiple files
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  if (folderId) {
    formData.append('folder_id', folderId.toString());
  }

  if (description) {
    formData.append('description', description);
  }

  const config: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/documents/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload documents.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUploadDocuments(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<T_DocumentResponse, Error, Omit<UploadParams, 'employeeId'>>(
    (params) => uploadDocuments({ ...params, employeeId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentsCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
