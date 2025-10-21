import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import { XCircleIcon, FunnelIcon, ChartBarIcon, UsersIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

// Chart.js imports for analytics
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [dateFilter, setDateFilter] = useState<{ from: any; to: any }>({
    from: '',
    to: '',
  });
  const [filteredResponses, setFilteredResponses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'respondents' | 'questions' | 'analytics'>('respondents');

  const customCloseModal = () => {
    setDateFilter({ from: '', to: '' });
    setActiveTab('respondents');
    setIsOpen(null);
  };

  // Helper function to prepare pie chart data for frequently evaluated employees
  const prepareFrequentlyEvaluatedData = () => {
    if (!templateResponseDetails?.frequently_evaluated_employees) return { labels: [], datasets: [] };

    // Take top 10 most frequently evaluated employees
    const topEmployees = templateResponseDetails.frequently_evaluated_employees.slice(0, 10);

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    return {
      labels: topEmployees.map((emp: EmployeeEvaluationData) => emp.name),
      datasets: [{
        data: topEmployees.map((emp: EmployeeEvaluationData) => emp.evaluation_count),
        backgroundColor: colors.slice(0, topEmployees.length),
        borderColor: colors.slice(0, topEmployees.length),
        borderWidth: 1,
      }]
    };
  };

  // Helper function to prepare question response data
  const prepareQuestionResponseData = () => {
    if (!templateResponseDetails?.questions) return [];

    const processedQuestions = templateResponseDetails.questions.map((question: any) => ({
      ...question,
      totalResponses: question.responses?.length || question.individual_responses?.length || 0
    }));

    // Debug logging
    console.log('Template Response Details:', templateResponseDetails);
    console.log('Processed Questions:', processedQuestions);
    console.log('Frequently Evaluated Employees:', templateResponseDetails.frequently_evaluated_employees);

    return processedQuestions;
  };

  // Filter responses based on date range
  useEffect(() => {
    if (templateResponseDetails?.individual_responses) {
      let responses = [...templateResponseDetails.individual_responses];

      if (dateFilter.from || dateFilter.to) {
        responses = responses.filter((evaluation: any) => {
          if (!evaluation.date_of_evaluation) return false;
          
          const evaluationDate = new Date(evaluation.date_of_evaluation);
          
          // Normalize dates to start/end of day for proper range comparison
          let fromDate = null;
          let toDate = null;
          
          if (dateFilter.from) {
            fromDate = new Date(dateFilter.from);
            fromDate.setHours(0, 0, 0, 0); // Start of day
          }
          
          if (dateFilter.to) {
            toDate = new Date(dateFilter.to);
            toDate.setHours(23, 59, 59, 999); // End of day
          }

          if (fromDate && toDate) {
            return evaluationDate >= fromDate && evaluationDate <= toDate;
          } else if (fromDate) {
            return evaluationDate >= fromDate;
          } else if (toDate) {
            return evaluationDate <= toDate;
          }
          return true;
        });
      }

      setFilteredResponses(responses);
    } else {
      setFilteredResponses([]);
    }
  }, [templateResponseDetails, dateFilter]);

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
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    Template Responses: {selectedTemplate?.evaluation_form}
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
                        <h4 className='text-lg font-semibold mb-4 text-gray-900'>Template Summary</h4>
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

                      {/* Date Filter */}
                      <div className='bg-white rounded-lg p-6 border border-gray-200'>
                        {/* <div className='flex items-center gap-2 mb-4'>
                          <FunnelIcon className='h-5 w-5 text-gray-600' />
                          <h4 className='text-lg font-semibold text-gray-900'>Filter by Date</h4>
                        </div> */}
                          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
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
                            <div className='text-sm text-gray-600'>
                              Showing {filteredResponses.length} of {templateResponseDetails.individual_responses?.length || 0} responses
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
                                      Employee Name
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Department
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
                                  {templateResponseDetails.employees_responded?.map((employee: any, index: number) => (
                                    <tr key={index} className='hover:bg-gray-50'>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {employee.name}
                                      </td>
                                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {employee.department}
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
                                      <td colSpan={5} className='px-6 py-4 text-center text-sm text-gray-500'>
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
                          <h4 className='text-lg font-semibold text-gray-900'>Evaluation Questions & Responses</h4>
                          {prepareQuestionResponseData().map((question: any, questionIndex: number) => (
                            <div key={questionIndex} className='bg-white border border-gray-200 rounded-lg p-6'>
                              <div className='mb-4'>
                                <h5 className='text-lg font-medium text-gray-900 mb-2'>
                                  {questionIndex + 1}. {question.question_text}
                                </h5>
                                <p className='text-sm text-gray-600'>
                                  Question Type: {question.question_type} • Total Responses: {question.total_responses}
                                </p>
                              </div>
                              
                              {question.responses && question.responses.length > 0 ? (
                                <div className='space-y-3'>
                                  {question.responses.map((response: any, responseIndex: number) => (
                                    <div key={responseIndex} className='bg-gray-50 p-3 rounded border'>
                                      <div className='flex justify-between items-start'>
                                        <div className='flex-1'>
                                          <p className='text-sm font-medium text-gray-900'>{response.option}</p>
                                        </div>
                                        <div className='ml-4 text-right'>
                                          <p className='text-sm font-bold text-gray-900'>{response.count}</p>
                                          <p className='text-xs text-gray-500'>{response.percentage}%</p>
                                        </div>
                                      </div>
                                      <div className='mt-2'>
                                        <div className='w-full bg-gray-200 rounded-full h-2'>
                                          <div
                                            className='bg-blue-500 h-2 rounded-full transition-all'
                                            style={{ width: `${response.percentage}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
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
                                <p className='text-sm text-gray-500 italic'>No responses available for this question</p>
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
                              {prepareFrequentlyEvaluatedData().labels.length > 0 ? (
                                <Pie 
                                  data={prepareFrequentlyEvaluatedData()} 
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: {
                                        position: 'right' as const,
                                        labels: {
                                          usePointStyle: true,
                                          padding: 20,
                                        },
                                      },
                                      tooltip: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        titleColor: 'white',
                                        bodyColor: 'white',
                                        borderColor: '#3B82F6',
                                        borderWidth: 1,
                                        callbacks: {
                                          label: (context: any) => {
                                            const label = context.label || '';
                                            const value = context.parsed || 0;
                                            return `${label}: ${value} evaluation${value !== 1 ? 's' : ''}`;
                                          }
                                        }
                                      }
                                    }
                                  }} 
                                />
                              ) : (
                                <div className='flex items-center justify-center h-full'>
                                  <p className='text-gray-500'>No evaluation data available</p>
                                </div>
                              )}
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