'use client';

import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

import { Tree, TreeNode } from 'react-organizational-chart';
import { PlusIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import OrgNode from './OrgNode';
import FullscreenChart from './FullscreenChart';
import PositionModal from '../modals/PositionModal';
import MoveModal from '../modals/MoveModal';
import useAddOrgStructure from '../hooks/useAddOrgStructure';
import useUpdateOrgStructure from '../hooks/useUpdateOrgStructure';
import useDeleteOrgStructure from '../hooks/useDeleteOrgStructure';
import useMoveOrgStructure from '../hooks/useMoveOrgStructure';
import useSwapOrgStructure from '../hooks/useSwapOrgStructure';
import { OrgStructure } from '../types';
import { 
  calculateZoomIn, 
  calculateZoomOut, 
  createRefreshChart, 
  createCenterChart, 
  createEscapeKeyHandler 
} from '../functions/chartUtils';
import { 
  createDragStartHandler, 
  createDragEndHandler, 
  createDragOverHandler, 
  createDragLeaveHandler 
} from '../functions/dragUtils';
import { 
  createMouseDownHandler, 
  createMouseMoveHandler, 
  createMouseUpHandler, 
  createMouseLeaveHandler, 
  createTouchStartHandler, 
  createTouchMoveHandler, 
  createTouchEndHandler
} from '../functions/eventUtils';
import {
  createKeyboardZoomHandler,
  createWheelZoomHandler,
  createPinchZoomHandler
} from '../functions/browserZoomUtils';

interface SettingsOrgChartProps {
  isEditMode?: boolean;
  orgStructureData?: any[];
  isLoading?: boolean;
  error?: any;
  refetch?: () => void;
  onEditMode?: () => void;
  onCancel?: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  dragOffset: { x: number; y: number };
  setDragOffset: (offset: { x: number; y: number }) => void;
}

// Tree manipulation utilities
const findNodeByIdGeneric = (node: OrgStructure, nodeId: number | string): OrgStructure | null => {
  if (node.id === nodeId) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByIdGeneric(child, nodeId);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to add shadow buttons to nodes recursively - only in edit mode
const addShadowButtonsToNode = (node: OrgStructure, isEditMode: boolean): OrgStructure => {
  const updatedNode = { ...node };
  
  // Only add shadow buttons in edit mode
  if (isEditMode) {
    if (updatedNode.children && updatedNode.children.length > 0) {
      // Add shadow button to children
      updatedNode.children = updatedNode.children.map(child => addShadowButtonsToNode(child, isEditMode));
      
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
      updatedNode.children = updatedNode.children.map(child => addShadowButtonsToNode(child, isEditMode));
    }
  }
  
  return updatedNode;
};

// Main Org Chart Component
const SettingsOrgChart = React.forwardRef<any, SettingsOrgChartProps>(({ 
  isEditMode = false, 
  orgStructureData, 
  isLoading, 
  error, 
  refetch,
  onEditMode,
  onCancel,
  zoomLevel,
  setZoomLevel,
  isFullscreen,
  setIsFullscreen,
  dragOffset,
  setDragOffset
}, ref) => {
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [editingPosition, setEditingPosition] = useState<OrgStructure | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<(DeleteModalData & { position?: OrgStructure }) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState<OrgStructure | null>(null);
  const [targetPosition, setTargetPosition] = useState<OrgStructure | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [draggedNodeId, setDraggedNodeId] = useState<number | string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<number | string | null>(null);
  const [isModeChanging, setIsModeChanging] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);
    
  // API hooks
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
        rootNode = addShadowButtonsToNode(rootNode, isEditMode);
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
    const handleEscapeKey = createEscapeKeyHandler(isFullscreen, setIsFullscreen);

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

  // Zoom helper functions
  const handleZoomIn = () => {
    setZoomLevel(calculateZoomIn(zoomLevel));
  };

  const handleZoomOut = () => {
    setZoomLevel(calculateZoomOut(zoomLevel));
  };

  // Browser zoom integration - keyboard shortcuts (Ctrl/Cmd + Plus/Minus/0)
  useEffect(() => {
    const handleKeyboardZoom = createKeyboardZoomHandler(
      zoomLevel,
      setZoomLevel,
      handleZoomIn,
      handleZoomOut
    );

    document.addEventListener('keydown', handleKeyboardZoom);
    return () => document.removeEventListener('keydown', handleKeyboardZoom);
  }, [zoomLevel]);

  // Browser zoom integration - wheel/pinch zoom (Ctrl + scroll, trackpad pinch)
  useEffect(() => {
    const handleWheelZoom = createWheelZoomHandler(zoomLevel, setZoomLevel);
    
    const chartElement = chartContainerRef.current?.parentElement;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleWheelZoom, { passive: false });
      return () => chartElement.removeEventListener('wheel', handleWheelZoom);
    }
  }, [zoomLevel]);

  // Browser zoom integration - touch pinch zoom for mobile
  useEffect(() => {
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = createPinchZoomHandler(
      zoomLevel,
      setZoomLevel,
      pinchDistanceRef
    );

    const chartElement = chartContainerRef.current?.parentElement;
    if (chartElement) {
      chartElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      chartElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      chartElement.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        chartElement.removeEventListener('touchstart', handleTouchStart);
        chartElement.removeEventListener('touchmove', handleTouchMove);
        chartElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [zoomLevel]);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Function to refresh the chart
  const refreshChart = createRefreshChart(refetch, setChartKey);

  // Function to smoothly center the chart
  const centerChart = createCenterChart(setIsModeChanging, setDragOffset, isEditMode);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearLocalChanges: refreshChart,
    forceRefresh: refreshChart
  }));


  // Drag functions
  const handleMouseDown = createMouseDownHandler(setIsDragging, setDragStart, dragOffset, draggedNodeId, zoomLevel);
  const handleMouseMove = createMouseMoveHandler(isDragging, setDragOffset, dragStart, zoomLevel);
  const handleMouseUp = createMouseUpHandler(isDragging, setIsDragging);
  const handleMouseLeave = createMouseLeaveHandler(isDragging, setIsDragging);

  // Handle touch events for mobile
  const handleTouchStart = createTouchStartHandler(setIsDragging, setDragStart, dragOffset, zoomLevel);
  const handleTouchMove = createTouchMoveHandler(isDragging, setDragOffset, dragStart, zoomLevel);
  const handleTouchEnd = createTouchEndHandler(setIsDragging);


  // Drag and drop handlers
  const handleDragStart = createDragStartHandler(setDraggedNodeId);
  const handleDragEnd = createDragEndHandler(setDraggedNodeId, setDragOverNodeId, dragOverTimeoutRef);
  const handleDragOver = createDragOverHandler(setDragOverNodeId, dragOverTimeoutRef, dragOverNodeId);
  const handleDragLeave = createDragLeaveHandler(setDragOverNodeId, dragOverTimeoutRef);
  const handleDrop = (draggedNode: any, targetNode: any) => {
    // If in fullscreen mode, exit fullscreen first
    if (isFullscreen) {
      setIsFullscreen(false);
      // Use setTimeout to ensure fullscreen exits before opening modal
      setTimeout(() => {
        setDraggedPosition(draggedNode);
        setTargetPosition(targetNode);
        setShowMoveModal(true);
      }, 100);
    } else {
      setDraggedPosition(draggedNode);
      setTargetPosition(targetNode);
      setShowMoveModal(true);
    }
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


  // Event handlers
  const handleAddChild = (parentId: number) => {
    // If in fullscreen mode, exit fullscreen first
    if (isFullscreen) {
      setIsFullscreen(false);
      // Use setTimeout to ensure fullscreen exits before opening modal
      setTimeout(() => {
        setSelectedParentId(parentId);
        setEditingPosition(null);
        setShowModal(true);
      }, 100);
    } else {
      setSelectedParentId(parentId);
      setEditingPosition(null);
      setShowModal(true);
    }
  };

  const handleEdit = (nodeId: number | string) => {
    if (orgData) {
      const nodeToEdit = findNodeByIdGeneric(orgData, nodeId);
      if (nodeToEdit && !nodeToEdit.isAddButton) {
        // If in fullscreen mode, exit fullscreen first
        if (isFullscreen) {
          setIsFullscreen(false);
          // Use setTimeout to ensure fullscreen exits before opening modal
          setTimeout(() => {
            setEditingPosition(nodeToEdit);
            setSelectedParentId(null);
            setShowModal(true);
          }, 100);
        } else {
          setEditingPosition(nodeToEdit);
          setSelectedParentId(null);
          setShowModal(true);
        }
      }
    }
  };

  const handleDelete = (nodeId: number | string) => {
    if (orgData) {
      const nodeToDelete = findNodeByIdGeneric(orgData, nodeId);
      if (nodeToDelete && !nodeToDelete.isAddButton) {
        // If in fullscreen mode, exit fullscreen first
        if (isFullscreen) {
          setIsFullscreen(false);
          // Use setTimeout to ensure fullscreen exits before opening modal
          setTimeout(() => {
            setDeleteModalData({ open: true, position: nodeToDelete });
          }, 100);
        } else {
          setDeleteModalData({ open: true, position: nodeToDelete });
        }
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalData?.position || typeof deleteModalData.position.id !== 'number') return;

    setIsDeleting(true);
    
    try {
      await deleteMutation.mutateAsync(deleteModalData.position.id);
      
      toast.custom(() => <CustomToast message='Position deleted successfully!' type='success' />, {
        duration: 3000,
      });
      
      setDeleteModalData(null);
      
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
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
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
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 text-center">Error loading organizational structure</p>
          <button 
            onClick={() => refetch?.()}
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
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
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


  // Render fullscreen chart in portal if in fullscreen mode
  if (isFullscreen) {
    return createPortal(
      <FullscreenChart
        isDragging={isDragging}
        isModeChanging={isModeChanging}
        zoomLevel={zoomLevel}
        dragOffset={dragOffset}
        chartKey={chartKey}
        orgData={orgData}
        isEditMode={false}
        draggedNodeId={draggedNodeId}
        dragOverNodeId={dragOverNodeId}
        isFullscreen={isFullscreen}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onAddChild={handleAddChild}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
        renderTree={renderTree}
        setDragOffset={setDragOffset}
        chartContainerRef={chartContainerRef}
        setZoomLevel={setZoomLevel}
      />, 
      document.body
    );
  }

  return (
    <div 
      className={`w-full bg-gray-50 overflow-hidden relative flex-1 h-full ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div 
        ref={chartContainerRef}
        className={`min-w-max flex justify-center items-center ${
          isModeChanging ? 'pointer-events-none opacity-90' : ''
        }`}
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x / zoomLevel}px, ${dragOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          minHeight: '100%',
          willChange: isDragging ? 'transform' : 'auto',
          transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
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


      {/* Position Modal */}
      {showModal && (
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
      )}

      {/* Delete Modal */}
      {deleteModalData && (
        <DeleteModal
          isOpen={deleteModalData}
          setIsOpen={setDeleteModalData}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          confirmText="Delete"
          customText={`the position "${deleteModalData.position?.position_name || 'this position'}"`}
        />
      )}

      {/* Move Modal */}
      {showMoveModal && (
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
      )}
    </div>
  );
});

SettingsOrgChart.displayName = 'SettingsOrgChart';

export default SettingsOrgChart;
