import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageOneProps {
  data: T_OshProgram;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const DocumentPageOne: React.FC<DocumentPageOneProps> = ({ data, isMultiPage = false, pageNumber = 1 }) => {
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
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Occupational Safety and Health (OSH) Program of
        </h1>
        <h2 className="text-lg font-bold text-gray-900">
          {data.company_name || 'COMPANY'}
        </h2>
      </div>

      {/* Section I: Complete Company Profile/Project details */}
      <div className="mb-6 flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          I. Complete Company Profile/Project details
        </h2>
        
        {/* Company Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Company Name:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.company_name || 'COMPANY'}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Date Established:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.date_established}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Complete Address:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.complete_address || 'ADDRESS'}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Phone and fax numbers:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {`${data.phone_number || ''} ${data.fax_number || ''}`.trim()}
            </div>
          </div>
        </div>

        {/* Contact Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Website URL/Email address:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {`${data.website_url || ''} ${data.email || ''}`.trim()}
            </div>
          </div>
        </div>

        {/* Personnel and Employee Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Name of Company Owner/Manager/President:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.company_owner}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Total Number of Employees:</span>
            <div className="flex items-center ml-2">
              <span className="text-xs mr-2">Male:</span>
              <div className="border-b border-gray-300 w-20 pb-1 min-h-[20px] mr-4">
                {data.number_of_male_employees}
              </div>
              <span className="text-xs mr-2">Female:</span>
              <div className="border-b border-gray-300 w-20 pb-1 min-h-[20px] mr-2">
                {data.number_of_female_employees}
              </div>
              <span className="text-xs text-gray-600">Pls specify</span>
            </div>
          </div>
        </div>

        {/* Description of the business Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <span className="text-xs font-medium text-gray-700 mr-2">• Description of the business</span>
          </div>
          <div className="ml-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Kindly check:</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.manufacturing_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Manufacturing:</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.bank_and_financial_institution_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Banks and financial institution</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.service_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Service:</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.security_agency_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Security Agency</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.agri_fishing_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Agri/fishing:</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.maintenance_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Maintenance</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.wholesale_retail_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Wholesale/retail</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.construction_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Construction</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.utilities_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Utilities</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.others_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-xs">Others (Please specify):</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
                  {data.others_description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product/Service Description Section */}
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">• Product descriptions:</span>
            <span className="text-xs text-gray-600 mr-2">(ex. Garments, shoes, electronics)</span>
          </div>
          <div className="border-b border-gray-300 pb-1 min-h-[20px] ml-4">
            {data.product_description}
          </div>
          <div className="flex items-center mt-4">
            <span className="text-xs font-medium text-gray-700 mr-2">• Description of services:</span>
          </div>
          <div className="border-b border-gray-300 pb-1 min-h-[20px] ml-4">
            {data.services_description}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default DocumentPageOne;
