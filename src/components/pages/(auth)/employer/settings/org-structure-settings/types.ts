// Types for our organizational data - matching backend structure
export interface OrgStructure {
  id: number | string; // Allow string for shadow buttons
  description: string;
  position_name: string;
  position: number; // position ID from positions table
  parent?: number | null;
  parent_position_name?: string;
  order: number;
  is_active: boolean;
  children?: OrgStructure[];
  employees?: any[];
  primary_employee?: any;
  isAddButton?: boolean; // for UI shadow buttons
  isPending?: boolean; // for pending changes
  isMoved?: boolean; // for moved positions
}

export interface DragState {
  isDragging: boolean;
  dragStart: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

export interface ChartState {
  zoomLevel: number;
  chartKey: number;
  isModeChanging: boolean;
  isFullscreen: boolean;
}

export interface DragDropState {
  draggedNodeId: number | string | null;
  dragOverNodeId: number | string | null;
  draggedPosition: OrgStructure | null;
  targetPosition: OrgStructure | null;
}
