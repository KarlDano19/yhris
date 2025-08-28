import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageSevenProps {
  data: T_OshProgram;
}

const DocumentPageSeven: React.FC<DocumentPageSevenProps> = ({ data }) => {
  // Debug: Log the data
  console.log('DocumentPageSeven - health_training:', data.health_training);
  console.log('DocumentPageSeven - risk_assessment:', data.risk_assessment);
  console.log('DocumentPageSeven - safety_meeting:', data.safety_meeting);
  console.log('DocumentPageSeven - data:', data);
  
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
      {/* Top Section - Emergency Health Personnel and Facilities */}
      <div className="mb-6 ml-5">

        <table className="w-full border-collapse border border-gray-300 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Shift/Area/unit/<br />Department</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Total number of workers/areas</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-center" colSpan={2}>Health Personnel & Facilities</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left"></th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left"></th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Health (First-aider, Physician, Dentist)</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Facilities (Treatment Room/Clinic/Hospital)</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const healthPersonnelData = Array.isArray(data.health_personnel) ? data.health_personnel : [];
                
                if (healthPersonnelData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(3)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return healthPersonnelData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.shift_area_department || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.total_workers || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.health_personnel_name || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.facilities || ''}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(3)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                  </tr>
                ));
              }
            })()}
          </tbody>
        </table>
      </div>

      {/* Section 7.0 Safety and Health Promotion, training and education provided to workers */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          7.0 Safety and Health Promotion, training and education provided to workers
        </h2>
        <ul className="list-none pl-4 mb-4 space-y-1">
          <li className="text-sm text-gray-700">--Orientation of all workers on OSH</li>
          <li className="text-sm text-gray-700">-Conduct of Risk Assessment, evaluation and Control</li>
          <li className="text-sm text-gray-700">-*Continuing training on OSH for OSH Personnel</li>
          <li className="text-sm text-gray-700">-*Work permit System</li>
        </ul>
        <p className="text-sm text-gray-600 mb-2">(please attach additional sheets as necessary)</p>

        {/* Table: Name of OSH Training/Orientation */}
        <table className="w-full border-collapse border border-gray-300 mb-4 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Name of OSH Training/Orientation</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Number of Employees in attendance</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const trainingData = Array.isArray(data.health_training) ? data.health_training : [];
                
                if (trainingData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(3)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return trainingData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.name_of_osh_training || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.no_of_employees_in_attendance || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{formatDate(entry.date)}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(3)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                  </tr>
                ));
              }
            })()}
          </tbody>
        </table>

        {/* Table: Conduct of Risk Assessment */}
        <table className="w-full border-collapse border border-gray-300 mb-4 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Conduct of Risk Assessment (may include WEM)</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const riskData = Array.isArray(data.risk_assessment) ? data.risk_assessment : [];
                
                if (riskData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(2)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return riskData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.conduct_of_risk_assessment || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{formatDate(entry.date)}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(2)].map((_, index) => (
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

      {/* Section 8.0 Conduct of Tool Box Meetings/ Safety Meetings if applicable */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          8.0 Conduct of Tool Box Meetings/ Safety Meetings if applicable
        </h2>
        <table className="w-full border-collapse border border-gray-300 mb-4 no-repeat-header">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Conduct of Safety Meetings/Tool Box Meetings</th>
              <th className="border border-gray-300 p-2 text-sm font-medium text-gray-900 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              try {
                const safetyData = Array.isArray(data.safety_meeting) ? data.safety_meeting : [];
                
                if (safetyData.length === 0) {
                  // Show empty rows only if no data
                  return [...Array(2)].map((_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                      <td className="border border-gray-300 p-2 min-h-[24px] text-sm"></td>
                    </tr>
                  ));
                }
                
                // Show actual data
                return safetyData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{entry.conduct_of_risk_assessment || ''}</td>
                    <td className="border border-gray-300 p-2 min-h-[24px] text-sm">{formatDate(entry.date)}</td>
                  </tr>
                ));
              } catch (error) {
                return [...Array(2)].map((_, index) => (
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

      {/* Section 9.0 Accident/Incident/Injury investigation recording and reporting */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          9.0 Accident/Incident/Injury investigation recording and reporting
        </h2>
        <p className="text-sm text-gray-700">
          Any dangerous occurrence, major accident resulting to death or permanent total disability,
          shall be reported by the company to the DOLE Regional Office within twenty-four (24) hours
          from occurrence using the prescribed form (Work Accident / Incident Notification).
        </p>
      </div>
    </>
  );
};

export default DocumentPageSeven;
