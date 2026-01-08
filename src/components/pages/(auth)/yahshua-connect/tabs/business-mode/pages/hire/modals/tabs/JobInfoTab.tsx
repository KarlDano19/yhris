import DropDownArrow from '@/svg/DropDownArrow';
import LocationPickerMap, { LocationData } from '@/components/LocationPickerMap';

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

interface JobInfoTabProps {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  locationData: LocationData | null;
  setLocationData: (value: LocationData | null) => void;
  showCategoryDropdown: boolean;
  setShowCategoryDropdown: (value: boolean) => void;
  categoryDropdownRef: React.RefObject<HTMLDivElement>;
  handleCategorySelect: (selectedCategory: string) => void;
  isOtherCategory: boolean;
  setIsOtherCategory: (value: boolean) => void;
  customCategory: string;
  setCustomCategory: (value: string) => void;
  validationErrors: {
    jobTitle?: string;
    description?: string;
    location?: string;
  };
  setValidationErrors: React.Dispatch<React.SetStateAction<{
    jobTitle?: string;
    description?: string;
    location?: string;
    scheduleDate?: string;
    budgetMin?: string;
    budgetMax?: string;
  }>>;
  onNext: () => void;
}

export default function JobInfoTab({
  jobTitle,
  setJobTitle,
  category,
  setCategory,
  description,
  setDescription,
  locationData,
  setLocationData,
  showCategoryDropdown,
  setShowCategoryDropdown,
  categoryDropdownRef,
  handleCategorySelect,
  isOtherCategory,
  setIsOtherCategory,
  customCategory,
  setCustomCategory,
  validationErrors,
  setValidationErrors,
  onNext,
}: JobInfoTabProps) {
  const handleNext = () => {
    const errors: typeof validationErrors = {};

    if (!jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (!locationData?.address || !locationData.address.trim()) {
      errors.location = 'Location is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...errors }));
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.jobTitle;
      delete newErrors.description;
      delete newErrors.location;
      return newErrors;
    });
    onNext();
  };

  const handleLocationChange = (location: LocationData) => {
    setLocationData(location);
    if (validationErrors.location) {
      setValidationErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  return (
    <div className="px-6 py-6">
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
            onChange={(e) => {
              setJobTitle(e.target.value);
              if (validationErrors.jobTitle) {
                setValidationErrors((prev) => ({ ...prev, jobTitle: undefined }));
              }
            }}
            placeholder="e.g., House Cleaning Service"
            className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 ${
              validationErrors.jobTitle ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.jobTitle}</p>
          )}
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
                    onClick={() => {
                      if (cat === 'Other') {
                        setIsOtherCategory(true);
                        setCategory('');
                        setCustomCategory('');
                      } else {
                        setIsOtherCategory(false);
                        setCustomCategory('');
                        handleCategorySelect(cat);
                      }
                      setShowCategoryDropdown(false);
                    }}
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
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setCategory(e.target.value);
                }}
                placeholder="Enter custom category"
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationErrors.description) {
                setValidationErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Describe the job in detail..."
            rows={4}
            className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 ${
              validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
          )}
        </div>

        {/* Location with Map Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-600">*</span>
          </label>
          <LocationPickerMap
            value={locationData}
            onChange={handleLocationChange}
            placeholder="Search for a location or click on the map..."
            error={validationErrors.location}
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex justify-center rounded-lg border border-transparent bg-savoy-blue px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
