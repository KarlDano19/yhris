import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageNineProps {
  data: T_OshProgram;
}

const DocumentPageNine: React.FC<DocumentPageNineProps> = ({ data }) => {
  // Format date to readable format (MM/DD/YYYY)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <>
      {/* Top Section - Worker Facilities Continuation */}
      <div className="mb-6">
        <div className="border border-gray-300">
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
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-sm border-b border-gray-300 last:border-b-0">
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
            <span className="text-sm font-medium text-gray-700 mr-4">14.1 Written Emergency and Disaster Program</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Yes</span>
                <span className="text-sm text-gray-700">({data.written_emergency_and_disaster_program === true ? '✓' : ''})</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">No</span>
                <span className="text-sm text-gray-700">({data.written_emergency_and_disaster_program === false ? '✓' : ''})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 14.2 Types and number of Drills conducted */}
        <div className="mb-4 ml-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            14.2 Types and number of Drills conducted
          </h3>
          <div className="border border-gray-300">
            <div className="grid grid-cols-3 text-sm font-medium bg-gray-50 border-b border-gray-300">
              <div className="p-2 border-r border-gray-300">Type of Drills (fire, earthquake)</div>
              <div className="p-2 border-r border-gray-300">Date</div>
              <div className="p-2">Responsible person/position</div>
            </div>
            {(() => {
              try {
                const drillData = Array.isArray(data.drills) ? data.drills : [];
                
                if (drillData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(3)].map((_, index) => (
                    <div key={index} className="grid grid-cols-3 text-sm border-b border-gray-300 last:border-b-0">
                      <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                      <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                      <div className="p-2 min-h-[24px]"></div>
                    </div>
                  ));
                }
                
                // Show actual data
                return drillData.map((entry, index) => (
                  <div key={index} className="grid grid-cols-3 text-sm border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.type_of_drills || ''}</div>
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{formatDate(entry.date)}</div>
                    <div className="p-2 min-h-[24px]">{entry.responsible_person_position || ''}</div>
                  </div>
                ));
              } catch (error) {
                return [...Array(3)].map((_, index) => (
                  <div key={index} className="grid grid-cols-3 text-sm border-b border-gray-300 last:border-b-0">
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
            <span className="text-sm font-medium text-gray-700 mr-4">Written Pollution Control Program</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Yes</span>
                <span className="text-sm text-gray-700">({data.written_pollution_control_program ? '✓' : ''})</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">No</span>
                <span className="text-sm text-gray-700">({!data.written_pollution_control_program ? '✓' : ''})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Name of Pollution Control Officer */}
        <div className="mb-4 ml-5">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Name of Pollution Control Officer:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.polution_control_officer || ''}
            </div>
          </div>
        </div>

        {/* Waste Management System Content */}
        {data.waste_management_system_message && (
          <div className="mb-4 ml-5">
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none [&>p]:mb-3 [&>ul]:ml-4 [&>ol]:ml-4 [&>li]:mb-1"
              dangerouslySetInnerHTML={{ __html: data.waste_management_system_message }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPageNine;
