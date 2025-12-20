export type Employee = {
  id: number;

  hasCompleteRecords: boolean;
  progressPercentage: number;
  incompleteRecords: {
    missing: {
      name: string;
      count: number;
      items: {
        name: string;
        missing?: string[];
      }[];
    }[];
    count: number;
  } | null;

  department: string | null;
  position: string | null;

  created_at: string;
  updated_at: string;

  employee_id: string | null;
  system_id: number | null;

  firstname: string;
  middlename: string | null;
  lastname: string;
  email: string | null;
  mobile: string | null;
  address: string | null;
  date_hired: string | null;
  birthdate?: string | null;
  nationality?: string | null;
  gender?: string | null;
  religion?: string | null;
  location?: string | null;

  is_active?: boolean;
  is_resigned?: boolean;
  photo?: string | null;
  employment_status?: string | null;

  tin?: string | null;
  sss?: string | null;
  pagibig?: string | null;
  philhealth?: string | null;

  emergency_contact?: {
    name?: string | null;
    contact_number?: string | null;
    relation?: string | null;
    address?: string | null;
  } | null;

  employer?: number | null;

  positions_list?: { id: number; name: string }[] | string[] | null;
  departments_list?: { id: number; name: string }[] | string[] | null;
  locations_list?: { id: number; name: string }[] | string[] | null;
  employment_status_list?: string[] | { name: string }[] | null;
};
