import { useEffect, useState, useRef } from 'react';

import Modal from '../../../components/Modal';

import DropdownArrow from '@/svg/DropDownArrow';

type SkillSelectorProps = {
  availableSkills: string[];
  selectedSkills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
};

function SkillSelector({ availableSkills, selectedSkills, onAddSkill, onRemoveSkill }: SkillSelectorProps) {
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSkillDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filtered = availableSkills.filter((s) => s.toLowerCase().includes(skillInput.toLowerCase()));

  return (
    <div ref={ref}>
      <div className="relative mb-3">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => {
            setSkillInput(e.target.value);
            setShowSkillDropdown(true);
            setHighlightedIndex(-1);
          }}
          onClick={() => setShowSkillDropdown((p) => !p)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setHighlightedIndex((p) => Math.min(p + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightedIndex((p) => Math.max(p - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
                const chosen = filtered[highlightedIndex];
                if (!selectedSkills.includes(chosen)) onAddSkill(chosen);
                setSkillInput('');
              } else if (skillInput.trim()) {
                if (!selectedSkills.includes(skillInput.trim())) onAddSkill(skillInput.trim());
                setSkillInput('');
              }
              setShowSkillDropdown(false);
            } else if (e.key === 'Escape') {
              setShowSkillDropdown(false);
            }
          }}
          placeholder="Type or select a skill to add"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <DropdownArrow />
        </div>
        {showSkillDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((s, idx) => (
              <div
                key={s}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === highlightedIndex ? 'bg-gray-100' : ''} ${selectedSkills.includes(s) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!selectedSkills.includes(s)) onAddSkill(s);
                  setSkillInput('');
                  setShowSkillDropdown(false);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <div className="font-medium">{s}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No matches. Press Enter to add "{skillInput}"</div>
            )}
          </div>
        )}
      </div>

      {/* Selected skills displayed as remove-only buttons */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => onRemoveSkill(skill)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Click to remove"
          >
            {skill} ×
          </button>
        ))}
      </div>
    </div>
  );
}
interface FilterRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    location?: string;
    category?: string;
    skills?: string[];
    urgentOnly?: boolean;
  }) => void;
  /** When false, hide the skills selector (only show skills on Search Talent page) */
  showSkills?: boolean;
  /** Optional skills list provided by caller (e.g., Search Talent page) */
  availableSkills?: string[];
  /** Optionally prefill category when opening modal */
  initialCategory?: string;
  initialUrgentOnly?: boolean;
}

const FilterRequestsModal = ({ isOpen, onClose, onApplyFilters, initialUrgentOnly, showSkills = true, initialCategory, availableSkills }: FilterRequestsModalProps) => {
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(!!initialUrgentOnly);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [highlightedCategoryIndex, setHighlightedCategoryIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrgentOnly(!!initialUrgentOnly);
      if (initialCategory) {
        setSelectedCategory(initialCategory);
        setCategoryInput(initialCategory);
      }
    }
  }, [isOpen, initialUrgentOnly, initialCategory]);

  // Categories sourced from JobInfoTab and backend job category values
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

  // Skills: prefer caller-provided list (from Search Talent page); fall back to defaults
  const skills = (availableSkills && availableSkills.length > 0)
    ? availableSkills
    : [
        'Plumbing',
        'Electrical',
        'Cleaning',
        'Carpentry',
        'Painting',
        'Landscaping',
        'General Maintenance',
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearAll = () => {
    setLocation('');
    setSelectedSkills([]);
    setUrgentOnly(false);
    setSelectedCategory('');
    setCategoryInput('');
  };

  const handleApply = () => {
    onApplyFilters({
      location,
      category: selectedCategory || undefined,
      skills: selectedSkills.length ? selectedSkills : undefined,
      urgentOnly,
    });
    onClose();
  };

  // Click outside to close category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
        setHighlightedCategoryIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Requests"
      size="md"
      footerContent={
        <div className="flex gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      }
    >
      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Carmen, Gusa"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Category (type or select) */}
      <div className="mb-6" ref={containerRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="relative">
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => {
              setCategoryInput(e.target.value);
              setSelectedCategory(''); // clear explicit selection when typing
              setShowCategoryDropdown(true);
              setHighlightedCategoryIndex(-1);
            }}
            onClick={() => {
              setShowCategoryDropdown((prev) => !prev);
              setHighlightedCategoryIndex(-1);
            }}
            onFocus={() => {
              setShowCategoryDropdown(true);
              setHighlightedCategoryIndex(-1);
            }}
            onKeyDown={(e) => {
              const filtered = categories.filter((c) =>
                c.toLowerCase().includes(categoryInput.toLowerCase())
              );
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedCategoryIndex((prev) => Math.min(prev + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedCategoryIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedCategoryIndex >= 0 && filtered[highlightedCategoryIndex]) {
                  const chosen = filtered[highlightedCategoryIndex];
                  setSelectedCategory(chosen);
                  setCategoryInput(chosen);
                } else if (categoryInput.trim()) {
                  setSelectedCategory(categoryInput.trim());
                }
                setShowCategoryDropdown(false);
              } else if (e.key === 'Escape') {
                setShowCategoryDropdown(false);
              }
            }}
            placeholder="Type or select a category"
            
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <DropdownArrow />
          </div>

          {/* Dropdown suggestions */}
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {categories
                .filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase()))
                .map((cat, idx) => (
                  <div
                    key={cat}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      idx === highlightedCategoryIndex ? 'bg-gray-100' : ''
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelectedCategory(cat);
                      setCategoryInput(cat);
                      setShowCategoryDropdown(false);
                    }}
                    onMouseEnter={() => setHighlightedCategoryIndex(idx)}
                  >
                    <div className="font-medium">{cat}
                    </div>
                  </div>
                ))}
              {categories.filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No matches. Press Enter to use "{categoryInput}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skills (only shown when allowed by caller) */}
      {showSkills && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          {/* Skill selector input/dropdown */}
          <SkillSelector
            availableSkills={skills}
            selectedSkills={selectedSkills}
            onAddSkill={(s: string) => {
              setSelectedSkills((prev) => (prev.includes(s) ? prev : [...prev, s]));
            }}
            onRemoveSkill={(s: string) => {
              setSelectedSkills((prev) => prev.filter((x) => x !== s));
            }}
          />
        </div>
      )}

      {/* Urgent Only */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Urgent Only</label>
          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              urgentOnly ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                urgentOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterRequestsModal;

