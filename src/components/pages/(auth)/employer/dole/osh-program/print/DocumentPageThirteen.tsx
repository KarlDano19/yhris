import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageThirteenProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
}

const DocumentPageThirteen: React.FC<DocumentPageThirteenProps> = ({ data, isMultiPage = false }) => {

  return (
    <div
      className="bg-white text-black font-sans text-sm leading-tight w-full h-full p-8 flex flex-col"
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Section - Prohibited Acts and Penalties/Sanctions */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          9. Tampering of Electrical Wiring connection and fuse boxes (breaker)
        </h3>
        <ul className="list-none pl-4 space-y-1">
          <li className="text-sm text-gray-700">• First offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Second offense - Five (5) days suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Ten (10) days suspension</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          10. Allowing other workers/employees to ride in heavy equipment other than the operator and outside cab of vehicles.
        </h3>
        <p className="text-sm text-gray-700 mb-2">Operator shall be given:</p>
        <ul className="list-none pl-4 space-y-1">
          <li className="text-sm text-gray-700">• First offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Second offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Seven (7) days suspension</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          11. Horse playing
        </h3>
        <ul className="list-none pl-4 space-y-1">
          <li className="text-sm text-gray-700">• First offense - One (1) day suspension</li>
          <li className="text-sm text-gray-700">• Second offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Seven (7) days suspension</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          12. Fist fighting/ Provoking fight
        </h3>
        <ul className="list-none pl-4 space-y-1">
          <li className="text-sm text-gray-700">• First offense - Three (3) days suspension</li>
          <li className="text-sm text-gray-700">• Second offense - Seven (7) days suspension</li>
          <li className="text-sm text-gray-700">• Third offense - Dismissal</li>
        </ul>
      </div>

      {/* Section 19.0 Cost of implementing company OSH program */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          19.0 Cost of implementing company OSH program
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Php <span className="border-b border-gray-400 px-8">{data.estimated_annual_cost || ''}</span>; Annual estimated amount for OSH program implementation to include but not
          limited to the following: orientation/training of workers, safety officer, OH personnel,
          purchase and maintenance of PPE, first aid medicine and other medical supplies, safety
          signages and devices, fire safety equipment/tools, safety of equipment (i.e. machine
          guards) etc.
        </p>

        <div className="border border-gray-300">
          <div className="grid grid-cols-2 text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">OSH Item</div>
            <div className="p-2">Estimated Cost/year</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">PPEs</div>
            <div className="p-2">{data.ppes_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">OSH trainings</div>
            <div className="p-2">{data.osh_trainings_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Safety Signages</div>
            <div className="p-2">{data.safety_signages_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Machine Guards and related equipment</div>
            <div className="p-2">{data.machine_guards_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Medical examinations</div>
            <div className="p-2">{data.medical_examinations_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-xs border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Medical supplies/medicines</div>
            <div className="p-2">{data.medical_supplies_cost || ''}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "mt-8" : "mt-auto"}>
        <span className="text-sm text-gray-600">Page | 13</span>
      </div>
    </div>
  );
};

export default DocumentPageThirteen;
