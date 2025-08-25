import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageSixProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageSix: React.FC<DocumentPageSixProps> = ({ data, isMultiPage = false, pageNumber = 6 }) => {

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
      {/* Top Section - Joint Coordinating Committee (continued from previous page) */}
      <div className="mb-4">
        <p className="text-xs text-gray-700 mb-2">
          <strong>(c)</strong> Joint Coordinating Committee: For two (2) or more establishments housed under one building or complex including malls.
        </p>
        <div className="ml-4 space-y-2">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">Chairperson:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.chairperson_joint_coordinating}
            </div>
            <span className="text-xs text-gray-600 ml-2">(Name of Building owner or his/her representative such as the building administrator)</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">Secretary:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.secretary_joint_coordinating}
            </div>
            <span className="text-xs text-gray-600 ml-2">(Name of Safety officer appointed by the Chairperson)</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">Members:</span>
          </div>
          <div className="ml-4 space-y-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-700 mr-2">•</span>
              <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] mr-2">
                {data.ex_officio_members_3}
              </div>
              <span className="text-xs text-gray-600">(Name of 2 safety officers from the building selected to the Joint OSH Committee)</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 mr-2">•</span>
              <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] mr-2">
                {data.ex_officio_members_4}
              </div>
              <span className="text-xs text-gray-600">(Name of two (2) workers&apos; representatives one from which must be from a union if organized from any establishments under the building)</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          (All members of the HSC shall perform their duties and responsibilities by the OSH law and its implementing guidelines.)
        </p>
      </div>

      {/* Middle Section - Safety and Health Committee Minutes/Reports */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-700 mr-2">Safety and Health Committee Minutes/Reports submitted to DOLE (pls attach latest OSH committee minutes/report)</span>
        </div>
        <div className="ml-4 space-y-1">
          <div className="flex items-center">
            <span className="text-xs text-gray-700 mr-2">Yes</span>
            <span className="text-xs text-gray-700 mr-2">( )</span>
            <span className="text-xs text-gray-700 mr-2">No</span>
            <span className="text-xs text-gray-700">( )</span>
          </div>
        </div>
      </div>

      {/* Main Section - 6.0 OSH Personnel and Facilities */}
      <div className="mb-4 flex-1">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          6.0 OSH Personnel and Facilities
        </h2>

        {/* Sub-section 6.1 Safety Officer */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            6.1 Safety Officer
          </h3>
          <p className="text-xs text-gray-700 mb-3">
            Safety Officer(s): (attach certificate of training/s prescribed by DOLE) (please use additional sheets as necessary)
          </p>
          
          {/* Safety Officers Table */}
          <div className="border border-gray-300">
            <div className="grid grid-cols-2 bg-gray-100 text-xs font-medium text-gray-900">
              <div className="p-2 border-r border-gray-300">Name of Safety Officer(s):</div>
              <div className="p-2">Training(s) (kindly include number of hours)</div>
            </div>
            {(() => {
              try {
                const safetyOfficersData = Array.isArray(data.safety_officers) ? data.safety_officers : [];
                const rows = Math.max(4, safetyOfficersData.length);
                
                return [...Array(rows)].map((_, index) => {
                  const officer = safetyOfficersData[index] || {};
                  return (
                    <div key={index} className="grid grid-cols-2 border-t border-gray-300">
                      <div className="p-2 border-r border-gray-300 min-h-[20px] text-xs">
                        {officer.name || ''}
                      </div>
                      <div className="p-2 min-h-[20px] text-xs">
                        {officer.training_and_hours || ''}
                      </div>
                    </div>
                  );
                });
              } catch (error) {
                return [...Array(4)].map((_, index) => (
                  <div key={index} className="grid grid-cols-2 border-t border-gray-300">
                    <div className="p-2 border-r border-gray-300 min-h-[20px]"></div>
                    <div className="p-2 min-h-[20px]"></div>
                  </div>
                ));
              }
            })()}
          </div>
        </div>

        {/* Sub-section 6.2 Emergency Occupational Health Personnel and Facilities */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            6.2 Emergency Occupational Health Personnel and Facilities
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-700 mr-2">Personnel:</span>
              <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                {/* Health personnel data would be displayed here */}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-700 mr-2">Facilities:</span>
              <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                {/* Health facilities data would be displayed here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default DocumentPageSix;
