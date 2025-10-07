'use client';

import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

// Types for our organizational data - matching backend structure
interface OrgStructure {
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

interface OrgNodeProps {
  data: OrgStructure;
  onAddChild: (parentId: number) => void;
  onEdit: (nodeId: number | string) => void;
  onDelete: (nodeId: number | string) => void;
  isEditMode?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (nodeId: number | string) => void;
  onDragEnd?: () => void;
  onDragOver?: (nodeId: number | string) => void;
  onDragLeave?: () => void;
  orgData?: OrgStructure | null;
  onDrop?: (draggedNode: OrgStructure, targetNode: OrgStructure) => void;
}

// Helper function to find a node by ID in the org tree
const findNodeById = (node: OrgStructure | null, id: number): OrgStructure | null => {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
};

// Custom Node Component
const OrgNode: React.FC<OrgNodeProps> = ({ 
  data, 
  onAddChild, 
  onEdit, 
  onDelete, 
  isEditMode = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver: onDragOverCallback,
  onDragLeave,
  orgData,
  onDrop: onDropCallback
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Render Shadow Add Button (clickable placeholder) - only in edit mode
  if (data.isAddButton && typeof data.id === 'string' && data.id.includes('shadow')) {
    if (!isEditMode) {
      return null; // Don't show + icons when not in edit mode
    }
    
    const parentId = typeof data.parent === 'number' ? data.parent : 0;
    return (
      <div className="relative flex flex-col items-center pointer-events-auto mx-2">
        <div 
          className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 cursor-pointer border-2 border-dashed border-gray-400 transition-colors"
          onClick={() => onAddChild(parentId)}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on shadow button
          title="Add Child Position"
        >
          <PlusIcon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    );
  }

  // Render Add Button (fallback - not used in current flow)
  if (data.isAddButton) {
    const parentId = typeof data.parent === 'number' ? data.parent : 0;
    return (
      <div className="relative flex flex-col items-center pointer-events-auto mx-2">
        <div
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer shadow-lg transition-colors"
          onClick={() => onAddChild(parentId)}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on add button
        >
          <PlusIcon className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (typeof data.id === 'number' && isEditMode) {
      e.dataTransfer.setData('text/plain', data.id.toString());
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(data.id);
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    // Always show visual feedback when dragging over any node (except the one being dragged)
    if (typeof data.id === 'number' && isEditMode) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      onDragOverCallback?.(data.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only trigger drag leave if we're actually leaving the node
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      onDragLeave?.();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedId && typeof data.id === 'number' && draggedId !== data.id) {
      // Find the dragged and target nodes
      const draggedNode = findNodeById(orgData || null, draggedId);
      const targetNode = findNodeById(orgData || null, data.id);
      
      if (draggedNode && targetNode && onDropCallback) {
        onDropCallback(draggedNode, targetNode);
      }
    }
  };

  // Render Position Node
  return (
    <div 
      className="relative pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on node
      draggable={typeof data.id === 'number' && isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Main Position Node - Adaptive Width */}
      <div className={`bg-white border-2 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out min-w-36 max-w-52 text-center mx-2 ${
        isDragOver
          ? 'border-blue-500 bg-blue-100 shadow-lg ring-4 ring-blue-400 ring-opacity-75 scale-105'
          : isDragging
          ? 'opacity-50 scale-95'
          : 'border-gray-200'
      }`}>
        {/* Position Name Only */}
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="font-semibold text-sm leading-tight px-2 text-gray-800">
            {data.position_name}
          </h3>
          {isDragOver && (
            <span className="text-xs text-blue-600 mt-1">Drop here</span>
          )}
        </div>

        {/* Action Buttons - Show on Hover (Edit and Delete only) - only in edit mode */}
        {isHovered && isEditMode && (
          <div className="absolute -top-1 -right-1 flex gap-1">
            <button
              onClick={() => onEdit(data.id)}
              className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              title="Edit"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(data.id)}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
              title="Delete"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgNode;
