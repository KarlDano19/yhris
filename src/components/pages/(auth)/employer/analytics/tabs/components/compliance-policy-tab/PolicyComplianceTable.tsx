import React, { useEffect, useState, useRef } from 'react';

import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

import InfoIcon from '@/svg/InfoIcon';

interface PolicyData {
  policyName: string;
  lastUpdated: string;
  nextReviewDate: string;
  complianceStatus: string;
  acknowledgedBy: string;
  action: string;
  directiveId?: number;
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
  onPageChange: (selectedItem: { selected: number }) => void;
  onPageSizeChange: (value: number) => void;
}

const PolicyComplianceTable: React.FC<PolicyComplianceTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error = null,
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
        return 'bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold';
      case 'Needs Review/Update':
        return 'bg-yellow-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-bold';
      case 'Overdue':
        return 'bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold';
      default:
        return 'bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Review/Update Policy':
        return 'text-red-600 hover:text-red-800 underline font-bold';
      default:
        return 'text-blue-600 hover:text-blue-800 underline font-bold';
    }
  };

  const handleActionClick = (action: string, directiveId?: number) => {
    if (!directiveId) return;
    
    switch (action) {
      case 'View Report':
        // Navigate to employee responses modal or page
        // You can implement navigation here
        break;
      case 'Review/Update Policy':
        // Navigate to edit policy page
        // You can implement navigation here
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Memo/Policy Compliance Status</h3>
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
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Memo/ Policy Compliance Status</h3>
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
        <h3 className="text-lg font-semibold text-gray-900">Memo/ Policy Compliance Status</h3>
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
                      <span 
                        className={`${getStatusTag(policy.complianceStatus)} whitespace-pre-line text-center cursor-pointer`}
                        data-tooltip-id={`status-tooltip-${index}`}
                        data-tooltip-place="right"
                      >
                        {policy.complianceStatus}
                      </span>
                      <Tooltip 
                        id={`status-tooltip-${index}`}
                        opacity={1} 
                        style={{ fontSize: '12px', maxWidth: '350px', whiteSpace: 'normal', lineHeight: '1.4' }}
                      >
                        <div>
                          {policy.complianceStatus === 'Compliant' && (
                            <p className='text-[12px] font-medium leading-relaxed'>This item is up-to-date and within its scheduled review or submission cycle.</p>
                          )}
                          {policy.complianceStatus === 'Needs Review/Update' && (
                            <p className='text-[12px] font-medium leading-relaxed'>This item is approaching its next review or updating date and should be checked soon.</p>
                          )}
                          {policy.complianceStatus === 'Overdue' && (
                            <p className='text-[12px] font-medium leading-relaxed'>This item has passed its review date and requires immediate attention.</p>
                          )}
                        </div>
                      </Tooltip>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-green-600">
                          {policy.acknowledgedBy.split('%')[0]}%
                        </span>
                        <span className="text-xs text-gray-500">
                          of Employees
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm">
                      <button className={getActionColor(policy.action)} onClick={() => handleActionClick(policy.action, policy.directiveId)}>
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
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default PolicyComplianceTable;
