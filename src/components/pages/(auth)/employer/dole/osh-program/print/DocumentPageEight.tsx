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
        <table className="w-full border-collapse border border-gray-300 mb-4 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Report Submitted</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const reportData = Array.isArray(data.reported_incidents) ? data.reported_incidents : [];
                
                if (reportData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return reportData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.report_submitted || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{formatDate(entry.date)}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                  </tr>
                ));
              }
            })()}
          </tbody>
        </table>
      </div>

      {/* Section 10.0 Provision and use of PPE */}
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          10.0 Provision and use of PPE
        </h2>
        <p className="text-sm text-gray-700 mb-3">
          Issuance of PPE shall be supplemented by training on the application, use, handling, cleaning and maintenance.
        </p>
        <table className="w-full border-collapse border border-gray-300 mb-4 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">PPE provided</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Number of Workers given</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const ppeData = Array.isArray(data.ppe) ? data.ppe : [];
                
                if (ppeData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return ppeData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.ppe_provided || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.number_of_workers_given || ''}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                  </tr>
                ));
              }
            })()}
          </tbody>
        </table>
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
        <table className="w-full border-collapse border border-gray-300 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">FACILITIES</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-center" colSpan={2}>PROVIDED? (YES/NO)</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">REMARKS</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left"></th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-center">YES</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-center">NO</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left"></th>
            </tr>
          </thead>
          <tbody>
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
              <tr key={index}>
                <td className="border border-gray-300 p-2 min-h-[24px] text-sm">
                  {entry.facility}
                </td>
                <td className="border border-gray-300 p-2 min-h-[24px] text-sm text-center">
                  {entry.provided ? '✓' : ''}
                </td>
                <td className="border border-gray-300 p-2 min-h-[24px] text-sm text-center">
                  {!entry.provided ? '✓' : ''}
                </td>
                <td className="border border-gray-300 p-2 min-h-[24px] text-sm">
                  {entry.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentPageEight;
