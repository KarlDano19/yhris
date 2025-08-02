'use client';

import React, { useState } from 'react';

import FilterLogo from '@/svg/FilterLogo';
import Pagination from '@/components/Pagination';
import RolePipelineFilterModal from '../../modals/RolePipelineFilterModal';

interface RolePipelineData {
  role: string;
  numberOfApplicants: number;
  status: string;
  dateJobOpened: string;
  turnaroundTime: number;
  currentPipeline: string;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface RolePipelineTableProps {
  data?: RolePipelineData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
}

const RolePipelineTable: React.FC<RolePipelineTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Closed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Draft':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Expired':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTurnaroundTime = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const formatPipelineInfo = (pipeline: string, applicants: number) => {
    if (applicants === 0) return 'No applicants yet';
    if (applicants === 1) return '1 applicant';
    return pipeline;
  };

  const handleFilterApply = (filters: any) => {
    // Placeholder for filter application logic
    console.log('Applied filters:', filters);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FilterLogo className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 font-medium">Filter</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading role pipeline data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FilterLogo className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 font-medium">Filter</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">Error loading role pipeline data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <FilterLogo className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Filter</span>
              </button>
            </div>
            {data.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {data.length} of {pagination?.totalRecords || 0} roles
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 pb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    No. of Applicants
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Date Job Opened
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Turnaround Time
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Current Pipeline
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((role, index) => (
                    <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm text-gray-900 font-medium">
                        {role.role}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        <span className="font-medium">{role.numberOfApplicants}</span>
                        {role.numberOfApplicants > 0 && (
                          <span className="text-xs text-gray-500 ml-1">applicants</span>
                        )}
                      </td>
                      <td className="py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(role.status)}`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {role.dateJobOpened}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        <span className="font-medium">{formatTurnaroundTime(role.turnaroundTime)}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {formatPipelineInfo(role.currentPipeline, role.numberOfApplicants)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-gray-400 text-lg mb-2">No job postings found</div>
                        <div className="text-gray-500 text-sm">Create your first job posting to see role pipeline data</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalRecords > 0 && (
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      <RolePipelineFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onFilterApply={handleFilterApply}
      />
    </>
  );
};

export default RolePipelineTable;
