import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageOneProps {
  data: T_OshProgram;
}

const DocumentPageOne: React.FC<DocumentPageOneProps> = ({ data }) => {
  return (
    <>
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
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          I. Complete Company Profile/Project details
        </h2>
        
        {/* Company Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Company Name:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.company_name || 'COMPANY'}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Date Established:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.date_established}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Complete Address:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.complete_address || 'ADDRESS'}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Phone and fax numbers:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {`${data.phone_number || ''}, ${data.fax_number || ''}`.trim()}
            </div>
          </div>
        </div>

        {/* Contact Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Website URL/Email address:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {`${data.website_url || ''} ${data.email || ''}`.trim()}
            </div>
          </div>
        </div>

        {/* Personnel and Employee Information Block */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Name of Company Owner/Manager/President:</span>
            <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
              {data.company_owner}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Total Number of Employees:</span>
            <div className="flex items-center ml-2">
              <span className="text-sm mr-2">Male:</span>
              <div className="border-b border-gray-300 w-20 pb-1 min-h-[20px] mr-4">
                {data.number_of_male_employees}
              </div>
              <span className="text-sm mr-2">Female:</span>
              <div className="border-b border-gray-300 w-20 pb-1 min-h-[20px] mr-2">
                {data.number_of_female_employees}
              </div>
              <span className="text-sm text-gray-600">Pls specify</span>
            </div>
          </div>
        </div>

        {/* Description of the business Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-700 mr-2">• Description of the business</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Kindly check:</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.manufacturing_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Manufacturing:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.manufacturing_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.bank_and_financial_institution_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Banks and financial institution:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.bank_and_financial_institution_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.service_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Service:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.service_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.security_agency_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Security Agency:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.security_agency_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.agri_fishing_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Agri/fishing:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.agri_fishing_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.maintenance_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Maintenance:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.maintenance_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.wholesale_retail_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Wholesale/retail:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.wholesale_retail_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.construction_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Construction:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.construction_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.utilities_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Utilities:</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.utilities_description}
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={data.others_description ? true : false}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">Others (Please specify):</span>
                <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px] ml-2">
                  {data.others_description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product/Service Description Section */}
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">• Product descriptions:</span>
            <span className="text-sm text-gray-600 mr-2">(ex. Garments, shoes, electronics)</span>
          </div>
          <div className="border-b border-gray-300 pb-1 min-h-[20px] ml-4">
            {data.product_description}
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-700 mr-2">• Description of services:</span>
          </div>
          <div className="border-b border-gray-300 pb-1 min-h-[20px] ml-4">
            {data.services_description}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageOne;
