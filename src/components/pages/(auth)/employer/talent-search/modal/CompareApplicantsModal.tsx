import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon } from "@heroicons/react/24/solid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useCreateApplicantComparison from "../hook/useCreateApplicantComparison";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const METRICS = {
  experience: {
    label: 'Experience',
    getValue: (a: any) => a.work_experience?.length || 0,
    format: (v: number) => `${v} role${v === 1 ? '' : 's'}`,
  },
  skills: {
    label: 'Skills',
    getValue: (a: any) => (Array.isArray(a.skills) ? a.skills.length : 0),
    format: (v: number) => `${v} skill${v === 1 ? '' : 's'}`,
  },
  salary: {
    label: 'Expected Salary',
    getValue: (a: any) => a.expected_salary || 0,
    format: (v: number) => (v ? `₱${v.toLocaleString()}` : 'Not specified'),
  },
} as const;

type T_MetricKey = keyof typeof METRICS;

type T_CompareModalData = {
  applicantIds: number[];
  open: boolean;
};

function CompareApplicantsModal({
  refetch,
  isOpen,
  setIsOpen,
  onViewProfile,
}: {
  refetch: any;
  isOpen: T_CompareModalData;
  setIsOpen: Dispatch<T_CompareModalData | null>;
  onViewProfile: (applicantId: number) => void;
}) {
  const cancelButtonRef = useRef(null);
  const [activeMetric, setActiveMetric] = useState<T_MetricKey>('experience');

  const {
    mutate: createComparison,
    data: comparisonData,
    isLoading,
    isError,
    reset: resetComparison,
  } = useCreateApplicantComparison();

  const applicants = comparisonData?.applicants || [];

  const customCloseModal = () => {
    refetch();
    resetComparison();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen.open && isOpen.applicantIds.length > 0) {
      setActiveMetric('experience');
      createComparison(isOpen.applicantIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.open, isOpen.applicantIds]);

  const activeMetricConfig = METRICS[activeMetric];

  const chartData = {
    labels: applicants.map((a: any) => `${a.firstname} ${a.lastname}`),
    datasets: [
      {
        label: activeMetricConfig.label,
        data: applicants.map((a: any) => activeMetricConfig.getValue(a)),
        backgroundColor: applicants.map((_: any, index: number) => CHART_COLORS[index % CHART_COLORS.length]),
        borderColor: applicants.map((_: any, index: number) => CHART_COLORS[index % CHART_COLORS.length]),
        borderWidth: 0,
        borderRadius: 8,
        maxBarThickness: 20,
        categoryPercentage: 0.6,
        barPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3B82F6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => {
            const applicant = applicants[context.dataIndex];
            return activeMetricConfig.format(activeMetricConfig.getValue(applicant));
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
        },
      },
    },
  };

  const CHART_SLOT_WIDTH_PX = 56;
  const chartMinWidthPx = Math.max(applicants.length * CHART_SLOT_WIDTH_PX, 100);

  return (
    <Transition show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-6xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Compare Profiles
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto" key={isOpen.applicantIds.join(',')}>
                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading profiles...</p>
                    </div>
                  )}

                  {isError && (
                    <div className="text-center py-8">
                      <p className="text-red-600">Failed to load comparison. Please try again.</p>
                    </div>
                  )}

                  {!isLoading && !isError && applicants.length > 0 && (
                    <>
                      {/* Metric Filter */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700 mr-1">Compare by:</span>
                        {(Object.keys(METRICS) as T_MetricKey[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveMetric(key)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                              activeMetric === key
                                ? 'bg-savoy-blue text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {METRICS[key].label}
                          </button>
                        ))}
                      </div>

                      {/* Bar Chart */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="overflow-x-auto">
                          <div style={{ height: '240px', width: '100%', minWidth: `${chartMinWidthPx}px` }}>
                            <Bar data={chartData} options={chartOptions} />
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Applicant List */}
                      <div className="mt-5">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Applicants</h4>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto space-y-2">
                          {applicants.map((applicant: any, index: number) => (
                            <button
                              key={applicant.id}
                              type="button"
                              onClick={() => onViewProfile(applicant.id)}
                              className="w-full flex items-center space-x-2 text-sm text-left bg-white rounded-md p-2 hover:bg-blue-50 transition-colors"
                            >
                              <div
                                className="w-8 h-8 rounded flex-shrink-0"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                              ></div>
                              <span className="text-gray-700 flex-1 min-w-0">
                                <span className="truncate block font-medium break-words">
                                  {applicant.firstname} {applicant.lastname}
                                </span>
                                <span className="text-gray-500 text-xs break-words">
                                  Experience: {METRICS.experience.getValue(applicant)} | Skills: {METRICS.skills.getValue(applicant)} | Salary: {METRICS.salary.format(METRICS.salary.getValue(applicant))}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CompareApplicantsModal;
