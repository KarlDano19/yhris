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

  // --- Employment Details (canonical) ---
  /** ISO date string, e.g. "2025-08-08" */
  dateHired?: string;
  employmentStatus?:
    | "Active"
    | "Probationary"
    | "Contract"
    | "On Leave"
    | "Terminated"
    | string;
  /** Monthly base salary (number) */
  basePay?: number;
  salaryCurrency?: string;
  locationsList?: string[];

  // --- Legacy/alias fields (to be removed later) ---
  /** @deprecated use id */
  employeeId?: string;
  /** @deprecated use dateHired */
  hireDate?: string;
  /** @deprecated use employmentStatus */
  status?: string;
  /** @deprecated use location */
  workLocation?: string;
  /** @deprecated use basePay */
  salary?: number;
};
