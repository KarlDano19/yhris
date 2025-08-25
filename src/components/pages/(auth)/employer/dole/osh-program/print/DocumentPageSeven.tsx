import React from 'react';

import { T_OshProgram } from '@/types/osh-program';
import Document from './Document';

interface DocumentPageSevenProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageSeven: React.FC<DocumentPageSevenProps> = ({ data, isMultiPage = false, pageNumber = 7 }) => {
  return (
    <Document isMultiPage={isMultiPage} pageNumber={pageNumber}>
      {/* Top Section - Emergency Health Personnel and Facilities */}
      <div className="mb-6">
        <p className="text-xs text-gray-700 mb-2">
          List of competent emergency health personnel within the worksite duly complemented
          by adequate medical supplies, equipment and facilities based on the total number of
          workers. (Use additional sheet if necessary and attach all required training certificates in
          this section.)
        </p>
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          Emergency Health Personnel and Facilities
        </h2>
        <div className="border border-gray-300">
          <div className="grid grid-cols-4 text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Shift/Area/unit/Department</div>
            <div className="p-2 border-r border-gray-300">Total number of workers/areas</div>
            <div className="p-2 text-center col-span-2">Health Personnel & Facilities</div>
          </div>
          <div className="grid grid-cols-4 text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300"></div>
            <div className="p-2 border-r border-gray-300"></div>
            <div className="p-2 border-r border-gray-300">Health (First-aider, Physician, Dentist)</div>
            <div className="p-2">Facilities (Treatment Room/Clinic/Hospital)</div>
          </div>
          {(() => {
            try {
              const healthPersonnelData = Array.isArray(data.health_personnel) ? data.health_personnel : [];
              const rows = Math.max(3, healthPersonnelData.length);
              
              return [...Array(rows)].map((_, index) => {
                const entry = healthPersonnelData[index] || {};
                return (
                  <div key={index} className="grid grid-cols-4 text-xs border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.shift_area_department || ''}</div>
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.total_workers || ''}</div>
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.health_personnel_name || ''}</div>
                    <div className="p-2 min-h-[24px]">{entry.facilities || ''}</div>
                  </div>
                );
              });
            } catch (error) {
              return [...Array(3)].map((_, index) => (
                <div key={index} className="grid grid-cols-4 text-xs border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>
      </div>

      {/* Section 7.0 Safety and Health Promotion, training and education provided to workers */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          7.0 Safety and Health Promotion, training and education provided to workers
        </h2>
        <ul className="list-none pl-4 mb-4 space-y-1">
          <li className="text-xs text-gray-700">--Orientation of all workers on OSH</li>
          <li className="text-xs text-gray-700">-Conduct of Risk Assesxsent, evaluation and Control</li>
          <li className="text-xs text-gray-700">-*Continuing training on OSH for OSH Personnel</li>
          <li className="text-xs text-gray-700">-*Work permit System</li>
        </ul>
        <p className="text-xs text-gray-600 mb-2">(please attach additional sheets as necessary)</p>

        {/* Table: Name of OSH Training/Orientation */}
        <div className="border border-gray-300 mb-4">
          <div className="grid grid-cols-[2fr_1fr_1fr] text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Name of OSH Training/Orientation</div>
            <div className="p-2 border-r border-gray-300">Number of Employees in attendance</div>
            <div className="p-2">Date</div>
          </div>
          {(() => {
            try {
              const trainingData = Array.isArray(data.health_training) ? data.health_training : [];
              const rows = Math.max(3, trainingData.length);
              
              return [...Array(rows)].map((_, index) => {
                const entry = trainingData[index] || {};
                return (
                  <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-xs border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.name || ''}</div>
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.employees_in_attendance || ''}</div>
                    <div className="p-2 min-h-[24px]">{entry.date || ''}</div>
                  </div>
                );
              });
            } catch (error) {
              return [...Array(3)].map((_, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-xs border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>

        {/* Table: Conduct of Risk Assesxsent */}
        <div className="border border-gray-300 mb-4">
          <div className="grid grid-cols-2 text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Conduct of Risk Assesxsent (may include WEM)</div>
            <div className="p-2">Date</div>
          </div>
          {(() => {
            try {
              const riskData = Array.isArray(data.risk_assesxsent) ? data.risk_assesxsent : [];
              const rows = Math.max(2, riskData.length);
              
              return [...Array(rows)].map((_, index) => {
                const entry = riskData[index] || {};
                return (
                  <div key={index} className="grid grid-cols-2 text-xs border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.description || ''}</div>
                    <div className="p-2 min-h-[24px]">{entry.date || ''}</div>
                  </div>
                );
              });
            } catch (error) {
              return [...Array(2)].map((_, index) => (
                <div key={index} className="grid grid-cols-2 text-xs border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>
      </div>

      {/* Section 8.0 Conduct of Tool Box Meetings/ Safety Meetings if applicable */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          8.0 Conduct of Tool Box Meetings/ Safety Meetings if applicable
        </h2>
        <div className="border border-gray-300 mb-4">
          <div className="grid grid-cols-2 text-xs font-medium bg-gray-50 border-b border-gray-300">
            <div className="p-2 border-r border-gray-300">Conduct of Safety Meetings/Tool Box Meetings</div>
            <div className="p-2">Date</div>
          </div>
          {(() => {
            try {
              const safetyData = Array.isArray(data.safety_meeting) ? data.safety_meeting : [];
              const rows = Math.max(2, safetyData.length);
              
              return [...Array(rows)].map((_, index) => {
                const entry = safetyData[index] || {};
                return (
                  <div key={index} className="grid grid-cols-2 text-xs border-b border-gray-300 last:border-b-0">
                    <div className="p-2 border-r border-gray-300 min-h-[24px]">{entry.description || ''}</div>
                    <div className="p-2 min-h-[24px]">{entry.date || ''}</div>
                  </div>
                );
              });
            } catch (error) {
              return [...Array(2)].map((_, index) => (
                <div key={index} className="grid grid-cols-2 text-xs border-b border-gray-300 last:border-b-0">
                  <div className="p-2 border-r border-gray-300 min-h-[24px]"></div>
                  <div className="p-2 min-h-[24px]"></div>
                </div>
              ));
            }
          })()}
        </div>
      </div>

      {/* Section 9.0 Accident/Incident/Injury investigation recording and reporting */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          9.0 Accident/Incident/Injury investigation recording and reporting
        </h2>
        <p className="text-xs text-gray-700">
          Any dangerous occurrence, major accident resulting to death or permanent total disability,
          shall be reported by the company to the DOLE Regional Office within twenty-four (24) hours
          from occurrence using the prescribed form (Work Accident / Incident Notification).
        </p>
      </div>
    </Document>
  );
};

export default DocumentPageSeven;
