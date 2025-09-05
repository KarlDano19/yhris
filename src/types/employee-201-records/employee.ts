export type Employee = {
  id: number;

  // completeness / progress
  hasCompleteRecords: boolean;
  progressPercentage: number;
  incompleteRecords: {
    missing: {
      name: string; // Section name
      count: number;
      items: {
        name: string;      // Item label
        missing?: string[]; // Optional: sub-missing items (e.g. SSS, PhilHealth)
      }[];
    }[];
    count: number; // total missing items across all sections
  } | null;

  // classification
  department: string | null; // e.g. "IT"
  position: string | null;   // e.g. "UI/UX Designer"

  // timestamps
  created_at: string; // ISO
  updated_at: string; // ISO

  // identifiers
  employee_id: string | null;
  system_id: number | null;

  // personal info
  firstname: string;
  middlename: string | null;
  lastname: string;
  email: string | null;
  mobile: string | null;
  address: string | null;
  date_hired: string | null; // ISO (YYYY-MM-DD)
  nationality?: string | null;
  gender?: string | null;
  religion?: string | null;
  location?: string | null;

  // status / misc
  is_active?: boolean;
  is_resigned?: boolean;
  photo?: string | null;
  employment_status?: string | null;

  // gov IDs
  tin?: string | null;
  sss?: string | null;
  pagibig?: string | null;
  philhealth?: string | null;

  // emergency contact
  emergency_contact?: {
    name?: string | null;
    contact_number?: string | null;
    relation?: string | null;
    address?: string | null;
  } | null;

  // relations
  employer?: number | null;

  // optional inline lists from API
  positions_list?: { id: number; name: string }[] | string[] | null;
  departments_list?: { id: number; name: string }[] | string[] | null;
  locations_list?: { id: number; name: string }[] | string[] | null;
};
