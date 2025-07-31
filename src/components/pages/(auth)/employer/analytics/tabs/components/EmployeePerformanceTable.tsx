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
      name: 'John Smith',
      department: 'Sales',
      score: '85',
      lastEvaluation: '2025-01-15',
      status: 'Exceeds Expectation'
    },
    {
      name: 'Sarah Johnson',
      department: 'IT',
      score: '92',
      lastEvaluation: '2025-01-20',
      status: 'Outstanding'
    },
    {
      name: 'Mike Davis',
      department: 'HR',
      score: '78',
      lastEvaluation: '2025-01-10',
      status: 'Meets Expectation'
    },
    {
      name: 'Lisa Wilson',
      department: 'Sales',
      score: '65',
      lastEvaluation: '2025-01-25',
      status: 'Needs Improvement'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Exceeds Expectation':
      case 'Outstanding':
        return 'text-green-600';
      case 'Meets Expectation':
        return 'text-green-600';
      case 'Needs Improvement':
        return 'text-red-600';
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
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Evaluation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employeeData.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.lastEvaluation}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <Pagination
        pagination={pagination}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={pageSizeChange}
        onPageChange={paginationChange}
      />
    </div>
  );
};

export default EmployeePerformanceTable; 