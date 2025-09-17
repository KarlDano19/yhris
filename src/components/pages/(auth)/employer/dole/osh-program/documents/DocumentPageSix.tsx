import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageSixProps {
  data: T_OshProgram;
}

const DocumentPageSix: React.FC<DocumentPageSixProps> = ({ data }) => {
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-repeat-header thead {
              display: table-row-group !important;
            }
            .no-repeat-header thead tr {
              page-break-after: avoid !important;
            }
          }
        `
      }} />
      {/* Top Section - Joint Coordinating Committee (continued from previous page) */}
      <div id="document-page-6" className="mb-4 ml-5">
        <p className="text-sm text-gray-700 mb-2">
          <strong>(c)</strong> Joint Coordinating Committee: For two (2) or more establishments housed under one building or complex including malls.
        </p>
        <div className="ml-4 space-y-3">
          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-700 mr-2">Chairperson:</span>
            <div className="flex-1">
              <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                {data.chairperson_joint_coordinating}
              </div>
              <div className="text-sm text-gray-600 mt-1">(Name of Building owner or his/her representative such as the building administrator)</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-700 mr-2">Secretary:</span>
            <div className="flex-1">
              <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                {data.secretary_joint_coordinating}
              </div>
              <div className="text-sm text-gray-600 mt-1">(Name of Safety officer appointed by the Chairperson)</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-700 mr-2">Members:</span>
            <div className="flex-1">
              <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                {data.ex_officio_members_3}
              </div>
              <div className="text-sm text-gray-600 mt-1">(Name of 2 safety officers from the building selected to the Joint OSH Committee)</div>
              <div className="border-b border-gray-300 pb-1 min-h-[16px] mt-2">
                {data.ex_officio_members_4}
              </div>
              <div className="text-sm text-gray-600 mt-1">(Name of two (2) workers&apos; representatives one from which must be from a union if organized from any establishments under the building)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Safety and Health Committee Minutes/Reports */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mt-2 mb-3">
          (All members of the HSC shall perform their duties and responsibilities by the OSH law and its implementing guidelines.)
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Safety and Health Committee Minutes/Reports submitted to DOLE (pls attach latest OSH committee minutes/report)
        </p>
        <div className="ml-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Yes</span>
            <div className={`border border-gray-300 w-4 h-4 mr-4 flex items-center justify-center ${data.duties_and_responsibilities === true ? 'bg-gray-300' : 'bg-white'}`}>
              {data.duties_and_responsibilities === true ? '✓' : ''}
            </div>
            <span className="text-sm text-gray-700 mr-2">No</span>
            <div className={`border border-gray-300 w-4 h-4 flex items-center justify-center ${data.duties_and_responsibilities === false ? 'bg-gray-300' : 'bg-white'}`}>
              {data.duties_and_responsibilities === false ? '✓' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section - 6.0 OSH Personnel and Facilities */}
      <div className="mb-4 flex-1">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          6.0 OSH Personnel and Facilities
        </h2>

        {/* Sub-section 6.1 Safety Officer */}
        <div className="mb-4 ml-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            6.1 Safety Officer
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Safety Officer(s): (attach certificate of training/s prescribed by DOLE) (please use additional sheets as necessary)
          </p>
          
          {/* Safety Officers Table */}
          <table className="w-full border-collapse border border-gray-300 no-repeat-header">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Name of Safety Officer(s):</th>
                <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Training(s) (kindly include number of hours)</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                try {
                  const safetyOfficersData = Array.isArray(data.safety_officers) ? data.safety_officers : [];
                  
                  if (safetyOfficersData.length === 0) {
                    // Show empty rows only if no data
                    return [...Array(4)].map((_, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 min-h-[20px] text-sm"></td>
                        <td className="border border-gray-300 p-2 min-h-[20px] text-sm"></td>
                      </tr>
                    ));
                  }
                  
                  // Show actual data
                  return safetyOfficersData.map((officer, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[20px] text-sm">
                        {officer.name || ''}
                      </td>
                      <td className="border border-gray-300 p-2 min-h-[20px] text-sm">
                        {officer.training_and_hours || ''}
                      </td>
                    </tr>
                  ));
                } catch (error) {
                  return [...Array(4)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[20px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[20px] text-sm"></td>
                    </tr>
                  ));
                }
              })()}
            </tbody>
          </table>
        </div>

        {/* Sub-section 6.2 Emergency Occupational Health Personnel and Facilities */}
        <div className="mb-4 ml-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            6.2 Emergency Occupational Health Personnel and Facilities
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            List of competent emergency health personnel within the worksite duly complemented
            by adequate medical supplies, equipment and facilities based on the total number of
            workers. (Use additional sheet if necessary and attach all required training certificates in
            this section.)
          </p>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Emergency Health Personnel and Facilities
          </h2>
        </div>
      </div>
    </>
  );
};

export default DocumentPageSix;
