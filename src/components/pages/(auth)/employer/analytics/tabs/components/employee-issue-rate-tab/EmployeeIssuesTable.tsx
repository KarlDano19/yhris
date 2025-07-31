'use client';

import React, { useState } from 'react';
import Pagination from '@/components/Pagination';

const EmployeeIssuesTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(3); // Anna Lim's row is selected

  const [pagination, setPagination] = useState({ totalPages: 1, totalRecords: 4 });

  const employeeIssuesData = [
    {
      name: 'Mia Reyes',
      department: 'IT',
      issueType: 'Tardiness',
      dateReported: 'Mar 10, 2025',
      status: 'NTE Issued'
    },
    {
      name: 'John Santos',
      department: 'Sales',
      issueType: 'Insubordination',
      dateReported: 'Feb 5, 2025',
      status: 'Resolved'
    },
    {
      name: 'Carlo Dela Cruz',
      department: 'HR',
      issueType: 'Absenteeism',
      dateReported: 'Feb 28, 2025',
      status: 'Under Hearing'
    },
    {
      name: 'Anna Lim',
      department: 'IT',
      issueType: 'Tardiness',
      dateReported: 'Jan 18, 2025',
      status: 'NTE Issued'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NTE Issued':
        return 'text-red-600 font-medium';
      case 'Resolved':
        return 'text-green-600 font-medium';
      case 'Under Hearing':
        return 'text-orange-600 font-medium';
      default:
        return 'text-gray-600';
    }
  };

  const paginationChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const pageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

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
              {employeeIssuesData.map((issue, index) => (
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

export default EmployeeIssuesTable;
