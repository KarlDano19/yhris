'use client';

import React, { useState } from 'react';

import Pagination from '@/components/Pagination';

const EmployeePerformanceTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 4,
  });

  const employeeData = [
    {
      name: 'John Santos',
      department: 'Sales',
      score: '91',
      lastEvaluation: 'Apr 10, 2025',
      status: 'Passed'
    },
    {
      name: 'Mia Reyes',
      department: 'IT',
      score: '68',
      lastEvaluation: 'Mar 20, 2025',
      status: 'Did not Pass'
    },
    {
      name: 'Carlo Dela Cruz',
      department: 'HR',
      score: '94',
      lastEvaluation: 'Apr 18, 2025',
      status: 'Passed'
    },
    {
      name: 'Anna Lim',
      department: 'IT',
      score: '71',
      lastEvaluation: 'Mar 28, 2025',
      status: 'Passed'
    }
  ];

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

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

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
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Score
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Last Evaluation
                </th>
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee, index) => (
                <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-900">
                    {employee.name}
                  </td>
                  <td className="py-4 text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="py-4 text-sm text-gray-900">
                    {employee.score}
                  </td>
                  <td className="py-4 text-sm text-gray-900">
                    {employee.lastEvaluation}
                  </td>
                  <td className={`py-4 text-sm ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
};

export default EmployeePerformanceTable; 