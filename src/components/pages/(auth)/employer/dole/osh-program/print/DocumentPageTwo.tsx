import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTwoProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({ data, isMultiPage = false, pageNumber = 2 }) => {
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
      {/* Document Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Basic Components of Company OSH Program and Policy
        </h1>
        <h2 className="text-lg text-gray-700">
          (DO 198-18, Chapter IV, Section 12)
        </h2>
      </div>

      {/* Components List */}
      <div className="space-y-3 flex-1">
        {/* 1.0 Company Commitment */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">1.0</span>
          <span className="text-xs text-gray-900">Company Commitment to Comply with OSH Requirements</span>
        </div>

        {/* 2.0 General Safety and Health Programs */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">2.0</span>
          <div className="flex-1">
            <span className="text-xs text-gray-900">General Safety and Health Programs</span>
            <div className="ml-4 mt-1 space-y-1">
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Safety and health Hazard Identification, Risk Assesxsent and Control (HIRAC)</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Medical Surveillance for early detection and management of occupational and work-related diseases</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">First-aid and emergency medical services</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3.0 Promotion of Drug Free workplace */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">3.0</span>
          <span className="text-xs text-gray-900">Promotion of Drug Free workplace, Mental health Services in the Workplace, Healthy lifestyle</span>
        </div>

        {/* 4.0 Prevention and Control */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">4.0</span>
          <span className="text-xs text-gray-900">Prevention and Control of HIV-AIDS, Tuberculosis, Hepatitis B</span>
        </div>

        {/* 5.0 Composition and Duties */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">5.0</span>
          <span className="text-xs text-gray-900">Composition and Duties of health and safety Committee</span>
        </div>

        {/* 6.0 OSH Personnel and Facilities */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">6.0</span>
          <span className="text-xs text-gray-900">OSH Personnel and Facilities</span>
        </div>

        {/* 7.0 Safety and Health Promotion */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">7.0</span>
          <div className="flex-1">
            <span className="text-xs text-gray-900">Safety and Health Promotion, Training and Education</span>
            <div className="ml-4 mt-1 space-y-1">
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Orientation of all workers on OSH</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Conduct of Risk Assesxsent, evaluation and Control</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Continuing training on OSH for OSH Personnel</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-700 mr-2">•</span>
                <span className="text-xs text-gray-700">Work permit System</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8.0 Toolbox/Safety Meetings */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">8.0</span>
          <span className="text-xs text-gray-900">Toolbox/Safety Meetings, job safety analysis</span>
        </div>

        {/* 9.0 Accident/Incident/illness Investigation */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">9.0</span>
          <span className="text-xs text-gray-900">Accident/Incident/illness Investigation, Recording and Reporting</span>
        </div>

        {/* 10.0 Personal Protective Equipment */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">10.0</span>
          <span className="text-xs text-gray-900">Personal Protective Equipment (PPE)</span>
        </div>

        {/* 11.0 Safety signages */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">11.0</span>
          <span className="text-xs text-gray-900">Safety signages</span>
        </div>

        {/* 12.0 Dust control and management */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">12.0</span>
          <span className="text-xs text-gray-900">Dust control and management and regulation on activities such as building of temporary structures and lifting and operation of electrical, mechanical, communications system and other requirements</span>
        </div>

        {/* 13.0 Welfare Facilities */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">13.0</span>
          <span className="text-xs text-gray-900">Welfare Facilities</span>
        </div>

        {/* 14.0 Emergency and disaster preparedness */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">14.0</span>
          <span className="text-xs text-gray-900">Emergency and disaster preparedness and response plan to include the organization and creation of disaster control groups, business continuity plan, and updating the hazard, risk and vulnerability assesxsent (as required)</span>
        </div>

        {/* 15.0 Solid waste management system */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">15.0</span>
          <span className="text-xs text-gray-900">Solid waste management system</span>
        </div>

        {/* 16.0 Compliance with Reportorial Government Requirement */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">16.0</span>
          <span className="text-xs text-gray-900">Compliance with Reportorial Government Requirement (refer to Item 9.0)</span>
        </div>

        {/* 17.0 Control and Management of Hazards */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">17.0</span>
          <span className="text-xs text-gray-900">Control and Management of Hazards (refer to Item 2-HIRAC)</span>
        </div>

        {/* 18.0 Prohibited Acts and Penalties */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">18.0</span>
          <span className="text-xs text-gray-900">Prohibited Acts and Penalties for Violations</span>
        </div>

        {/* 19.0 Cost of Implementing Company OSH program */}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mr-2 w-8 flex-shrink-0">19.0</span>
          <span className="text-xs text-gray-900">Cost of Implementing Company OSH program</span>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default DocumentPageTwo;
