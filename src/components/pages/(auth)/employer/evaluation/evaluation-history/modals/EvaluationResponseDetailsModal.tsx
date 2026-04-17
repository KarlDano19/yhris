import { Fragment, useRef, useState, useEffect, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';

import LoadingSpinner from '@/components/LoadingSpinner';

import { FilterGroup, FilterValues } from '@/components/common/Filter';
import CustomToast from '@/components/CustomToast';
import useFileforge from '@/components/hooks/useFileforge';

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
import useGetEvaluationTemplateDetails from '@/components/pages/(auth)/employer/evaluation/evaluation-template/hooks/useGetEvaluationTemplateDetails';
import useGetEvaluationResponseRespondents from '../hooks/useGetEvaluationResponseRespondents';
import useGetEvaluationResponseQuestions from '../hooks/useGetEvaluationResponseQuestions';
import useGetEvaluationResponseAnalytics from '../hooks/useGetEvaluationResponseAnalytics';

import { XCircleIcon } from '@heroicons/react/24/solid';


import { EvaluationResponseDetailsModalProps, TabType } from '../types';

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
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<{ from: any; to: any }>({
    from: '',
    to: '',
  });
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const initializedDepartmentsRef = useRef<number | null>(null);
  
  // Pagination state for all tabs
  const [respondentsPageSize, setRespondentsPageSize] = useState(5);
  const [respondentsCurrentPage, setRespondentsCurrentPage] = useState(1);
  const [respondentsPagination, setRespondentsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });
  
  const [questionsPageSize, setQuestionsPageSize] = useState(5);
  const [questionsCurrentPage, setQuestionsCurrentPage] = useState(1);
  const [questionsPagination, setQuestionsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });
  
  const [analyticsPageSize, setAnalyticsPageSize] = useState(5);
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1);
  const [analyticsPagination, setAnalyticsPagination] = useState<PaginationState>({
    totalPages: 1,
    totalRecords: 0,
  });
  
  const templateId = selectedTemplate?.evaluation_template_id || null;
  
  /**
   * Creates pagination handlers for a tab.
   * @param setCurrentPage - Function to set the current page number
   * @param setPageSize - Function to set the page size
   * @returns Object containing handlePageChange and handlePageSizeChange handlers
   */
  const createPaginationHandlers = (
    setCurrentPage: (page: number) => void,
    setPageSize: (size: number) => void
  ) => ({
    handlePageChange: (event: any) => setCurrentPage(event.selected + 1),
    handlePageSizeChange: (value: number) => {
      setCurrentPage(1);
      setPageSize(value);
    },
  });
  
  const respondentsPaginationHandlers = createPaginationHandlers(
    setRespondentsCurrentPage,
    setRespondentsPageSize
  );
  const questionsPaginationHandlers = createPaginationHandlers(
    setQuestionsCurrentPage,
    setQuestionsPageSize
  );
  const analyticsPaginationHandlers = createPaginationHandlers(
    setAnalyticsCurrentPage,
    setAnalyticsPageSize
  );
  
  // Fetch respondents tab data (includes template summary to avoid redundant API calls)
  // Always fetch since it contains the summary needed for header, even if tab hasn't been visited yet
  const { 
    data: respondentsData, 
    isLoading: isLoadingRespondents,
    refetch: refetchRespondents
  } = useGetEvaluationResponseRespondents(
    templateId, 
    {
      pageSize: respondentsPageSize,
      currentPage: respondentsCurrentPage,
      dateFilter: {
        from: dateFilter.from || undefined,
        to: dateFilter.to || undefined,
      }
    },
    true // Always enabled since it provides summary data for the header
  );
  
  // Extract template summary and employees from respondents response
  const template = respondentsData?.template_summary || null;
  
  /**
   * Memoized employees responded array to prevent new array reference on every render.
   */
  const employeesResponded = useMemo(() => 
    respondentsData?.employees_responded || [], 
    [respondentsData?.employees_responded]
  );
  
  /**
   * Updates pagination state for Respondents tab from backend response.
   */
  useEffect(() => {
    if (respondentsData) {
      setRespondentsPagination({
        totalRecords: respondentsData.total_records || 0,
        totalPages: respondentsData.total_pages || 0
      });
    }
  }, [respondentsData]);

  const { 
    data: questionsData, 
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions
  } = useGetEvaluationResponseQuestions(
    templateId, 
    visitedTabs.has('questions'),
    {
      pageSize: questionsPageSize,
      currentPage: questionsCurrentPage,
      dateFilter: {
        from: dateFilter.from || undefined,
        to: dateFilter.to || undefined,
      }
    }
  );
  
  /**
   * Memoized sections data to prevent new array reference on every render.
   */
  const sectionsData = useMemo(() => 
    questionsData?.sections || [], 
    [questionsData?.sections]
  );

  const { 
    data: analyticsData, 
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics
  } = useGetEvaluationResponseAnalytics(
    templateId, 
    visitedTabs.has('analytics'),
    {
      pageSize: analyticsPageSize,
      currentPage: analyticsCurrentPage,
      dateFilter: {
        from: dateFilter.from || undefined,
        to: dateFilter.to || undefined,
      }
    }
  );
  
  /**
   * Memoized frequently evaluated employees array to prevent new array reference on every render.
   */
  const frequentlyEvaluatedEmployees = useMemo(() => 
    analyticsData?.frequently_evaluated_employees || [], 
    [analyticsData?.frequently_evaluated_employees]
  );
  
  /**
   * Memoized analytics chart data containing ALL employees with evaluation counts for chart visualization.
   */
  const analyticsChartData = useMemo(() => 
    analyticsData?.analytics_chart_data || [], 
    [analyticsData?.analytics_chart_data]
  );

  /**
   * Memoized template response details object combining all data sources.
   * Memoized to prevent infinite loops in useEffects that depend on this object.
   */
  const templateResponseDetails = useMemo(() => ({
    template,
    employees_responded: employeesResponded,
    sections: sectionsData, // New backend format with merged questions
    individual_responses: [], // Empty for now, will be populated if needed for legacy code
    frequently_evaluated_employees: frequentlyEvaluatedEmployees,
  }), [template, employeesResponded, sectionsData, frequentlyEvaluatedEmployees]);

  // Loading state: always check respondents since it provides summary for header
  // Also check active tab's loading state
  const isLoadingTemplateDetails = 
    isLoadingRespondents || // Always check since it provides summary
    (activeTab === 'questions' && isLoadingQuestions) ||
    (activeTab === 'analytics' && isLoadingAnalytics);

  const {
    data: templateDefinition,
    refetch: refetchTemplateDefinition,
    remove: clearTemplateDefinition,
  } = useGetEvaluationTemplateDetails(templateId);


  // Fileforge hook for PDF generation
  const { generatePDFLocally, isGenerating: isPrintGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {

      toast.custom(() => <CustomToast message='Failed to generate PDF.' type='error' />, { duration: 3000 });
    },
  });

  /**
   * Handles the print button click event.
   * Fetches all data (unpaginated) for the current template and generates a PDF.
   * Applies date and department filters to the printed data.
   */
  const handlePrintClick = async () => {
    if (!templateId) {
      toast.custom(() => <CustomToast message='No template data available to print.' type='error' />, { duration: 3000 });
      return;
    }

    try {
      // Fetch ALL data (not paginated) for printing
      const token = getCookie('token');
      const queryParams = new URLSearchParams();

      // Add date filter parameters if provided
      if (dateFilter.from) {
        const fromDate = dateFilter.from instanceof Date 
          ? dateFilter.from.toLocaleDateString('en-CA') 
          : dateFilter.from;
        queryParams.append('dateFrom', fromDate);
      }
      if (dateFilter.to) {
        const toDate = dateFilter.to instanceof Date 
          ? dateFilter.to.toLocaleDateString('en-CA') 
          : dateFilter.to;
        queryParams.append('dateTo', toDate);
      }

      const config: RequestInit = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };

      // Fetch all respondents (no pagination - don't send pageSize/currentPage to get all data)
      const respondentsUrl = queryParams.toString() 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/respondents/?${queryParams.toString()}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/respondents/`;
      const respondentsResponse = await fetch(respondentsUrl, config);
      const respondentsData = await respondentsResponse.json();
      // Backend returns all data when no pagination params are sent
      const allRespondents = respondentsData?.data?.employees_responded || respondentsData?.employees_responded || [];
      const templateSummary = respondentsData?.data?.template_summary || respondentsData?.template_summary || template;

      // Fetch all questions (no pagination - don't send pageSize/currentPage to get all data)
      const questionsUrl = queryParams.toString()
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/questions/?${queryParams.toString()}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/questions/`;
      const questionsResponse = await fetch(questionsUrl, config);
      const questionsData = await questionsResponse.json();
      // Backend returns all sections when no pagination params are sent
      const allSections = questionsData?.data?.sections || questionsData?.sections || [];

      // Fetch all analytics (no pagination - don't send pageSize/currentPage to get all data)
      const analyticsUrl = queryParams.toString()
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/analytics/?${queryParams.toString()}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${templateId}/responses/analytics/`;
      const analyticsResponse = await fetch(analyticsUrl, config);
      const analyticsData = await analyticsResponse.json();
      // Backend returns all employees when no pagination params are sent
      const allAnalyticsEmployees = analyticsData?.data?.frequently_evaluated_employees || analyticsData?.frequently_evaluated_employees || [];

      // Apply department filter to all data
      const filteredRespondents = applyDepartmentFilter(allRespondents);
      const filteredAnalytics = applyDepartmentFilter(allAnalyticsEmployees);

      // Prepare print data with ALL records (not paginated)
      const printTemplateData = {
        template: templateSummary,
        employees_responded: filteredRespondents,
        sections: allSections, // Use sections from backend (new format)
        questions: allSections, // Also provide as questions for compatibility
        frequently_evaluated_employees: filteredAnalytics,
        individual_responses: [] // Not needed for new format
      };

      // Prepare date filter for printing
      const printDateFilter = dateFilter.from || dateFilter.to
        ? {
            from: dateFilter.from ? dateFilter.from.toLocaleDateString('en-CA') : '',
            to: dateFilter.to ? dateFilter.to.toLocaleDateString('en-CA') : '',
          }
        : undefined;

      await handlePrintEvaluationTemplateResponse(
        generatePDFLocally,
        printTemplateData,
        printDateFilter,
        departmentFilter
      );
    } catch (error) {
      toast.custom(() => <CustomToast message='Failed to generate PDF.' type='error' />, { duration: 3000 });
    }
  };

  /**
   * Handles tab change and tracks visited tabs for lazy loading.
   * @param tab - The tab type to switch to
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setVisitedTabs(prev => new Set<TabType>([...Array.from(prev), tab]));
  };

  /**
   * Closes the modal and resets all state to initial values.
   * Clears filters, pagination, expanded questions, and template definition cache.
   */
  const customCloseModal = () => {
    setDepartmentFilter([]);
    setDateFilter({ from: '', to: '' });
    setActiveTab('respondents');
    setVisitedTabs(new Set<TabType>(['respondents']));
    setExpandedQuestions(new Set());
    // Reset pagination for all tabs
    setRespondentsCurrentPage(1);
    setRespondentsPageSize(5);
    setQuestionsCurrentPage(1);
    setQuestionsPageSize(5);
    setAnalyticsCurrentPage(1);
    setAnalyticsPageSize(5);
    initializedDepartmentsRef.current = null;
    clearTemplateDefinition();
    setIsOpen(null);
  };

  /**
   * Toggles the expansion state of a question in the Questions tab.
   * @param questionId - The unique identifier of the question to toggle
   */
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.has(questionId) ? newSet.delete(questionId) : newSet.add(questionId);
      return newSet;
    });
  };

  /**
   * Prepares filter groups for the Filter component used in EvaluationFilters.
   * Note: Filter component is rendered in EvaluationFilters, but filter logic stays in modal
   * because it needs access to modal state (employeesResponded, departmentFilter).
   * Memoized based on employees_responded directly to avoid circular dependencies.
   * @returns Array of filter groups with department options
   */
  const filterGroups: FilterGroup[] = useMemo(() => {
    const departments = getUniqueDepts(employeesResponded);
    return [
      {
        id: 'departments',
        title: 'Department',
        options: departments.map(dept => ({ label: dept, value: dept })),
        multiSelect: true,
        allowEmpty: true
      }
    ];
  }, [employeesResponded]);

  // Track previous template ID to detect changes
  const prevTemplateIdRef = useRef<number | null>(null);
  
  /**
   * Resets state when template changes or modal opens.
   * Note: React Query automatically refetches when templateId changes, so we don't need manual refetches.
   */
  useEffect(() => {
    if (isOpen?.open && selectedTemplate?.evaluation_template_id) {
      const currentTemplateId = selectedTemplate.evaluation_template_id;
      const isNewTemplate = prevTemplateIdRef.current !== currentTemplateId;
      
      if (isNewTemplate) {
        // Reset state when template changes
        setDepartmentFilter([]);
        setDateFilter({ from: '', to: '' });
        setActiveTab('respondents');
        setVisitedTabs(new Set<TabType>(['respondents']));
        setExpandedQuestions(new Set());
        setRespondentsCurrentPage(1);
        setQuestionsCurrentPage(1);
        setAnalyticsCurrentPage(1);
        initializedDepartmentsRef.current = null;
        
        // Update ref to current template ID
        prevTemplateIdRef.current = currentTemplateId;
        
        // Only refetch template definition (not used by React Query hooks)
        // React Query will automatically refetch respondents (which includes summary), etc. when templateId changes
        refetchTemplateDefinition();
      }
    } else if (!isOpen?.open) {
      // Reset ref when modal closes
      prevTemplateIdRef.current = null;
    }
  }, [
    isOpen?.open, 
    selectedTemplate?.evaluation_template_id, 
    refetchTemplateDefinition
    // Note: Removed refetch functions from dependencies to prevent double-fetching
    // React Query handles refetching automatically when templateId changes
  ]);

  /**
   * Builds maps of criterion IDs, section titles, and criterion titles from template definition.
   * Used for resolving titles and matching criteria between form data and template definition.
   * @returns Object containing activeCriterionIds Set, sectionTitleMap, criterionTitleMap, and criterionTitleToTitleMap
   */
  const { activeCriterionIds, sectionTitleMap, criterionTitleMap, criterionTitleToTitleMap } = useMemo(() => {
    if (!templateDefinition?.evaluation_criterion || !Array.isArray(templateDefinition.evaluation_criterion)) {
      return {
        activeCriterionIds: new Set<string>(),
        sectionTitleMap: new Map<string, { title?: string; description?: string }>(),
        criterionTitleMap: new Map<string, string>(),
        criterionTitleToTitleMap: new Map<string, string>() // Title-based lookup for criteria without IDs
      };
    }

    const ids = new Set<string>();
    const sectionMap = new Map<string, { title?: string; description?: string }>();
    const criterionMap = new Map<string, string>();
    const titleToTitleMap = new Map<string, string>(); // Normalized title -> original title mapping

    templateDefinition.evaluation_criterion.forEach((section: any) => {
      if (!section || !Array.isArray(section.criterion)) {
        return;
      }

      sectionMap.set(section.id, {
        title: section.section_title,
        description: section.section_description
      });

      section.criterion.forEach((criterion: any) => {
        const criterionTitle = criterion?.title || criterion?.name || '';
        
        // Map by ID if available
        if (criterion?.id) {
          ids.add(criterion.id);
          criterionMap.set(criterion.id, criterionTitle);
        }
        
        // Also map by normalized title for criteria without IDs
        // This allows us to match criteria by title even when IDs are missing
        if (criterionTitle && criterionTitle.trim()) {
          const normalizedTitle = criterionTitle.trim().toLowerCase();
          titleToTitleMap.set(normalizedTitle, criterionTitle);
        }
      });
    });

    return {
      activeCriterionIds: ids,
      sectionTitleMap: sectionMap,
      criterionTitleMap: criterionMap,
      criterionTitleToTitleMap: titleToTitleMap
    };
  }, [templateDefinition]);

  /**
   * Resolves the title for a criterion by checking multiple sources.
   * Tries form data first, then template definition, with fallback to title-based lookup.
   * @param criterion - The criterion object from form data
   * @param criterionId - Optional criterion ID for template definition lookup
   * @returns The resolved title string, or empty string if not found
   */
  const resolveCriterionTitle = (criterion: any, criterionId?: string) => {
    const possibleTitles = [
      typeof criterion?.title === 'string' ? criterion.title : '',
      typeof criterion?.name === 'string' ? criterion.name : '',
      criterionId ? (criterionTitleMap.get(criterionId) || '') : ''
    ].filter(Boolean) as string[];

    // If we still don't have a title and the criterion has a title, try title-based lookup
    // This helps when criteria don't have IDs in the template definition
    if (possibleTitles.length === 0 && criterion?.title) {
      const normalizedTitle = criterion.title.trim().toLowerCase();
      const templateTitle = criterionTitleToTitleMap.get(normalizedTitle);
      if (templateTitle) {
        possibleTitles.push(templateTitle);
      }
    }

    if (possibleTitles.length === 0) {
      return '';
    }

    const resolved = possibleTitles.find(title => title && title.trim()) || '';
    return resolved.trim();
  };

  /**
   * Checks if a criterion title is meaningful (not empty or "untitled").
   * @param title - The title string to check
   * @returns True if the title is meaningful, false otherwise
   */
  const isMeaningfulCriterionTitle = (title: string) => {
    if (!title) return false;
    return !/^untitled(\s+question)?$/i.test(title.trim());
  };

  /**
   * Extracts unique questions from sections (new backend format) or individual_responses (legacy).
   * IMPORTANT: Extracts from ALL responses (not filtered) so questions always show.
   * Only the scores within questions are filtered by date/department.
   * @returns Array of sections with their criteria and responses
   */
  const extractQuestionsFromIndividualResponses = useMemo(() => {
    // Prefer sections from backend (new format) if available
    const backendSections = templateResponseDetails?.sections || [];
    if (backendSections && backendSections.length > 0) {
      // Backend already provides merged sections with criterion
      // Transform to expected format
      return backendSections.map((section: any, sectionIndex: number) => ({
        id: `section-${section.section_index}`,
        section_title: section.section_title,
        section_description: section.section_description,
        sectionIndex: section.section_index,
        criterion: (section.criterion || []).map((criterion: any, criterionIndex: number) => ({
          id: `criterion-${section.section_index}-${criterion.criterion_index}`,
          title: criterion.title,
          max_score: criterion.max_score,
          criterionIndex: criterion.criterion_index,
          responses: criterion.responses || [] // Include responses for filtering
        }))
      }));
    }
    
    // Fallback to old format (individual_responses)
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
        // Use index as part of ID to differentiate questions with same title
        criteriaList.forEach((criterion: any, criterionIndex: number) => {
          if (!criterion) return;

          let criterionId = getCriterionIdentifier(criterion);
          
          // If no ID could be generated, create one using index
          if (!criterionId) {
            criterionId = `criterion-${sectionId}-${criterionIndex}`;
          }
          
          // Check if this ID already exists - if so, it might be a duplicate title
          // Use index to make it unique so all questions are shown
          const baseCriterionId = criterionId;
          let uniqueCriterionId = baseCriterionId;
          let attempt = 0;
          
          // If the ID already exists, append index to make it unique
          // This ensures all questions are shown even if they have identical titles
          while (sectionData.criterion.has(uniqueCriterionId) && attempt < 100) {
            uniqueCriterionId = `${baseCriterionId}-${criterionIndex}-${attempt}`;
            attempt++;
          }
          
          criterionId = uniqueCriterionId;

          // Resolve title - try form_data first, then template definition
          let criterionTitle = resolveCriterionTitle(criterion, criterionId);
          
          // If title is empty or "untitled", try to get it from template definition
          if (!criterionTitle || !isMeaningfulCriterionTitle(criterionTitle)) {
            // First try ID-based lookup
            const templateTitle = criterionTitleMap.get(criterionId);
            if (templateTitle && isMeaningfulCriterionTitle(templateTitle)) {
              criterionTitle = templateTitle;
            } else {
              // Fallback to title-based lookup (for criteria without IDs)
              const formTitle = criterion?.title || criterion?.name;
              if (formTitle) {
                const normalizedFormTitle = formTitle.trim().toLowerCase();
                const titleBasedTemplateTitle = criterionTitleToTitleMap.get(normalizedFormTitle);
                if (titleBasedTemplateTitle && isMeaningfulCriterionTitle(titleBasedTemplateTitle)) {
                  criterionTitle = titleBasedTemplateTitle;
                }
              }
            }
          }

          // Use a fallback title if we still don't have a meaningful title
          if (!criterionTitle || !isMeaningfulCriterionTitle(criterionTitle)) {
            criterionTitle = `Question ${criterionId}`;
          }

          // Don't filter by activeCriterionIds - show all questions that were actually answered
          // The form_data is the source of truth for what questions exist in responses
          // Even if the template definition doesn't have this criterion, if it was answered, show it

          // Get or create criterion (use the most complete version)
          if (!sectionData.criterion.has(criterionId)) {
            sectionData.criterion.set(criterionId, {
              id: criterionId,
              title: criterionTitle,
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
  }, [templateResponseDetails?.sections, templateResponseDetails?.individual_responses, activeCriterionIds, sectionTitleMap, criterionTitleMap]);

  /**
   * Handles department filter changes from the Filter component in EvaluationFilters.
   * This callback is passed to EvaluationFilters which renders the Filter component.
   * Updates the departmentFilter state in the modal.
   * @param filters - Filter values object containing departments array
   */
  const handleDepartmentFilterChange = (filters: FilterValues) => {
    setDepartmentFilter(filters.departments || []);
  };

  /**
   * Generic helper function to filter items by department.
   * Used throughout the modal to apply department filtering to various data sets.
   * The departmentFilter state is managed in the modal and updated via handleDepartmentFilterChange
   * when the Filter component (rendered in EvaluationFilters) changes.
   * Returns all items if no department filter is applied.
   * @param items - Array of items with department property
   * @returns Filtered array of items matching the department filter
   */
  const applyDepartmentFilter = <T extends { department: string }>(items: T[]): T[] => {
    if (departmentFilter.length === 0) return items;
    return items.filter(item => departmentFilter.includes(item.department));
  };

  /**
   * Filters employees based on department (used for print functionality).
   * Sorts by date_completed in descending order (newest first).
   */
  useEffect(() => {
    const filtered = applyDepartmentFilter(templateResponseDetails?.employees_responded || []);
    // Sort by date_completed in descending order (newest first)
    const sorted = filtered.sort((a: any, b: any) => {
      if (!a.date_completed) return 1;
      if (!b.date_completed) return -1;
      return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
    });
    setFilteredEmployees(sorted);
  }, [templateResponseDetails, departmentFilter]);

  /**
   * Initializes department filter with all departments when template response details change.
   * Uses ref to track which template we've initialized to prevent infinite loops.
   */
  useEffect(() => {
    if (employeesResponded && 
        employeesResponded.length > 0 &&
        template?.id &&
        initializedDepartmentsRef.current !== template.id) {
      const allDepartments = getUniqueDepts(employeesResponded);
      // Only update if departments have actually changed
      setDepartmentFilter(prev => {
        const prevStr = JSON.stringify([...prev].sort());
        const newStr = JSON.stringify([...allDepartments].sort());
        if (prevStr !== newStr) {
          return allDepartments;
        }
        return prev;
      });
      initializedDepartmentsRef.current = template.id;
    }
  }, [template?.id, employeesResponded]);

  /**
   * Resets pagination to page 1 for all tabs when date filter changes.
   */
  useEffect(() => {
    setRespondentsCurrentPage(1);
    setQuestionsCurrentPage(1);
    setAnalyticsCurrentPage(1);
  }, [dateFilter.from, dateFilter.to]);

  /**
   * Gets filtered individual responses based on department and date filters.
   * @returns Filtered array of individual evaluation responses
   */
  const getFilteredIndividualResponses = () => {
    return filterIndividualResponses(
      templateResponseDetails?.individual_responses || [],
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
  };

  /**
   * Calculates employee scores for a specific criterion.
   * Filters responses by date and department, then aggregates scores by employee.
   * @param sectionId - The section identifier (e.g., "section-0")
   * @param criterionId - The criterion identifier (e.g., "criterion-0-1")
   * @returns Array of employee score objects with name, scores array, and averageScore
   */
  const getEmployeeScoresForCriterionWrapper = (sectionId: string, criterionId: string) => {
    // If we have sections (new backend format), extract scores directly
    const backendSections = templateResponseDetails?.sections || [];
    if (backendSections && backendSections.length > 0) {
      // Extract section_index and criterion_index from IDs
      const sectionMatch = sectionId.match(/section-(\d+)/);
      const criterionMatch = criterionId.match(/criterion-(\d+)-(\d+)/);
      
      if (sectionMatch && criterionMatch) {
        const sectionIndex = parseInt(sectionMatch[1]);
        const criterionIndex = parseInt(criterionMatch[2]);
        
        // Find the section and criterion
        const section = backendSections.find((s: any) => s.section_index === sectionIndex);
        if (section && section.criterion) {
          const criterion = section.criterion.find((c: any) => c.criterion_index === criterionIndex);
            if (criterion && criterion.responses) {
              // Filter responses by date and department
              let filteredResponses = criterion.responses.filter((response: any) => {
                // Filter by date
                if (dateFilter.from || dateFilter.to) {
                  if (!response.date_of_evaluation) return false;
                  const responseDate = new Date(response.date_of_evaluation);
                  if (dateFilter.from) {
                    const fromDate = new Date(dateFilter.from);
                    fromDate.setHours(0, 0, 0, 0);
                    if (responseDate < fromDate) return false;
                  }
                  if (dateFilter.to) {
                    const toDate = new Date(dateFilter.to);
                    toDate.setHours(23, 59, 59, 999);
                    if (responseDate > toDate) return false;
                  }
                }
                
                // Filter by department
                if (departmentFilter && departmentFilter.length > 0) {
                  if (!departmentFilter.includes(response.department)) return false;
                }
                
                return true;
              });
            
            // Transform to expected format
            const employeeScoresMap: { [key: string]: { name: string; scores: number[]; averageScore: number } } = {};
            
            filteredResponses.forEach((response: any) => {
              const employeeName = response.employee_name;
              const score = typeof response.form_total_score === 'number' ? response.form_total_score : parseFloat(response.form_total_score || 0);
              
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
            
            // Calculate averages
            return Object.values(employeeScoresMap).map(employee => {
              if (employee.scores.length > 0) {
                employee.averageScore = employee.scores.reduce((sum, score) => sum + score, 0) / employee.scores.length;
              }
              return employee;
            });
          }
        }
      }
      
      return [];
    }
    
    // Fallback to old format
    const filteredResponses = getFilteredIndividualResponses();
    return getEmployeeScoresForCriterion(
      filteredResponses, 
      sectionId, 
      criterionId
    );
  };

  /**
   * Prepares question response data for horizontal bar charts.
   * Extracts all criteria from sections and calculates employee scores for each.
   * Questions always show regardless of filters; only scores are filtered.
   * @returns Array of criterion objects with employee scores for charting
   */
  const prepareQuestionResponseData = useMemo(() => {
    // Use questions extracted from individual_responses instead of aggregated questions
    const questionsFromResponses = extractQuestionsFromIndividualResponses;
    
    if (!questionsFromResponses || questionsFromResponses.length === 0) {
      return [];
    }

    const allCriteria: any[] = [];

        // Extract individual criteria from each section
        // IMPORTANT: Questions should ALWAYS show regardless of department filter
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
        // Use criterion ID for matching
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
  }, [extractQuestionsFromIndividualResponses, departmentFilter, dateFilter, templateResponseDetails?.sections]);

  /**
   * Gets filtered frequently evaluated employees based on department and date filters.
   * Memoized to prevent unnecessary recalculations.
   * @returns Filtered array of frequently evaluated employees
   */
  const getFilteredFrequentlyEvaluatedEmployees = useMemo(() => {
    return filterFrequentlyEvaluatedEmployees(
      templateResponseDetails?.frequently_evaluated_employees || [],
      departmentFilter,
      templateResponseDetails?.individual_responses || [],
      dateFilter
    );
  }, [templateResponseDetails?.frequently_evaluated_employees, departmentFilter, dateFilter, templateResponseDetails?.individual_responses]);

  /**
   * Updates pagination state for Questions tab from backend response.
   */
  useEffect(() => {
    if (questionsData) {
      setQuestionsPagination({
        totalRecords: questionsData.total_records || 0,
        totalPages: questionsData.total_pages || 1
      });
    }
  }, [questionsData]);

  /**
   * Updates pagination state for Analytics tab from backend response.
   */
  useEffect(() => {
    if (analyticsData) {
      setAnalyticsPagination({
        totalRecords: analyticsData.total_records || 0,
        totalPages: analyticsData.total_pages || 1
      });
    }
  }, [analyticsData]);

  /**
   * Gets filtered and paginated employees for Respondents tab.
   * Note: Backend handles pagination; we only apply department filter on frontend.
   * @returns Filtered and sorted array of employee responses
   */
  const getPaginatedRespondents = useMemo(() => {
    const filtered = applyDepartmentFilter([...employeesResponded]);
    // Sort by date_completed in descending order (newest first)
    return filtered.sort((a: any, b: any) => {
      if (!a.date_completed) return 1;
      if (!b.date_completed) return -1;
      return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
    });
  }, [employeesResponded, departmentFilter]);

  /**
   * Gets paginated questions for Questions tab.
   * Backend handles pagination; we transform sections to the format expected by QuestionsTab.
   * Applies department filter to employee scores within each question.
   * @returns Array of criterion objects formatted for QuestionsTab component
   */
  const getPaginatedQuestions = useMemo(() => {
    // Use sections from backend (already paginated)
    const backendSections = sectionsData || [];
    
    if (!backendSections || backendSections.length === 0) {
      return [];
    }

    const allCriteria: any[] = [];

    // Extract individual criteria from each section
    backendSections.forEach((section: any) => {
      if (!section || !section.criterion || !Array.isArray(section.criterion)) {
        return;
      }

      section.criterion.forEach((criterion: any) => {
        if (!criterion) {
          return;
        }

        const title = typeof criterion.title === 'string' ? criterion.title.trim() : '';
        if (!isMeaningfulCriterionTitle(title)) {
          return;
        }

        // Get filtered scores (this is what gets filtered by date/department)
        const sectionId = `section-${section.section_index}`;
        const criterionId = `criterion-${section.section_index}-${criterion.criterion_index}`;
        const employeeScores = getEmployeeScoresForCriterionWrapper(sectionId, criterionId);

        allCriteria.push({
          sectionId,
          sectionTitle: section.section_title || 'Untitled Section',
          criterionId,
          title,
          max_score: criterion.max_score,
          sectionIndex: section.section_index,
          criterionIndex: criterion.criterion_index,
          employeeScores: employeeScores // These scores are filtered, but question still shows
        });
      });
    });

    return allCriteria;
  }, [sectionsData, departmentFilter]);

  /**
   * Gets paginated analytics data for Analytics tab.
   * Backend handles pagination; we only apply department filter on frontend.
   * @returns Filtered array of frequently evaluated employees
   */
  const getPaginatedAnalytics = useMemo(() => {
    return applyDepartmentFilter(frequentlyEvaluatedEmployees || []);
  }, [frequentlyEvaluatedEmployees, departmentFilter]);

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
                          departmentFilter={departmentFilter}
                          filterGroups={filterGroups}
                          onDepartmentFilterChange={handleDepartmentFilterChange}
                          dateFilter={dateFilter}
                          onDateFilterChange={setDateFilter}
                          filteredCount={getPaginatedRespondents.length}
                          totalCount={respondentsData?.total_records || 0}
                          onPrintClick={handlePrintClick}
                          isPrintGenerating={isPrintGenerating}
                          isLoadingTemplateDetails={isLoadingTemplateDetails}
                        />

                        {/* Tab Navigation */}
                        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

                        {/* Tab Content */}
                        {activeTab === 'respondents' && (
                          <RespondentsTab
                            paginatedRespondents={getPaginatedRespondents}
                            pagination={respondentsPagination}
                            currentPage={respondentsCurrentPage}
                            pageSize={respondentsPageSize}
                            onPageChange={respondentsPaginationHandlers.handlePageChange}
                            onPageSizeChange={respondentsPaginationHandlers.handlePageSizeChange}
                            passingScore={templateResponseDetails?.template?.passing_score || 0}
                            totalScore={templateResponseDetails?.template?.total_score || 0}
                          />
                        )}

                        {activeTab === 'questions' && (
                          <QuestionsTab
                            paginatedQuestions={getPaginatedQuestions}
                            allQuestions={prepareQuestionResponseData}
                            pagination={questionsPagination}
                            currentPage={questionsCurrentPage}
                            pageSize={questionsPageSize}
                            onPageChange={questionsPaginationHandlers.handlePageChange}
                            onPageSizeChange={questionsPaginationHandlers.handlePageSizeChange}
                            departmentFilter={departmentFilter}
                            templateResponseDetails={templateResponseDetails}
                            totalScore={templateResponseDetails?.template?.total_score || 0}
                          />
                        )}

                        {activeTab === 'analytics' && (
                          <AnalyticsTab
                            frequentlyEvaluatedEmployees={analyticsChartData}
                            paginatedAnalytics={getPaginatedAnalytics}
                            pagination={analyticsPagination}
                            currentPage={analyticsCurrentPage}
                            pageSize={analyticsPageSize}
                            onPageChange={analyticsPaginationHandlers.handlePageChange}
                            onPageSizeChange={analyticsPaginationHandlers.handlePageSizeChange}
                            totalScore={templateResponseDetails?.template?.total_score || 0}
                            passingScore={templateResponseDetails?.template?.passing_score || 0}
                          />
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

    
    </>
  );
};

export default EvaluationResponseDetailsModal;
