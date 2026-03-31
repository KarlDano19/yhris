export type T_EmployeeDocumentFolder = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  document_count: number;
};

export type T_EmployeeDocument = {
  id: number;
  employee_id: number;
  employee_name: string | null;
  folder_id: number | null;
  folder_name: string | null;
  file: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  description: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type T_CreateFolderData = {
  name: string;
  description?: string;
  order?: number;
};

export type T_UpdateFolderData = {
  name?: string;
  description?: string;
  order?: number;
};

export type T_UploadDocumentsData = {
  files: FileList;
  folder_id?: number | null;
  description?: string;
};

export type T_UpdateDocumentData = {
  folder_id?: number | null;
  file_name?: string;
  description?: string;
};

export type T_FolderResponse = {
  message: string;
  data?: T_EmployeeDocumentFolder;
};

export type T_DocumentResponse = {
  message: string;
  count?: number;
  data?: T_EmployeeDocument;
};
