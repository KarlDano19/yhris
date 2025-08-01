'use client';

import React from 'react';

import Pagination from '@/components/Pagination';

interface EmployeeIssueData {
  name: string;
  department: string;
  issueType: string;
  dateReported: string;
  status: string;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface EmployeeIssuesTableProps {
  data?: EmployeeIssueData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
}

const EmployeeIssuesTable: React.FC<EmployeeIssuesTableProps> = ({
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
      case 'NTE Issued':
        return 'text-red-600 font-medium';
      case 'Resolved':
        return 'text-green-600 font-medium';
      case 'Under Hearing':
        return 'text-orange-600 font-medium';
      case 'Pending':
        return 'text-yellow-600 font-medium';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Employee Issues</h3>
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
          <h3 className="text-lg font-semibold text-gray-900">Employee Issues</h3>
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
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Employee Issues</h3>
      </div>
      
      <div className="p-6 pb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-[#ACB9CB]">
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Issue Type
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Date Reported
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((issue, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-900">
                      {issue.name}
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {issue.department}
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {issue.issueType}
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {issue.dateReported}
                    </td>
                    <td className={`py-4 text-sm ${getStatusColor(issue.status)}`}>
                      {issue.status}
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

export default EmployeeIssuesTable;
