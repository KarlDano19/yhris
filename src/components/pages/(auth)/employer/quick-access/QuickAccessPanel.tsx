'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Draggable, Droppable, DroppableProps, DropResult } from 'react-beautiful-dnd';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement } from '@/config/ui-permissions';
import { getCatalogItemById } from '@/config/quick-access-catalog';

import useGetQuickAccess from './hooks/useGetQuickAccess';
import useUpdateQuickAccess from './hooks/useUpdateQuickAccess';
import useGetQuickAccessCounters from './hooks/useGetQuickAccessCounters';
import QuickAccessEditModal from './QuickAccessEditModal';

// Workaround for react-beautiful-dnd + React 18 Strict Mode
function StrictModeDroppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
}

type Props = {
  className?: string;
  hasActiveSubscription?: boolean;
  onGrayedOutClick?: (link: string, reason: 'subscription' | 'permission', featureName?: string) => void;
};

export default function QuickAccessPanel({ className = '', hasActiveSubscription, onGrayedOutClick }: Props) {
  const router = useRouter();
  const cachedRights = useLegacyPermissions();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [localItems, setLocalItems] = useState<string[]>([]);

  const { data, isLoading } = useGetQuickAccess();
  const { mutate: saveOrder } = useUpdateQuickAccess();
  const { data: counters } = useGetQuickAccessCounters(localItems);

  useEffect(() => {
    if (data?.items) {
      setLocalItems(data.items);
    }
  }, [data?.items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...localItems];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setLocalItems(reordered);
    saveOrder(reordered);
  };

  const handleItemClick = (url: string, permissionId: string, label: string, isGrayedOut: boolean, grayReason: 'subscription' | 'permission') => {
    if (isGrayedOut) {
      onGrayedOutClick?.(url, grayReason, label);
      return;
    }
    window.dispatchEvent(new CustomEvent('yahshua:navigation-start', { detail: { url } }));
    router.push(url);
  };

  const isEmpty = !isLoading && localItems.length === 0;

  return (
    <>
      <div className={`bg-white shadow rounded-lg flex flex-col overflow-hidden ${className}`}>
        {/* Header */}
        <div className='flex items-center justify-between px-4 pt-4 pb-2 shrink-0'>
          <h3 className='font-bold text-indigo-dye text-sm'>Quick Access</h3>
          <button
            type='button'
            onClick={() => setIsEditOpen(true)}
            className='p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-savoy-blue transition-colors'
            title='Edit Quick Access'
          >
            <PencilIcon className='w-4 h-4' />
          </button>
        </div>

        {/* Content */}
        <div className='px-4 pb-4'>
          {isLoading && (
            <div className='flex items-center justify-center h-full text-gray-400 text-xs'>
              Loading...
            </div>
          )}

          {isEmpty && (
            <div className='flex flex-col items-center justify-center h-full gap-2 text-center'>
              <p className='text-xs text-gray-400'>No shortcuts yet.</p>
              <button
                type='button'
                onClick={() => setIsEditOpen(true)}
                className='text-xs text-savoy-blue hover:underline'
              >
                + Add shortcuts
              </button>
            </div>
          )}

          {!isLoading && localItems.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId='quick-access-list' direction='vertical'>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='flex flex-col gap-1'
                  >
                    {localItems.map((itemId, index) => {
                      const catalogItem = getCatalogItemById(itemId);
                      if (!catalogItem) return null;

                      const requiredPermission = getPermissionForElement(catalogItem.permissionId);
                      const hasPermission = requiredPermission
                        ? cachedRights?.state?.data?.[requiredPermission] || false
                        : true;
                      const hasSubscriptionIssue = !hasActiveSubscription;
                      const isGrayedOut = !hasPermission || hasSubscriptionIssue;
                      const grayReason: 'subscription' | 'permission' = !hasPermission ? 'permission' : 'subscription';

                      const counter = counters?.[itemId];
                      const Icon = catalogItem.iconComponent;

                      return (
                        <Draggable key={itemId} draggableId={itemId} index={index}>
                          {(drag, snapshot) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              onClick={() =>
                                handleItemClick(catalogItem.url, catalogItem.permissionId, catalogItem.label, isGrayedOut, grayReason)
                              }
                              data-tooltip-id={isGrayedOut ? `qa-tooltip-${itemId}` : undefined}
                              data-tooltip-content={
                                isGrayedOut
                                  ? !hasPermission
                                    ? "You don't have permission to access this section"
                                    : 'Subscription required to access this section'
                                  : undefined
                              }
                              data-tooltip-place='top'
                              className={`flex flex-row items-center gap-3 px-3 py-2 rounded-md cursor-pointer select-none transition-colors ${
                                snapshot.isDragging
                                  ? 'shadow-md bg-blue-50'
                                  : isGrayedOut
                                  ? 'opacity-50 hover:bg-gray-50'
                                  : 'hover:bg-blue-50'
                              }`}
                            >
                              <div style={{ width: 32, height: 32, flexShrink: 0, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.4)', transformOrigin: 'center center' }}>
                                  <Icon />
                                </div>
                              </div>
                              <div className='flex flex-col min-w-0'>
                                <span className='text-xs text-gray-800 font-semibold leading-tight truncate'>
                                  {catalogItem.label}
                                </span>
                                {counter != null && counter.count > 0 && (
                                  <span className='text-xs text-savoy-blue font-medium'>
                                    {counter.count} {counter.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Tooltips for grayed-out items */}
      {localItems.map((itemId) => {
        const catalogItem = getCatalogItemById(itemId);
        if (!catalogItem) return null;
        const requiredPermission = getPermissionForElement(catalogItem.permissionId);
        const hasPermission = requiredPermission ? cachedRights?.state?.data?.[requiredPermission] || false : true;
        const isGrayedOut = !hasPermission || !hasActiveSubscription;
        if (!isGrayedOut) return null;
        return (
          <Tooltip
            key={`qa-tooltip-${itemId}`}
            id={`qa-tooltip-${itemId}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              zIndex: 1000,
            }}
          />
        );
      })}

      <QuickAccessEditModal
        isOpen={isEditOpen}
        handleClose={() => setIsEditOpen(false)}
        currentItems={localItems}
      />
    </>
  );
}
