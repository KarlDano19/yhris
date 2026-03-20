import React from 'react';

import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/LoadingSpinner';

interface DOLEEmployeeData {
  doleRequirement: string;
  frequency: string;
  lastSubmitted: string;
  nextDueDate: string;
  complianceStatus: string;
  action?: string;
}


interface DOLEComplianceTableProps {
  data?: DOLEEmployeeData[];
  isLoading?: boolean;
  error?: any;
}

const DOLEComplianceTable: React.FC<DOLEComplianceTableProps> = ({
  data = [],
  isLoading = false,
  error
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
      case '—':
        return 'text-gray-500';
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
          <h3 className="text-lg font-semibold text-gray-900">DOLE Compliance Status</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">Error loading data: {error?.message || 'An error occurred'}</div>
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
      
      <div className="p-6">
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
                      {item.frequency || "—"}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {item.lastSubmitted || "—"}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-900">
                      {item.nextDueDate || "—"}
                    </td>
                    <td className="py-4 text-center">
                      {item.complianceStatus === '—' ? (
                        <span className="text-gray-500">—</span>
                      ) : (
                        <span className={getStatusColor(item.complianceStatus)}>
                          {item.complianceStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-center text-sm">
                      {(() => {
                        const isSafetyPolicy = item.doleRequirement.includes('Safety & Health Policy');
                        const isOshProgram = item.doleRequirement.includes('OSH Program');
                        const displayAction: string = item.action ?? (isSafetyPolicy || isOshProgram ? 'View' : 'View Report');
                        
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
      </div>
    </div>
  );
};

export default DOLEComplianceTable;
