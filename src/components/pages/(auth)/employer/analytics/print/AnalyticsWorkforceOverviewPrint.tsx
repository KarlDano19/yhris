import React from 'react';

interface AnalyticsWorkforceOverviewPrintProps {
  kpiData: {
    totalEmployees: { value: number; trend: string };
    newHires: { value: number; trend: string };
    separatedEmployees: { value: number; trend: string };
    attritionRate: { value: string; trend: string };
    averageTenure: { value: string; trend: string };
  };
  applicantData: Array<{
    status: string;
    count: string;
    percentage: string;
    label: string;
    color: string;
  }>;
  demographicData?: {
    femalePercentage: string;
    malePercentage: string;
    mostCommonRegion: string;
    mostCommonAgeGroup: string;
  };
  rolePipelineData: Array<{
    role: string;
    numberOfApplicants: number;
    status: string;
    dateJobOpened: string;
    turnaroundTime: number;
    currentPipeline: string;
    jobId: number;
  }>;
  attritionData: {
    attritionRate: string;
    exitReasons: Array<{
      reason: string;
      count: number;
      percentage: string;
    }>;
  };
  dateFilter: { from: string; to: string };
  activeSubTab: number;
}

const AnalyticsWorkforceOverviewPrint: React.FC<AnalyticsWorkforceOverviewPrintProps> = ({
  kpiData,
  applicantData,
  demographicData,
  rolePipelineData,
  attritionData,
  dateFilter,
  activeSubTab
}) => {
  const formatDateRange = () => {
    if (dateFilter.from && dateFilter.to) {
      return `${dateFilter.from} to ${dateFilter.to}`;
    } else if (dateFilter.from) {
      return `From ${dateFilter.from}`;
    } else if (dateFilter.to) {
      return `Until ${dateFilter.to}`;
    }
    return 'All Time';
  };

  const renderKPICards = () => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Workforce Overview - Key Performance Indicators</h2>
      <div className="grid grid-cols-5 gap-3">
        {/* Total Active Employees */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-1 text-center">Total Active Employees</h3>
          <div className="text-lg font-bold text-gray-900 mb-1 text-center">{kpiData.totalEmployees.value}</div>
          <p className="text-xs text-gray-500 text-center leading-tight">{kpiData.totalEmployees.trend}</p>
        </div>

        {/* New Hires */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-1 text-center">New Hires</h3>
          <div className="text-lg font-bold text-gray-900 mb-1 text-center">{kpiData.newHires.value}</div>
          <p className="text-xs text-gray-500 text-center leading-tight">{kpiData.newHires.trend}</p>
        </div>

        {/* Separated Employees */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-1 text-center">Separated Employees</h3>
          <div className="text-lg font-bold text-gray-900 mb-1 text-center">{kpiData.separatedEmployees.value}</div>
          <p className="text-xs text-gray-500 text-center leading-tight">{kpiData.separatedEmployees.trend}</p>
        </div>

        {/* Attrition Rate */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-1 text-center">Attrition Rate</h3>
          <div className="text-lg font-bold text-gray-900 mb-1 text-center">{kpiData.attritionRate.value}%</div>
          <p className="text-xs text-gray-500 text-center leading-tight">{kpiData.attritionRate.trend}</p>
        </div>

        {/* Average Tenure */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-1 text-center">Average Tenure</h3>
          <div className="text-lg font-bold text-gray-900 mb-1 text-center">{kpiData.averageTenure.value} years</div>
          <p className="text-xs text-gray-500 text-center leading-tight">{kpiData.averageTenure.trend}</p>
        </div>
      </div>
    </div>
  );

  const renderApplicantVsHired = () => (
    <div className="mb-8" style={{ pageBreakInside: 'avoid', minHeight: 'fit-content' }}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Applicant vs Hired Analysis</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Overall Applicants Status Summary Component */}
        <div className="border border-gray-300 rounded-lg p-4" style={{ pageBreakInside: 'avoid' }}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
          
          {applicantData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Status</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Count</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {applicantData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">{item.status}</td>
                      <td className="text-center py-3 px-2 text-gray-700 text-xs">{item.count}</td>
                      <td className="text-center py-3 px-2">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-xs ${item.color}`}>{item.percentage}</span>
                          <span className="text-xs text-gray-500">{item.label}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-center">
                <div className="text-sm font-semibold mb-2">No Data Available</div>
                <div className="text-xs">No applicant data found for the selected criteria</div>
              </div>
            </div>
          )}
        </div>

        {/* Demographic Breakdown Component */}
        <div className="border border-gray-300 rounded-lg p-4" style={{ pageBreakInside: 'avoid' }}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Demographic Breakdown</h3>
          
          {demographicData ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Demographic</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">Female Applicants</td>
                    <td className="text-center py-3 px-2 text-gray-700 text-xs">{demographicData.femalePercentage || '0%'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">Male Applicants</td>
                    <td className="text-center py-3 px-2 text-gray-700 text-xs">{demographicData.malePercentage || '0%'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">Most Common Regions</td>
                    <td className="text-center py-3 px-2 text-gray-700 text-xs">{demographicData.mostCommonRegion || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">Most Common Age Group</td>
                    <td className="text-center py-3 px-2 text-gray-700 text-xs">{demographicData.mostCommonAgeGroup || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-center">
                <div className="text-sm font-semibold mb-2">No Data Available</div>
                <div className="text-xs">No demographic data found for the selected criteria</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRolePipeline = () => (
    <div className="mb-8" style={{ pageBreakInside: 'avoid', minHeight: 'fit-content' }}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Role Turnaround and Pipeline Analysis</h2>
      
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm" style={{ pageBreakInside: 'avoid' }}>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">Role</th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">No. of Applicants</th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">Date Job Opened</th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">Turnaround Time</th>
                  <th className="pb-4 text-center text-sm font-semibold text-gray-900">Current Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {rolePipelineData.length > 0 ? (
                  rolePipelineData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 text-sm text-gray-900 font-medium text-center">{item.role}</td>
                      <td className="py-4 text-sm text-gray-900 text-center">{item.numberOfApplicants}</td>
                      <td className="py-4 text-sm text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          item.status === 'Ongoing' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          item.status === 'Closed' ? 'text-red-600 bg-red-50 border-red-200' :
                          item.status === 'Draft' ? 'text-gray-600 bg-gray-50 border-gray-200' :
                          item.status === 'Expired' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                          'text-gray-600 bg-gray-50 border-gray-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">{item.dateJobOpened}</td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        <span className="font-medium">
                          {item.turnaroundTime === 0 ? 'Today' :
                           item.turnaroundTime === 1 ? '1 day' :
                           `${item.turnaroundTime} days`}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900 text-center">
                        {item.numberOfApplicants === 0 ? 'No applicants yet' : item.currentPipeline}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-gray-400 text-lg mb-2">No job postings found</div>
                        <div className="text-gray-500 text-sm">Create your first job posting to see role pipeline data</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttritionRate = () => (
    <div className="mb-8" style={{ pageBreakInside: 'avoid', minHeight: 'fit-content' }}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Attrition Rate Analysis</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Attrition Rate Component */}
        <div className="border border-gray-300 rounded-lg p-4" style={{ pageBreakInside: 'avoid' }}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Attrition Rate for {formatDateRange()}</h3>
          
          {attritionData.attritionRate !== '0' ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Month</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Attrition Rate</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Total Exits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">Current</td>
                      <td className="text-center py-3 px-2 text-green-600 font-semibold text-xs">{attritionData.attritionRate}%</td>
                      <td className="text-center py-3 px-2 text-gray-700 text-xs">{attritionData.exitReasons.reduce((sum, item) => sum + item.count, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Guidelines Section */}
              <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-3">Attrition Rate Guidelines</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start">
                    <span className="text-green-600 font-medium w-32 flex-shrink-0">0-10% - <span className="font-bold">Healthy</span>:</span>
                    <span className="text-gray-700">Indicates strong employee retention and stable work culture.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium w-32 flex-shrink-0">11-15% - <span className="font-bold">Manageable</span>:</span>
                    <span className="text-gray-700">Still within normal range but worth monitoring for trends.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-600 font-medium w-32 flex-shrink-0">16-20% - <span className="font-bold">Concerning</span>:</span>
                    <span className="text-gray-700">May reflect issues in employee satisfaction, engagement, or job fit.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 font-medium w-32 flex-shrink-0">Above 20% - <span className="font-bold">High</span>:</span>
                    <span className="text-gray-700">Signals potential problems in management, culture, workload, or compensation that may require attention.</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">No separation data available</div>
                <div className="text-gray-500 text-xs">Separation records will appear here when available</div>
              </div>
            </div>
          )}
        </div>

        {/* Exit Reasons Component */}
        <div className="border border-gray-300 rounded-lg p-4" style={{ pageBreakInside: 'avoid' }}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Exit Reasons</h3>
          
          {attritionData.exitReasons.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Exit Reason</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700 text-xs">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attritionData.exitReasons.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="text-center py-3 px-2 text-gray-900 font-medium text-xs">{item.reason}</td>
                        <td className="text-center py-3 px-2 text-gray-700 text-xs">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Guidelines Section */}
              <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-3">Exit Reason Guidelines</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start">
                    <span className="text-gray-800 font-medium w-40 flex-shrink-0"><span className="font-bold">Voluntary Resignation</span> (0-1 per month):</span>
                    <span className="text-gray-700">This is usually normal, but more than 1 may suggest employees are unhappy or looking for better opportunities.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-800 font-medium w-40 flex-shrink-0"><span className="font-bold">AWOL</span> (0 per month):</span>
                    <span className="text-gray-700">This should not happen; even one case could point to deeper issues like poor onboarding or unmet expectations.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-800 font-medium w-40 flex-shrink-0"><span className="font-bold">Layoff</span> (0 per month):</span>
                    <span className="text-gray-700">Layoffs should be rare and usually signal changes in company structure or budget.</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-800 font-medium w-40 flex-shrink-0"><span className="font-bold">Termination</span> (0-1 per month):</span>
                    <span className="text-gray-700">Some terminations are expected, but frequent cases may indicate hiring or training problems.</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">No exit reasons data available</div>
                <div className="text-gray-500 text-xs">Separation records will appear here when available</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSubTabContent = () => {
    return (
      <>
        {/* Applicant vs Hired */}
        {renderApplicantVsHired()}
        
        {/* Role Turnaround and Pipeline Analysis */}
        {renderRolePipeline()}
        
        {/* Attrition Rate */}
        {renderAttritionRate()}
      </>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-sm leading-relaxed max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workforce Analytics Report</h1>
        <p className="text-gray-600">Period: {formatDateRange()}</p>
        <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Sub-tab Content */}
      {renderSubTabContent()}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
        <p>This report was generated automatically by the HRIS Analytics System</p>
      </div>
    </div>
  );
};

export default AnalyticsWorkforceOverviewPrint; 