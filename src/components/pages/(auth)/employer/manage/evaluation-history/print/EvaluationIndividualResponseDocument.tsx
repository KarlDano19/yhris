import React from 'react';

interface EvaluationIndividualResponseDocumentProps {
  evaluationData: Array<{
    id: number;
    employee_name: string;
    date_of_evaluation: string;
    evaluation_period: string;
    evaluation_form: string;
    form_total_score: number;
    max_total_score: number;
    passing_score: number;
    department?: string;
  }>;
  dateFilter?: { from: string; to: string };
  searchText?: string;
}

const EvaluationIndividualResponseDocument: React.FC<EvaluationIndividualResponseDocumentProps> = ({
  evaluationData,
  dateFilter,
  searchText,
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
        return dateString;
      }
    };

    if (dateFilter?.from && dateFilter?.to) {
      return `${formatDate(dateFilter.from)} to ${formatDate(dateFilter.to)}`;
    } else if (dateFilter?.from) {
      return `From ${formatDate(dateFilter.from)}`;
    } else if (dateFilter?.to) {
      return `Until ${formatDate(dateFilter.to)}`;
    }
    return 'All Time';
  };

  const renderSummary = () => {
    const totalEvaluations = evaluationData.length;
    const passedEvaluations = evaluationData.filter(item => item.form_total_score >= item.passing_score).length;
    const failedEvaluations = totalEvaluations - passedEvaluations;
    const passRate = totalEvaluations > 0 ? ((passedEvaluations / totalEvaluations) * 100).toFixed(1) : '0.0';

    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">Summary</h2>
        <table className="w-full border-collapse border border-gray-300 ml-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-left text-xs">Metric</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Total Evaluations</td>
              <td className="border border-gray-300 p-1 text-center text-xs">{totalEvaluations}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Passed</td>
              <td className="border border-gray-300 p-1 text-center text-xs">
                <span className="text-green-600 font-semibold">{passedEvaluations}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Failed</td>
              <td className="border border-gray-300 p-1 text-center text-xs">
                <span className="text-red-600 font-semibold">{failedEvaluations}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Pass Rate</td>
              <td className="border border-gray-300 p-1 text-center text-xs">{passRate}%</td>
            </tr>
          </tbody>
        </table>
        
        {searchText && (
          <div className="mt-2 ml-3">
            <p className="text-xs text-gray-600">
              <strong>Search Filter:</strong> "{searchText}"
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderEvaluations = () => (
    <div className="mb-4 ml-3">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Individual Evaluation Records (Sorted by Date - Newest First)</h3>
      
      {evaluationData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-center text-xs">Employee</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Evaluation Date</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Evaluation Period</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Evaluation Form</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Overall Rating</th>
              <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluationData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.employee_name}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.date_of_evaluation}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.evaluation_period}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">{item.evaluation_form}</td>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  <span className={`font-semibold ${
                    item.form_total_score < item.passing_score ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {item.form_total_score}/{item.max_total_score}
                  </span>
                </td>
                <td className="border border-gray-300 p-1 text-center text-xs">
                  <span className={`${
                    item.form_total_score >= item.passing_score
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }`}>
                    {item.form_total_score >= item.passing_score ? 'Passed' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <div className="text-sm mb-1">No individual evaluations found</div>
          <div className="text-xs">Individual evaluation records will appear here when available</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Evaluation History: Individual Evaluations Report</h1>
        <p className="text-gray-600 text-xs">Period: {formatDateRange()}</p>
        <p className="text-gray-600 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Summary */}
      {renderSummary()}

      {/* Evaluations Table */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">Individual Evaluations</h2>
        {renderEvaluations()}
      </div>
    </div>
  );
};

export default EvaluationIndividualResponseDocument;

