import { useState, useRef, useEffect } from 'react';

import Modal from '../../../../../components/Modal';
import JobInfoTab from './tabs/JobInfoTab';
import JobBudgetTab from './tabs/JobBudgetTab';
import JobPreviewTab from './tabs/JobPreviewTab';

import classNames from '@/helpers/classNames';
import { LocationData } from '@/components/LocationPickerMap';

interface CreateBusinessJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  }) => void;
}

const CreateBusinessJobModal = ({ isOpen, onClose, onSubmit }: CreateBusinessJobModalProps) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTimeFrom, setScheduleTimeFrom] = useState('');
  const [scheduleTimeTo, setScheduleTimeTo] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    jobTitle?: string;
    description?: string;
    location?: string;
    scheduleDate?: string;
    budgetMin?: string;
    budgetMax?: string;
  }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const handleSubmit = () => {
    // Reset validation errors
    const errors: typeof validationErrors = {};

    // Validate required fields
    if (!jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (!locationData?.address) {
      errors.location = 'Location is required';
    }
    if (!scheduleDate) {
      errors.scheduleDate = 'Schedule date is required';
    }

    // Validate budget amounts
    if (!budgetMin.trim()) {
      errors.budgetMin = 'Minimum amount is required';
    } else {
      const minAmount = parseFloat(budgetMin.trim());
      if (isNaN(minAmount) || minAmount <= 0) {
        errors.budgetMin = 'Minimum amount must be a valid positive number';
      } else if (budgetMax.trim()) {
        const maxAmount = parseFloat(budgetMax.trim());
        if (isNaN(maxAmount) || maxAmount <= 0) {
          errors.budgetMax = 'Maximum amount must be a valid positive number';
        } else if (maxAmount <= minAmount) {
          errors.budgetMax = 'Maximum amount must be greater than minimum amount';
        }
      }
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors
    setValidationErrors({});

    const formattedDate = scheduleDate
      ? `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, '0')}-${String(scheduleDate.getDate()).padStart(2, '0')}`
      : '';

    onSubmit({
      jobTitle: jobTitle.trim(),
      category,
      description: description.trim(),
      location: locationData?.address.trim() || '',
      latitude: locationData?.latitude || null,
      longitude: locationData?.longitude || null,
      budgetType,
      budgetMin: budgetMin.trim(),
      budgetMax: budgetMax.trim(),
      scheduleDate: formattedDate,
      scheduleTimeFrom: scheduleTimeFrom.trim(),
      scheduleTimeTo: scheduleTimeTo.trim(),
    });

    // Reset form
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setJobTitle('');
    setCategory('');
    setIsOtherCategory(false);
    setCustomCategory('');
    setDescription('');
    setLocationData(null);
    setBudgetType('fixed');
    setBudgetMin('');
    setBudgetMax('');
    setScheduleDate(null);
    setScheduleTimeFrom('');
    setScheduleTimeTo('');
    setValidationErrors({});
    setSelectedTab(1);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Post a New Job"
      size="5xl"
    >
      {/* Tab Navigation */}
      <div className="hidden sm:block pt-6 pb-6">
        <div className="md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={classNames(
                'bg-savoy-blue h-1 rounded-full transition-all duration-300',
                selectedTab === 1 && 'w-0',
                selectedTab === 2 && 'w-[50%]',
                selectedTab === 3 && 'w-[100%]',
              )}
            ></div>
          </div>
        </div>
        <nav
          className="mb-px flex relative justify-between w-[90%] mx-auto mt-[-9px]"
          aria-label="post-job-tabs"
        >
          <li 
            onClick={() => setSelectedTab(1)}
            className="text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-white px-2">
              <div className="h-8 w-8 bg-savoy-blue border-2 mb-2 rounded-lg flex justify-center items-center border-savoy-blue">
                <h1 className="text-white">1</h1>
              </div>
            </div>
            Job Info
          </li>
          <li
            onClick={() => setSelectedTab(2)}
            className={classNames(
              'text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity',
              selectedTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
            )}
          >
            <div className="bg-white px-2">
              <div
                className={classNames(
                  'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                  selectedTab >= 2 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                )}
              >
                <h1 className="text-white">2</h1>
              </div>
            </div>
            Budget & Schedule
          </li>
          <li
            onClick={() => setSelectedTab(3)}
            className={classNames(
              'text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity',
              selectedTab >= 3 ? 'text-savoy-blue' : 'text-gray-500'
            )}
          >
            <div className="bg-white px-2">
              <div
                className={classNames(
                  'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                  selectedTab >= 3 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                )}
              >
                <h1 className="text-white">3</h1>
              </div>
            </div>
            Preview
          </li>
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 1 && (
        <JobInfoTab
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
          locationData={locationData}
          setLocationData={setLocationData}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          categoryDropdownRef={categoryDropdownRef}
          handleCategorySelect={handleCategorySelect}
          isOtherCategory={isOtherCategory}
          setIsOtherCategory={setIsOtherCategory}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          onNext={() => setSelectedTab(2)}
        />
      )}

      {selectedTab === 2 && (
        <JobBudgetTab
          budgetType={budgetType}
          setBudgetType={setBudgetType}
          budgetMin={budgetMin}
          setBudgetMin={setBudgetMin}
          budgetMax={budgetMax}
          setBudgetMax={setBudgetMax}
          scheduleDate={scheduleDate}
          setScheduleDate={setScheduleDate}
          scheduleTimeFrom={scheduleTimeFrom}
          setScheduleTimeFrom={setScheduleTimeFrom}
          scheduleTimeTo={scheduleTimeTo}
          setScheduleTimeTo={setScheduleTimeTo}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          onNext={() => setSelectedTab(3)}
          onBack={() => setSelectedTab(1)}
        />
      )}

      {selectedTab === 3 && (
        <JobPreviewTab
          jobTitle={jobTitle}
          category={category}
          description={description}
          location={locationData?.address || ''}
          budgetType={budgetType}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          scheduleDate={scheduleDate}
          scheduleTimeFrom={scheduleTimeFrom}
          scheduleTimeTo={scheduleTimeTo}
          onBack={() => setSelectedTab(2)}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
};

export default CreateBusinessJobModal;

