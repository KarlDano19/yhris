import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
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
import ColorPaletteModal from '../../analytics/modals/ColorPaletteModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
const APPLICANT_COLOR_STORAGE_KEY = 'talentCompareApplicantColors';

function getNiceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let niceResidual;
  if (residual <= 1) niceResidual = 1;
  else if (residual <= 2) niceResidual = 2;
  else if (residual <= 5) niceResidual = 5;
  else niceResidual = 10;
  return niceResidual * magnitude;
}

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
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<Record<number, string>>({});

  const {
    mutate: createComparison,
    data: comparisonData,
    isLoading,
    isError,
    reset: resetComparison,
  } = useCreateApplicantComparison();

  const applicants = comparisonData?.applicants || [];

  const getBarColor = (applicantId: number, index: number) =>
    customColors[applicantId] || CHART_COLORS[index % CHART_COLORS.length];

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

  useEffect(() => {
    const saved = localStorage.getItem(APPLICANT_COLOR_STORAGE_KEY);
    if (saved) {
      try {
        setCustomColors(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved applicant colors:', error);
      }
    }
  }, []);

  const handleColorPaletteSave = (colors: string[]) => {
    const merged = { ...customColors };
    applicants.forEach((applicant: any, index: number) => {
      merged[applicant.id] = colors[index];
    });
    setCustomColors(merged);
    localStorage.setItem(APPLICANT_COLOR_STORAGE_KEY, JSON.stringify(merged));
  };

  const activeMetricConfig = METRICS[activeMetric];

  const chartLabels = applicants.map((a: any) => `${a.firstname} ${a.lastname}`);
  const sharedYMax = getNiceMax(Math.max(...applicants.map((a: any) => activeMetricConfig.getValue(a)), 1));
  const sharedYStepSize = sharedYMax / 5;

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: activeMetricConfig.label,
        data: applicants.map((a: any) => activeMetricConfig.getValue(a)),
        backgroundColor: applicants.map((a: any, index: number) => getBarColor(a.id, index)),
        borderColor: applicants.map((a: any, index: number) => getBarColor(a.id, index)),
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
        min: 0,
        max: sharedYMax,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
        },
        ticks: {
          display: false,
          stepSize: sharedYStepSize,
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

  const axisChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: applicants.map(() => 0),
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };

  const axisChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: sharedYMax,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          stepSize: sharedYStepSize,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'transparent',
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
  const CHART_HEIGHT_PX = 240;

  return (
    <>
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
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
                        <button
                          onClick={() => setIsColorModalOpen(true)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                          title="Customize colors"
                        >
                          <Squares2X2Icon className="w-4 h-4" />
                          Colors
                        </button>
                      </div>

                      {/* Bar Chart */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex">
                          <div
                            className="sticky left-0 z-10 bg-white flex-shrink-0"
                            style={{ height: `${CHART_HEIGHT_PX}px`, width: '48px' }}
                          >
                            <Bar data={axisChartData} options={axisChartOptions} />
                          </div>
                          <div className="overflow-x-auto flex-1">
                            <div style={{ height: `${CHART_HEIGHT_PX}px`, width: '100%', minWidth: `${chartMinWidthPx}px` }}>
                              <Bar data={chartData} options={chartOptions} />
                            </div>
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
                                style={{ backgroundColor: getBarColor(applicant.id, index) }}
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

    <ColorPaletteModal
      isOpen={isColorModalOpen}
      onClose={() => setIsColorModalOpen(false)}
      onSave={handleColorPaletteSave}
      currentColors={applicants.map((a: any, index: number) => getBarColor(a.id, index))}
      departmentNames={applicants.map((a: any) => `${a.firstname} ${a.lastname}`)}
    />
    </>
  );
}

export default CompareApplicantsModal;
