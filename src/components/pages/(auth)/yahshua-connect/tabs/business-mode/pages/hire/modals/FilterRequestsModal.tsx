

import { useState } from 'react';
import Modal from '../../../../../components/Modal';

interface FilterRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    location: string;
    skills: string[];
    urgentOnly: boolean;
  }) => void;
}

const FilterRequestsModal = ({ isOpen, onClose, onApplyFilters }: FilterRequestsModalProps) => {
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [urgentOnly, setUrgentOnly] = useState(false);

  const skills = ['Plumbing', 'Electrical', 'Cleaning'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearAll = () => {
    setLocation('');
    setSelectedSkills([]);
    setUrgentOnly(false);
  };

  const handleApply = () => {
    onApplyFilters({
      location,
      skills: selectedSkills,
      urgentOnly,
    });
    onClose();
  };

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

      {/* Skills */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

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

