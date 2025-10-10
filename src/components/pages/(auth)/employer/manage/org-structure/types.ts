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