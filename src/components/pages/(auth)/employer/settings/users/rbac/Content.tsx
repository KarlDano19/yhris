'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

// RBAC Hooks
import useGetPermissionsList from './hooks/useGetPermissionsList';
import useGetRolesList from './hooks/useGetRolesList';
import useGetUsersWithRoles from './hooks/useGetUsersWithRoles';
import useDeletePermission from './hooks/useDeletePermission';
import useDeleteRole from './hooks/useDeleteRole';

// RBAC Modals
import { 
  CreateEditPermissionModal, 
  CreateEditRoleModal, 
  AssignUserRolesModal, 
  RoleTemplateModal 
} from './modals';

import { 
  ArrowLeftIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  Cog6ToothIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number | null;
  open: boolean;
  mode?: 'create' | 'edit';
  userName?: string;
};

type T_SimpleModalData = {
  open: boolean;
};

const permissionColumnDefinitions = [
  { key: 'display_name', label: 'Permission Name' },
  { key: 'name', label: 'Code Name' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: 'Actions' },
];

const roleColumnDefinitions = [
  { key: 'name', label: 'Role Name' },
  { key: 'role_type', label: 'Type' },
  { key: 'permissions_count', label: 'Permissions' },
  { key: 'users_count', label: 'Users' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: 'Actions' },
];

const userRoleColumnDefinitions = [
  { key: 'user_name', label: 'User Name' },
  { key: 'user_email', label: 'Email' },
  { key: 'roles', label: 'Assigned Roles' },
  { key: 'permissions_count', label: 'Total Permissions' },
  { key: 'actions', label: 'Actions' },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  
  // State Management
  const [activeTab, setActiveTab] = useState<'permissions' | 'roles' | 'users'>('permissions');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Filter States
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
    category: '',
    roleType: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    search: '',
    category: '',
    roleType: '',
  });

  // Modal States
  const [permissionModal, setPermissionModal] = useState<T_ModalData | null>(null);
  const [roleModal, setRoleModal] = useState<T_ModalData | null>(null);
  const [assignRoleModal, setAssignRoleModal] = useState<T_ModalData | null>(null);
  const [templateModal, setTemplateModal] = useState<T_SimpleModalData | null>(null);

  // Column Visibility
  const [visiblePermissionColumns, setVisiblePermissionColumns] = useState<Record<string, boolean>>({
    display_name: true,
    name: true,
    category: true,
    description: false,
    actions: true,
  });

  const [visibleRoleColumns, setVisibleRoleColumns] = useState<Record<string, boolean>>({
    name: true,
    role_type: true,
    permissions_count: true,
    users_count: true,
    description: false,
    actions: true,
  });

  const [visibleUserRoleColumns, setVisibleUserRoleColumns] = useState<Record<string, boolean>>({
    user_name: true,
    user_email: true,
    roles: true,
    permissions_count: true,
    actions: true,
  });

  // Data Fetching Hooks
  const {
    data: permissionsData,
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
  } = useGetPermissionsList({ 
    ...appliedFilter, 
    pageSize: pageSize, 
    currentPage: activeTab === 'permissions' ? currentPage : 1 
  });

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    refetch: refetchRoles,
  } = useGetRolesList({ 
    ...appliedFilter, 
    pageSize: pageSize, 
    currentPage: activeTab === 'roles' ? currentPage : 1 
  });

  const {
    data: usersWithRolesData,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useGetUsersWithRoles({ 
    ...appliedFilter, 
    pageSize: pageSize, 
    currentPage: activeTab === 'users' ? currentPage : 1 
  });

  // Delete Hooks
  const { mutate: deletePermission } = useDeletePermission();
  const { mutate: deleteRole } = useDeleteRole();

  // Effects
  useEffect(() => {
    const data = activeTab === 'permissions' ? permissionsData : 
                 activeTab === 'roles' ? rolesData : usersWithRolesData;
    
    if (data) {
      setPagination({
        totalPages: data.total_pages || 1,
        totalRecords: data.total_records || data.count || 0,
      });
    }
  }, [permissionsData, rolesData, usersWithRolesData, activeTab]);

  useEffect(() => {
    const refetch = activeTab === 'permissions' ? refetchPermissions :
                   activeTab === 'roles' ? refetchRoles : refetchUsers;
    refetch();
  }, [currentPage, pageSize, activeTab, refetchPermissions, refetchRoles, refetchUsers]);

  useEffect(() => {
    const isLoading = activeTab === 'permissions' ? isPermissionsLoading :
                     activeTab === 'roles' ? isRolesLoading : isUsersLoading;
    if (!isLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isPermissionsLoading, isRolesLoading, isUsersLoading, isSearching, activeTab]);

  // Handlers
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    setAppliedFilter({ ...itemsFilter });
  };

  const handleTabChange = (tab: 'permissions' | 'roles' | 'users') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setItemsFilter({ search: '', category: '', roleType: '' });
    setAppliedFilter({ search: '', category: '', roleType: '' });
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleDelete = (type: 'permission' | 'role', id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${type} "${name}"?`)) {
      const callback = {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={data.message} type='success' />, {
            duration: 5000,
          });
          const refetch = type === 'permission' ? refetchPermissions : refetchRoles;
          refetch();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };

      if (type === 'permission') {
        deletePermission(id, callback);
      } else {
        deleteRole(id, callback);
      }
    }
  };

  const handleRefetch = () => {
    const refetch = activeTab === 'permissions' ? refetchPermissions :
                   activeTab === 'roles' ? refetchRoles : refetchUsers;
    refetch();
  };

  // Column Management
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'permissions': return permissionColumnDefinitions;
      case 'roles': return roleColumnDefinitions;
      case 'users': return userRoleColumnDefinitions;
      default: return [];
    }
  };

  const getCurrentVisibleColumns = () => {
    switch (activeTab) {
      case 'permissions': return visiblePermissionColumns;
      case 'roles': return visibleRoleColumns;
      case 'users': return visibleUserRoleColumns;
      default: return {};
    }
  };

  const handleColumnToggle = (columnKey: string) => {
    const setter = activeTab === 'permissions' ? setVisiblePermissionColumns :
                   activeTab === 'roles' ? setVisibleRoleColumns : setVisibleUserRoleColumns;
    
    setter((prev: Record<string, boolean>) => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Render Functions
  const renderPermissionRows = () => {
    if (isSearching || isPermissionsLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }

    if (permissionsData?.results && permissionsData.results.length > 0) {
      return permissionsData.results.map((permission: any) => (
        <tr key={permission.id} className='hover:bg-gray-50'>
          {visiblePermissionColumns.display_name && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium'>
              {permission.display_name}
            </td>
          )}
          {visiblePermissionColumns.name && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono'>
              {permission.name}
            </td>
          )}
          {visiblePermissionColumns.category && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                {permission.category}
              </span>
            </td>
          )}
          {visiblePermissionColumns.description && (
            <td className='px-3 py-4 text-sm text-gray-500 max-w-xs truncate'>
              {permission.description || '-'}
            </td>
          )}
          {visiblePermissionColumns.actions && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setPermissionModal({ id: permission.id, open: true, mode: 'edit' })}
                  className='text-indigo-600 hover:text-indigo-900'
                  title='Edit Permission'
                >
                  <PencilIcon className='h-4 w-4' />
                </button>
                <button
                  onClick={() => handleDelete('permission', permission.id, permission.display_name)}
                  className='text-red-600 hover:text-red-900'
                  title='Delete Permission'
                >
                  <TrashIcon className='h-4 w-4' />
                </button>
              </div>
            </td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={100}>
            <div className='text-center py-8'>
              <ShieldCheckIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No permissions found</h3>
              <p className='mt-1 text-sm text-gray-500'>Get started by creating a new permission.</p>
              <div className='mt-6'>
                <button
                  onClick={() => setPermissionModal({ id: null, open: true, mode: 'create' })}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-savoy-blue hover:bg-blue-700'
                >
                  <PlusIcon className='-ml-1 mr-2 h-5 w-5' />
                  Create Permission
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };

  const renderRoleRows = () => {
    if (isSearching || isRolesLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }

    if (rolesData?.results && rolesData.results.length > 0) {
      return rolesData.results.map((role: any) => (
        <tr key={role.id} className='hover:bg-gray-50'>
          {visibleRoleColumns.name && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium'>
              <div className='flex items-center'>
                <UserGroupIcon className='h-4 w-4 text-gray-400 mr-2' />
                {role.name}
              </div>
            </td>
          )}
          {visibleRoleColumns.role_type && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                role.role_type === 'system' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {role.role_type === 'system' ? 'System' : 'Custom'}
              </span>
            </td>
          )}
          {visibleRoleColumns.permissions_count && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                {role.permissions_count || 0} permissions
              </span>
            </td>
          )}
          {visibleRoleColumns.users_count && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              {role.users_count || 0} users
            </td>
          )}
          {visibleRoleColumns.description && (
            <td className='px-3 py-4 text-sm text-gray-500 max-w-xs truncate'>
              {role.description || '-'}
            </td>
          )}
          {visibleRoleColumns.actions && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setRoleModal({ id: role.id, open: true, mode: 'edit' })}
                  className='text-indigo-600 hover:text-indigo-900'
                  title='Edit Role'
                >
                  <PencilIcon className='h-4 w-4' />
                </button>
                <button
                  onClick={() => handleDelete('role', role.id, role.name)}
                  className='text-red-600 hover:text-red-900'
                  title='Delete Role'
                >
                  <TrashIcon className='h-4 w-4' />
                </button>
              </div>
            </td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={100}>
            <div className='text-center py-8'>
              <UserGroupIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No roles found</h3>
              <p className='mt-1 text-sm text-gray-500'>Get started by creating a new role or using templates.</p>
              <div className='mt-6 space-x-3'>
                <button
                  onClick={() => setRoleModal({ id: null, open: true, mode: 'create' })}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-savoy-blue hover:bg-blue-700'
                >
                  <PlusIcon className='-ml-1 mr-2 h-5 w-5' />
                  Create Role
                </button>
                <button
                  onClick={() => setTemplateModal({ open: true })}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                  <DocumentDuplicateIcon className='-ml-1 mr-2 h-5 w-5' />
                  Use Template
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };
  const renderUserRoleRows = () => {
    if (isSearching || isUsersLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }

    if (usersWithRolesData?.results && usersWithRolesData.results.length > 0) {
      return usersWithRolesData.results.map((user: any) => (
        <tr key={user.id} className='hover:bg-gray-50'>
          {visibleUserRoleColumns.user_name && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium'>
              {user.name}
            </td>
          )}
          {visibleUserRoleColumns.user_email && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              {user.email}
            </td>
          )}
          {visibleUserRoleColumns.roles && (
            <td className='px-3 py-4 text-sm text-gray-500'>
              <div className='flex flex-wrap gap-1'>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role: any, index: number) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                    >
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-400 italic'>No roles assigned</span>
                )}
              </div>
            </td>
          )}
          {visibleUserRoleColumns.permissions_count && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              {user.total_permissions || 0} permissions
            </td>
          )}
          {visibleUserRoleColumns.actions && (
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setAssignRoleModal({ 
                    id: user.id, 
                    open: true, 
                    userName: user.name 
                  })}
                  className='text-indigo-600 hover:text-indigo-900'
                  title='Assign Roles'
                >
                  <UserGroupIcon className='h-4 w-4' />
                </button>
              </div>
            </td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={100}>
            <div className='text-center py-8'>
              <UserGroupIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No users found</h3>
              <p className='mt-1 text-sm text-gray-500'>Users will appear here when they are created.</p>
            </div>
          </td>
        </tr>
      );
    }
  };

  const renderCurrentRows = () => {
    switch (activeTab) {
      case 'permissions': return renderPermissionRows();
      case 'roles': return renderRoleRows();
      case 'users': return renderUserRoleRows();
      default: return null;
    }
  };

  const renderTableHeaders = () => {
    const columns = getCurrentColumns();
    const visibleColumns = getCurrentVisibleColumns();

    return columns.map((column) => (
      visibleColumns[column.key] && (
        <th key={column.key} scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
          {column.label}
        </th>
      )
    ));
  };

  const getTabCount = () => {
    switch (activeTab) {
      case 'permissions': return permissionsData?.total_records || 0;
      case 'roles': return rolesData?.total_records || 0;
      case 'users': return usersWithRolesData?.total_records || usersWithRolesData?.count || 0;
      default: return 0;
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/users' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Users</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-indigo-dye'>Role-Based Access Control (RBAC)</h2>
            <button
              onClick={handleRefetch}
              className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-savoy-blue'
            >
              <ArrowPathIcon className='h-4 w-4 mr-2' />
              Refresh
            </button>
          </div>

          {/* Tab Navigation */}
          <div className='mt-6'>
            <div className='border-b border-gray-200'>
              <nav className='-mb-px flex space-x-8'>
                {[
                  { key: 'permissions', label: 'Permissions', icon: ShieldCheckIcon },
                  { key: 'roles', label: 'Roles', icon: UserGroupIcon },
                  { key: 'users', label: 'Users', icon: UserGroupIcon },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key as any)}
                    className={classNames(
                      activeTab === tab.key
                        ? 'border-savoy-blue text-savoy-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                  >
                    <tab.icon
                      className={classNames(
                        activeTab === tab.key ? 'text-savoy-blue' : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-0.5 mr-2 h-5 w-5'
                      )}
                    />
                    {tab.label}
                    <span className='ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900'>
                      {getTabCount()}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-center gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex gap-2 lg:w-1/3 pr-5 md:pr-16'>
              <div className='flex-none w-11/12 lg:w-full'>
                <div className='relative flex items-center'>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    data-tooltip-id='search-tooltip'
                    data-tooltip-content={`Search for: ${activeTab === 'permissions' ? 'Name / Code / Category' : activeTab === 'roles' ? 'Role Name / Type' : 'Name / Email'}`}
                    data-tooltip-place='bottom'
                    className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    placeholder={`Search ${activeTab}...`}
                    value={itemsFilter.search}
                  />
                </div>
              </div>
              <button
                className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            
            <div className='flex-1 flex justify-start lg:justify-end gap-3'>
              {/* Action Buttons */}
              {activeTab === 'permissions' && (
                <button
                  onClick={() => setPermissionModal({ id: null, open: true, mode: 'create' })}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-savoy-blue hover:bg-blue-700'
                >
                  <PlusIcon className='-ml-1 mr-2 h-5 w-5' />
                  Create Permission
                </button>
              )}

              {activeTab === 'roles' && (
                <>
                  <button
                    onClick={() => setRoleModal({ id: null, open: true, mode: 'create' })}
                    className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-savoy-blue hover:bg-blue-700'
                  >
                    <PlusIcon className='-ml-1 mr-2 h-5 w-5' />
                    Create Role
                  </button>
                  <button
                    onClick={() => setTemplateModal({ open: true })}
                    className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <DocumentDuplicateIcon className='-ml-1 mr-2 h-5 w-5' />
                    Use Template
                  </button>
                </>
              )}

              {/* Column Settings */}
              <Menu as='div' className='relative'>
                <Menu.Button className='bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 text-sm font-medium shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-savoy-blue flex items-center gap-2'>
                  <Cog6ToothIcon className='h-5 w-5' />
                  Columns
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='p-4'>
                      <div className='mb-4'>
                        <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                          Filter Columns ({Object.values(getCurrentVisibleColumns()).filter(Boolean).length} of {getCurrentColumns().length})
                        </h3>
                        <p className='text-xs text-gray-600'>
                          Select which columns to display in the table.
                        </p>
                      </div>
                      <div className='max-h-64 overflow-y-auto mb-4'>
                        <div className='grid grid-cols-1 gap-2'>
                          {getCurrentColumns().map((column) => (
                            <label key={column.key} className='flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50'>
                              <input
                                type='checkbox'
                                checked={getCurrentVisibleColumns()[column.key] || false}
                                onChange={() => handleColumnToggle(column.key)}
                                className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded'
                              />
                              <span className='text-sm text-gray-700'>{column.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Table */}
          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div 
              className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
              <div className='py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      {renderTableHeaders()}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {renderCurrentRows()}
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={pageSizeChange}
              onPageChange={paginationChange}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {permissionModal && (
        <CreateEditPermissionModal
          isOpen={permissionModal}
          setIsOpen={setPermissionModal}
          refetch={handleRefetch}
        />
      )}

      {roleModal && (
        <CreateEditRoleModal
          isOpen={roleModal}
          setIsOpen={setRoleModal}
          refetch={handleRefetch}
        />
      )}

      {assignRoleModal && (
        <AssignUserRolesModal
          isOpen={assignRoleModal}
          setIsOpen={setAssignRoleModal}
          refetch={handleRefetch}
        />
      )}

      {templateModal && (
        <RoleTemplateModal
          isOpen={templateModal}
          setIsOpen={setTemplateModal}
          refetch={handleRefetch}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
