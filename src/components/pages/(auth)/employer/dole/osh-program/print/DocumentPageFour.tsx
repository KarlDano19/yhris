import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageFourProps {
  data: T_OshProgram;
}

const DocumentPageFour: React.FC<DocumentPageFourProps> = ({ data }) => {
  return (
    <>
      {/* Document Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          2.0 General Safety and Health Programs
        </h1>
      </div>

      {/* Section 2.1 Conduct of Risk Assessment */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          2.1 Conduct of Risk Assessment
        </h2>
        <p className="text-xs text-gray-700 mb-3">
          Kindly accomplish. Pls use additional pages if needed. You may also wish to attach your Company&apos;s Risk Assessment Matrix as substitute.
        </p>

        {/* Risk Assessment Matrix Table */}
        <div className="mb-3">
          <h3 className="text-xs font-medium text-gray-900 mb-1">Risk Assessment Matrix</h3>
          <div className="border border-gray-300">
            <div className="grid grid-cols-5 bg-gray-100 text-xs font-medium text-gray-900">
              <div className="p-2 border-r border-gray-300">Task</div>
              <div className="p-2 border-r border-gray-300">Hazard Identified</div>
              <div className="p-2 border-r border-gray-300">Risk Description</div>
              <div className="p-2 border-r border-gray-300">Priority: likelihood of injury and illness to occur (low, medium, high)</div>
              <div className="p-2">Control Measures</div>
            </div>
            {(() => {
              try {
                const riskData = typeof data.emergency_and_disaster_preparedness === 'string' 
                  ? JSON.parse(data.emergency_and_disaster_preparedness) 
                  : data.emergency_and_disaster_preparedness || [];
                
                const entries = Array.isArray(riskData) ? riskData : [];
                
                return [...Array(Math.max(6, entries.length))].map((_, index) => {
                  const entry = entries[index] || {};
                  return (
                    <div key={index} className="grid grid-cols-5 border-t border-gray-300">
                      <div className="p-2 border-r border-gray-300 min-h-[20px] text-xs">
                        {entry.task || ''}
                      </div>
                      <div className="p-2 border-r border-gray-300 min-h-[20px] text-xs">
                        {entry.hazard_identified || ''}
                      </div>
                      <div className="p-2 border-r border-gray-300 min-h-[20px] text-xs">
                        {entry.risk_description || ''}
                      </div>
                      <div className="p-2 border-r border-gray-300 min-h-[20px] text-xs">
                        {entry.priority || ''}
                      </div>
                      <div className="p-2 min-h-[20px] text-xs">
                        {entry.control_measures || ''}
                      </div>
                    </div>
                  );
                });
              } catch (error) {
                return [...Array(6)].map((_, index) => (
                  <div key={index} className="grid grid-cols-5 border-t border-gray-300">
                    <div className="p-2 border-r border-gray-300 min-h-[20px]"></div>
                    <div className="p-2 border-r border-gray-300 min-h-[20px]"></div>
                    <div className="p-2 border-r border-gray-300 min-h-[20px]"></div>
                    <div className="p-2 border-r border-gray-300 min-h-[20px]"></div>
                    <div className="p-2 min-h-[20px]"></div>
                  </div>
                ));
              }
            })()}
          </div>
        </div>
      </div>

      {/* Section 2.2 Medical Surveillance */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          2.2 Medical Surveillance
        </h2>
        <p className="text-xs text-gray-700 mb-3">
          The company will require all employees to undergo a baseline or initial medical health examination prior to assigning to a potentially hazardous activity. The examination will include but not limited to the following:
        </p>
        
        <div className="space-y-2">
          {/* a. Routine */}
          <div className="flex items-start">
            <span className="text-xs text-gray-700 mr-2 w-4 flex-shrink-0">a.</span>
            <div className="flex-1">
              <span className="text-xs text-gray-700">Routine:</span>
              <div className="ml-4 mt-1 space-y-1">
                <div className="flex items-center">
                  <span className="text-xs text-gray-700 mr-2">( )</span>
                  <span className="text-xs text-gray-700">CBC</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Chest X-ray</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Urinalysis</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Stool exam</span>
                </div>
              </div>
            </div>
          </div>

          {/* b. Special */}
          <div className="flex items-start">
            <span className="text-xs text-gray-700 mr-2 w-4 flex-shrink-0">b.</span>
            <div className="flex-1">
              <span className="text-xs text-gray-700">Special:</span>
              <div className="ml-4 mt-1 space-y-1">
                <div className="flex items-center">
                  <span className="text-xs text-gray-700 mr-2">( )</span>
                  <span className="text-xs text-gray-700">Blood Chemistry</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">ECG</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">others, please specify:</span>
                  <div className="border-b border-gray-300 w-20 pb-1 min-h-[16px] ml-2">
                    {/* Special surveillance data would go here */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* c. Schedule */}
          <div className="flex items-start">
            <span className="text-xs text-gray-700 mr-2 w-4 flex-shrink-0">c.</span>
            <div className="flex-1">
              <span className="text-xs text-gray-700">Schedule of Annual medical examination:</span>
              <div className="ml-4 mt-1">
                <div className="flex items-center">
                  <span className="text-xs text-gray-700 mr-2">( )</span>
                  <span className="text-xs text-gray-700">Q1</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Q2</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Q3</span>
                  <span className="text-xs text-gray-700 mr-2 ml-4">( )</span>
                  <span className="text-xs text-gray-700">Q4</span>
                </div>
              </div>
            </div>
          </div>

          {/* d. Drug Testing */}
          <div className="flex items-start">
            <span className="text-xs text-gray-700 mr-2 w-4 flex-shrink-0">d.</span>
            <div className="flex-1">
              <span className="text-xs text-gray-700">Is random drug testing conducted?</span>
              <div className="ml-4 mt-1">
                <div className="flex items-center">
                  <span className="text-xs text-gray-700 mr-2">Yes</span>
                  <div className="border-b border-gray-300 w-16 pb-1 min-h-[16px] mr-4">
                    {data.random_drug_testing ? 'Yes' : ''}
                  </div>
                  <span className="text-xs text-gray-700 mr-2">when</span>
                  <div className="border-b border-gray-300 w-16 pb-1 min-h-[16px] mr-4"></div>
                  <span className="text-xs text-gray-700 mr-2">No</span>
                  <span className="text-xs text-gray-700">( )</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2.3 First-Aid, Health Care Medicines and Equipment Facilities */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          2.3 First-Aid, Health Care Medicines and Equipment Facilities
        </h2>
      </div>
    </>
  );
};

export default DocumentPageFour;
