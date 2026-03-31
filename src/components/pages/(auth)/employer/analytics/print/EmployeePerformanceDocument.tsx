import React from 'react';

interface EmployeePerformanceDocumentProps {
  kpiData: {
    averagePerformance: { value: number; maxScore: number; totalEmployees: number };
    resolvedVSOngoing: { resolvedPercentage: number; ongoingPercentage: number; totalIssues: number; resolvedIssues: number; ongoingIssues: number };
  };
  performanceRateData: Array<{
    name: string;
    score: number;
    count: number;
    color: string;
  }>;
  performanceTrendData: Array<{
    month: string;
    score: number;
    count: number;
  }>;
  employeePerformanceTableData: Array<{
    id: string;
    name: string;
    department: string;
    score: string;
    lastEvaluation: string;
    status: string;
  }>;
  issueTypeData: Array<{
    reason: string;
    count: number;
    percentage: string;
    color: string;
  }>;
  monthlyIssueVolumeData: Array<{
    month: string;
    count: number;
  }>;
  employeeIssuesTableData: Array<{
    id: string;
    name: string;
    department: string;
    issueType: string;
    dateReported: string;
    status: string;
  }>;
  dateFilter: { from: string; to: string };
  activeSubTab: number;
}

const EmployeePerformanceDocument: React.FC<EmployeePerformanceDocumentProps> = ({
  kpiData,
  performanceRateData,
  performanceTrendData,
  employeePerformanceTableData,
  issueTypeData,
  monthlyIssueVolumeData,
  employeeIssuesTableData,
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
      <h2 className="text-sm font-bold text-gray-900 mb-2">Employee Performance - Key Performance Indicators</h2>
      <table className="w-full border-collapse border border-gray-300 ml-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1 text-left text-xs">Metric</th>
            <th className="border border-gray-300 p-1 text-center text-xs">Value</th>
            <th className="border border-gray-300 p-1 text-left text-xs">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Average Performance Score</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.averagePerformance.value}/{kpiData.averagePerformance.maxScore}</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.averagePerformance.totalEmployees} employees evaluated</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-medium text-xs">Resolved vs Ongoing Issues</td>
            <td className="border border-gray-300 p-1 text-center font-bold text-xs">{kpiData.resolvedVSOngoing.resolvedPercentage}% Resolved</td>
            <td className="border border-gray-300 p-1 text-xs">{kpiData.resolvedVSOngoing.resolvedIssues} resolved, {kpiData.resolvedVSOngoing.ongoingIssues} ongoing</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderPerformanceRate = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Performance Rate by Department</h3>
      
      {performanceRateData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Department</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Average Score</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Employees Evaluated</th>
            </tr>
          </thead>
          <tbody>
            {performanceRateData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    {item.name}
                  </div>
                </td>
                <td className="border border-gray-300 p-1 text-center font-bold text-xs">{item.score}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No performance data available</div>
          <div className="text-xs">Employee evaluations will appear here when available</div>
        </div>
      )}
    </div>
  );

  const renderPerformanceTrend = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Performance Trend Over Time</h3>
      
      {performanceTrendData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Month</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Average Score</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Evaluations</th>
            </tr>
          </thead>
          <tbody>
            {performanceTrendData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.month}</td>
                <td className="border border-gray-300 p-1 text-center font-bold text-xs">{item.score}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No trend data available</div>
          <div className="text-xs">Performance trends will appear here when available</div>
        </div>
      )}
    </div>
  );

  const renderEmployeePerformanceTable = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Employee Performance Details</h3>
      
      {employeePerformanceTableData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Employee Name</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Department</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Score</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Last Evaluation</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {employeePerformanceTableData.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.name}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.department}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.score}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.lastEvaluation}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No employee performance data available</div>
          <div className="text-xs">Employee performance records will appear here when available</div>
        </div>
      )}
    </div>
  );

  const renderIssueType = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Employee Issue Types</h3>
      
      {issueTypeData && issueTypeData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Issue Type</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Count</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {issueTypeData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    {item.reason}
                  </div>
                </td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No issue type data available</div>
          <div className="text-xs">Employee issue records will appear here when available</div>
          <div className="text-xs mt-2">Debug: issueTypeData length = {issueTypeData?.length || 0}</div>
        </div>
      )}
    </div>
  );

  const renderMonthlyIssueVolume = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Monthly Issue Volume</h3>
      
      {monthlyIssueVolumeData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Month</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Issue Count</th>
            </tr>
          </thead>
          <tbody>
            {monthlyIssueVolumeData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.month}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No monthly issue data available</div>
          <div className="text-xs">Monthly issue volume will appear here when available</div>
        </div>
      )}
    </div>
  );

  const renderEmployeeIssuesTable = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2" style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>Employee Issues Details</h3>
      
      {employeeIssuesTableData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Employee Name</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Department</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Issue Type</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Date Reported</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {employeeIssuesTableData.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.name}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.department}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.issueType}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.dateReported}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No employee issues data available</div>
          <div className="text-xs">Employee issue records will appear here when available</div>
        </div>
      )}
    </div>
  );

  const renderSubTabContent = () => {
    return (
      <>
        {/* Performance Rate */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Performance Rate</h2>
          {renderPerformanceRate()}
          <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {renderPerformanceTrend()}
          </div>
          <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {renderEmployeePerformanceTable()}
          </div>
        </div>
        
        {/* Training Analysis - Commented out until content is available */}
        {/* <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Training Analysis</h2>
          <div className="text-center py-6 text-gray-500">
            <div className="text-sm mb-1">Training Analysis</div>
            <div className="text-xs">Training analysis features are under development</div>
          </div>
        </div> */}
        
        {/* Employee Issue Rate */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Employee Issue Rate</h2>
          <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {renderIssueType()}
          </div>
          <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {renderMonthlyIssueVolume()}
          </div>
          <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {renderEmployeeIssuesTable()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Analytics: Employee Performance Report</h1>
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

export default EmployeePerformanceDocument;
