import React from 'react';

import { useRouter } from 'next/navigation';

import Pagination from '@/components/Pagination';

interface DOLEEmployeeData {
  doleRequirement: string;
  frequency: string;
  lastSubmitted: string;
  nextDueDate: string;
  complianceStatus: string;
  action?: string;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

interface DOLEComplianceTableProps {
  data?: DOLEEmployeeData[];
  pagination?: PaginationData;
  isLoading?: boolean;
  error?: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
}

const DOLEComplianceTable: React.FC<DOLEComplianceTableProps> = ({
  data = [],
  pagination,
  isLoading = false,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Schedule':
        return 'bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold';
      case 'For Submission':
        return 'bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold';
      case 'For Review':
        return 'bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold';
      case 'Approved':
        return 'bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold';
      default:
        return 'bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold';
    }
  };

  const getActionColor = (action: string) => {
    return 'text-blue-600 hover:text-blue-800 underline font-bold';
  };

  const handleActionClick = (action: string, requirement?: string) => {
    switch (action) {
      case 'View Report': {
        if (requirement?.includes('Work Accident & Illness Report')) {
          router.push('/dole/annual-work-accident-illness-exposure-data-report');
        } else if (requirement?.includes('Annual Medical Report')) {
          router.push('/dole/annual-medical-report');
        } else if (requirement?.includes('Health & Safety Org Report') || requirement?.includes('Health and Safety Organization Report')) {
          router.push('/dole/health-and-safety-organization-report');
        } else if (requirement?.includes('SHC Minutes of Meeting')) {
          router.push('/dole/shc-minutes-of-meetings');
        } else if (requirement?.includes('Work Environment Measurement')) {
          router.push('/dole/work-environment-measurement-request');
        } else {
          // Future: route to other report pages as needed
        }
        break;
      }
      case 'View': {
        if (requirement?.includes('Safety & Health Policy')) {
          router.push('/dole?modal=safety-and-health-policy&from=analytics');
        } else if (requirement?.includes('OSH Program')) {
          router.push('/dole/osh-program');
        }
        break;
      }
      case 'View Log': {
        if (requirement?.includes('Employee Compensation Logbook')) {
          router.push('/dole/employee-compensation-logbook');
        }
        break;
      }
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#A8B5C7] shadow-sm">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">DOLE Compliance Status</h3>
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
          <h3 className="text-lg font-semibold text-gray-900">DOLE Compliance Status</h3>
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
        <h3 className="text-lg font-semibold text-gray-900">DOLE Compliance Status</h3>
      </div>
      
      <div className="p-6 pb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-[#ACB9CB]">
                <th className="pb-4 text-left text-sm font-semibold text-gray-900">
                  DOLE Requirements
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Frequency
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Last Submitted
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Next Due Date
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA] hover:bg-gray-50">
                    <td className="py-4 text-left text-sm text-gray-900">
                      {item.doleRequirement}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {item.frequency}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {item.lastSubmitted}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {item.nextDueDate}
                    </td>
                    <td className="py-4 text-center">
                      <span className={getStatusColor(item.complianceStatus)}>
                        {item.complianceStatus}
                      </span>
                    </td>
                    <td className="py-4 text-center text-sm">
                      {(() => {
                        const isLogbook = item.doleRequirement.includes('Employee Compensation Logbook');
                        const isSafetyPolicy = item.doleRequirement.includes('Safety & Health Policy');
                        const isOshProgram = item.doleRequirement.includes('OSH Program');
                        let displayAction = item.action;
                        
                        // Determine action based on requirement type if not provided
                        if (!displayAction) {
                          if (isLogbook) {
                            displayAction = 'View Log';
                          } else if (isSafetyPolicy || isOshProgram) {
                            displayAction = 'View';
                          } else {
                            displayAction = 'View Report';
                          }
                        }
                        
                        return (
                          <button
                            className={getActionColor(displayAction)}
                            onClick={() => handleActionClick(displayAction, item.doleRequirement)}
                          >
                            {displayAction}
                          </button>
                        );
                      })()}
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

export default DOLEComplianceTable;
