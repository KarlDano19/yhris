import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import useFileforge from '@/components/hooks/useFileforge';
import RecipientsListModal from './RecipientsListModal';
import { handlePrintEvaluationTemplateResponse } from '../PrintData';
import useGetEvaluationTemplateDetails from '@/components/pages/(auth)/employer/train/evaluation/evaluation-template/hooks/useGetEvaluationTemplateDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

// Types
import { EvaluationResponseDetailsModalProps, TabType, SelectedRecipients } from './types';

// Hooks
import { usePagination } from './hooks/usePagination';
import { useEvaluationFilters } from './hooks/useEvaluationFilters';
import { useEvaluationData } from './hooks/useEvaluationData';

// Components
import TemplateSummary from '../tabs/components/TemplateSummary';
import EvaluationFilters from '../tabs/components/EvaluationFilters';
import TabNavigation from '../tabs/components/TabNavigation';
import RespondentsTab from '../tabs/components/respondents-tab/RespondentsTab';
import QuestionsTab from '../tabs/components/question-and-response-tab/QuestionsTab';
import AnalyticsTab from '../tabs/components/analytics-tab/AnalyticsTab';

const EvaluationResponseDetailsModal = ({
  isOpen,
  setIsOpen,
  selectedTemplate,
  templateResponseDetails,
  isLoadingTemplateDetails,
}: EvaluationResponseDetailsModalProps) => {
  const cancelButtonRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabType>('respondents');
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<SelectedRecipients | null>(null);

  const {
    data: templateDefinition,
    refetch: refetchTemplateDefinition,
    remove: clearTemplateDefinition,
  } = useGetEvaluationTemplateDetails(selectedTemplate?.evaluation_template_id || null);

  // Filters hook
  const {
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    filterGroups,
    handleDepartmentFilterChange,
    resetFilters,
  } = useEvaluationFilters({
    employeesResponded: templateResponseDetails?.employees_responded || [],
    templateResponseDetails,
  });

  // Data processing hook
  const {
    filteredEmployees,
    extractQuestionsFromIndividualResponses,
    getFilteredFrequentlyEvaluatedEmployees,
    getFilteredIndividualResponses,
    prepareQuestionResponseData,
  } = useEvaluationData({
    templateResponseDetails,
    templateDefinition,
    dateFilter,
    departmentFilter,
  });

  // Pagination hooks
  const respondentsPagination = usePagination({
    totalRecords: filteredEmployees.length,
    pageSize: 5,
  });

  const questionsPagination = usePagination({
    totalRecords: prepareQuestionResponseData().length,
    pageSize: 5,
  });

  const analyticsPagination = usePagination({
    totalRecords: getFilteredFrequentlyEvaluatedEmployees().length,
    pageSize: 5,
  });

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
      const printDateFilter = dateFilter.from || dateFilter.to
        ? {
            from: dateFilter.from ? dateFilter.from.toLocaleDateString('en-CA') : '',
            to: dateFilter.to ? dateFilter.to.toLocaleDateString('en-CA') : '',
          }
        : undefined;

      const filteredTemplateData = {
        ...templateResponseDetails,
        employees_responded: filteredEmployees,
        frequently_evaluated_employees: getFilteredFrequentlyEvaluatedEmployees(),
        individual_responses: getFilteredIndividualResponses(),
        questions: extractQuestionsFromIndividualResponses,
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
    resetFilters();
    setActiveTab('respondents');
    respondentsPagination.setCurrentPage(1);
    respondentsPagination.setPageSize(5);
    questionsPagination.setCurrentPage(1);
    questionsPagination.setPageSize(5);
    analyticsPagination.setCurrentPage(1);
    analyticsPagination.setPageSize(5);
    setIsRecipientsModalOpen(false);
    setSelectedRecipients(null);
    clearTemplateDefinition();
    setIsOpen(null);
  };

  // Recipients modal handlers
  const handleRecipientsClick = (recipients: string, employeeName: string, department: string) => {
    setSelectedRecipients({
      recipients,
      employeeName,
      department,
    });
    setIsRecipientsModalOpen(true);
  };

  const handleCloseRecipientsModal = () => {
    setIsRecipientsModalOpen(false);
    setSelectedRecipients(null);
  };

  // Refetch template definition when modal opens
  useEffect(() => {
    if (isOpen?.open && selectedTemplate?.evaluation_template_id) {
      refetchTemplateDefinition();
    }
  }, [isOpen?.open, selectedTemplate?.evaluation_template_id, refetchTemplateDefinition]);

  // Get paginated data
  const getPaginatedRespondents = () => {
    const startIndex = (respondentsPagination.currentPage - 1) * respondentsPagination.pageSize;
    const endIndex = startIndex + respondentsPagination.pageSize;
    return filteredEmployees.slice(startIndex, endIndex);
  };

  const getPaginatedQuestions = () => {
    const allQuestions = prepareQuestionResponseData();
    const startIndex = (questionsPagination.currentPage - 1) * questionsPagination.pageSize;
    const endIndex = startIndex + questionsPagination.pageSize;
    return allQuestions.slice(startIndex, endIndex);
  };

  const getPaginatedAnalytics = () => {
    const allEmployees = getFilteredFrequentlyEvaluatedEmployees();
    const startIndex = (analyticsPagination.currentPage - 1) * analyticsPagination.pageSize;
    const endIndex = startIndex + analyticsPagination.pageSize;
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
                        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                        {/* Tab Content */}
                        {activeTab === 'respondents' && (
                          <RespondentsTab
                            paginatedRespondents={getPaginatedRespondents()}
                            pagination={respondentsPagination.pagination}
                            currentPage={respondentsPagination.currentPage}
                            pageSize={respondentsPagination.pageSize}
                            onPageChange={respondentsPagination.handlePageChange}
                            onPageSizeChange={respondentsPagination.handlePageSizeChange}
                            onRecipientsClick={handleRecipientsClick}
                            passingScore={templateResponseDetails?.template?.passing_score || 0}
                          />
                        )}

                        {activeTab === 'questions' && (
                          <QuestionsTab
                            paginatedQuestions={getPaginatedQuestions()}
                            allQuestions={prepareQuestionResponseData()}
                            pagination={questionsPagination.pagination}
                            currentPage={questionsPagination.currentPage}
                            pageSize={questionsPagination.pageSize}
                            onPageChange={questionsPagination.handlePageChange}
                            onPageSizeChange={questionsPagination.handlePageSizeChange}
                            dateFilter={dateFilter}
                            departmentFilter={departmentFilter}
                            templateResponseDetails={templateResponseDetails}
                          />
                        )}

                        {activeTab === 'analytics' && (
                          <AnalyticsTab
                            frequentlyEvaluatedEmployees={getFilteredFrequentlyEvaluatedEmployees()}
                            paginatedAnalytics={getPaginatedAnalytics()}
                            pagination={analyticsPagination.pagination}
                            currentPage={analyticsPagination.currentPage}
                            pageSize={analyticsPagination.pageSize}
                            onPageChange={analyticsPagination.handlePageChange}
                            onPageSizeChange={analyticsPagination.handlePageSizeChange}
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
