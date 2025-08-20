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
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        // If date parsing fails, return the original string
        return dateString;
      }
    };

    if (dateFilter.from && dateFilter.to) {
      return `${formatDate(dateFilter.from)} to ${formatDate(dateFilter.to)}`;
    } else if (dateFilter.from) {
      return `From ${formatDate(dateFilter.from)}`;
    } else if (dateFilter.to) {
      return `Until ${formatDate(dateFilter.to)}`;
    }
    return 'All Time';
  };

  const renderKPICards = () => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Workforce Overview - Key Performance Indicators</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Metric</th>
            <th className="border border-gray-300 p-2 text-center">Value</th>
            <th className="border border-gray-300 p-2 text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Total Active Employees</td>
            <td className="border border-gray-300 p-2 text-center font-bold">{kpiData.totalEmployees.value}</td>
            <td className="border border-gray-300 p-2 text-sm">{kpiData.totalEmployees.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">New Hires</td>
            <td className="border border-gray-300 p-2 text-center font-bold">{kpiData.newHires.value}</td>
            <td className="border border-gray-300 p-2 text-sm">{kpiData.newHires.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Separated Employees</td>
            <td className="border border-gray-300 p-2 text-center font-bold">{kpiData.separatedEmployees.value}</td>
            <td className="border border-gray-300 p-2 text-sm">{kpiData.separatedEmployees.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Attrition Rate</td>
            <td className="border border-gray-300 p-2 text-center font-bold">{kpiData.attritionRate.value}%</td>
            <td className="border border-gray-300 p-2 text-sm">{kpiData.attritionRate.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Average Tenure</td>
            <td className="border border-gray-300 p-2 text-center font-bold">{kpiData.averageTenure.value} years</td>
            <td className="border border-gray-300 p-2 text-sm">{kpiData.averageTenure.trend}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderApplicantVsHired = () => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Applicant vs Hired Analysis</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Overall Applicants Status Summary */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Overall Applicants Status Summary</h3>
          {applicantData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-center">Status</th>
                  <th className="border border-gray-300 p-2 text-center">Count</th>
                  <th className="border border-gray-300 p-2 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {applicantData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 text-center">{item.status}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.count}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="font-semibold mb-2">No Data Available</div>
              <div className="text-sm">No applicant data found for the selected criteria</div>
            </div>
          )}
        </div>

        {/* Demographic Breakdown */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Demographic Breakdown</h3>
          {demographicData ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-center">Demographic</th>
                  <th className="border border-gray-300 p-2 text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">Female Applicants</td>
                  <td className="border border-gray-300 p-2 text-center">{demographicData.femalePercentage || '0%'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">Male Applicants</td>
                  <td className="border border-gray-300 p-2 text-center">{demographicData.malePercentage || '0%'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">Most Common Regions</td>
                  <td className="border border-gray-300 p-2 text-center">{demographicData.mostCommonRegion || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">Most Common Age Group</td>
                  <td className="border border-gray-300 p-2 text-center">{demographicData.mostCommonAgeGroup || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="font-semibold mb-2">No Data Available</div>
              <div className="text-sm">No demographic data found for the selected criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRolePipeline = () => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Role Turnaround and Pipeline Analysis</h2>
      
      {rolePipelineData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-center">Role</th>
              <th className="border border-gray-300 p-2 text-center">No. of Applicants</th>
              <th className="border border-gray-300 p-2 text-center">Status</th>
              <th className="border border-gray-300 p-2 text-center">Date Job Opened</th>
              <th className="border border-gray-300 p-2 text-center">Turnaround Time</th>
              <th className="border border-gray-300 p-2 text-center">Current Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {rolePipelineData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-center">{item.role}</td>
                <td className="border border-gray-300 p-2 text-center">{item.numberOfApplicants}</td>
                <td className="border border-gray-300 p-2 text-center">{item.status}</td>
                <td className="border border-gray-300 p-2 text-center">{item.dateJobOpened}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {item.turnaroundTime === 0 ? 'Today' :
                   item.turnaroundTime === 1 ? '1 day' :
                   `${item.turnaroundTime} days`}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {item.numberOfApplicants === 0 ? 'No applicants yet' : item.currentPipeline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg mb-2">No job postings found</div>
          <div className="text-sm">Create your first job posting to see role pipeline data</div>
        </div>
      )}
    </div>
  );

  const renderAttritionRate = () => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Attrition Rate Analysis</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Attrition Rate */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Attrition Rate for {formatDateRange()}</h3>
          
          {attritionData.attritionRate !== '0' ? (
            <>
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-center">Month</th>
                    <th className="border border-gray-300 p-2 text-center">Attrition Rate</th>
                    <th className="border border-gray-300 p-2 text-center">Total Exits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">Current</td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">{attritionData.attritionRate}%</td>
                    <td className="border border-gray-300 p-2 text-center">{attritionData.exitReasons.reduce((sum, item) => sum + item.count, 0)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border border-gray-300 p-4 bg-gray-50">
                <h4 className="font-semibold mb-3">Attrition Rate Guidelines</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>0-10% - Healthy:</strong> Indicates strong employee retention and stable work culture.</div>
                  <div><strong>11-15% - Manageable:</strong> Still within normal range but worth monitoring for trends.</div>
                  <div><strong>16-20% - Concerning:</strong> May reflect issues in employee satisfaction, engagement, or job fit.</div>
                  <div><strong>Above 20% - High:</strong> Signals potential problems in management, culture, workload, or compensation.</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="font-semibold mb-2">No separation data available</div>
              <div className="text-sm">Separation records will appear here when available</div>
            </div>
          )}
        </div>

        {/* Exit Reasons */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Exit Reasons</h3>
          
          {attritionData.exitReasons.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-center">Exit Reason</th>
                    <th className="border border-gray-300 p-2 text-center">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {attritionData.exitReasons.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{item.reason}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border border-gray-300 p-4 bg-gray-50">
                <h4 className="font-semibold mb-3">Exit Reason Guidelines</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Voluntary Resignation (0-1 per month):</strong> Usually normal, but more than 1 may suggest issues.</div>
                  <div><strong>AWOL (0 per month):</strong> Should not happen; could point to deeper issues.</div>
                  <div><strong>Layoff (0 per month):</strong> Should be rare and signal company changes.</div>
                  <div><strong>Termination (0-1 per month):</strong> Some expected, but frequent cases may indicate problems.</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="font-semibold mb-2">No exit reasons data available</div>
              <div className="text-sm">Separation records will appear here when available</div>
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