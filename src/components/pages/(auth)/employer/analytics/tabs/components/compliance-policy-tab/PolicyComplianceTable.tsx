'use client';

import React, { useEffect, useState, useRef } from 'react';

import { Tooltip } from 'react-tooltip';

import Pagination from '@/components/Pagination';

import InfoIcon from '@/svg/InfoIcon';

interface PolicyData {
  policyName: string;
  lastUpdated: string;
  nextReviewDate: string;
  complianceStatus: string;
  acknowledgedBy: string;
  action: string;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface PolicyComplianceTableProps {
  data?: PolicyData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
}

const PolicyComplianceTable: React.FC<PolicyComplianceTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Show tooltip when table comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasShownTooltip) {
            // Show tooltip after 1 second when table is visible
            setTimeout(() => {
              setShowTooltip(true);
              setHasShownTooltip(true);
            }, 1000);

            // Hide tooltip after 3 seconds
            setTimeout(() => {
              setShowTooltip(false);
            }, 4000);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the table is visible
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, [hasShownTooltip]);
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium';
      case 'Needs Review/Update':
        return 'bg-yellow-100 text-orange-600 px-3 py-1 rounded-md text-sm font-medium';
      case 'Overdue':
        return 'bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium';
      default:
        return 'bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Review/Update Policy':
        return 'text-red-600 hover:text-red-800 underline';
      default:
        return 'text-blue-600 hover:text-blue-800 underline';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Policy Compliance Status</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div role='status' className='text-center'>
              <svg
                aria-hidden='true'
                className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Policy Compliance Status</h3>
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
    <div ref={tableRef} className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Policy Compliance Status</h3>
      </div>
      
      <div className="p-6 pb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-[#ACB9CB]">
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  Policy Name
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Last Updated
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Next Review Date
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  <div className="flex items-center justify-center">
                    Compliance Status
                    <div
                      className='inline-block ml-1 cursor-pointer'
                      data-tooltip-id='compliance-status-tooltip'
                      data-tooltip-place='top'
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <InfoIcon />
                    </div>
                    <Tooltip 
                      id='compliance-status-tooltip' 
                      opacity={1} 
                      style={{ fontSize: '12px', maxWidth: '350px', whiteSpace: 'normal', lineHeight: '1.4' }}
                      isOpen={showTooltip}
                    >
                      <div>
                        <h2 className='text-[12px] font-medium leading-relaxed'>Indicates whether each policy is currently compliant, due for review/update, or overdue. Hover on the status icon to see what it means.</h2>
                      </div>
                    </Tooltip>
                  </div>
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Acknowledged By
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((policy, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-900">
                      {policy.policyName}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {policy.lastUpdated}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {policy.nextReviewDate}
                    </td>
                    <td className="py-4 text-center text-sm">
                      <span className={getStatusTag(policy.complianceStatus)}>
                        {policy.complianceStatus}
                      </span>
                    </td>
                    <td className="py-4 text-center text-sm text-green-600 font-medium">
                      {policy.acknowledgedBy}
                    </td>
                    <td className="py-4 text-center text-sm">
                      <button className={getActionColor(policy.action)}>
                        {policy.action}
                      </button>
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
  );
};

export default PolicyComplianceTable;
