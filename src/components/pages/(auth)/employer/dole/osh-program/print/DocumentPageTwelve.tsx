import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTwelveProps {
  data: T_OshProgram;
}

const DocumentPageTwelve: React.FC<DocumentPageTwelveProps> = ({ data }) => {
  return (
    <>
      {/* Page Header - Continuation from previous page */}
      <div className="mb-4 ml-10">
        <p className="text-xs text-gray-700 mb-2">
        • Fifth offense - Dismissal
        </p>
      </div>

      {/* G. Hand Gloves */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2 ml-5">
          <strong>G. Hand Gloves</strong> - Required for employees engaged in material handling, steelworks, welding operations, tinsmith, and chipping works.
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Written reprimand</li>
          <li className="text-xs text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-xs text-gray-700">• Third offense - Three (3) days suspension</li>
          <li className="text-xs text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* 2. Smoking at Restricted Area */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2 ">
          <strong>2. Smoking at Restricted Area</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - One (1) day suspension</li>
          <li className="text-xs text-gray-700">• Second offense - Three (3) days suspension</li>
          <li className="text-xs text-gray-700">• Third offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Fourth offense - Dismissal</li>
        </ul>
      </div>

      {/* 3. Unauthorized used/tinkering playing of fire fighting equipments */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>3. Unauthorized used/tinkering playing of fire fighting equipments</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Three (3) days suspension</li>
          <li className="text-xs text-gray-700">• Second offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Third offense - Dismissal</li>
        </ul>
      </div>

      {/* 4. Driving under the influence of Liquor */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>4. Driving under the influence of Liquor that resulted into a Vehicular Accident</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Dismissal and to pay incurred damages.</li>
        </ul>
      </div>

      {/* 5. Failure to report personal accident */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>5. Failure to report his/her personal accident (work connected within 24 hrs. at the Establishment clinic and/or advise his/her immediate superior)</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - One (1) day suspension</li>
          <li className="text-xs text-gray-700">• Second offense - Five (5) days suspension</li>
        </ul>
      </div>

      {/* 6. Failure to observe speed limit */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>6. Failure to observe the 20 KPH speed limit at the construction site</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Written reprimand</li>
          <li className="text-xs text-gray-700">• Second offense - One (1) day suspension</li>
          <li className="text-xs text-gray-700">• Third offense - Third (3) days suspension</li>
          <li className="text-xs text-gray-700">• Fourth offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Fifth offense - Dismissal</li>
        </ul>
      </div>

      {/* 7. Deliberate removal/tampering of safety signs */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>7. Deliberate removal/tampering of safety signs and foster including traffic signs on site (unauthorized)</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Second offense - Dismissal</li>
        </ul>
      </div>

      {/* 8. Unhygienic Practice */}
      <div className="mb-4 flex-1">
        <p className="text-xs text-gray-700 mb-2">
          <strong>8. Unhygienic Practice (Urinating, removal of vowel elsewhere on site other than the prescribed area)</strong>
        </p>
        <ul className="list-none pl-4 space-y-1 ml-5">
          <li className="text-xs text-gray-700">• First offense - Three (3) days suspension</li>
          <li className="text-xs text-gray-700">• Second offense - Seven (7) days suspension</li>
          <li className="text-xs text-gray-700">• Third offense - Dismissal</li>
        </ul>
      </div>
    </>
  );
};

export default DocumentPageTwelve;
