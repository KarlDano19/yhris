import React from 'react';

interface ToggleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="mb-4 border rounded-md">
      <div
        className={`flex items-center justify-between cursor-pointer px-4 py-2 bg-gray-100 ${isOpen ? 'border-b' : ''}`}
        onClick={onToggle}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-savoy-blue text-lg">{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="px-4 py-2 bg-white">{children}</div>}
    </div>
  );
};

export default ToggleSection; 