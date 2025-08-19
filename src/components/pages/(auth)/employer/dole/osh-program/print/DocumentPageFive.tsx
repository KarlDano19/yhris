import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageFiveProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
}

const DocumentPageFive: React.FC<DocumentPageFiveProps> = ({ data, isMultiPage = false }) => {

  return (
    <div 
      className="bg-white text-black font-sans text-sm leading-tight w-full h-full flex flex-col" 
      style={{ 
        fontFamily: 'Arial, sans-serif',
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box',
        padding: '32px 40px 32px 60px'
      }}
    >
      {/* Top Section - First Aid Facilities (continued from previous page) */}
      <div className="mb-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">How many treatment rooms/first aid rooms are existing in your company?</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.no_of_treatment_rooms_first_aid_rooms}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">How many Clinics in the workplace?</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.no_of_clinics_in_the_workplace}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">What hospital(s) are you affiliated with?</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
              {data.hospitals_youre_affiliated_with}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3.0 and 4.0 - Health Programs */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          3.0 and 4.0 Health Programs for the promotion, prevention and control:
        </h2>
        <div className="space-y-2 ml-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">Drug-free Workplace in compliance to RA 9165</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">Human Immunodeficiency Syndrome (HIV/AIDS) in compliance to (RA 8504) RA 11166</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">Tuberculosis in compliance to EO 187-03</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">Hepatitis B in compliance to DOLE Advisory No. 05 Series of 2010</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">•</span>
            <span className="text-sm text-gray-700">Mental Health in compliance to RA 11036</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-2">Refer to Annex A..</p>
      </div>

      {/* Section 5.0 - Safety and Health Committee */}
      <div className="mb-4 flex-1">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          5.0 Composition and Duties of Safety and Health Committee
        </h2>
        <p className="text-sm text-gray-700 mb-3">
          The SHC of the company is responsible to plan, develop and implement OSH policies and programs, monitor and evaluate OSH programs and investigate all aspect of the work pertaining to the safety and health of all the workers. SHC shall be composed of the following in compliance with the law:
        </p>

        {/* (a) Small Establishments */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 mb-2">
            <strong>(a)</strong> For establishments with less than ten workers and low risk establishments with ten (10) to fifty (50) workers. - A SO1 shall establish an OSH committee composed of the following:
          </p>
                      <div className="ml-4 space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Chairperson:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.chairperson_less_than_ten}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Name of Company owner or manager)</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Secretary:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.secretary_less_than_ten}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Safety officer of the workplace)</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Member:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.member_less_than_ten}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Name of at least one (1) worker, preferably a union member, if organized)</span>
              </div>
            </div>
        </div>

        {/* (b) Large Establishments */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 mb-2">
            <strong>(b)</strong> For medium to high risk establishments with ten (10) to fifty (50) workers and low to high risk establishments with fifty-one (51) workers and above. - The OSH committee of the covered workplace shall be composed of the following:
          </p>
                      <div className="ml-4 space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Ex-officio chairperson:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.chairperson_medium_to_high}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Name of Employer or his/her representative)</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Secretary:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.secretary_medium_to_high}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Name of Safety officer of the workplace)</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Ex-officio members:</span>
              </div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">•</span>
                  <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] mr-2">
                    {data.ex_officio_members}
                  </div>
                  <span className="text-sm text-gray-600">(Name of Certified first-aider/s)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">•</span>
                  <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] mr-2">
                    {data.ex_officio_members_1}
                  </div>
                  <span className="text-sm text-gray-600">(Name of OH nurse)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">•</span>
                  <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] mr-2">
                    {data.ex_officio_members_2}
                  </div>
                  <span className="text-sm text-gray-600">(Name of OH dentist, and OH physician, as applicable)</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Members:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.members}
                </div>
                <span className="text-sm text-gray-600 ml-2">(Name of Safety officers representing the contractor or subcontractor, as the case may be)</span>
              </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-sm text-gray-600">Page | 5</span>
      </div>
    </div>
  );
};

export default DocumentPageFive;
