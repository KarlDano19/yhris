// Types for employee data
export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  photo?: string;
  gender?: string;
}

// Types for job posting hiring information
export interface JobPostingDetail {
  id: number;
  job_title: string;
  required_slot: number;
  hired_count: number;
  remaining_slots: number;
}

export interface HiringInfo {
  is_hiring: boolean;
  total_remaining_slots: number;
  total_required_slots: number;
  total_hired: number;
  active_postings_count: number;
  postings: JobPostingDetail[];
}

// Types for organizational structure data
export interface OrgStructure {
  id: number | string;
  description: string;
  position_name: string;
  position: number;
  parent?: number | null;
  parent_position_name?: string;
  order: number;
  is_active: boolean;
  children?: OrgStructure[];
  employees?: Employee[];
  primary_employee?: Employee;
  hiring_info?: HiringInfo | null;
}

// Props for organization node components
export interface OrgNodeProps {
  data: OrgStructure;
  clickedNodeId: number | string | null;
  setClickedNodeId: (id: number | string | null) => void;
  expandedPositions?: Set<number | string>;
  setExpandedPositions?: (positions: Set<number | string>) => void;
  onSetPrimaryEmployee?: (orgStructureId: number | string, employeeId: number) => void;
  disableTooltips?: boolean;
  isSelectionMode?: boolean;
  selectedPositions?: Set<number | string>;
  setSelectedPositions?: (positions: Set<number | string>) => void;
  usePlaceholderAvatars?: boolean;
  excludeAvatars?: boolean;
}

// Props for position details modal/tooltip
export interface PositionDetailsModalProps {
  data: OrgStructure;
  primaryEmployee?: Employee;
  isVisible: boolean;
  onClose: () => void;
}

// Props for position action modal
export interface PositionActionModalProps {
  data: OrgStructure;
  primaryEmployee?: Employee;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onShowEmployees: () => void;
  isExpanded?: boolean;
}