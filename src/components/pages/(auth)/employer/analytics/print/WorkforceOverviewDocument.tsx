import React from 'react';

interface WorkforceOverviewDocumentProps {
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
  jobApplicantSummaries?: Array<{
    jobId: string | number;
    jobTitle: string;
    applicantCount: number;
    summary: Array<{
      status: string;
      count: string;
      percentage: string;
      label: string;
      color: string;
    }>;
  }>;
  selectionMetadata?: {
    totalApplicants: number;
    jobCount?: number;
  };
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
    dateJobClosed: string;
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
    dateRange?: string;
  };
  dateFilter: { from: string; to: string };
}

const WorkforceOverviewDocument: React.FC<WorkforceOverviewDocumentProps> = ({
  kpiData,
  applicantData,
  jobApplicantSummaries,
  selectionMetadata,
  demographicData,
  rolePipelineData,
  attritionData,
  dateFilter,
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

  const formatMonthYear = () => {
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      } catch (error) {
        // If date parsing fails, return the original string
        return dateString;
      }
    };

    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      
      // If same month and year, show just one month
      if (fromDate.getFullYear() === toDate.getFullYear() && 
          fromDate.getMonth() === toDate.getMonth()) {
        return formatDate(dateFilter.from);
      } else {
        // If different months, show range
        return `${formatDate(dateFilter.from)} to ${formatDate(dateFilter.to)}`;
      }
    } else if (dateFilter.from) {
      return formatDate(dateFilter.from);
    } else if (dateFilter.to) {
      return formatDate(dateFilter.to);
    }
    return 'All Time';
  };

  const renderKPICards = () => (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-gray-900 mb-2">Workforce Overview - Key Performance Indicators</h2>
      <table className="w-full border-collapse border border-gray-300 ml-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1 text-left text-xs">Metric</th>
            <th className="border border-gray-300 p-1 text-center text-xs">Value</th>
            <th className="border border-gray-300 p-1 text-left text-xs">Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Total Active Employees</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.totalEmployees.value}</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.totalEmployees.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">New Hires</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.newHires.value}</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.newHires.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Separated Employees</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.separatedEmployees.value}</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.separatedEmployees.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Attrition Rate</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.attritionRate.value}%</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.attritionRate.trend}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Average Tenure</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.averageTenure.value} years</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.averageTenure.trend}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderApplicantVsHired = () => (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-gray-900 mb-2">Applicant vs Hired Analysis</h2>
      <div className="grid grid-cols-2 gap-4 ml-3">
        {/* Overall Applicants Status Summary */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Overall Applicants Status Summary</h3>
          {applicantData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
                  <th className="border border-gray-300 p-1 text-center text-xs">Count</th>
                  <th className="border border-gray-300 p-1 text-center text-xs">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {applicantData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1 text-center text-xs">{item.status}</td>
                    <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
                    <td className="border border-gray-300 p-1 text-center text-xs">{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="font-semibold mb-1 text-xs">No Data Available</div>
              <div className="text-xs">No applicant data found for the selected criteria</div>
            </div>
          )}
          {selectionMetadata && (
            <div className="text-[11px] text-gray-600 mt-2">
              Total applicants across selection: <span className="font-semibold">{selectionMetadata.totalApplicants}</span>
              {typeof selectionMetadata.jobCount === 'number' && (
                <> • Jobs included: <span className="font-semibold">{selectionMetadata.jobCount}</span></>
              )}
            </div>
          )}
          {jobApplicantSummaries && jobApplicantSummaries.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-[11px] font-semibold text-gray-900">
                Selected Job Breakdown
                {selectionMetadata?.jobCount ? ` (${selectionMetadata.jobCount} job${selectionMetadata.jobCount > 1 ? 's' : ''})` : ''}
              </h4>
              {jobApplicantSummaries.map((job) => (
                <div key={job.jobId}>
                  <div className="text-[11px] font-semibold text-gray-700 mb-1">
                    {job.jobTitle} • Applicants: {job.applicantCount}
                  </div>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-1 text-center text-[11px]">Status</th>
                        <th className="border border-gray-300 p-1 text-center text-[11px]">Count</th>
                        <th className="border border-gray-300 p-1 text-center text-[11px]">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.summary.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-1 text-center text-[11px]">{item.status}</td>
                          <td className="border border-gray-300 p-1 text-center text-[11px]">{item.count}</td>
                          <td className="border border-gray-300 p-1 text-center text-[11px]">{item.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demographic Breakdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Demographic Breakdown</h3>
          {demographicData ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-1 text-center text-xs">Demographic</th>
                  <th className="border border-gray-300 p-1 text-center text-xs">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1 text-center text-xs">Female Applicants</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{demographicData.femalePercentage || '0%'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 text-center text-xs">Male Applicants</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{demographicData.malePercentage || '0%'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 text-center text-xs">Most Common Regions</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{demographicData.mostCommonRegion || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 text-center text-xs">Most Common Age Group</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{demographicData.mostCommonAgeGroup || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="font-semibold mb-1 text-xs">No Data Available</div>
              <div className="text-xs">No demographic data found for the selected criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRolePipeline = () => (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-gray-900 mb-2">Role Turnaround and Pipeline Analysis</h2>

      {rolePipelineData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 ml-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Role</th>
              <th className="border border-gray-300 p-1 text-center text-xs">No. of Applicants</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Date Job Opened</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Date Job Closed</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Turnaround Time</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Current Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {rolePipelineData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.role}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.numberOfApplicants}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.status}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.dateJobOpened}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.dateJobClosed}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  {item.turnaroundTime === 0 ? 'Today' :
                   item.turnaroundTime === 1 ? '1 day' :
                   `${item.turnaroundTime} days`}
                </td>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  {item.numberOfApplicants === 0 ? 'No applicants yet' : item.currentPipeline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No job postings found</div>
          <div className="text-xs">Create your first job posting to see role pipeline data</div>
        </div>
      )}
    </div>
  );

  const renderAttritionRate = () => (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-gray-900 mb-2">Attrition Rate Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4 ml-3">
        {/* Attrition Rate */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            Attrition Rate for {attritionData.dateRange || formatMonthYear()}
          </h3>
          
          {attritionData.attritionRate !== '0' ? (
            <>
              <table className="w-full border-collapse border border-gray-300 mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-1 text-center text-xs">Month</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Attrition Rate</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Total Exits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center text-xs">Current</td>
                    <td className="border border-gray-300 p-1 text-center font-semibold text-xs">{attritionData.attritionRate}%</td>
                    <td className="border border-gray-300 p-1 text-center text-xs">{attritionData.exitReasons.reduce((sum, item) => sum + item.count, 0)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border border-gray-300 p-3 bg-gray-50">
                <h4 className="font-semibold mb-2 text-xs">Attrition Rate Guidelines</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>0-10% - Healthy:</strong> Indicates strong employee retention and stable work culture.</div>
                  <div><strong>11-15% - Manageable:</strong> Still within normal range but worth monitoring for trends.</div>
                  <div><strong>16-20% - Concerning:</strong> May reflect issues in employee satisfaction, engagement, or job fit.</div>
                  <div><strong>Above 20% - High:</strong> Signals potential problems in management, culture, workload, or compensation.</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="font-semibold mb-1 text-xs">No separation data available</div>
              <div className="text-xs">Separation records will appear here when available</div>
            </div>
          )}
        </div>

        {/* Exit Reasons */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Exit Reasons</h3>
          
          {attritionData.exitReasons.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-300 mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-1 text-center text-xs">Exit Reason</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {attritionData.exitReasons.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1 text-center text-xs">{item.reason}</td>
                      <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border border-gray-300 p-3 bg-gray-50">
                <h4 className="font-semibold mb-2 text-xs">Exit Reason Guidelines</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>Voluntary Resignation (0-1 per month):</strong> Usually normal, but more than 1 may suggest issues.</div>
                  <div><strong>AWOL (0 per month):</strong> Should not happen; could point to deeper issues.</div>
                  <div><strong>Layoff (0 per month):</strong> Should be rare and signal company changes.</div>
                  <div><strong>Termination (0-1 per month):</strong> Some expected, but frequent cases may indicate problems.</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="font-semibold mb-1 text-xs">No exit reasons data available</div>
              <div className="text-xs">Separation records will appear here when available</div>
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
        
        {/* Conditional Page Break - Only if content would be cut off */}
        <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          {/* Attrition Rate */}
          {renderAttritionRate()}
        </div>
      </>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Analytics: Workforce Overview Report</h1>
        <p className="text-gray-600 text-xs">Period: {formatDateRange()}</p>
        <p className="text-gray-600 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Sub-tab Content */}
      {renderSubTabContent()}

      
    </div>
  );
};

export default WorkforceOverviewDocument; 