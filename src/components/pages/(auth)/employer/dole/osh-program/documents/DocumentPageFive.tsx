import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageFiveProps {
  data: T_OshProgram;
}

const DocumentPageFive: React.FC<DocumentPageFiveProps> = ({ data }) => {
  return (
    <>
      {/* Top Section - First Aid Facilities (continued from previous page) */}
      <div id="document-page-5" className="mb-4">
        <div className="space-y-2 ml-5">
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
        <h2 className="text-base font-semibold italic text-gray-900 mb-2">
          3.0 And 4.0 - Health Programs for the promotion, prevention and control
        </h2>
        <p className="text-sm italic text-gray-700 mb-2">
          This refers to : 
          Drug-free Workplace in compliance to RA 9165, 
          Human Immunodeficiency Syndrome (HIV/AIDS) in compliance to (RA 8504) RA 11166, 
          Tuberculosis in compliance to EO 187-03, 
          Hepatitis B in compliance to DOLE Advisory No. 05 Series of 2010, 
          Mental Health in compliance to RA 11036
        </p>
        <p className="text-sm font-bold text-gray-700 mt-2">Refer to Annex A..</p>
      </div>

      {/* Section 5.0 - Safety and Health Committee */}
      <div className="mb-4 flex-1">
        <h2 className="text-base font-semibold italic text-gray-900 mb-2">
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
          <div className="ml-4 space-y-3">
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Chairperson:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.chairperson_less_than_ten}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of Company owner or manager)</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Secretary:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.secretary_less_than_ten}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Safety officer of the workplace)</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Member:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.member_less_than_ten}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of at least one (1) worker, preferably a union member, if organized)</div>
              </div>
            </div>
          </div>
        </div>

        {/* (b) Large Establishments */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 mb-2">
            <strong>(b)</strong> For medium to high risk establishments with ten (10) to fifty (50) workers and low to high risk establishments with fifty-one (51) workers and above. - The OSH committee of the covered workplace shall be composed of the following:
          </p>
          <div className="ml-4 space-y-3">
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Ex-officio chairperson:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.chairperson_medium_to_high}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of Employer or his/her representative)</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Secretary:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.secretary_medium_to_high}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of Safety officer of the workplace)</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Ex-officio members:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.ex_officio_members}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of Certified first-aider/s)</div>
                <div className="border-b border-gray-300 pb-1 min-h-[16px] mt-2">
                  {data.ex_officio_members_1}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of OH nurse)</div>
                <div className="border-b border-gray-300 pb-1 min-h-[16px] mt-2">
                  {data.ex_officio_members_2}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of OH dentist, and OH physician, as applicable)</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-2">Members:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-1 min-h-[16px]">
                  {data.members}
                </div>
                <div className="text-sm text-gray-600 mt-1">(Name of Safety officers representing the contractor or subcontractor, as the case may be)</div>
                <div className="border-b border-gray-300 pb-1 min-h-[16px] mt-2">
                  {data.members_2}
                </div>
                <div className="text-sm text-gray-600 mt-1">Name of workers&apos; representatives who shall come from the union, if the workers are organized, or elected workers through a simple vote of majority, if they are unorganized.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageFive;
