import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import { XCircleIcon, ChartBarIcon, UsersIcon, ClipboardDocumentListIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import FilterIcon from '@/svg/FilterIcon';
import FrequentlyEvaluatedPieChart from './charts-and-graphs/FrequentlyEvaluatedPieChart';
import QuestionResponseBarChart from './charts-and-graphs/QuestionResponseBarChart';
import {
  getUniqueDepartments as getUniqueDepts,
  filterEmployeesByDateAndDepartment,
  filterFrequentlyEvaluatedEmployees,
  filterIndividualResponses,
  getEmployeeScoresForCriterion
} from '../helpers/evaluationHelpers';

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
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const customCloseModal = () => {
    setDateFilter({ from: '', to: '' });
    setDepartmentFilter([]);
    setActiveTab('respondents');
    setExpandedQuestions(new Set());
    setIsOpen(null);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Helper function to get unique departments from responses
  const getUniqueDepartments = () => {
    return getUniqueDepts(templateResponseDetails?.employees_responded || []);
  };

  // Handle department filter changes from the Filter component
  const handleDepartmentFilterChange = (filters: any) => {
    setDepartmentFilter(filters.departments);
  };

  // Filter employees based on date range and department
  useEffect(() => {
    const filtered = filterEmployeesByDateAndDepartment(
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
    setFilteredEmployees(filtered);
  }, [templateResponseDetails, dateFilter, departmentFilter]);

  // Initialize department filter with all departments when template response details change
  useEffect(() => {
    if (templateResponseDetails?.employees_responded) {
      const allDepartments = getUniqueDepartments();
      setDepartmentFilter(allDepartments);
    }
  }, [templateResponseDetails]);

  // Helper to get filtered frequently evaluated employees
  const getFilteredFrequentlyEvaluatedEmployees = () => {
    return filterFrequentlyEvaluatedEmployees(
      templateResponseDetails?.frequently_evaluated_employees || [],
      departmentFilter
    );
  };

  // Helper to get filtered individual responses based on department and date
  const getFilteredIndividualResponses = () => {
    return filterIndividualResponses(
      templateResponseDetails?.individual_responses || [],
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
  };

  // Helper function to prepare question response data for horizontal bar charts
  const prepareQuestionResponseData = () => {
    if (!templateResponseDetails?.questions) return [];

    const allCriteria: any[] = [];

    // Extract individual criteria from each section
    templateResponseDetails.questions.forEach((section: any, sectionIndex: number) => {
      if (section.criterion && Array.isArray(section.criterion)) {
        section.criterion.forEach((criterion: any, criterionIndex: number) => {
          allCriteria.push({
            sectionId: section.id,
            sectionTitle: section.section_title,
            criterionId: criterion.id,
            title: criterion.title,
            max_score: criterion.max_score,
            sectionIndex,
            criterionIndex,
            employeeScores: getEmployeeScoresForCriterionWrapper(section.id, criterionIndex)
          });
        });
      }
    });

    return allCriteria;
  };

  // Helper function to calculate employee scores for each criterion
  const getEmployeeScoresForCriterionWrapper = (sectionId: string, criterionIndex: number) => {
    const filteredResponses = getFilteredIndividualResponses();
    
    return getEmployeeScoresForCriterion(
      filteredResponses, 
      sectionId, 
      criterionIndex
    );
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
                          <div className='flex items-center justify-between'>
                            <h4 className='text-lg font-semibold text-black'>Evaluation Questions & Employee Scores</h4>
                            {prepareQuestionResponseData().length > 0 && (
                              <button
                                onClick={() => {
                                  const allQuestions = prepareQuestionResponseData().map((criterion: any) => 
                                    `${criterion.sectionId}-${criterion.criterionIndex}`
                                  );
                                  if (expandedQuestions.size === allQuestions.length) {
                                    setExpandedQuestions(new Set());
                                  } else {
                                    setExpandedQuestions(new Set(allQuestions));
                                  }
                                }}
                                className='px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors'
                              >
                                {expandedQuestions.size === prepareQuestionResponseData().length ? 'Collapse All' : 'Expand All'}
                              </button>
                            )}
                          </div>
                          {prepareQuestionResponseData().length > 0 ? (
                            prepareQuestionResponseData().map((criterion: any, index: number) => {
                              const questionId = `${criterion.sectionId}-${criterion.criterionIndex}`;
                              const isExpanded = expandedQuestions.has(questionId);
                              
                              return (
                                <div key={questionId} className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                                  <button
                                    onClick={() => toggleQuestion(questionId)}
                                    className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left'
                                  >
                                    <div className='flex-1'>
                                      <h5 className='text-sm font-medium text-gray-900 flex items-center gap-2'>
                                        {isExpanded ? (
                                          <ChevronDownIcon className='w-4 h-4 text-gray-500' />
                                        ) : (
                                          <ChevronRightIcon className='w-4 h-4 text-gray-500' />
                                        )}
                                        {index + 1}. {criterion.title}
                                      </h5>
                                      {criterion.max_score && (
                                        <p className='text-xs text-gray-500 mt-0.5 ml-6'>Max Score: {criterion.max_score}</p>
                                      )}
                                    </div>
                                  </button>
                                  
                                  {isExpanded && (
                                    <div className='px-4 pb-4 pt-2 border-t border-gray-100'>
                                      {criterion.employeeScores && criterion.employeeScores.length > 0 ? (
                                        <QuestionResponseBarChart 
                                          employeeScores={criterion.employeeScores}
                                          questionText={criterion.title}
                                          maxScore={criterion.max_score}
                                        />
                                      ) : (
                                        <div className='text-center py-6'>
                                          <p className='text-sm text-gray-500 italic'>
                                            No scored responses available for this question
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className='text-center py-8'>
                              <p className='text-sm text-gray-500 italic'>
                                No evaluation criteria found
                              </p>
                            </div>
                          )}
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
                                frequentlyEvaluatedEmployees={getFilteredFrequentlyEvaluatedEmployees()}
                              />
                            </div>
                          </div>

                          {/* Detailed Analytics Table */}
                          {getFilteredFrequentlyEvaluatedEmployees().length > 0 && (
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
                                    {getFilteredFrequentlyEvaluatedEmployees().map((employee: any, index: number) => (
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