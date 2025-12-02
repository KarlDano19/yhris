import React from 'react';

interface EvaluationTemplateResponseDocumentProps {
  templateData: {
    template: {
      name: string;
      evaluation_type: string;
      frequency: string;
      total_responses: number;
      total_score: number;
      passing_score: number;
    };
    employees_responded: Array<{
      name: string;
      department: string;
      date_completed: string;
      score: number;
    }>;
    sections?: Array<{
      section_index: number;
      section_title: string;
      section_description: string;
      criterion: Array<{
        criterion_index: number;
        title: string;
        max_score: number;
        responses?: Array<{
          employee_name: string;
          employee_id: number;
          department: string;
          date_of_evaluation: string;
          score: number;
        }>;
      }>;
    }>;
    questions?: Array<{
      id: string;
      section_title: string;
      criterion: Array<{
        id: string;
        title: string;
        max_score: number;
      }>;
    }>;
    frequently_evaluated_employees: Array<{
      name: string;
      department: string;
      evaluation_count: number;
      average_score: number;
      average_raw_score: number;
    }>;
    individual_responses?: Array<{
      employee_name: string;
      date_of_evaluation: string;
      form_data: any[];
      form_total_score: number;
    }>;
  };
  dateFilter?: { from: string; to: string };
  departmentFilter?: string[];
}

const EvaluationTemplateResponseDocument: React.FC<EvaluationTemplateResponseDocumentProps> = ({
  templateData,
  dateFilter,
  departmentFilter,
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

  const renderTemplateSummary = () => {
    const filteredCount = templateData.employees_responded?.length || 0;
    const totalCount = templateData.template?.total_responses || 0;
    const isFiltered = (dateFilter?.from || dateFilter?.to || (departmentFilter && departmentFilter.length > 0));
    
    return (
      <div className="mb-4 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Template Summary</h2>
        <table className="w-full border-collapse border border-gray-300 ml-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-left text-xs">Property</th>
              <th className="border border-gray-300 p-1 text-left text-xs">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Template Name</td>
              <td className="border border-gray-300 p-1 text-xs">{templateData.template?.name || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Evaluation Type</td>
              <td className="border border-gray-300 p-1 text-xs">{templateData.template?.evaluation_type || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Frequency</td>
              <td className="border border-gray-300 p-1 text-xs">{templateData.template?.frequency || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">
                {isFiltered ? 'Filtered Responses' : 'Total Responses'}
              </td>
              <td className="border border-gray-300 p-1 text-xs">
                {isFiltered ? `${filteredCount} of ${totalCount}` : totalCount}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Total Score</td>
              <td className="border border-gray-300 p-1 text-xs">{templateData.template?.total_score || 0}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-medium text-xs">Passing Score</td>
              <td className="border border-gray-300 p-1 text-xs">{templateData.template?.passing_score || 0}</td>
            </tr>
          </tbody>
        </table>
        
        {departmentFilter && departmentFilter.length > 0 && (
          <div className="mt-2 ml-3">
            <p className="text-xs text-gray-600">
              <strong>Department Filter:</strong> {departmentFilter.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderRespondents = () => {
    // Sort respondents by date_completed in descending order (newest first)
    const sortedRespondents = templateData.employees_responded 
      ? [...templateData.employees_responded].sort((a, b) => {
          if (!a.date_completed) return 1;
          if (!b.date_completed) return -1;
          return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
        })
      : [];
    
    return (
      <div className="mb-2 ml-3">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">List of Respondents (Sorted by Date - Newest First)</h3>
        
        {sortedRespondents.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-center text-xs">Department</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Employee Evaluated</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Date Completed</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Score</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedRespondents.map((employee, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1 text-center text-xs">{employee.department}</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{employee.name}</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">
                    {employee.date_completed ? 
                      new Intl.DateTimeFormat('en-US').format(new Date(employee.date_completed)) : 
                      'N/A'
                    }
                  </td>
                  <td className="border border-gray-300 p-1 text-center font-bold text-xs">{employee.score || 0}</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">
                    <span className={`${
                      employee.score >= (templateData.template?.passing_score || 0)
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }`}>
                      {employee.score >= (templateData.template?.passing_score || 0) ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-sm mb-1">No respondents found</div>
            <div className="text-xs">Evaluation responses will appear here when available</div>
          </div>
        )}
      </div>
    );
  };

  const sanitizeQuestionTitle = (title?: string) => {
    if (typeof title !== 'string') return '';
    const trimmed = title.trim();
    if (!trimmed || /^untitled(\s+question)?$/i.test(trimmed)) {
      return '';
    }
    return trimmed;
  };

  const renderQuestions = () => {
    // Flatten all criteria from all sections with employee scores
    const allCriteria: any[] = [];
    
    // Use sections from backend (new format) if available, otherwise fall back to questions
    const sectionsToProcess = templateData.sections && Array.isArray(templateData.sections) && templateData.sections.length > 0
      ? templateData.sections
      : (templateData.questions && Array.isArray(templateData.questions) ? templateData.questions : []);
    
    if (sectionsToProcess && sectionsToProcess.length > 0) {
      sectionsToProcess.forEach((section: any, sectionIndex: number) => {
        if (section.criterion && Array.isArray(section.criterion)) {
          section.criterion.forEach((criterion: any, criterionIndex: number) => {
            const questionTitle = sanitizeQuestionTitle(criterion?.title);
            if (!criterion || !questionTitle) {
              return;
            }
            
            // Get employee scores from criterion.responses (new backend format)
            const employeeScoresMap: { [key: string]: { name: string; scores: number[]; averageScore: number } } = {};
            
            if (criterion.responses && Array.isArray(criterion.responses)) {
              // Process responses from backend format
              criterion.responses.forEach((response: any) => {
                const employeeName = response.employee_name;
                const score = typeof response.score === 'number' ? response.score : parseFloat(response.score || 0);
                
                if (!isNaN(score) && score >= 0) {
                  if (!employeeScoresMap[employeeName]) {
                    employeeScoresMap[employeeName] = {
                      name: employeeName,
                      scores: [],
                      averageScore: 0
                    };
                  }
                  employeeScoresMap[employeeName].scores.push(score);
                }
              });
            } else {
              // Fallback to old format
              const scores = getEmployeeScoresForQuestion(section.id || `section-${section.section_index}`, criterionIndex);
              scores.forEach((emp: any) => {
                employeeScoresMap[emp.name] = emp;
              });
            }
            
            // Calculate averages
            const employeeScores = Object.values(employeeScoresMap).map(employee => {
              if (employee.scores.length > 0) {
                employee.averageScore = employee.scores.reduce((sum, score) => sum + score, 0) / employee.scores.length;
              }
              return employee;
            }).filter(employee => employee.averageScore > 0)
              .sort((a, b) => b.averageScore - a.averageScore);
            
            allCriteria.push({
              sectionTitle: section.section_title || section.title || 'Untitled Section',
              title: questionTitle,
              max_score: criterion?.max_score || 0,
              employeeScores: employeeScores,
            });
          });
        }
      });
    }

    return (
      <div className="mb-2 ml-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Evaluation Questions & Employee Scores</h3>
        
        {allCriteria.length > 0 ? (
          <div className="space-y-4">
            {allCriteria.map((criterion, index) => (
              <div key={index}>
                {/* Question Header - Plain text, NO borders or boxes */}
                <div className="font-semibold text-xs mb-1">
                  {index + 1}. {criterion.title}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Section: {criterion.sectionTitle} | Max Score: {criterion.max_score}
                </div>
                
                {/* Employee Score Details Table - ONLY this has borders */}
                {criterion.employeeScores && criterion.employeeScores.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-1 text-center text-xs font-medium">Employee Name</th>
                        <th className="border border-gray-300 p-1 text-center text-xs font-medium">Average Score</th>
                        <th className="border border-gray-300 p-1 text-center text-xs font-medium">Evaluations</th>
                        <th className="border border-gray-300 p-1 text-center text-xs font-medium">High Score</th>
                        <th className="border border-gray-300 p-1 text-center text-xs font-medium">Low Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criterion.employeeScores.map((employee: any, empIndex: number) => {
                        const highScore = employee.scores.length > 0 ? Math.max(...employee.scores) : 0;
                        const lowScore = employee.scores.length > 0 ? Math.min(...employee.scores) : 0;
                        
                        return (
                          <tr key={empIndex}>
                            <td className="border border-gray-300 p-1 text-center text-xs">{employee.name}</td>
                            <td className="border border-gray-300 p-1 text-center text-xs">
                              <span className={`font-semibold ${
                                employee.averageScore >= 4 ? 'text-green-600' :
                                employee.averageScore >= 3 ? 'text-yellow-600' :
                                employee.averageScore >= 2 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {employee.averageScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-1 text-center text-xs">
                              {employee.scores.length} time{employee.scores.length !== 1 ? 's' : ''}
                            </td>
                            <td className="border border-gray-300 p-1 text-center text-xs">
                              <span className="font-semibold text-green-700">{Math.round(highScore)}</span>
                            </td>
                            <td className="border border-gray-300 p-1 text-center text-xs">
                              <span className="font-semibold text-red-700">{Math.round(lowScore)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    No scored responses available for this question
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-sm mb-1">No evaluation criteria found</div>
            <div className="text-xs">Evaluation questions will appear here when available</div>
          </div>
        )}
      </div>
    );
  };
  
  // Helper function to get employee scores for a specific question
  const getEmployeeScoresForQuestion = (sectionId: string, criterionIndex: number) => {
    if (!templateData.individual_responses) return [];
    
    const employeeScores: { 
      [key: string]: { 
        name: string; 
        scores: number[]; 
        averageScore: number;
      } 
    } = {};

    // Process each individual response
    templateData.individual_responses.forEach((response: any) => {
      const employeeName = response.employee_name;
      const formData = response.form_data || [];
      
      // Find the section in the form data
      const section = Array.isArray(formData) 
        ? formData.find((s: any) => s.id === sectionId)
        : null;

      if (section && section.criterion && Array.isArray(section.criterion)) {
        const criterion = section.criterion[criterionIndex];
        
        if (criterion && criterion.score !== undefined && criterion.score !== null) {
          const score = typeof criterion.score === 'number' ? criterion.score : parseFloat(criterion.score);
          
          if (!isNaN(score) && score > 0) {
            if (!employeeScores[employeeName]) {
              employeeScores[employeeName] = {
                name: employeeName,
                scores: [],
                averageScore: 0
              };
            }
            employeeScores[employeeName].scores.push(score);
          }
        }
      }
    });

    // Calculate average scores for each employee
    Object.values(employeeScores).forEach(employee => {
      if (employee.scores.length > 0) {
        employee.averageScore = employee.scores.reduce((sum, score) => sum + score, 0) / employee.scores.length;
      }
    });

    // Convert to array and sort by average score (descending)
    return Object.values(employeeScores)
      .filter(employee => employee.averageScore > 0)
      .sort((a, b) => b.averageScore - a.averageScore);
  };

  const renderAnalytics = () => {
    // Get all analytics employees (not paginated for print)
    const allAnalyticsEmployees = templateData.frequently_evaluated_employees || [];
    
    return (
      <div className="mb-2 ml-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Employee Evaluation Details</h3>
        
        {allAnalyticsEmployees.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-center text-xs">Employee Name</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Department</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Evaluation Count</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Average Score</th>
                <th className="border border-gray-300 p-1 text-center text-xs">Average Raw Score</th>
              </tr>
            </thead>
            <tbody>
              {allAnalyticsEmployees.map((employee: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1 text-center text-xs">{employee.name}</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">{employee.department}</td>
                  <td className="border border-gray-300 p-1 text-center text-xs">
                    {employee.evaluation_count} evaluation{employee.evaluation_count !== 1 ? 's' : ''}
                  </td>
                  <td className="border border-gray-300 p-1 text-center text-xs">
                    <span className={`font-semibold ${
                      employee.average_score >= 80 ? 'text-green-600' :
                      employee.average_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {employee.average_score}%
                    </span>
                  </td>
                  <td className="border border-gray-300 p-1 text-center text-xs">
                    {employee.average_raw_score || 0} / {templateData.template?.total_score || 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-sm mb-1">No employee evaluation data found</div>
            <div className="text-xs">Analytics data will appear here when available</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Evaluation History: Template Response Report</h1>
        <p className="text-gray-600 text-xs">Period: {formatDateRange()}</p>
        <p className="text-gray-600 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Template Summary */}
      {renderTemplateSummary()}

      {/* Respondents Section */}
      <div className="mb-4 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Respondents</h2>
        {renderRespondents()}
      </div>

      {/* Questions Section */}
      <div className="mb-4 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Evaluation Questions</h2>
        {renderQuestions()}
      </div>

      {/* Analytics Section */}
      <div className="mb-4 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Analytics</h2>
        {renderAnalytics()}
      </div>
    </div>
  );
};

export default EvaluationTemplateResponseDocument;

