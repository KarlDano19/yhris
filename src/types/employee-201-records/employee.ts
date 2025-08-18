// types/employee.ts
export type GovernmentIds = {
  tin?: string;
  sss?: string;
  pagibig?: string;      // PAG-IBIG
  philhealth?: string;
};

export type EmergencyContact = {
  name: string;
  relation: string;      // e.g., "Mother"
  contactNumber: string;
  address?: string;
};

export type Employee = {
  // core / list view
  id: string;
  avatar: string;
  complete: boolean;
  percent?: number;
  alert?: boolean;
  missingCount?: number;
  totalCount?: number;

  // classification (kept for filters)
  location?: string;     // e.g., "Manila"
  department?: string;   // e.g., "Accounting"
  position?: string;     // e.g., "Associate" | "Manager"

  // profile header
  jobTitle?: string;     // e.g., "Accounting Officer"
  displayDept?: string;  // if you want header to show "(Accounting)"

  // personal info section
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  address?: string;
  contactNumber?: string;

  // derived convenience (for existing tiles/search)
  name: string;          // keep this for tiles: `${firstName} ${lastName}`

  // PH Government IDs
  governmentIds?: GovernmentIds;

  // Emergency contact
  emergencyContact?: EmergencyContact;
};
