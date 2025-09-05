import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageElevenProps {
  data: T_OshProgram;
}

const DocumentPageEleven: React.FC<DocumentPageElevenProps> = ({ data }) => {
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
      {/* Section 19.0 Cost of implementing company OSH program */}
      <div id="document-page-11" className="mb-6 mt-6 flex-1">
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

        <table className="w-full border-collapse border border-gray-300 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">OSH Item</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Estimated Cost/year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">PPEs</td>
              <td className="border border-gray-300 p-2 text-sm">{data.ppe_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">OSH trainings</td>
              <td className="border border-gray-300 p-2 text-sm">{data.osh_training_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">Safety Signages</td>
              <td className="border border-gray-300 p-2 text-sm">{data.safety_signages_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">Machine Guards and related equipment</td>
              <td className="border border-gray-300 p-2 text-sm">{data.machine_guards_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">Medical examinations</td>
              <td className="border border-gray-300 p-2 text-sm">{data.medical_examinations_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">Medical supplies/medicines</td>
              <td className="border border-gray-300 p-2 text-sm">{data.medical_supplies_cost || ''}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">Others: <span className="border-b border-gray-400 px-8">{data.others_name || ''}</span></td>
              <td className="border border-gray-300 p-2 text-sm">{data.others_cost || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentPageEleven;
