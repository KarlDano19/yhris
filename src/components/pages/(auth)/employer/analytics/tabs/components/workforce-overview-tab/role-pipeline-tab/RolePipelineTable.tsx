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
        return 'text-blue-600 font-medium';
      case 'Closed':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-600';
    }
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
            <div className="text-gray-500">Loading...</div>
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
            <div className="text-red-500">Error loading data: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    Turnaround Time (Days)
                  </th>
                  <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                    Current Pipeline
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((role, index) => (
                    <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-900 font-medium">
                        {role.role}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {role.numberOfApplicants}
                      </td>
                      <td className={`py-4 text-sm ${getStatusColor(role.status)}`}>
                        {role.status}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {role.dateJobOpened}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {role.turnaroundTime}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {role.currentPipeline}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
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
