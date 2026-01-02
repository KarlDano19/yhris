'use client';

import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import CustomDatePicker from '@/components/CustomDatePicker';
import { categories, locationSuggestions } from '../../hooks/usePostJobData';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTime: string;
  }) => void;
}

const PostJobModal = ({ isOpen, onClose, onSubmit }: PostJobModalProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');

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
    if (!jobTitle.trim() || !description.trim()) {
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
      budgetMin: budgetMin.trim(),
      budgetMax: budgetMax.trim(),
      scheduleDate: formattedDate,
      scheduleTime: scheduleTime.trim(),
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
    setBudgetMin('');
    setBudgetMax('');
    setScheduleDate(null);
    setScheduleTime('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Title */}
                <div className="text-left mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Post a Job
                  </Dialog.Title>
                </div>

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
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
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
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 text-left bg-white flex items-center justify-between"
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
                      placeholder="Describe what you need done..."
                      rows={4}
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
                      required
                    />
                  </div>

                  {/* Location and Budget */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Location */}
                    <div className="relative" ref={locationDropdownRef}>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
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
                          placeholder="e.g., Carmen, CDO"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
                        />
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

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          placeholder="Min"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="text"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          placeholder="Max"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="relative">
                        <CustomDatePicker
                          id="scheduleDate"
                          selected={scheduleDate}
                          pickerOnChange={(date: Date | null) => setScheduleDate(date)}
                          inputOnChange={(date: Date | null) => setScheduleDate(date)}
                          placeholder="mm/dd/yyyy"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10"
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex justify-center rounded-md border border-transparent bg-savoy-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                  >
                    Post Job
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PostJobModal;

