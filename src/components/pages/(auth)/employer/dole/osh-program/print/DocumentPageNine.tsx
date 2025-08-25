import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageNineProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageNine: React.FC<DocumentPageNineProps> = ({ data, isMultiPage = false, pageNumber = 9 }) => {

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
      {/* Top Section - Worker Facilities Continuation */}
      <div className="mb-6">
        <div className="border border-gray-300">
          <div className="grid grid-cols-[2fr_1fr_1fr] text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">FACILITIES</div>
            <div className="p-2 border-r border-gray-300 text-center">PROVIDED? (YES/NO)</div>
            <div className="p-2">REMARKS</div>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr] text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300"></div>
            <div className="grid grid-cols-2 border-r border-gray-300">
              <div className="p-2 border-r border-gray-300 text-center">YES</div>
              <div className="p-2 text-center">NO</div>
            </div>
            <div className="p-2"></div>
          </div>
          {[
            {
              facility: 'c. Suitable living accommodation (if applicable)',
              provided: data.suitable_living_accommodation,
              remarks: data.suitable_living_accommodation_remarks || ''
            },
            {
              facility: 'd. Separate sanitary, washing and sleeping facilities (if applicable)',
              provided: data.separate_sanitary_washing_and_sleeping_facilities,
              remarks: data.separate_sanitary_washing_and_sleeping_facilities_remarks || ''
            },
            {
              facility: 'e. Lactation station (in consonance with DOLE D.O. 143-15)',
              provided: data.lactation_station,
              remarks: data.lactation_station_remarks || ''
            },
            {
              facility: 'f. Ramps, railings, and the like',
              provided: data.ramps_railings_and_like,
              remarks: data.ramps_railings_and_like_remarks || ''
            },
            {
              facility: 'g. Other workers\' welfare facilities as prescribed by OSHS and other related issuances',
              provided: data.other_workers_welfare_facilities,
              remarks: data.other_workers_welfare_facilities_remarks || ''
            }
          ].map((entry, index) => (
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-xs border-b border-gray-300 last:border-b-0">
              <div className="p-2 border-r border-gray-300 min-h-[24px]">
                {entry.facility}
              </div>
              <div className="grid grid-cols-2 border-r border-gray-300">
                <div className="p-2 border-r border-gray-300 min-h-[24px] text-center">
                  {entry.provided ? '✓' : ''}
                </div>
                <div className="p-2 min-h-[24px] text-center">
                  {!entry.provided ? '✓' : ''}
                </div>
              </div>
              <div className="p-2 min-h-[24px]">
                {entry.remarks}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 14.0 Emergency and Disaster Preparedness */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          14.0 Emergency and Disaster Preparedness
        </h2>
        
        {/* 14.1 Written Emergency and Disaster Program */}
        <div className="mb-4 ml-5">
          <div className="flex items-center mb-2">
            <span className="text-xs font-medium text-gray-700 mr-4">14.1 Written Emergency and Disaster Program</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">Yes</span>
                <span className="text-xs text-gray-700">({data.written_emergency_program ? '✓' : ''})</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">No</span>
                <span className="text-xs text-gray-700">({!data.written_emergency_program ? '✓' : ''})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 14.2 Types and number of Drills conducted */}
        <div className="mb-4 ml-5">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            14.2 Types and number of Drills conducted
          </h3>
          <div className="border border-gray-300">
            <div className="grid grid-cols-3 text-xs font-medium bg-gray-50 border-b border-gray-300">
              <div className="p-2 border-r border-gray-300">Type of Drills (fire, earthquake)</div>
              <div className="p-2 border-r border-gray-300">Date</div>
              <div className="p-2">Responsible person/position</div>
            </div>
            {(() => {
              try {
                const drillData = Array.isArray(data.emergency_drills) ? data.emergency_drills : [];
                const rows = Math.max(3, drillData.length);
                
                return [...Array(rows)].map((_, index) => {
                  const entry = drillData[index] || {};
                  return (
                    <div key={index} className="grid grid-cols-3 text-xs border-b border-gray-300 last:border-b-0">
                      <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.type_of_drills || ''}</div>
                      <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.date || ''}</div>
                      <div className="p-2 min-h-[24px]">{entry.responsible_person || ''}</div>
                    </div>
                  );
                });
              } catch (error) {
                return [...Array(3)].map((_, index) => (
                  <div key={index} className="grid grid-cols-3 text-xs border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                    <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                    <div className="p-2 min-h-[24px]"></div>
                  </div>
                ));
              }
            })()}
          </div>
        </div>
      </div>

      {/* Section 15.0 Solid Waste Management System */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          15.0 Solid Waste Management System
        </h2>
        
        {/* Written Pollution Control Program */}
        <div className="mb-4 ml-5">
          <div className="flex items-center mb-2">
            <span className="text-xs font-medium text-gray-700 mr-4">Written Pollution Control Program</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">Yes</span>
                <span className="text-xs text-gray-700">({data.written_pollution_control_program ? '✓' : ''})</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">No</span>
                <span className="text-xs text-gray-700">({!data.written_pollution_control_program ? '✓' : ''})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Name of Pollution Control Officer */}
        <div className="mb-4 ml-5">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">Name of Pollution Control Officer:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.pollution_control_officer || ''}
            </div>
          </div>
        </div>

        {/* Subsection 1. OIL LEAKS AND SPILLAGE */}
        <div className="mb-4 ml-5">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            1. OIL LEAKS AND SPILLAGE
          </h3>
          <ul className="list-none pl-4 space-y-1">
            <li className="text-xs text-gray-700">• Implement proper storage and handling of fuel and lubricants</li>
            <li className="text-xs text-gray-700">• Provide oil catch or drip trays.</li>
            <li className="text-xs text-gray-700">• Clean up immediately any spillage and leak</li>
            <li className="text-xs text-gray-700">• Utilize only equipment in good condition. Disallow entry of equipment with leaks into the Establishment</li>
            <li className="text-xs text-gray-700">• Deploy fire extinguisher in fuel and oil storage areas</li>
          </ul>
        </div>

        {/* Subsection 2. GARBAGE */}
        <div className="mb-4 ml-5">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            2. GARBAGE
          </h3>
          <ul className="list-none pl-4 space-y-1">
            <li className="text-xs text-gray-700">• Designate garbage collection area</li>
            <li className="text-xs text-gray-700">• Clean up the site daily</li>
            <li className="text-xs text-gray-700">• Dispose garbage off site regularly and frequently</li>
            <li className="text-xs text-gray-700">• Disallow eating in the work areas</li>
            <li className="text-xs text-gray-700">• Designate mess hall area away from the work areas.</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default DocumentPageNine;
