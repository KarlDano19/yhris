'use client';

import React, { useState, useEffect, useContext } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import StateContext from '../contexts/StateContext';
import useGetAvailableUsers from '../hooks/useGetAvailableUsers';
import useGetStageAssignments from '../hooks/useGetStageAssignments';
import useUpdateStageAssignments from '../hooks/useUpdateStageAssignments';

import { ContextTypes } from '../types';

interface StageAssignmentProps {
  title: string;
  handleFormSubmit: (data: any, isOpen?: any) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_current_user: boolean;
}

interface Assignment {
  id: number;
  assigned_user: number;
  assigned_user_name: string;
  assigned_user_email: string;
  can_view_applicants: boolean;
  can_move_applicants: boolean;
  can_update_status: boolean;
}

export default function StageAssignment({ title, handleFormSubmit }: StageAssignmentProps) {
  const { actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  // Use custom hooks for API calls
  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useGetAvailableUsers();
  const { 
    data: currentAssignments = [], 
    isLoading: isLoadingAssignments 
  } = useGetStageAssignments(actionState.stageId);
  const { mutateAsync: updateAssignments, isLoading: isUpdating } = useUpdateStageAssignments();

  // Update selected users when current assignments change
  useEffect(() => {
    if (currentAssignments && currentAssignments.length > 0) {
      setSelectedUsers(currentAssignments.map((a: Assignment) => a.assigned_user));
    }
  }, [currentAssignments]);

  // Always include the creator (current user) in selected users
  useEffect(() => {
    if (users && users.length > 0) {
      const creatorUser = users.find((u: User) => u.is_current_user);
      if (creatorUser) {
        setSelectedUsers(prev => {
          if (!prev.includes(creatorUser.id)) {
            return [...prev, creatorUser.id];
          }
          return prev;
        });
      }
    }
  }, [users]);

  // Show error toast if users fetch fails
  useEffect(() => {
    if (usersError) {
      toast.custom(() => <CustomToast message="Failed to load users" type="error" />, {
        duration: 4000,
      });
    }
  }, [usersError]);

  const handleUserToggle = (userId: number, isCreator: boolean) => {
    // Prevent deselecting the creator (creator always has access to their stages)
    if (isCreator) {
      return;
    }
    
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    try {
      await updateAssignments({
        stageId: actionState.stageId,
        assigned_users: selectedUsers,
        // Default to full permissions for all assigned users
        can_view_applicants: true,
        can_move_applicants: true,
        can_update_status: true,
      });

      toast.custom(() => <CustomToast message="Stage assignments updated successfully!" type="success" />, {
        duration: 4000,
      });
      
      // Close modal
      handleClose();
      
      // Trigger page refresh to update permissions
      if (handleFormSubmit) {
        handleFormSubmit({});
      }
      
      // Force refresh the page to reload stage permissions
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating assignments:', error);
      toast.custom(() => <CustomToast message={error.message || error || "Failed to update assignments"} type="error" />, {
        duration: 7000,
      });
    }
  };

  const handleClose = () => {
    setActionState((prev: any) => ({
      ...prev,
      modal: { ...prev.modal, isOpen: false }
    }));
  };

  // Don't render if modal is not open
  if (!actionState.modal.isOpen || actionState.modal.whichModal !== 'STAGE_ASSIGNMENT') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={handleClose}>
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {title}
          </h3>
          
          <div className="space-y-4">
            {/* Users Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Select Users to Assign
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Assigned users will have full access to this stage (view, move, and update applicants).
                <br />
                <strong className="text-blue-700">Note:</strong> The Creator is automatically assigned and cannot be deselected.
                <br />
                <span className="inline-flex items-center gap-1 mt-1">
                  User badges: 
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Creator</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Admin</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">User</span>
                </span>
              </p>
              
              {isLoadingUsers ? (
                <LoadingSpinner 
                  size="lg" 
                  color="yellow" 
                  text="Loading users..." 
                  showText={true}
                  className="py-4"
                />
              ) : (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  {users.length === 0 ? (
                    <p className="text-center py-4 text-sm text-gray-500">No users found</p>
                  ) : (
                    users.map((user: User) => {
                      // Determine user type badge
                      const getUserBadge = () => {
                        if (user.is_current_user) {
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Creator
                            </span>
                          );
                        }
                        if (user.is_admin) {
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Admin
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            User
                          </span>
                        );
                      };

                      return (
                        <div 
                          key={user.id} 
                          className={`flex items-center p-3 ${user.is_current_user ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserToggle(user.id, user.is_current_user)}
                            disabled={user.is_current_user}
                            className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                              user.is_current_user ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={user.is_current_user ? 'Creator always has access to their stages' : ''}
                          />
                          <label 
                            htmlFor={`user-${user.id}`} 
                            className={`ml-3 flex-1 ${user.is_current_user ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              {getUserBadge()}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Current Assignments Summary */}
            {isLoadingAssignments ? (
              <LoadingSpinner 
                size="md" 
                color="yellow"
                text="Loading current assignments..." 
                showText={true}
                className="py-2"
              />
            ) : currentAssignments.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Currently Assigned Users ({currentAssignments.length})
                </h4>
                <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                  {currentAssignments.map((assignment: Assignment) => (
                    <div key={assignment.id}>
                      • {assignment.assigned_user_name} ({assignment.assigned_user_email})
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="xs" color="white" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Assignments'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}