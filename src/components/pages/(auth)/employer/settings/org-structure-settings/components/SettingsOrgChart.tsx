'use client';

import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

import { Tree, TreeNode } from 'react-organizational-chart';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ZoomControls from './ZoomControls';
import PositionModal from '../modals/PositionModal';
import DeleteModal from '../modals/DeleteModal';
import MoveModal from '../modals/MoveModal';
import useGetOrgStructureSettings from '../hooks/useGetOrgStructureSettings';
import useAddOrgStructure from '../hooks/useAddOrgStructure';
import useUpdateOrgStructure from '../hooks/useUpdateOrgStructure';
import useDeleteOrgStructure from '../hooks/useDeleteOrgStructure';
import useMoveOrgStructure from '../hooks/useMoveOrgStructure';
import useSwapOrgStructure from '../hooks/useSwapOrgStructure';

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
  onMove?: (nodeId: number, newParentId: number | null, newOrder?: number) => void;
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

interface SettingsOrgChartProps {
  isEditMode?: boolean;
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
  onMove,
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


// Main Org Chart Component
const SettingsOrgChart = React.forwardRef<any, SettingsOrgChartProps>(({ isEditMode = false }, ref) => {
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [editingPosition, setEditingPosition] = useState<OrgStructure | null>(null);
  const [deletingPosition, setDeletingPosition] = useState<OrgStructure | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState<OrgStructure | null>(null);
  const [targetPosition, setTargetPosition] = useState<OrgStructure | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [chartKey, setChartKey] = useState(0);
  const [draggedNodeId, setDraggedNodeId] = useState<number | string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<number | string | null>(null);
  const [isCentering, setIsCentering] = useState(false);
  const [isModeChanging, setIsModeChanging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
  // API hooks
  const { data: orgStructureData, isLoading, error, refetch } = useGetOrgStructureSettings();
  const addMutation = useAddOrgStructure();
  const updateMutation = useUpdateOrgStructure();
  const deleteMutation = useDeleteOrgStructure();
  const moveMutation = useMoveOrgStructure();
  const swapMutation = useSwapOrgStructure();
  
  // Load data from API
  useEffect(() => {
    if (orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0) {
      // Get the first root node and add shadow buttons
      let rootNode = orgStructureData[0];
      if (rootNode) {
        rootNode = addShadowButtonsToNode(rootNode);
        setOrgData(rootNode);
      } else {
        setOrgData(null);
      }
    } else {
      setOrgData(null);
    }
  }, [orgStructureData, isEditMode]);

  // Center chart when edit mode changes
  useEffect(() => {
    if (orgData && !isModeChanging) {
      // Add a small delay to ensure DOM is updated with buttons
      setTimeout(() => {
        centerChart();
      }, 100);
    }
  }, [isEditMode]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isFullscreen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
    };
  }, []);

  // Function to refresh the chart
  const refreshChart = () => {
    refetch();
    setChartKey(prev => prev + 1);
  };

  // Function to smoothly center the chart
  const centerChart = () => {
    setIsCentering(true);
    setIsModeChanging(true);
    
    // Calculate offset to account for button space in edit mode
    let centerOffsetX = 0;
    if (isEditMode) {
      // In edit mode, we need to shift the chart to the LEFT to compensate
      // for the + buttons that extend to the right of each node
      // The buttons make the chart appear wider, so we shift left to re-center
      centerOffsetX = -60; // Negative offset to shift left
    } else {
      // In view mode, ensure perfect center
      centerOffsetX = 0;
    }
    
    // Set the calculated offset
    setDragOffset({ x: centerOffsetX, y: 0 });
    
    // Add a delay to allow the DOM to update with new buttons and prevent spam clicking
    setTimeout(() => {
      setIsCentering(false);
      setIsModeChanging(false);
    }, 500); // Increased delay to prevent spam clicking
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearLocalChanges: refreshChart,
    forceRefresh: refreshChart
  }));
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2)); // Max zoom 2x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
  };

  // Drag functions
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the background, not on nodes or buttons
    const target = e.target as HTMLElement;
    if (e.target === e.currentTarget || 
        (target.closest('.org-tree-container') && !target.closest('.pointer-events-auto'))) {
      // Don't start panning if we're in the middle of a drag operation
      if (!draggedNodeId) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
        e.preventDefault();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only stop dragging if leaving the container entirely
    if (isDragging && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Drag and drop handlers
  const handleDragStart = (nodeId: number | string) => {
    setDraggedNodeId(nodeId);
  };

  const handleDragEnd = () => {
    // Clear any pending timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
    setDraggedNodeId(null);
    setDragOverNodeId(null);
  };

  const handleDragOver = (nodeId: number | string) => {
    // Clear any existing timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
    
    // Only update if the node is different to prevent flickering
    if (dragOverNodeId !== nodeId) {
      setDragOverNodeId(nodeId);
    }
  };

  const handleDragLeave = () => {
    // Clear any existing timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }
    
    // Add a small delay to prevent flickering when moving between nodes
    dragOverTimeoutRef.current = setTimeout(() => {
      setDragOverNodeId(null);
      dragOverTimeoutRef.current = null;
    }, 100);
  };

  const handleDrop = (draggedNode: OrgStructure, targetNode: OrgStructure) => {
    setDraggedPosition(draggedNode);
    setTargetPosition(targetNode);
    setShowMoveModal(true);
  };

  const handleMoveConfirm = async (action: 'swap' | 'move') => {
    if (!draggedPosition || !targetPosition || typeof draggedPosition.id !== 'number') return;

    setIsMoving(true);
    
    try {
      if (action === 'swap') {
        // Swap positions - only if they have the same parent
        if (draggedPosition.parent === targetPosition.parent) {
          // Use the swap mutation hook for proper position swapping
          await swapMutation.mutateAsync({
            orgStructureId: draggedPosition.id,
            data: {
              swap_with_id: typeof targetPosition.id === 'number' ? targetPosition.id : parseInt(targetPosition.id.toString())
            }
          });
          
          toast.custom(() => <CustomToast message='Positions swapped successfully!' type='success' />, {
            duration: 3000,
          });
        } else {
          // If different parents, treat as move operation
          await moveMutation.mutateAsync({
            orgStructureId: draggedPosition.id,
            data: {
              new_parent_id: typeof targetPosition.id === 'number' ? targetPosition.id : null
            }
          });
          
          toast.custom(() => <CustomToast message='Position moved successfully!' type='success' />, {
            duration: 3000,
          });
        }
        
      } else {
        // Move as child - dragged becomes child of target
        await moveMutation.mutateAsync({
          orgStructureId: draggedPosition.id,
          data: {
            new_parent_id: typeof targetPosition.id === 'number' ? targetPosition.id : null
          }
        });
        
        toast.custom(() => <CustomToast message='Position moved successfully!' type='success' />, {
          duration: 3000,
        });
      }
      
      setShowMoveModal(false);
      setDraggedPosition(null);
      setTargetPosition(null);
      
      // Refresh the chart
      refreshChart();
    } catch (error: any) {
      console.error('Error moving position:', error);
      toast.custom(() => <CustomToast message={error.message || 'Failed to move position'} type='error' />, {
        duration: 5000,
      });
    } finally {
      setIsMoving(false);
    }
  };


  // Helper function to add shadow buttons to nodes recursively - only in edit mode
  const addShadowButtonsToNode = (node: OrgStructure): OrgStructure => {
    const updatedNode = { ...node };
    
    // Only add shadow buttons in edit mode
    if (isEditMode) {
      if (updatedNode.children && updatedNode.children.length > 0) {
        // Add shadow button to children
        updatedNode.children = updatedNode.children.map(child => addShadowButtonsToNode(child));
        
        // Add shadow button for this parent
        const shadowButton: OrgStructure = {
          id: `shadow-${updatedNode.id}`,
          description: '',
          position_name: '',
          position: 0,
          parent: typeof updatedNode.id === 'number' ? updatedNode.id : null,
          order: 0,
          is_active: false,
          children: [],
          isAddButton: true
        };
        
        updatedNode.children.push(shadowButton);
      } else {
        // No children, add shadow button
        updatedNode.children = [{
          id: `shadow-${updatedNode.id}`,
          description: '',
          position_name: '',
          position: 0,
          parent: typeof updatedNode.id === 'number' ? updatedNode.id : null,
          order: 0,
          is_active: false,
          children: [],
          isAddButton: true
        }];
      }
    } else {
      // Not in edit mode, just process children without adding shadow buttons
      if (updatedNode.children && updatedNode.children.length > 0) {
        updatedNode.children = updatedNode.children.map(child => addShadowButtonsToNode(child));
      }
    }
    
    return updatedNode;
  };

  // Event handlers
  const handleAddChild = (parentId: number) => {
    setSelectedParentId(parentId);
    setEditingPosition(null);
    setShowModal(true);
  };

  const handleEdit = (nodeId: number | string) => {
    const findNode = (node: OrgStructure): OrgStructure | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    if (orgData) {
      const nodeToEdit = findNode(orgData);
      if (nodeToEdit && !nodeToEdit.isAddButton) {
        setEditingPosition(nodeToEdit);
        setSelectedParentId(null);
        setShowModal(true);
      }
    }
  };

  const handleDelete = (nodeId: number | string) => {
    const findNode = (node: OrgStructure): OrgStructure | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    if (orgData) {
      const nodeToDelete = findNode(orgData);
      if (nodeToDelete && !nodeToDelete.isAddButton) {
        setDeletingPosition(nodeToDelete);
        setShowDeleteModal(true);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPosition || typeof deletingPosition.id !== 'number') return;

    setIsDeleting(true);
    
    try {
      await deleteMutation.mutateAsync(deletingPosition.id);
      
      toast.custom(() => <CustomToast message='Position deleted successfully!' type='success' />, {
        duration: 3000,
      });
      
      setShowDeleteModal(false);
      setDeletingPosition(null);
      
      // Refresh the chart
      refreshChart();
    } catch (error: any) {
      console.error('Error deleting position:', error);
      toast.custom(() => <CustomToast message={error.message || 'Failed to delete position'} type='error' />, {
        duration: 7000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSavePosition = async (positionName: string, description: string, positionId: number) => {
    try {
      if (editingPosition && typeof editingPosition.id === 'number') {
        // Update existing position
        await updateMutation.mutateAsync({
          orgStructureId: editingPosition.id,
          data: {
            position: positionId,
            description: description || positionName,
          }
        });
        
        toast.custom(() => <CustomToast message='Position updated successfully!' type='success' />, {
          duration: 3000,
        });
        
      } else {
        // Add new position
        await addMutation.mutateAsync({
          position: positionId,
          description: description || positionName,
          parent: selectedParentId
        });
        
        toast.custom(() => <CustomToast message='Position added successfully!' type='success' />, {
          duration: 3000,
        });
      }

      setShowModal(false);
      setSelectedParentId(null);
      setEditingPosition(null);
      
      // Refresh the chart
      refreshChart();
    } catch (error: any) {
      console.error('Error saving position:', error);
      toast.custom(() => <CustomToast message={error.message || 'Failed to save position'} type='error' />, {
        duration: 7000,
      });
    }
  };

  // Render tree recursively
  const renderTree = (node: OrgStructure): React.ReactNode => {
    return (
      <TreeNode
        label={
          <div className="flex justify-center w-full">
            <OrgNode
              data={node}
              onAddChild={handleAddChild}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isEditMode={isEditMode}
              isDragging={draggedNodeId === node.id}
              isDragOver={dragOverNodeId === node.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              orgData={orgData}
              onDrop={handleDrop}
            />
          </div>
        }
        key={node.id}
      >
        {node.children && node.children.map(renderTree)}
      </TreeNode>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
        <LoadingSpinner 
          size="lg" 
          color="yellow" 
          text="Loading organizational structure settings..." 
          showText={true}
          className="h-full"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 text-center">Error loading organizational structure</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Initial empty state
  if (!orgData) {
    return (
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer shadow-lg transition-colors mb-4"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-center text-sm max-w-md">
            (Click the plus button to select the parent or top position of the organization hierarchy)
          </p>
        </div>

        <PositionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(positionName: string, description: string, positionId: number) => 
            handleSavePosition(positionName, description, positionId)
          }
          orgData={orgData}
        />
      </div>
    );
  }

  // Fullscreen chart component
  const FullscreenChart = () => (
    <div 
      className={`fixed inset-0 z-50 bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={chartContainerRef}
        className={`min-w-max flex justify-center items-center transition-transform duration-300 ease-in-out ${
          isModeChanging ? 'pointer-events-none opacity-90' : ''
        }`}
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transformOrigin: 'center center',
          minHeight: '100%'
        }}
      >
        <div className="org-tree-container">
          <Tree
            key={chartKey}
            lineWidth="2px"
            lineColor="#3b82f6"
            lineBorderRadius="10px"
            lineStyle="dashed"
            label={
              <div className="flex justify-center w-full">
                <OrgNode
                  data={orgData}
                  onAddChild={handleAddChild}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditMode={isEditMode}
                  isDragging={draggedNodeId === orgData.id}
                  isDragOver={dragOverNodeId === orgData.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  orgData={orgData}
                  onDrop={handleDrop}
                />
              </div>
            }
          >
            {orgData.children && orgData.children.map(renderTree)}
          </Tree>
        </div>
      </div>

      {/* Debug Fullscreen State */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded">
          Fullscreen: {isFullscreen ? 'ON' : 'OFF'}
        </div>
      )}

      {/* Zoom Controls */}
      <ZoomControls 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />
    </div>
  );

  // Render fullscreen chart in portal if in fullscreen mode
  if (isFullscreen) {
    return createPortal(<FullscreenChart />, document.body);
  }

  return (
    <div 
      className={`w-full bg-gray-50 p-8 rounded-lg overflow-hidden relative flex-1 h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      
      <div 
        ref={chartContainerRef}
        className={`min-w-max flex justify-center items-center transition-transform duration-300 ease-in-out ${
          isModeChanging ? 'pointer-events-none opacity-90' : ''
        }`}
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transformOrigin: 'center center',
          minHeight: '100%'
        }}
      >
        <div className="org-tree-container">
          <Tree
            key={chartKey}
            lineWidth="2px"
            lineColor="#3b82f6"
            lineBorderRadius="10px"
            lineStyle="dashed"
            label={
              <div className="flex justify-center w-full">
                <OrgNode
                  data={orgData}
                  onAddChild={handleAddChild}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditMode={isEditMode}
                  isDragging={draggedNodeId === orgData.id}
                  isDragOver={dragOverNodeId === orgData.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  orgData={orgData}
                  onDrop={handleDrop}
                />
              </div>
            }
          >
            {orgData.children && orgData.children.map(renderTree)}
          </Tree>
        </div>
      </div>

      {/* Zoom Controls */}
      <ZoomControls 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />

      <PositionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedParentId(null);
          setEditingPosition(null);
        }}
        onSave={(positionName: string, description: string, positionId: number) => 
          handleSavePosition(positionName, description, positionId)
        }
        editingPosition={editingPosition || undefined}
        orgData={orgData}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPosition(null);
        }}
        onConfirm={handleConfirmDelete}
        deletingPosition={deletingPosition}
        isLoading={isDeleting}
      />

      <MoveModal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setDraggedPosition(null);
          setTargetPosition(null);
        }}
        onConfirm={handleMoveConfirm}
        draggedPosition={draggedPosition}
        targetPosition={targetPosition}
        isLoading={isMoving}
      />
    </div>
  );
});

SettingsOrgChart.displayName = 'SettingsOrgChart';

export default SettingsOrgChart;
