import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageElevenProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageEleven: React.FC<DocumentPageElevenProps> = ({ data, isMultiPage = false, pageNumber = 11 }) => {
  const penaltySystem = (
    <ul className="list-none pl-0 mt-2 space-y-1 ml-5">
      <li className="text-xs text-gray-700">• First offense - Written reprimand</li>
      <li className="text-xs text-gray-700">• Second offense - ONE (1) day suspension</li>
      <li className="text-xs text-gray-700">• Third offense - Three (3) days suspension</li>
      <li className="text-xs text-gray-700">• Fourth offense - Seven (7) days suspension</li>
      <li className="text-xs text-gray-700">• Fifth offense - Dismissal</li>
    </ul>
  );

  return (
    <div
      className="bg-white text-black font-sans text-xs leading-tight w-full h-full flex flex-col"
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box',
        padding: '32px 40px 32px 60px'
      }}
    >
      {/* Top Section - Safety Equipment Requirements */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-1">
          <strong>Face Shield</strong> - Required for jack hammering & grinding operations.
        </p>
        <p className="text-xs text-gray-700 mb-1">
          <strong>Goggles</strong> - Required for welding works.
        </p>
        <p className="text-xs text-gray-700 mb-1">
          <strong>Dusk Mask</strong> - Required for cement handling and housekeeping operations.
        </p>
        <p className="text-xs text-gray-700 mb-1">
          <strong>Respirator</strong> - Required in confines areas (cleaning of tanks etc.) painting, handling chemical especially toxic matter.
        </p>
        {penaltySystem}
      </div>

      {/* Section C. Safety Harness & Life Lines */}
      <div className="mb-4 ml-5">
        <p className="text-xs text-gray-700 mb-1">
          <strong>C. Safety Harness & Life Lines</strong> - Required for employees doing above 6 ft. that has a great danger of falling (ex. perimeter of building being constructed, column and rebar installations, formworks, plastering works outside the building painting crane installations and repair and other that may be required by the Establishment safety engineer:
        </p>
        {penaltySystem}
      </div>

      {/* Section D. Ear Muff */}
      <div className="mb-4 ml-5">
        <p className="text-xs text-gray-700 mb-1">
          <strong>D. Ear Muff</strong> - Required for employees engaged in usual noise exposures such as generator tending, heliports, tinsmith works (air conduct assembly)
        </p>
        {penaltySystem}
      </div>

      {/* Section E. Rain Boots (Rubber Boots) */}
      <div className="mb-4 ml-5">
        <p className="text-xs text-gray-700 mb-1">
          <strong>E. Rain Boots (Rubber Boots)</strong> - required for employee engaged in masonry works especially those belonging to pouring and concreting crew those assigned in dewatering works and those operation that wearing of safety shoes in unlikely deterrent.
        </p>
        {penaltySystem}
      </div>

      {/* Section F. Rain Coat */}
      <div className="mb-4 flex-1 ml-5">
        <p className="text-xs text-gray-700 mb-1">
          <strong>F. Rain Coat</strong> - Required during rainy season (a must for all employees working at active level/floor) Site supervisors may opted to send the workers home (discretion of site operations)
        </p>
        {penaltySystem}
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default DocumentPageEleven;
