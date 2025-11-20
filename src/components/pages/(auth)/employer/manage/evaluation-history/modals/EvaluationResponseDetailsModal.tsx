import { Dispatch, Fragment, useRef, useState, useEffect, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';

import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import CustomToast from '@/components/CustomToast';
import useFileforge from '@/components/hooks/useFileforge';

import RecipientsListModal from './RecipientsListModal';
import {
  getUniqueDepartments as getUniqueDepts,
  filterEmployeesByDateAndDepartment,
  filterFrequentlyEvaluatedEmployees,
  filterIndividualResponses,
  getEmployeeScoresForCriterion,
  getCriterionIdentifier,
  getSectionIdentifier,
  normalizeFormSections
} from '../helpers/evaluationHelpers';
import { handlePrintEvaluationTemplateResponse } from '../PrintData';
import useGetEvaluationTemplateDetails from '@/components/pages/(auth)/employer/train/evaluation/evaluation-template/hooks/useGetEvaluationTemplateDetails';
import useGetEvaluationResponseSummary from '../hooks/useGetEvaluationResponseSummary';
import useGetEvaluationResponseRespondents from '../hooks/useGetEvaluationResponseRespondents';
import useGetEvaluationResponseQuestions from '../hooks/useGetEvaluationResponseQuestions';
import useGetEvaluationResponseAnalytics from '../hooks/useGetEvaluationResponseAnalytics';

import { XCircleIcon } from '@heroicons/react/24/solid';


import { EvaluationResponseDetailsModalProps, TabType, SelectedRecipients } from '../types';

interface DateFilter {
  from: any;
  to: any;
}

interface PaginationState {
  totalRecords: number;
  totalPages: number;
}

// Components
import TemplateSummary from './components/evaluation-response-details/TemplateSummary';
import EvaluationFilters from './components/evaluation-response-details/EvaluationFilters';
import TabNavigation from './components/evaluation-response-details/TabNavigation';
import RespondentsTab from './components/evaluation-response-details/RespondentsTab';
import QuestionsTab from './components/evaluation-response-details/QuestionsTab';
import AnalyticsTab from './components/evaluation-response-details/AnalyticsTab';

const EvaluationResponseDetailsModal = ({
  isOpen,
  setIsOpen,
  selectedTemplate,
}: EvaluationResponseDetailsModalProps) => {
  const cancelButtonRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabType>('respondents');
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set<TabType>(['respondents']));
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    from: '',
    to: '',
  });
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  
  const templateId = selectedTemplate?.evaluation_template_id || null;
  
  // Always fetch summary (needed for header)
  const { 
    data: template, 
    isLoading: isLoadingSummary 
  } = useGetEvaluationResponseSummary(templateId, true);

  // Fetch tab data only when that tab has been visited (for better UX)
  const { 
    data: employeesResponded = [], 
    isLoading: isLoadingRespondents 
  } = useGetEvaluationResponseRespondents(
    templateId, 
    visitedTabs.has('respondents')
  );

  const { 
    data: individualResponses = [], 
    isLoading: isLoadingQuestions 
  } = useGetEvaluationResponseQuestions(
    templateId, 
    visitedTabs.has('questions')
  );

  const { 
    data: frequentlyEvaluatedEmployees = [], 
    isLoading: isLoadingAnalytics 
  } = useGetEvaluationResponseAnalytics(
    templateId, 
    visitedTabs.has('analytics')
  );

  // Combine data for backward compatibility
  const templateResponseDetails = {
    template,
    employees_responded: employeesResponded,
    individual_responses: individualResponses,
    frequently_evaluated_employees: frequentlyEvaluatedEmployees,
  };

  const isLoadingTemplateDetails = 
    isLoadingSummary || 
    (activeTab === 'respondents' && isLoadingRespondents) ||
    (activeTab === 'questions' && isLoadingQuestions) ||
    (activeTab === 'analytics' && isLoadingAnalytics);

  const {
    data: templateDefinition,
    refetch: refetchTemplateDefinition,
    remove: clearTemplateDefinition,
  } = useGetEvaluationTemplateDetails(templateId);

  // Pagination state for Respondents tab
  const [respondentsPageSize, setRespondentsPageSize] = useState(5);
  const [respondentsCurrentPage, setRespondentsCurrentPage] = useState(1);
  const [respondentsPagination, setRespondentsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Pagination state for Questions tab
  const [questionsPageSize, setQuestionsPageSize] = useState(5);
  const [questionsCurrentPage, setQuestionsCurrentPage] = useState(1);
  const [questionsPagination, setQuestionsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Pagination state for Analytics tab (Employee Evaluation Details)
  const [analyticsPageSize, setAnalyticsPageSize] = useState(5);
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1);
  const [analyticsPagination, setAnalyticsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Recipients modal state
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<SelectedRecipients | null>(null);

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
        individual_responses: getFilteredIndividualResponses(),
        // Use questions extracted from individual_responses instead of aggregated questions
        questions: extractQuestionsFromIndividualResponses
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

  // Handle tab change and track visited tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setVisitedTabs(prev => new Set<TabType>([...Array.from(prev), tab]));
  };

  const customCloseModal = () => {
    setDateFilter({ from: '', to: '' });
    setDepartmentFilter([]);
    setActiveTab('respondents');
    setVisitedTabs(new Set<TabType>(['respondents']));
    setExpandedQuestions(new Set());
    setRespondentsCurrentPage(1);
    setRespondentsPageSize(5);
    setQuestionsCurrentPage(1);
    setQuestionsPageSize(5);
    setAnalyticsCurrentPage(1);
    setAnalyticsPageSize(5);
    setIsRecipientsModalOpen(false);
    setSelectedRecipients(null);
    clearTemplateDefinition();
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
        allowEmpty: true
      }
    ];
  }, [templateResponseDetails]);

  useEffect(() => {
    if (isOpen?.open && selectedTemplate?.evaluation_template_id) {
      refetchTemplateDefinition();
    }
  }, [isOpen?.open, selectedTemplate?.evaluation_template_id, refetchTemplateDefinition]);

  const { activeCriterionIds, sectionTitleMap, criterionTitleMap } = useMemo(() => {
    if (!templateDefinition?.evaluation_criterion || !Array.isArray(templateDefinition.evaluation_criterion)) {
      return {
        activeCriterionIds: new Set<string>(),
        sectionTitleMap: new Map<string, { title?: string; description?: string }>(),
        criterionTitleMap: new Map<string, string>()
      };
    }

    const ids = new Set<string>();
    const sectionMap = new Map<string, { title?: string; description?: string }>();
    const criterionMap = new Map<string, string>();

    templateDefinition.evaluation_criterion.forEach((section: any) => {
      if (!section || !Array.isArray(section.criterion)) {
        return;
      }

      sectionMap.set(section.id, {
        title: section.section_title,
        description: section.section_description
      });

      section.criterion.forEach((criterion: any) => {
        if (criterion?.id) {
          ids.add(criterion.id);
          criterionMap.set(criterion.id, criterion.title);
        }
      });
    });

    return {
      activeCriterionIds: ids,
      sectionTitleMap: sectionMap,
      criterionTitleMap: criterionMap
    };
  }, [templateDefinition]);

  const resolveCriterionTitle = (criterion: any, criterionId?: string) => {
    const possibleTitles = [
      typeof criterion?.title === 'string' ? criterion.title : '',
      typeof criterion?.name === 'string' ? criterion.name : '',
      criterionId ? (criterionTitleMap.get(criterionId) || '') : ''
    ].filter(Boolean) as string[];

    if (possibleTitles.length === 0) {
      return '';
    }

    const resolved = possibleTitles.find(title => title && title.trim()) || '';
    return resolved.trim();
  };

  const isMeaningfulCriterionTitle = (title: string) => {
    if (!title) return false;
    return !/^untitled(\s+question)?$/i.test(title.trim());
  };

  // Helper function to extract unique questions from individual_responses
  // IMPORTANT: Extract from ALL responses (not filtered) so questions always show
  // Only the scores within questions are filtered by date/department
  const extractQuestionsFromIndividualResponses = useMemo(() => {
    const allResponses = templateResponseDetails?.individual_responses || [];
    if (!allResponses || allResponses.length === 0) {
      return [];
    }

    // Map to store unique sections by ID
    const sectionsMap = new Map<string, {
      id: string;
      section_title: string;
      section_description: string;
      criterion: Map<string, any>;
    }>();

    // Extract all unique sections and criteria from all form_data
    allResponses.forEach((response: any) => {
      const formData = normalizeFormSections(response.form_data || []);
      if (!Array.isArray(formData)) return;

      formData.forEach((section: any) => {
        const sectionId = getSectionIdentifier(section);
        if (!section || !sectionId) return;

        // Get or create section
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: sectionId,
            section_title: section.section_title || section.title || sectionTitleMap.get(sectionId)?.title || 'Untitled Section',
            section_description: section.section_description || section.description || sectionTitleMap.get(sectionId)?.description || '',
            criterion: new Map(),
          });
        }

        const sectionData = sectionsMap.get(sectionId)!;
        const criteriaList = section.criterion || [];
        
        if (!Array.isArray(criteriaList)) return;

        // Extract unique criteria from this section
        criteriaList.forEach((criterion: any) => {
          if (!criterion) return;

          const criterionId = getCriterionIdentifier(criterion);
          if (!criterionId) return;

          const criterionTitle = resolveCriterionTitle(criterion, criterionId);
          if (!isMeaningfulCriterionTitle(criterionTitle)) return;

          // Only add if not already exists or if we should show all criteria
          // Apply activeCriterionIds filter if available
          if (activeCriterionIds.size > 0 && !activeCriterionIds.has(criterionId)) {
            return;
          }

          // Get or create criterion (use the most complete version)
          if (!sectionData.criterion.has(criterionId)) {
            sectionData.criterion.set(criterionId, {
              id: criterionId,
              title: criterionTitle || 'Untitled',
              max_score: criterion.max_score || criterion.weight || criterion.maxScore || 0,
              type: criterion.type || 'rating',
            });
          } else {
            // Update if we have better data (non-empty title, non-zero max_score)
            const existing = sectionData.criterion.get(criterionId)!;
            if ((!existing.title || existing.title === 'Untitled') && criterionTitle) {
              existing.title = criterionTitle || existing.title;
            }
            if (existing.max_score === 0 && (criterion.max_score || criterion.weight || criterion.maxScore)) {
              existing.max_score = criterion.max_score || criterion.weight || criterion.maxScore || 0;
            }
          }
        });
      });
    });

    // Convert map to array structure
    const sections: any[] = [];
    sectionsMap.forEach((sectionData, sectionIndex) => {
      const criteria: any[] = [];
      let criterionIndex = 0;
      
      sectionData.criterion.forEach((criterion) => {
        criteria.push({
          ...criterion,
          criterionIndex: criterionIndex++,
        });
      });

      if (criteria.length > 0) {
        sections.push({
          ...sectionData,
          criterion: criteria,
          sectionIndex,
        });
      }
    });

    return sections;
  }, [templateResponseDetails?.individual_responses, activeCriterionIds, sectionTitleMap, criterionTitleMap]);

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

  // Helper to get filtered individual responses based on department and date
  const getFilteredIndividualResponses = () => {
    return filterIndividualResponses(
      templateResponseDetails?.individual_responses || [],
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
  };

  // Helper function to calculate employee scores for each criterion
  const getEmployeeScoresForCriterionWrapper = (sectionId: string, criterionId: string) => {
    const filteredResponses = getFilteredIndividualResponses();
    
    return getEmployeeScoresForCriterion(
      filteredResponses, 
      sectionId, 
      criterionId
    );
  };

  // Helper function to prepare question response data for horizontal bar charts
  const prepareQuestionResponseData = () => {
    // Use questions extracted from individual_responses instead of aggregated questions
    const questionsFromResponses = extractQuestionsFromIndividualResponses;
    
    if (!questionsFromResponses || questionsFromResponses.length === 0) {
      return [];
    }

    const allCriteria: any[] = [];

    // Extract individual criteria from each section
    // IMPORTANT: Questions should ALWAYS show regardless of date/department filter
    // Only the employee scores within each question are filtered
    questionsFromResponses.forEach((section: any) => {
      if (!section || !section.criterion || !Array.isArray(section.criterion)) {
        return;
      }

      section.criterion.forEach((criterion: any) => {
        if (!criterion || !criterion.id || !section?.id) {
          return;
        }

        const title = typeof criterion.title === 'string' ? criterion.title.trim() : '';
        if (!isMeaningfulCriterionTitle(title)) {
          return;
        }

        // Get filtered scores (this is what gets filtered by date/department)
        // Use criterion ID instead of index for more reliable matching
        const employeeScores = getEmployeeScoresForCriterionWrapper(section.id, criterion.id);

        allCriteria.push({
          sectionId: section.id,
          sectionTitle: section.section_title || 'Untitled Section',
          criterionId: criterion.id,
          title,
          max_score: criterion.max_score,
          sectionIndex: section.sectionIndex,
          criterionIndex: criterion.criterionIndex,
          employeeScores: employeeScores // These scores are filtered, but question still shows
        });
      });
    });

    return allCriteria;
  };

  // Helper to get filtered frequently evaluated employees
  const getFilteredFrequentlyEvaluatedEmployees = () => {
    return filterFrequentlyEvaluatedEmployees(
      templateResponseDetails?.frequently_evaluated_employees || [],
      departmentFilter,
      templateResponseDetails?.individual_responses || [],
      dateFilter
    );
  };

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
  }, [templateResponseDetails, dateFilter, departmentFilter, questionsPageSize, extractQuestionsFromIndividualResponses]);

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

  // Helper to get paginated employees for Respondents tab
  const getPaginatedRespondents = () => {
    const startIndex = (respondentsCurrentPage - 1) * respondentsPageSize;
    const endIndex = startIndex + respondentsPageSize;
    return filteredEmployees.slice(startIndex, endIndex);
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
                        <TemplateSummary template={templateResponseDetails?.template} />

                        {/* Filters */}
                        <EvaluationFilters
                          dateFilter={dateFilter}
                          setDateFilter={setDateFilter}
                          departmentFilter={departmentFilter}
                          filterGroups={filterGroups}
                          onDepartmentFilterChange={handleDepartmentFilterChange}
                          filteredCount={filteredEmployees.length}
                          totalCount={templateResponseDetails?.employees_responded?.length || 0}
                          onPrintClick={handlePrintClick}
                          isPrintGenerating={isPrintGenerating}
                          isLoadingTemplateDetails={isLoadingTemplateDetails}
                        />

                        {/* Tab Navigation */}
                        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

                        {/* Tab Content */}
                        {activeTab === 'respondents' && (
                          <RespondentsTab
                            paginatedRespondents={getPaginatedRespondents()}
                          pagination={respondentsPagination}
                          currentPage={respondentsCurrentPage}
                          pageSize={respondentsPageSize}
                          onPageChange={handleRespondentsPaginationChange}
                          onPageSizeChange={handleRespondentsPageSizeChange}
                            onRecipientsClick={handleRecipientsClick}
                            passingScore={templateResponseDetails?.template?.passing_score || 0}
                          />
                        )}

                        {activeTab === 'questions' && (
                          <QuestionsTab
                            paginatedQuestions={getPaginatedQuestions()}
                            allQuestions={prepareQuestionResponseData()}
                          pagination={questionsPagination}
                          currentPage={questionsCurrentPage}
                          pageSize={questionsPageSize}
                          onPageChange={handleQuestionsPaginationChange}
                          onPageSizeChange={handleQuestionsPageSizeChange}
                            dateFilter={dateFilter}
                            departmentFilter={departmentFilter}
                            templateResponseDetails={templateResponseDetails}
                          />
                        )}

                        {activeTab === 'analytics' && (
                          <AnalyticsTab
                            frequentlyEvaluatedEmployees={getFilteredFrequentlyEvaluatedEmployees()}
                            paginatedAnalytics={getPaginatedAnalytics()}
                          pagination={analyticsPagination}
                          currentPage={analyticsCurrentPage}
                          pageSize={analyticsPageSize}
                          onPageChange={handleAnalyticsPaginationChange}
                          onPageSizeChange={handleAnalyticsPageSizeChange}
                            dateFilter={dateFilter}
                            totalScore={templateResponseDetails?.template?.total_score || 1}
                          />
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
