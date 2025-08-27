import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageEightProps {
  data: T_OshProgram;
}

const DocumentPageEight: React.FC<DocumentPageEightProps> = ({ data }) => {
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
      {/* Top Section - Work Accident Reporting */}
      <div className="mb-2">
        <p className="text-sm text-gray-700 mb-2">
          After the conduct of investigation, the company shall prepare and submit work accident report using the prescribed form (WAIR).
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Moreover, other work accidents resulting to disabling injuries such as Permanent Partial Disability and Temporary Total Disability shall be reported to the DOLE Regional Office within 30 days after the date of occurrence of accident using the DOLE prescribed form (WAIR).
        </p>
        <p className="text-sm text-gray-700 mb-2">
          All near misses shall be recorded and reported. A system for notification and reporting of work accidents including near misses within the company shall be developed and reviewed by the OSH Committee as necessary.
        </p>
        <p className="text-sm text-gray-700 mb-3">
          (Kindly submit reports on the following: Work Accident /Injury Report (WAIR), Annual Exposure Data Report (AEDR), Annual Medical Report (AMR))
        </p>

        {/* Report Submission Table */}
        <div className="border border-gray-300 mb-4">
          <div className="grid grid-cols-2 text-sm font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Report Submitted</div>
            <div className="p-2">Date</div>
          </div>
          {(() => {
            try {
              const reportData = Array.isArray(data.reported_incidents) ? data.reported_incidents : [];
              
              if (reportData.length === 0) {
                // Show empty rows only if no data
                return [...Array(5)].map((_, index) => (
                  <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                    <div className="p-2 min-h-[24px]"></div>
                  </div>
                ));
              }
              
              // Show actual data
              return reportData.map((entry, index) => (
                <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.report_submitted || ''}</div>
                  <div className="p-2 min-h-[24px]">{formatDate(entry.date)}</div>
                </div>
              ));
            } catch (error) {
              return [...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>
      </div>

      {/* Section 10.0 Provision and use of PPE */}
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          10.0 Provision and use of PPE
        </h2>
        <p className="text-sm text-gray-700 mb-3">
          Issuance of PPE shall be supplemented by training on the application, use, handling, cleaning and maintenance.
        </p>
        <div className="border border-gray-300 mb-4">
          <div className="grid grid-cols-2 text-sm font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">PPE provided</div>
            <div className="p-2">Number of Workers given</div>
          </div>
          {(() => {
            try {
              const ppeData = Array.isArray(data.ppe) ? data.ppe : [];
              
              if (ppeData.length === 0) {
                // Show empty rows only if no data
                return [...Array(5)].map((_, index) => (
                  <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                    <div className="p-2 min-h-[24px]"></div>
                  </div>
                ));
              }
              
              // Show actual data
              return ppeData.map((entry, index) => (
                <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.ppe_provided || ''}</div>
                  <div className="p-2 min-h-[24px]">{entry.number_of_workers_given || ''}</div>
                </div>
              ));
            } catch (error) {
              return [...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>
      </div>

      {/* Section 11.0 Safety Signage */}
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          11.0 Safety Signage
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          The safety signages include warning to workers and employees and the public about the hazards within the workplace.
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Type of Safety Signage: Kindly attach picture.
        </p>
      </div>

      {/* Section 12.0 Dust control and management */}
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          12.0 Dust control and management and regulation on activities such as building of temporary structures and lifting and operation of electrical, mechanical, communications system and other requirements
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Kindly attach dust control procedures, plans on temporary structures, permits applicable for the operation of electrical, mechanical, communications systems and other requirements
        </p>
      </div>

      {/* Section 13.0 Workers Facilities Provided */}
      <div className="flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          13.0 Workers Facilities Provided
        </h2>
        <div className="border border-gray-300">
          <div className="grid grid-cols-[2fr_1fr_1fr] text-sm font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">FACILITIES</div>
            <div className="p-2 border-r border-gray-300 text-center">PROVIDED? (YES/NO)</div>
            <div className="p-2">REMARKS</div>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr] text-sm font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300"></div>
            <div className="grid grid-cols-2 border-r border-gray-300">
              <div className="p-2 border-r border-gray-300 text-center">YES</div>
              <div className="p-2 text-center">NO</div>
            </div>
            <div className="p-2"></div>
          </div>
          {[
            {
              facility: 'a. Adequate supply of drinking water',
              provided: data.adequate_supply_of_drinking_water,
              remarks: data.adequate_supply_of_drinking_water_remarks || ''
            },
            {
              facility: 'b. Adequate sanitary and washing facilities',
              provided: data.adequate_sanitary_and_washing_facilities,
              remarks: data.adequate_sanitary_and_washing_facilities_remarks || ''
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
    </>
  );
};

export default DocumentPageEight;
