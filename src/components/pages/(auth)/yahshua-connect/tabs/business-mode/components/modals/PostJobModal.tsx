
'use client';

import { useState, useRef, useEffect } from 'react';
import classNames from '@/helpers/classNames';
import Modal from '../../../../components/Modal';
import { locationSuggestions } from '../../hooks/usePostJobData';
import JobInfoTab from './tabs/JobInfoTab';
import JobBudgetTab from './tabs/JobBudgetTab';
import JobPreviewTab from './tabs/JobPreviewTab';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  }) => void;
  initialData?: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  };
}

const PostJobModal = ({ isOpen, onClose, onSubmit, initialData }: PostJobModalProps) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
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

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // Reset to first tab when opening
      setSelectedTab(1);
      // Clear validation errors when modal opens
      setValidationErrors({});
      
      if (initialData) {
        setJobTitle(initialData.jobTitle);
        setCategory(initialData.category);
        setDescription(initialData.description);
        setLocation(initialData.location);
        setBudgetType(initialData.budgetType);
        setBudgetMin(initialData.budgetMin);
        setBudgetMax(initialData.budgetMax);
        // Parse scheduleDate string to Date
        if (initialData.scheduleDate) {
          const date = new Date(initialData.scheduleDate);
          if (!isNaN(date.getTime())) {
            setScheduleDate(date);
          }
        }
        setScheduleTimeFrom(initialData.scheduleTimeFrom);
        setScheduleTimeTo(initialData.scheduleTimeTo);
      } else {
        // Reset to defaults when opening without initial data
        setJobTitle('');
        setCategory('');
        setDescription('');
        setLocation('');
        setBudgetType('fixed');
        setBudgetMin('');
        setBudgetMax('');
        setScheduleDate(null);
        setScheduleTimeFrom('');
        setScheduleTimeTo('');
      }
    }
  }, [initialData, isOpen]);

  // Location dropdown state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>(locationSuggestions);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter locations based on input
    if (location.trim() === '') {
      setFilteredLocations(locationSuggestions);
    } else {
      const filtered = locationSuggestions.filter((loc) =>
        loc.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
    setSelectedLocationIndex(-1);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
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

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setShowLocationDropdown(true);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationDropdown(false);
    setSelectedLocationIndex(-1);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedLocationIndex((prev) =>
        prev < filteredLocations.length - 1 ? prev + 1 : prev
      );
      setShowLocationDropdown(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedLocationIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedLocationIndex >= 0 && filteredLocations[selectedLocationIndex]) {
        handleLocationSelect(filteredLocations[selectedLocationIndex]);
      } else {
        setShowLocationDropdown(false);
      }
    } else if (e.key === 'Escape') {
      setShowLocationDropdown(false);
      setSelectedLocationIndex(-1);
    }
  };

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
    if (!location.trim()) {
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
      location: location.trim(),
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
    setDescription('');
    setLocation('');
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
      title={initialData ? 'Edit Job' : 'Post a New Job'}
      size="5xl"
    >
      {/* Tab Navigation */}
      <div className="hidden sm:block pt-6 pb-6">
        <div className="md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={classNames(
                'bg-gray-600 h-1 rounded-full transition-all duration-300',
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
          <li className="text-center text-sm font-semibold list-none flex flex-col items-center text-gray-900">
            <div className="bg-white px-2">
              <div className="h-8 w-8 bg-gray-900 border-2 mb-2 rounded-lg flex justify-center items-center border-gray-900">
                <h1 className="text-white">1</h1>
              </div>
            </div>
            Job Info
          </li>
          <li
            className={classNames(
              'text-center text-sm font-semibold list-none flex flex-col items-center',
              selectedTab >= 2 ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            <div className="bg-white px-2">
              <div
                className={classNames(
                  'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                  selectedTab >= 2 ? 'border-gray-900 bg-gray-900' : 'border-gray-500 bg-gray-500'
                )}
              >
                <h1 className="text-white">2</h1>
              </div>
            </div>
            Budget & Schedule
          </li>
          <li
            className={classNames(
              'text-center text-sm font-semibold list-none flex flex-col items-center',
              selectedTab >= 3 ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            <div className="bg-white px-2">
              <div
                className={classNames(
                  'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                  selectedTab >= 3 ? 'border-gray-900 bg-gray-900' : 'border-gray-500 bg-gray-500'
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
          location={location}
          setLocation={setLocation}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          showLocationDropdown={showLocationDropdown}
          setShowLocationDropdown={setShowLocationDropdown}
          filteredLocations={filteredLocations}
          selectedLocationIndex={selectedLocationIndex}
          setSelectedLocationIndex={setSelectedLocationIndex}
          locationInputRef={locationInputRef}
          locationDropdownRef={locationDropdownRef}
          categoryDropdownRef={categoryDropdownRef}
          handleLocationInputChange={handleLocationInputChange}
          handleLocationSelect={handleLocationSelect}
          handleLocationKeyDown={handleLocationKeyDown}
          handleCategorySelect={handleCategorySelect}
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
          location={location}
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

export default PostJobModal;
