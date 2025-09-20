import React from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

import { getStatusColor } from './calculations/employeePerformanceTableCalc';

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


  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4 border-[#A8B5C7]">
          <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" color="yellow" />
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
        <div 
          className='-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#2d3e58 #f1f1f1'
          }}
        >
          <div className='min-w-full py-2 sm:px-6 lg:px-8'>
            <table className="min-w-full divide-y divide-gray-300 text-center">
            <thead>
              <tr className="border-b-2 border-[#ACB9CB]">
                <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Name
                </th>
                <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Department
                </th>
                <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Score
                </th>
                <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Last Evaluation
                </th>
                <th className="px-2 sm:px-3 py-3 md:pb-4 text-center text-xs sm:text-sm md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((employee, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50 transition-colors">
                    <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 font-medium text-center whitespace-nowrap">
                      {employee.name}
                    </td>
                    <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                      {employee.department}
                    </td>
                    <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                      {employee.score}
                    </td>
                    <td className="px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-gray-900 text-center whitespace-nowrap">
                      {employee.lastEvaluation}
                    </td>
                    <td className={`px-2 sm:px-3 py-3 md:py-4 text-xs sm:text-sm md:text-sm text-center ${getStatusColor(employee.status)}`}>
                      <span className="whitespace-nowrap">{employee.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-2 sm:px-3 py-8 md:py-8 text-center font-semibold text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
        {pagination && data.length > 0 && (
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