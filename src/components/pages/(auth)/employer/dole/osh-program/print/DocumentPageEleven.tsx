import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageElevenProps {
  data: T_OshProgram;
}

const DocumentPageEleven: React.FC<DocumentPageElevenProps> = ({ data }) => {
  return (
    <>
      {/* Section 19.0 Cost of implementing company OSH program */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          19.0 Cost of implementing company OSH program
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Php <span className="border-b border-gray-400 px-8">{data.cost_osh_program || ''}</span>; Annual estimated amount for OSH program implementation to include but not
          limited to the following: orientation/training of workers, safety officer, OH personnel,
          purchase and maintenance of PPE, first aid medicine and other medical supplies, safety
          signages and devices, fire safety equipment/tools, safety of equipment (i.e. machine
          guards) etc.
        </p>

        <div className="border border-gray-300">
          <div className="grid grid-cols-2 text-sm font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">OSH Item</div>
            <div className="p-2">Estimated Cost/year</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">PPEs</div>
            <div className="p-2">{data.ppe_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">OSH trainings</div>
            <div className="p-2">{data.osh_training_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Safety Signages</div>
            <div className="p-2">{data.safety_signages_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Machine Guards and related equipment</div>
            <div className="p-2">{data.machine_guards_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Medical examinations</div>
            <div className="p-2">{data.medical_examinations_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Medical supplies/medicines</div>
            <div className="p-2">{data.medical_supplies_cost || ''}</div>
          </div>
          <div className="grid grid-cols-2 text-sm border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Others: <span className="border-b border-gray-400 px-8">{data.others_name || ''}</span></div>
            <div className="p-2">{data.others_cost || ''}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageEleven;
