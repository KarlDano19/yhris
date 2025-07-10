import React from "react";

interface ToggleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <>
      <div
        className="flex justify-start items-center mb-4"
        onClick={onToggle}
      >
        <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
          {title}
          <span className="ml-2 cursor-pointer">
            {isOpen ? 
              <span className="text-red-600 font-medium">hide</span> : 
              <span className="text-green-600 font-medium">show</span>
            }
          </span>
        </h1>
      </div>
      {isOpen && children}
    </>
  );
};

export default ToggleSection; 