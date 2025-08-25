import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTenProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
}

const DocumentPageTen: React.FC<DocumentPageTenProps> = ({ data, isMultiPage = false }) => {
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
      {/* Top Section - Previous Section Headers */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          16.0 Compliance with Reportorial Government Requirements (refer to item 9.0)
        </h2>
        <h2 className="text-base font-bold text-gray-900 mb-2">
          17.0 Control and management of hazards.
        </h2>
        <p className="text-xs text-gray-700 mb-4">
          Refer to accomplished HIRAC
        </p>
      </div>

      {/* Main Section: 18.0 Prohibited Acts and Penalties/sanctions */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          18.0 Prohibited Acts and Penalties/sanctions for violations on OSH
        </h2>

        {/* 1. REWARD */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-900 mb-2 ml-5">
            1. REWARD:
          </h3>
          <p className="text-xs text-gray-700 mb-2">
            Since the manpower of this Establishment is more than <strong>fifty (50)</strong>, we in {data.company_name || 'COMPANY'} proposed using incentives to the job-site Establishment Manager, supervisor, Establishment safety officer, leadmen, foremen and workers based on a target recordable injury incidence rate measured at end of the Establishment.
          </p>
        </div>

        {/* 2. PENALTIES/SANCTIONS */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-900 mb-2 ml-5">
            2. PENALTIES/SANCTIONS:
          </h3>
          
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-900 mb-1">
              Offenses and Description. Violation of any safety rules, regulations and general practices promulgated by the Establishment and/or the company.
            </h4>
            <h4 className="text-xs font-medium text-gray-900 mb-2 mt-5">
              Remedial action for each offense.
            </h4>
          </div>

          {/*1. Failure to wear Personal Protective Equipment */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">
              1. Failure to wear Personal Protective Equipment at construction site or where specified
            </h4>

            {/* A. Safety Helmet & Safety Shoes */}
            <div className="mb-4 ml-5">
              <h5 className="text-xs font-medium text-gray-900 mb-2">
                A. Safety Helmet & Safety Shoes
              </h5>
              <ul className="list-none pl-4 space-y-1 mb-3">
                <li className="text-xs text-gray-700">• First offense - written reprimand</li>
                <li className="text-xs text-gray-700">• Second offense - One (1) day suspension</li>
                <li className="text-xs text-gray-700">• Third offense - Three (3) days suspension</li>
                <li className="text-xs text-gray-700">• Fourth offense - Seven (7) days suspension</li>
                <li className="text-xs text-gray-700">• Fifth offense - Dixsissal</li>
              </ul>
              <div className="space-y-2">
                <p className="text-xs text-gray-700">
                  Required to all construction worker/staff regardless of position
                </p>
                <p className="text-xs text-gray-700">
                  No entry at all construction sites.
                </p>
                <p className="text-xs text-gray-700">
                  Construction site, refers to the site inclusive of field offices and other temporary facilities
                </p>
                <p className="text-xs text-gray-700">
                  Visitors and Guest must secure Written Permit from the Establishment Safety Officers (to be shown at the gate upon entry at the construction site.)
                </p>
              </div>
            </div>

            {/* B. Eye and Face Protection */}
            <div className="mb-4 ml-5">
              <h5 className="text-xs font-medium text-gray-900 mb-2">
                B. Eye and Face Protection
              </h5>
              <p className="text-xs text-gray-700">
                Spectacles - Required for steel men and those engage in chipping works.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | 10</span>
      </div>
    </div>
  );
};

export default DocumentPageTen;
