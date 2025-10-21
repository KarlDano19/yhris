import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import { XCircleIcon, ChartBarIcon, UsersIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import FilterIcon from '@/svg/FilterIcon';
import FrequentlyEvaluatedPieChart from './charts-and-graphs/FrequentlyEvaluatedPieChart';
import QuestionResponseBarChart from './charts-and-graphs/QuestionResponseBarChart';

type T_ModalData = {
  id: number;
  open: boolean;
};

interface EmployeeEvaluationData {
  name: string;
  department: string;
  evaluation_count: number;
  total_score: number;
  average_score: number;
}

interface EvaluationResponseDetailsModalProps {
  isOpen: T_ModalData | null;
  setIsOpen: Dispatch<T_ModalData | null>;
  selectedTemplate: any;
  templateResponseDetails: any;
  isLoadingTemplateDetails: boolean;
}

// Filter component matching Screen Applicants design
const Filter = ({ 
  onFilterChange, 
  departments 
}: { 
  onFilterChange: (filters: any) => void;
  departments: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(departments);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => 
      filterRef.current?.contains(e.target as Node) || setIsOpen(false);
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleDepartmentChange = (department: string) => {
    let newDepartments;
    if (selectedDepartments.includes(department)) {
      // Don't allow unchecking if this is the only option selected
      if (selectedDepartments.length === 1) {
        return;
      }
      newDepartments = selectedDepartments.filter((d) => d !== department);
    } else {
      newDepartments = [...selectedDepartments, department];
    }
    
    setSelectedDepartments(newDepartments);
    onFilterChange({ departments: newDepartments });
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={toggleFilter}
        className="rounded-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 p-2 flex items-center justify-center h-12 w-12 transition-colors"
      >
        <FilterIcon/>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white shadow-md rounded-md p-3 z-30 w-64 border border-gray-300">
          <div className="mb-4">
            <h3 className="font-semibold text-indigo-dye mb-2">Department</h3>
            <div className="flex flex-col gap-0.5">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-blue-500 focus:ring-blue-500"
                    checked={selectedDepartments.includes(dept)}
                    onChange={() => handleDepartmentChange(dept)}
                  />
                  <span className="text-sm text-gray-800">{dept}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EvaluationResponseDetailsModal = ({
  isOpen,
  setIsOpen,
  selectedTemplate,
  templateResponseDetails,
  isLoadingTemplateDetails,
}: EvaluationResponseDetailsModalProps) => {
  const cancelButtonRef = useRef(null);
  const [activeTab, setActiveTab] = useState<'respondents' | 'questions' | 'analytics'>('respondents');
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<{ from: any; to: any }>({
    from: '',
    to: '',
  });
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);

  const customCloseModal = () => {
    setDateFilter({ from: '', to: '' });
    setDepartmentFilter([]);
    setActiveTab('respondents');
    setIsOpen(null);
  };

  // Helper function to get unique departments from responses
  const getUniqueDepartments = () => {
    if (!templateResponseDetails?.employees_responded) return [];
    
    const departments = new Set<string>();
    templateResponseDetails.employees_responded.forEach((employee: any) => {
      if (employee.department && employee.department !== 'N/A') {
        departments.add(employee.department);
      }
    });
    
    return Array.from(departments).sort();
  };

  // Handle department filter changes from the Filter component
  const handleDepartmentFilterChange = (filters: any) => {
    setDepartmentFilter(filters.departments);
  };

  // Filter employees based on date range and department
  useEffect(() => {
    if (!templateResponseDetails?.employees_responded) {
      setFilteredEmployees([]);
      return;
    }

    let filtered = [...templateResponseDetails.employees_responded];

    // Filter by date range
    if (dateFilter.from || dateFilter.to) {
      filtered = filtered.filter((employee: any) => {
        if (!employee.date_completed) return false;
        
        const employeeDate = new Date(employee.date_completed);
        
        if (dateFilter.from) {
          const fromDate = new Date(dateFilter.from);
          fromDate.setHours(0, 0, 0, 0);
          if (employeeDate < fromDate) return false;
        }
        
        if (dateFilter.to) {
          const toDate = new Date(dateFilter.to);
          toDate.setHours(23, 59, 59, 999);
          if (employeeDate > toDate) return false;
        }
        
        return true;
      });
    }

    // Filter by department
    if (departmentFilter && departmentFilter.length > 0) {
      filtered = filtered.filter((employee: any) => departmentFilter.includes(employee.department));
    }

    setFilteredEmployees(filtered);
  }, [templateResponseDetails, dateFilter, departmentFilter]);

  // Initialize department filter with all departments when template response details change
  useEffect(() => {
    if (templateResponseDetails?.employees_responded) {
      const allDepartments = getUniqueDepartments();
      setDepartmentFilter(allDepartments);
    }
  }, [templateResponseDetails]);

  // Helper function to prepare question response data for horizontal bar charts
  const prepareQuestionResponseData = () => {
    if (!templateResponseDetails?.questions) return [];

    const processedQuestions = templateResponseDetails.questions.map((question: any, index: number) => ({
      ...question,
      totalResponses: question.responses?.length || question.individual_responses?.length || 0,
      employeeScores: getEmployeeScoresForQuestion(question, index)
    }));

    return processedQuestions;
  };

  // Helper function to calculate employee scores for each question
  const getEmployeeScoresForQuestion = (question: any, questionIndex: number) => {
    if (!templateResponseDetails?.individual_responses) return [];

    const employeeScores: { [key: string]: { name: string; scores: number[]; averageScore: number } } = {};

    // Process each individual response
    templateResponseDetails.individual_responses.forEach((response: any) => {
      const employeeName = response.employee_name;
      const formData = response.form_data || {};
      
      // Try different possible field names for question ID
      const questionId = question.question_id || question.id || questionIndex.toString();
      const questionResponse = formData[questionId];

      if (questionResponse !== undefined && questionResponse !== null) {
        let score = 0;

        // Extract score based on question type and response format
        if (typeof questionResponse === 'object' && questionResponse !== null) {
          score = questionResponse.value || questionResponse.rating || questionResponse.score || 0;
        } else if (typeof questionResponse === 'number') {
          score = questionResponse;
        } else if (typeof questionResponse === 'string') {
          // Try to parse string as number
          const parsedScore = parseFloat(questionResponse);
          score = isNaN(parsedScore) ? 0 : parsedScore;
        }

        if (score > 0) {
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

  if (!isOpen) return null;

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl'>
                <div className='flex bg-savoy-blue p-4 items-center'>
                  <h3 className='flex-1 text-white ml-2 text-lg font-semibold'>
                    Template Summary
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                </div>
                
                <div className='p-6'>
                  {isLoadingTemplateDetails ? (
                    <div className='flex justify-center py-8'>
                      <LoadingSpinner size="lg" color="yellow" />
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      {/* Template Summary */}
                      <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <p className='text-sm text-gray-600'>Template Name</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.name}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Total Responses</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.total_responses}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Evaluation Type</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.evaluation_type}</p>
                          </div>
                        </div>
                      </div>

                      {/* Filters */}
                      <div className='bg-white'>
                        
                        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
                            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                              <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                                <label className='text-sm font-medium text-gray-700'>From:</label>
                                <CustomDatePicker
                                  id='modal-from-datepicker'
                                  placeholder='mm/dd/yyyy'
                                  className='appearance-none block w-full md:w-40 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                  selected={dateFilter.from}
                                  pickerOnChange={(date: any) => {
                                    setDateFilter({ ...dateFilter, from: date });
                                  }}
                                  inputOnChange={(value: any) => {
                                    setDateFilter({
                                      ...dateFilter,
                                      from: value?.target?.value === '' ? null : value,
                                    });
                                  }}
                                />
                              </div>
                              <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                                <label className='text-sm font-medium text-gray-700'>To:</label>
                                <CustomDatePicker
                                  id='modal-to-datepicker'
                                  placeholder='mm/dd/yyyy'
                                  className='appearance-none block w-full md:w-40 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                  selected={dateFilter.to}
                                  pickerOnChange={(date: any) => {
                                    setDateFilter({ ...dateFilter, to: date });
                                  }}
                                  inputOnChange={(value: any) => {
                                    setDateFilter({
                                      ...dateFilter,
                                      to: value?.target?.value === '' ? null : value,
                                    });
                                  }}
                                  minDate={dateFilter.from}
                                />
                              </div>
                            </div>
                          <div className='flex items-center gap-4'>
                            <div className='text-sm text-gray-600'>
                              Showing {filteredEmployees.length} of {templateResponseDetails.employees_responded?.length || 0} responses
                            </div>
                            <Filter 
                              onFilterChange={handleDepartmentFilterChange}
                              departments={getUniqueDepartments()}
                            />
                            </div>
                          </div>
                      </div>

                      {/* Tab Navigation */}
                      <div className='border-b border-gray-200'>
                        <nav className='-mb-px flex space-x-8'>
                          <button
                            onClick={() => setActiveTab('respondents')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                              activeTab === 'respondents'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <UsersIcon className='h-4 w-4' />
                            Respondents
                          </button>
                          <button
                            onClick={() => setActiveTab('questions')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                              activeTab === 'questions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <ClipboardDocumentListIcon className='h-4 w-4' />
                            Questions & Responses
                          </button>
                          <button
                            onClick={() => setActiveTab('analytics')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                              activeTab === 'analytics'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <ChartBarIcon className='h-4 w-4' />
                            Analytics
                          </button>
                        </nav>
                      </div>

                      {/* Tab Content */}
                      {activeTab === 'respondents' && (
                        <div className='space-y-4'>
                          <h4 className='text-lg font-semibold text-gray-900'>List of Respondents</h4>
                          <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                            <div className='overflow-x-auto'>
                              <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                  <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Recipients (Evaluators)
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Department
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Employee Evaluated
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Date Completed
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Score
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                  {filteredEmployees?.map((employee: any, index: number) => (
                                    <tr key={index} className='hover:bg-gray-50'>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {employee.recipients || 'N/A'}
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {employee.department}
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {employee.name}
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {employee.date_completed ? 
                                          new Intl.DateTimeFormat('en-US').format(new Date(employee.date_completed)) : 
                                          'N/A'
                                        }
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {employee.score || 0}
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                          employee.score >= (templateResponseDetails.template?.passing_score || 0)
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {employee.score >= (templateResponseDetails.template?.passing_score || 0) ? 'Passed' : 'Failed'}
                                        </span>
                                      </td>
                                    </tr>
                                  )) || (
                                    <tr>
                                      <td colSpan={6} className='px-6 py-4 text-center text-sm text-gray-500'>
                                        No respondents found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'questions' && (
                        <div className='space-y-6'>
                          <h4 className='text-lg font-semibold text-gray-900'>Evaluation Questions & Employee Scores</h4>
                          {prepareQuestionResponseData().map((question: any, questionIndex: number) => (
                            <div key={questionIndex} className='bg-white border border-gray-200 rounded-lg p-6'>
                              <div className='mb-6'>
                                <h5 className='text-lg font-medium text-gray-900 mb-2'>
                                  {questionIndex + 1}. {question.question_text}
                                </h5>
                                <p className='text-sm text-gray-600'>
                                  Question Type: {question.question_type} • Total Responses: {question.total_responses}
                                </p>
                              </div>
                              
                              {question.employeeScores && question.employeeScores.length > 0 ? (
                                <QuestionResponseBarChart 
                                  employeeScores={question.employeeScores}
                                  questionText={question.question_text}
                                />
                              ) : question.individual_responses && question.individual_responses.length > 0 ? (
                                <div className='space-y-3'>
                                  <div className='bg-blue-50 p-4 rounded border border-blue-200'>
                                    <h6 className='text-sm font-medium text-blue-900 mb-3'>Individual Text Responses ({question.individual_responses.length})</h6>
                                    <div className='space-y-3'>
                                      {question.individual_responses.map((response: any, responseIndex: number) => (
                                        <div key={responseIndex} className='bg-white p-3 rounded border border-blue-100'>
                                          <div className='flex justify-between items-start mb-2'>
                                            <p className='text-sm font-medium text-gray-900'>{response.employee_name}</p>
                                            <p className='text-xs text-gray-500'>
                                              {response.date ? new Intl.DateTimeFormat('en-US').format(new Date(response.date)) : 'N/A'}
                                            </p>
                                          </div>
                                          <p className='text-sm text-gray-700 bg-gray-50 p-2 rounded'>
                                            {response.response}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className='text-center py-8'>
                                  <p className='text-sm text-gray-500 italic'>
                                    {question.question_type === 'text' 
                                      ? 'No text responses available for this question' 
                                      : 'No scored responses available for this question'
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'analytics' && (
                        <div className='space-y-6'>
                          <h4 className='text-lg font-semibold text-gray-900'>Analytics</h4>
                          
                          {/* Frequently Evaluated Employees Pie Chart */}
                          <div className='bg-white border border-gray-200 rounded-lg p-6'>
                            <h5 className='text-lg font-medium text-gray-900 mb-4'>Frequently Evaluated Employees</h5>
                            <div className='h-80'>
                              <FrequentlyEvaluatedPieChart 
                                frequentlyEvaluatedEmployees={templateResponseDetails.frequently_evaluated_employees || []}
                              />
                            </div>
                          </div>

                          {/* Detailed Analytics Table */}
                          {templateResponseDetails.frequently_evaluated_employees && templateResponseDetails.frequently_evaluated_employees.length > 0 && (
                            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                              <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                                <h5 className='text-lg font-medium text-gray-900'>Employee Evaluation Details</h5>
                                <p className='text-sm text-gray-600 mt-1'>Detailed breakdown of employee evaluation frequency and performance</p>
                              </div>
                              <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200'>
                                  <thead className='bg-gray-50'>
                                    <tr>
                                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Employee Name
                                      </th>
                                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Department
                                      </th>
                                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Evaluation Count
                                      </th>
                                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Average Score
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className='bg-white divide-y divide-gray-200'>
                                    {templateResponseDetails.frequently_evaluated_employees.map((employee: any, index: number) => (
                                      <tr key={index} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                          {employee.name}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                          {employee.department}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                            {employee.evaluation_count} evaluation{employee.evaluation_count !== 1 ? 's' : ''}
                                          </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                          <div className='flex flex-col'>
                                            <span className={`font-medium ${
                                              employee.average_score >= 80 ? 'text-green-600' :
                                              employee.average_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                              {employee.average_score}%
                                            </span>
                                            <span className='text-xs text-gray-400'>
                                              Avg: {employee.average_raw_score || 0} / {templateResponseDetails.template?.total_score || 1}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EvaluationResponseDetailsModal;