import { useEffect, useState, useRef } from "react";

import { Controller } from "react-hook-form";

import LocationPickerMap, { LocationData } from '@/components/LocationPickerMap';
import DropDownArrow from '@/svg/DropDownArrow';

import { XCircleIcon } from "@heroicons/react/24/solid";

// Categories
const categories = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Carpentry',
  'Painting',
  'Landscaping',
  'General Maintenance',
  'Other',
];

export default function JobInfoTab({
  control,
  register,
  setSelectedTab,
  errors,
  setError,
  clearErrors,
  watch,
  setValue,
}: {
  control: any;
  register: any;
  setSelectedTab: any;
  errors: any;
  setError: any;
  clearErrors: any;
  watch: any;
  setValue: any;
}) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Watch form values
  const jobTitle = watch("jobTitle");
  const category = watch("category");
  const description = watch("description");
  const locationData = watch("locationData");

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
    if (selectedCategory === 'Other') {
      setValue("isOtherCategory", true);
      setValue("category", '');
      setValue("customCategory", '');
    } else {
      setValue("isOtherCategory", false);
      setValue("customCategory", '');
      setValue("category", selectedCategory);
    }
    setShowCategoryDropdown(false);
    clearErrors("category");
  };

  const handleLocationChange = (location: LocationData) => {
    setValue("locationData", location);
    setValue("location", location.address);
    setValue("latitude", location.latitude);
    setValue("longitude", location.longitude);
    clearErrors("location");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobTitleValue = watch("jobTitle");
    const descriptionValue = watch("description");
    const locationDataValue = watch("locationData");

    let hasError = false;

    if (!jobTitleValue || !jobTitleValue.trim()) {
      setError("jobTitle", {
        type: "manual",
        message: "Job title is required"
      });
      hasError = true;
    }
    if (!descriptionValue || !descriptionValue.trim()) {
      setError("description", {
        type: "manual",
        message: "Description is required"
      });
      hasError = true;
    }
    if (!locationDataValue || !locationDataValue.address) {
      setError("location", {
        type: "manual",
        message: "Location is required"
      });
      hasError = true;
    }

    if (hasError) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSelectedTab(2);
  };

  useEffect(() => {
    if (jobTitle && jobTitle.trim()) {
      clearErrors("jobTitle");
    }
  }, [jobTitle, clearErrors]);

  useEffect(() => {
    if (description && description.trim()) {
      clearErrors("description");
    }
  }, [description, clearErrors]);

  useEffect(() => {
    if (locationData && locationData.address) {
      clearErrors("location");
    }
  }, [locationData, clearErrors]);

  const isOtherCategory = watch("isOtherCategory");

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-16 md:pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Job Title
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("jobTitle", { required: true })}
                id="jobTitle"
                placeholder="e.g., House Cleaning Service"
                className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                  errors.jobTitle ? 'ring-red-500' : ''
                }`}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message || "Job title is required"}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="relative" ref={categoryDropdownRef}>
            <label
              htmlFor="category"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Category
            </label>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 bg-white flex items-center justify-between"
              >
                <span className={category ? 'text-gray-900' : 'text-gray-400'}>
                  {isOtherCategory ? 'Other' : category || 'Select category'}
                </span>
                <DropDownArrow />
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
            {/* Custom Category Input when "Other" is selected */}
            {isOtherCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  {...register("customCategory")}
                  onChange={(e) => {
                    setValue("customCategory", e.target.value);
                    setValue("category", e.target.value);
                  }}
                  placeholder="Enter custom category"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Description
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <textarea
                {...register("description", { required: true })}
                id="description"
                placeholder="Describe the job in detail..."
                rows={4}
                className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                  errors.description ? 'ring-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message || "Description is required"}</p>
              )}
            </div>
          </div>

          {/* Daily Progress Settings */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-red-600 mb-3">Daily Progress Settings</h4>

            <div className="ml-4 space-y-3">
              {/* Require Proof File Uploads */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Require Proof File Uploads
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    When enabled, hired workers must upload proof files when submitting daily progress
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isProofFileRequired"
                  defaultValue={true}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 ${
                        field.value !== false ? 'bg-savoy-blue' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          field.value !== false ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}
                />
              </div>

              {/* Require Client Approval for Daily Progress */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Require Client Approval for Daily Progress
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    When enabled, you must review and approve each daily progress submission. When disabled, submissions are auto-approved.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isDailyProgressApprovalRequired"
                  defaultValue={true}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 ${
                        field.value !== false ? 'bg-savoy-blue' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          field.value !== false ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Location with Map Picker */}
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Location
              <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <Controller
                control={control}
                name="locationData"
                render={({ field }) => (
                  <LocationPickerMap
                    value={field.value || null}
                    onChange={(location: LocationData) => {
                      field.onChange(location);
                      handleLocationChange(location);
                    }}
                    placeholder="Search for a location or click on the map..."
                    error={errors.location?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 text-right">
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}