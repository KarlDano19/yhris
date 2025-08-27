import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageElevenProps {
  data: T_OshProgram;
}

const DocumentPageEleven: React.FC<DocumentPageElevenProps> = ({ data }) => {
  return (
    <>
      {/* General Personal Protective Equipment (PPE) Requirements */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">
          <strong>Face Shield</strong> - Required for jack hammering & grinding operations.
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Goggles</strong> - Required for welding works.
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Dusk Mask</strong> - Required for cement handling and housekeeping operations.
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Respirator</strong> - Required in confined areas (cleaning of tanks etc.), painting, and handling chemical, especially toxic matter.
        </p>
        
        {/* Disciplinary Action Schedule for General PPE */}
        <p className="text-sm text-gray-700 mb-2 mt-2">
          <strong>Disciplinary Action Schedule (applies to the above PPE):</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-sm text-gray-700">• First offense - Written reprimand</li>
          <li className="text-sm text-gray-700">• Second offense - ONE (1) day suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-sm text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* C. Safety Harness & Life Lines */}
      <div className="mb-4 ml-5">
        <p className="text-sm text-gray-700 mb-2">
          <strong>C. Safety Harness & Life Lines</strong> - Required for employees working above 6 ft. where there is a great danger of falling. Examples include the perimeter of a building being constructed, column and rebar installations, formworks, plastering works outside the building, painting crane installations and repair, and other situations as required by the Establishment safety engineer.
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-sm text-gray-700">• First offense - Written reprimand</li>
          <li className="text-sm text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-sm text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* D. Ear Muff */}
      <div className="mb-4 ml-5">
        <p className="text-sm text-gray-700 mb-2">
          <strong>D. Ear Muff</strong> - Required for employees engaged in usual noise exposures such as generator tending, heliports, and tinsmith works (air conduct assembly).
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-sm text-gray-700">• First offense - Written reprimand</li>
          <li className="text-sm text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-sm text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* E. Rain Boots (Rubber Boots) */}
      <div className="mb-4 ml-5">
        <p className="text-sm text-gray-700 mb-2">
          <strong>E. Rain Boots (Rubber Boots)</strong> - Required for employees engaged in masonry works, especially those belonging to pouring and concreting crews, those assigned in dewatering works, and operations where wearing safety shoes is an unlikely deterrent.
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-sm text-gray-700">• First offense - Written reprimand</li>
          <li className="text-sm text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-sm text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* F. Rain Coat */}
      <div className="mb-4 flex-1 ml-5">
        <p className="text-sm text-gray-700 mb-2">
          <strong>F. Rain Coat</strong> - Required during the rainy season (a must for all employees working at an active level/floor). Site supervisors may opt to send workers home (at the discretion of site operations).
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-sm text-gray-700">• First offense - Written reprimand</li>
          <li className="text-sm text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Fourth offense - Seven (7) days suspension</li>
        </ul>
      </div>
    </>
  );
};

export default DocumentPageEleven;
