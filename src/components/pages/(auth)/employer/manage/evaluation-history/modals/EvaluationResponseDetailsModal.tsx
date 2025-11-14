import { Dispatch, Fragment, useRef, useState, useEffect, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import CustomToast from '@/components/CustomToast';
import useFileforge from '@/components/hooks/useFileforge';
import FrequentlyEvaluatedPieChart from './charts-and-graphs/FrequentlyEvaluatedPieChart';
import QuestionResponseBarChart from './charts-and-graphs/QuestionResponseBarChart';
import RecipientsListModal from './RecipientsListModal';
import {
  getUniqueDepartments as getUniqueDepts,
  filterEmployeesByDateAndDepartment,
  filterFrequentlyEvaluatedEmployees,
  filterIndividualResponses,
  getEmployeeScoresForCriterion
} from '../helpers/evaluationHelpers';
import { handlePrintEvaluationTemplateResponse } from '../PrintData';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import { UsersIcon } from '@heroicons/react/24/solid';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import PrintIcon from '@/svg/PrintIcon';

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
  
  // Pagination state for Respondents tab
  const [respondentsPageSize, setRespondentsPageSize] = useState(5);
  const [respondentsCurrentPage, setRespondentsCurrentPage] = useState(1);
  const [respondentsPagination, setRespondentsPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Pagination state for Questions tab
  const [questionsPageSize, setQuestionsPageSize] = useState(5);
  const [questionsCurrentPage, setQuestionsCurrentPage] = useState(1);
  const [questionsPagination, setQuestionsPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Pagination state for Analytics tab (Employee Evaluation Details)
  const [analyticsPageSize, setAnalyticsPageSize] = useState(5);
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1);
  const [analyticsPagination, setAnalyticsPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Recipients modal state
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<{
    recipients: string;
    employeeName: string;
    department: string;
  } | null>(null);

  // Fileforge hook for PDF generation
  const { generatePDFLocally, isGenerating: isPrintGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      console.error('Print error:', error);
      toast.custom(() => <CustomToast message='Failed to generate PDF.' type='error' />, { duration: 3000 });
    },
  });

  // Handle print button click
  const handlePrintClick = async () => {
    if (!templateResponseDetails) {
      toast.custom(() => <CustomToast message='No template data available to print.' type='error' />, { duration: 3000 });
      return;
    }

    try {
      // Prepare date filter for printing
      const printDateFilter = dateFilter.from || dateFilter.to
        ? {
            from: dateFilter.from ? dateFilter.from.toLocaleDateString('en-CA') : '',
            to: dateFilter.to ? dateFilter.to.toLocaleDateString('en-CA') : '',
          }
        : undefined;

      // Filter the data before printing (use the already filtered employees from the modal)
      const filteredTemplateData = {
        ...templateResponseDetails,
        // Use the already filtered employees based on date and department
        employees_responded: filteredEmployees,
        // Filter frequently evaluated employees based on department filter
        frequently_evaluated_employees: getFilteredFrequentlyEvaluatedEmployees(),
        // Include individual_responses for question score details
        individual_responses: getFilteredIndividualResponses()
      };

      await handlePrintEvaluationTemplateResponse(
        generatePDFLocally,
        filteredTemplateData,
        printDateFilter,
        departmentFilter
      );
    } catch (error) {
      console.error('Error printing evaluation template response:', error);
      toast.custom(() => <CustomToast message='Failed to generate PDF.' type='error' />, { duration: 3000 });
    }
  };

  const customCloseModal = () => {
    setDateFilter({ from: '', to: '' });
    setDepartmentFilter([]);
    setActiveTab('respondents');
    setExpandedQuestions(new Set());
    setRespondentsCurrentPage(1);
    setRespondentsPageSize(5);
    setQuestionsCurrentPage(1);
    setQuestionsPageSize(5);
    setAnalyticsCurrentPage(1);
    setAnalyticsPageSize(5);
    setIsRecipientsModalOpen(false);
    setSelectedRecipients(null);
    setIsOpen(null);
  };

  // Pagination handlers for Respondents tab
  const handleRespondentsPaginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setRespondentsCurrentPage(newCurrentPage);
  };

  const handleRespondentsPageSizeChange = (value: number) => {
    setRespondentsCurrentPage(1);
    setRespondentsPageSize(value);
  };

  // Pagination handlers for Questions tab
  const handleQuestionsPaginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setQuestionsCurrentPage(newCurrentPage);
  };

  const handleQuestionsPageSizeChange = (value: number) => {
    setQuestionsCurrentPage(1);
    setQuestionsPageSize(value);
  };

  // Pagination handlers for Analytics tab
  const handleAnalyticsPaginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setAnalyticsCurrentPage(newCurrentPage);
  };

  const handleAnalyticsPageSizeChange = (value: number) => {
    setAnalyticsCurrentPage(1);
    setAnalyticsPageSize(value);
  };

  // Recipients modal handlers
  const handleRecipientsClick = (recipients: string, employeeName: string, department: string) => {
    setSelectedRecipients({
      recipients,
      employeeName,
      department
    });
    setIsRecipientsModalOpen(true);
  };

  const handleCloseRecipientsModal = () => {
    setIsRecipientsModalOpen(false);
    setSelectedRecipients(null);
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

  // Prepare filter groups for the Filter component
  const filterGroups: FilterGroup[] = useMemo(() => {
    const departments = getUniqueDepartments();
    return [
      {
        id: 'departments',
        title: 'Department',
        options: departments.map(dept => ({ label: dept, value: dept })),
        multiSelect: true,
        allowEmpty: false
      }
    ];
  }, [templateResponseDetails]);

  // Handle department filter changes from the Filter component
  const handleDepartmentFilterChange = (filters: FilterValues) => {
    setDepartmentFilter(filters.departments || []);
  };

  // Filter employees based on date range and department
  useEffect(() => {
    const filtered = filterEmployeesByDateAndDepartment(
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
    
    // Sort by date_completed in descending order (newest first)
    const sortedFiltered = filtered.sort((a, b) => {
      if (!a.date_completed) return 1;
      if (!b.date_completed) return -1;
      return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
    });
    
    setFilteredEmployees(sortedFiltered);
    
    // Update pagination for Respondents tab
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / respondentsPageSize);
    setRespondentsPagination({
      totalRecords,
      totalPages
    });
    
    // Reset to page 1 if current page exceeds total pages
    if (respondentsCurrentPage > totalPages && totalPages > 0) {
      setRespondentsCurrentPage(1);
    }
  }, [templateResponseDetails, dateFilter, departmentFilter, respondentsPageSize, respondentsCurrentPage]);

  // Initialize department filter with all departments when template response details change
  useEffect(() => {
    if (templateResponseDetails?.employees_responded) {
      const allDepartments = getUniqueDepartments();
      setDepartmentFilter(allDepartments);
    }
  }, [templateResponseDetails]);

  // Update pagination for Questions tab when data changes
  useEffect(() => {
    const allQuestions = prepareQuestionResponseData();
    const totalRecords = allQuestions.length;
    const totalPages = Math.ceil(totalRecords / questionsPageSize) || 1;
    
    setQuestionsPagination({
      totalRecords,
      totalPages
    });
    
    // Reset to page 1 if current page exceeds total pages
    if (questionsCurrentPage > totalPages && totalPages > 0) {
      setQuestionsCurrentPage(1);
    }
  }, [templateResponseDetails, dateFilter, departmentFilter, questionsPageSize]);

  // Update pagination for Analytics tab when data changes
  useEffect(() => {
    const allEmployees = getFilteredFrequentlyEvaluatedEmployees();
    const totalRecords = allEmployees.length;
    const totalPages = Math.ceil(totalRecords / analyticsPageSize);
    setAnalyticsPagination({
      totalRecords,
      totalPages
    });
    
    // Reset to page 1 if current page exceeds total pages
    if (analyticsCurrentPage > totalPages && totalPages > 0) {
      setAnalyticsCurrentPage(1);
    }
  }, [templateResponseDetails, dateFilter, departmentFilter, analyticsPageSize, analyticsCurrentPage]);

  // Helper to get filtered frequently evaluated employees
  const getFilteredFrequentlyEvaluatedEmployees = () => {
    return filterFrequentlyEvaluatedEmployees(
      templateResponseDetails?.frequently_evaluated_employees || [],
      departmentFilter,
      templateResponseDetails?.individual_responses || [],
      dateFilter
    );
  };

  // Helper to get paginated employees for Respondents tab
  const getPaginatedRespondents = () => {
    const startIndex = (respondentsCurrentPage - 1) * respondentsPageSize;
    const endIndex = startIndex + respondentsPageSize;
    return filteredEmployees.slice(startIndex, endIndex);
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

  const isValidCriterion = (criterion: any) => {
    if (!criterion) return false;
    const title = typeof criterion.title === 'string' ? criterion.title.trim() : '';
    return Boolean(title) && !/^untitled(\s+question)?$/i.test(title);
  };

  // Helper function to prepare question response data for horizontal bar charts
  const prepareQuestionResponseData = () => {
    // Always return questions from the template, regardless of filters
    if (!templateResponseDetails?.questions || !Array.isArray(templateResponseDetails.questions)) {
      return [];
    }

    const allCriteria: any[] = [];

    // Extract individual criteria from each section
    // IMPORTANT: Questions should ALWAYS show regardless of date/department filter
    // Only the employee scores within each question are filtered
    templateResponseDetails.questions.forEach((section: any, sectionIndex: number) => {
      if (!section || !section.criterion || !Array.isArray(section.criterion)) {
        return;
      }

      section.criterion.forEach((criterion: any, criterionIndex: number) => {
        if (!isValidCriterion(criterion)) {
          return;
        }

        // Get filtered scores (this is what gets filtered by date/department)
        const employeeScores = getEmployeeScoresForCriterionWrapper(section.id, criterionIndex);

        allCriteria.push({
          sectionId: section.id,
          sectionTitle: section.section_title || 'Untitled Section',
          criterionId: criterion.id,
          title: criterion.title.trim(),
          max_score: criterion.max_score,
          sectionIndex,
          criterionIndex,
          employeeScores: employeeScores // These scores are filtered, but question still shows
        });
      });
    });

    return allCriteria;
  };

  // Helper to get paginated questions for Questions tab
  const getPaginatedQuestions = () => {
    const allQuestions = prepareQuestionResponseData();
    const startIndex = (questionsCurrentPage - 1) * questionsPageSize;
    const endIndex = startIndex + questionsPageSize;
    return allQuestions.slice(startIndex, endIndex);
  };

  // Helper to get paginated analytics data
  const getPaginatedAnalytics = () => {
    const allEmployees = getFilteredFrequentlyEvaluatedEmployees();
    const startIndex = (analyticsCurrentPage - 1) * analyticsPageSize;
    const endIndex = startIndex + analyticsPageSize;
    return allEmployees.slice(startIndex, endIndex);
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
    <>
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
                            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                              <div className='relative'>
                                <CustomDatePicker
                                  id='modal-from-datepicker'
                                  placeholder='mm/dd/yyyy'
                                  className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
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
                              <p>to</p>
                              <div className='relative'>
                                <CustomDatePicker
                                  id='modal-to-datepicker'
                                  placeholder='mm/dd/yyyy'
                                  className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
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
                              filterGroups={filterGroups}
                              defaultValues={{ departments: departmentFilter }}
                              onFilterChange={handleDepartmentFilterChange}
                              showButtonText={true}
                              size="small"
                            />
                            <button
                              onClick={handlePrintClick}
                              disabled={isPrintGenerating || isLoadingTemplateDetails}
                              className='flex items-center justify-center bg-white text-black rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                              title='Print template response'
                            >
                              {isPrintGenerating ? (
                                <div className="animate-spin w-6 h-6">
                                  
                                </div>
                              ) : (
                                <div>
                                  <PrintIcon/>
                                  
                                </div>
                              )}
                            </button>
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
                            <div 
                              className='overflow-x-auto overflow-y-auto'
                              style={{
                                maxHeight: '500px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#2d3e58 #f1f1f1'
                              }}
                            >
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
                                  {getPaginatedRespondents().length > 0 ? (
                                    getPaginatedRespondents().map((employee: any, index: number) => (
                                      <tr key={index} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 text-sm font-medium text-gray-900 max-w-xs'>
                                          <div 
                                            className='truncate cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium' 
                                            title='Click to view full list of evaluators'
                                            onClick={() => handleRecipientsClick(
                                              employee.recipients || 'N/A',
                                              employee.name,
                                              employee.department
                                            )}
                                          >
                                            {employee.recipients || 'N/A'}
                                          </div>
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
                                    ))
                                  ) : (
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
                          <Pagination
                            pagination={respondentsPagination}
                            currentPage={respondentsCurrentPage}
                            pageSize={respondentsPageSize}
                            onPageSizeChange={handleRespondentsPageSizeChange}
                            onPageChange={handleRespondentsPaginationChange}
                          />
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
                          {getPaginatedQuestions().length > 0 ? (
                            <>
                              <div 
                                className='overflow-y-auto space-y-4'
                                style={{
                                  maxHeight: '500px',
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: '#2d3e58 #f1f1f1'
                                }}
                              >
                              {getPaginatedQuestions().map((criterion: any, index: number) => {
                                const questionId = `${criterion.sectionId}-${criterion.criterionIndex}`;
                                const isExpanded = expandedQuestions.has(questionId);
                                const globalIndex = (questionsCurrentPage - 1) * questionsPageSize + index;
                                
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
                                          {globalIndex + 1}. {criterion.title}
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
                                          <div className='text-center py-6 bg-gray-50 rounded'>
                                            <p className='text-sm text-gray-500 italic mb-1'>
                                              No scored responses available for this question
                                            </p>
                                            {(dateFilter.from || dateFilter.to || (departmentFilter && departmentFilter.length > 0)) && (
                                              <p className='text-xs text-gray-400'>
                                                Try adjusting your filters to see more responses
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              </div>
                              <Pagination
                                pagination={questionsPagination}
                                currentPage={questionsCurrentPage}
                                pageSize={questionsPageSize}
                                onPageSizeChange={handleQuestionsPageSizeChange}
                                onPageChange={handleQuestionsPaginationChange}
                              />
                            </>
                          ) : (
                            <div className='text-center py-8 bg-gray-50 rounded-lg'>
                              <p className='text-sm text-gray-500 italic mb-2'>
                                No evaluation questions found
                              </p>
                              <p className='text-xs text-gray-400'>
                                {templateResponseDetails?.questions 
                                  ? 'This template does not have any evaluation criteria configured'
                                  : 'Loading evaluation questions...'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'analytics' && (
                        <div className='space-y-6'>
                          <div>
                            <h4 className='text-lg font-semibold text-gray-900'>Analytics</h4>
                            {(dateFilter.from || dateFilter.to) && (
                              <p className='text-xs text-blue-600 mt-1'>
                                Showing analytics for filtered date range
                              </p>
                            )}
                          </div>
                          
                          {/* Frequently Evaluated Employees Pie Chart */}
                          <div className='bg-white border border-gray-200 rounded-lg p-6'>
                            <h5 className='text-lg font-medium text-gray-900 mb-4'>Frequently Evaluated Employees</h5>
                            {getFilteredFrequentlyEvaluatedEmployees().length > 0 ? (
                              <div className='h-80'>
                                <FrequentlyEvaluatedPieChart 
                                  frequentlyEvaluatedEmployees={getFilteredFrequentlyEvaluatedEmployees()}
                                />
                              </div>
                            ) : (
                              <div className='h-80 flex items-center justify-center'>
                                <div className='text-center'>
                                  <p className='text-sm text-gray-500 italic mb-1'>
                                    No employee data available
                                  </p>
                                  {(dateFilter.from || dateFilter.to) && (
                                    <p className='text-xs text-gray-400'>
                                      Try adjusting your date range to see more data
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Detailed Analytics Table */}
                          {getFilteredFrequentlyEvaluatedEmployees().length > 0 && (
                            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                              <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                                <h5 className='text-lg font-medium text-gray-900'>Employee Evaluation Details</h5>
                                <p className='text-sm text-gray-600 mt-1'>Detailed breakdown of employee evaluation frequency and performance</p>
                              </div>
                              <div 
                                className='overflow-x-auto overflow-y-auto'
                                style={{
                                  maxHeight: '500px',
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: '#2d3e58 #f1f1f1'
                                }}
                              >
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
                                    {getPaginatedAnalytics().length > 0 ? (
                                      getPaginatedAnalytics().map((employee: any, index: number) => (
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
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={4} className='px-6 py-4 text-center text-sm text-gray-500'>
                                          No employee evaluation data found
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <Pagination
                                pagination={analyticsPagination}
                                currentPage={analyticsCurrentPage}
                                pageSize={analyticsPageSize}
                                onPageSizeChange={handleAnalyticsPageSizeChange}
                                onPageChange={handleAnalyticsPaginationChange}
                              />
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
          {/* Recipients List Modal */}
      {selectedRecipients && (
      <RecipientsListModal
        isOpen={isRecipientsModalOpen}
        onClose={handleCloseRecipientsModal}
        recipients={selectedRecipients.recipients}
        employeeName={selectedRecipients.employeeName}
        department={selectedRecipients.department}
      />
    )}
        </div>
      </Dialog>
    </Transition.Root>

    
    </>
  );
};

export default EvaluationResponseDetailsModal;