'use client';

import React from 'react';

import Pagination from '@/components/Pagination';

interface EmployeeData {
  name: string;
  department: string;
  score: string;
  lastEvaluation: string;
  status: string;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface EmployeePerformanceTableProps {
  data?: EmployeeData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
}

const EmployeePerformanceTable: React.FC<EmployeePerformanceTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'text-green-600 font-medium';
      case 'Did not Pass':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4 border-[#A8B5C7]">
          <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
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
        <div className="px-6 py-4 border-[#A8B5C7]">
          <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
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
    <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
      <div className="px-6 py-4 border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-[#ACB9CB]">
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Score
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Last Evaluation
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((employee, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                    <td className="py-4 text-center text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {employee.score}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {employee.lastEvaluation}
                    </td>
                    <td className={`py-4 text-center text-sm ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
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
  );
};

export default EmployeePerformanceTable; 