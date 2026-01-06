

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import CustomDatePicker from '@/components/CustomDatePicker';
import Modal from '../../../../components/Modal';
import { categories, locationSuggestions } from '../../hooks/usePostJobData';

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
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budgetMin, setBudgetMin] = useState('500');
  const [budgetMax, setBudgetMax] = useState('1000');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTimeFrom, setScheduleTimeFrom] = useState('');
  const [scheduleTimeTo, setScheduleTimeTo] = useState('');

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
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
      // Reset to defaults when no initial data
      setJobTitle('');
      setCategory('');
      setDescription('');
      setLocation('');
      setBudgetType('fixed');
      setBudgetMin('500');
      setBudgetMax('1000');
      setScheduleDate(null);
      setScheduleTimeFrom('');
      setScheduleTimeTo('');
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
    if (!jobTitle.trim() || !description.trim() || !location.trim()) {
      return; // Basic validation
    }

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
    setBudgetMin('500');
    setBudgetMax('1000');
    setScheduleDate(null);
    setScheduleTimeFrom('');
    setScheduleTimeTo('');
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
      size="2xl"
      footerContent={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center rounded-lg border border-transparent bg-savoy-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            {initialData ? 'Update Job' : 'Post Job'}
          </button>
        </div>
      }
    >
      {/* Form */}
      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., House Cleaning Service"
            className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
            required
          />
        </div>

        {/* Category */}
        <div className="relative" ref={categoryDropdownRef}>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 text-left bg-white flex items-center justify-between"
            >
              <span className={category ? 'text-gray-900' : 'text-gray-400'}>
                {category || 'Select category'}
              </span>
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job in detail..."
            rows={4}
            className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
            required
          />
        </div>

        {/* Location */}
        <div className="relative" ref={locationDropdownRef}>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              ref={locationInputRef}
              type="text"
              id="location"
              value={location}
              onChange={handleLocationInputChange}
              onFocus={() => setShowLocationDropdown(true)}
              onKeyDown={handleLocationKeyDown}
              placeholder="Select location"
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10"
            />
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {filteredLocations.map((loc, index) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocationSelect(loc)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      index === selectedLocationIndex
                        ? 'bg-savoy-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Type <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setBudgetType('fixed')}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                budgetType === 'fixed'
                  ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Fixed Rate
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('hourly')}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                budgetType === 'hourly'
                  ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Hourly Rate
            </button>
          </div>
        </div>

        {/* Budget Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === 'fixed' ? 'Min Amount (₱)' : 'Min Rate/Hour (₱)'}
            </label>
            <input
              type="text"
              id="budgetMin"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="500"
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === 'fixed' ? 'Max Amount (₱)' : 'Max Rate/Hour (₱)'} <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="budgetMax"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="1000"
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule <span className="text-red-600">*</span>
          </label>
          <div className="space-y-3">
            {/* Date */}
            <div className="relative">
              <CustomDatePicker
                id="scheduleDate"
                selected={scheduleDate}
                pickerOnChange={(date: Date | null) => setScheduleDate(date)}
                inputOnChange={(date: Date | null) => setScheduleDate(date)}
                placeholder="mm/dd/yyyy"
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Time From and To */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label htmlFor="timeFrom" className="block text-xs text-gray-600 mb-1">
                  Time From
                </label>
                <input
                  type="time"
                  id="timeFrom"
                  value={scheduleTimeFrom}
                  onChange={(e) => setScheduleTimeFrom(e.target.value)}
                  placeholder="--:--"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10"
                />
                <ClockIcon className="absolute right-3 bottom-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <label htmlFor="timeTo" className="block text-xs text-gray-600 mb-1">
                  Time To
                </label>
                <input
                  type="time"
                  id="timeTo"
                  value={scheduleTimeTo}
                  onChange={(e) => setScheduleTimeTo(e.target.value)}
                  placeholder="--:--"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10"
                />
                <ClockIcon className="absolute right-3 bottom-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostJobModal;
