'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';
import CustomToast from '@/components/CustomToast';
import { ContextTypes } from '../types';
import { useContext } from 'react';
import StateContext from '../contexts/StateContext';

interface StageAssignmentProps {
  title: string;
  handleFormSubmit: (data: any, isOpen?: any) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Fetch users and current assignments
  useEffect(() => {
    fetchUsers();
    fetchCurrentAssignments();
  }, [actionState.stageId]);

  const fetchUsers = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/available-users/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.records || data || []);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.custom(() => <CustomToast message="Failed to load users" type="error" />, {
        duration: 4000,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchCurrentAssignments = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/screen-applicants/stages/${actionState.stageId}/assignments/`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const assignments = await response.json();
        setCurrentAssignments(assignments);
        setSelectedUsers(assignments.map((a: Assignment) => a.assigned_user));
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const token = getCookie('token');
      const payload = {
        assigned_users: selectedUsers,
        // Default to full permissions for all assigned users
        can_view_applicants: true,
        can_move_applicants: true,
        can_update_status: true,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/screen-applicants/stages/${actionState.stageId}/assignments/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update assignments');
      }
    } catch (error: any) {
      console.error('Error updating assignments:', error);
      toast.custom(() => <CustomToast message={error.message || "Failed to update assignments"} type="error" />, {
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActionState(prev => ({
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
              </p>
              
              {isLoadingUsers ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  {users.length === 0 ? (
                    <p className="text-center py-4 text-sm text-gray-500">No users found</p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center p-3 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`user-${user.id}`} className="ml-3 flex-1 cursor-pointer">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Current Assignments Summary */}
            {currentAssignments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Currently Assigned Users ({currentAssignments.length})
                </h4>
                <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                  {currentAssignments.map((assignment) => (
                    <div key={assignment.id}>
                      • {assignment.assigned_user_name} ({assignment.assigned_user_email})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
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
