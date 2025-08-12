import React from 'react';

interface AnnualWorkAccidentIllnessData {
  date: string;
  establishmentName: string;
  natureOfBusiness: string;
  address: string;
  exposureData: string;
  numberOfEmployees: number;
  totalHoursWorked: number;
  injurySummary: {
    totalDisablingInjuries: number;
    totalNonDisablingInjuries: number;
    frequencyRate: number;
    severityRate: number;
  };
  submittedBy: {
    name: string;
    position: string;
  };
}

interface DocumentPageOneProps {
  data: AnnualWorkAccidentIllnessData;
}

const DocumentPageOne: React.FC<DocumentPageOneProps> = ({ data }) => {
  return (
    <div className="bg-white text-black font-sans text-sm leading-tight max-w-4xl mx-auto p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="relative mb-4">
        {/* Centered header text */}
        <div className="text-center mx-auto max-w-xs">
          <div className="text-sm">Republic of the Philippines</div>
          <div className="text-sm font-bold">Department of Labor and Employment</div>
          <div className="text-sm font-bold">Regional Office No. IV-A</div>
        </div>
        
        {/* Date field - positioned absolutely to the right */}
        <div className="absolute right-0 top-10">
          <div className="flex items-center">
            <span className="text-xs font-bold mr-2">DATE:</span>
            <div className="border-b text-center border-black w-32 pb-1 text-xs">
              {data.date}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <div className="text-md font-bold">ANNUAL WORK ACCIDENT/ILLNESS EXPOSURE DATA REPORT</div>
      </div>

      {/* Data Input Fields */}
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">NAME OF ESTABLISHMENT:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.establishmentName}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">NATURE OF BUSINESS:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.natureOfBusiness}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">ADDRESS:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.address}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">EXPOSURE DATA:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.exposureData}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">NUMBER OF EMPLOYEES:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.numberOfEmployees}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">TOTAL HOURS WORK BY ALL:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.totalHoursWorked}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">EMPLOYEES DURING THE YEAR:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.numberOfEmployees}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">INJURY SUMMARY:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {/* This field appears to be empty in the image */}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">TOTAL ALL DISABLING INJURIES/ILLNESS:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.injurySummary.totalDisablingInjuries}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">TOTAL NON-DISABLING INJURIES/ILLNESS:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.injurySummary.totalNonDisablingInjuries}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">FREQUENCY RATE:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.injurySummary.frequencyRate}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 w-48">SEVERITY:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs">
            {data.injurySummary.severityRate}
          </div>
        </div>
      </div>

      {/* Signature/Approval Section */}
      <div className="mt-8 flex justify-end">
        <div className="text-right">
          <div className="border-b border-black w-48 pb-1 mb-2"></div>
          <div className="text-xs font-bold">General Manager</div>
        </div>
      </div>

      {/* Instructions and Definitions Section */}
      <div className="mt-8 space-y-4">
        <div className="text-xs">
          <div className="ml-4">
            1. This report shall be accomplished with or without accident/illness occurrence and submitted to the Regional Labor Officer or Local Government not later than the 30th day of the month following the end of each calendar year.
          </div>
        </div>
        
        <div className="text-xs">
          <div className="ml-4">
            <div className="mb-2">2. Frequency Rate - The total number of disabling injuries per million employees hour exposure.</div>
            <div className="ml-4">
              <div>Frequency Rate = Number of disabling × 1,000,000.00</div>
              <div className="border-b border-black w-48 pb-1 mt-1">Employees hours of exposure</div>
            </div>
          </div>
        </div>
        
        <div className="text-xs">
          <div className="ml-4">
            <div className="mb-2">3. Severity Rate - The total number of days lost or charged per million hours of exposure.</div>
            <div className="ml-4">
              <div>Severity Rate = Number of Days lost of exchange × 1,000,000</div>
              <div className="border-b border-black w-48 pb-1 mt-1">Employees hours of exposure</div>
            </div>
          </div>
        </div>
        
        <div className="text-xs">
          <div className="ml-4">
            <div className="mb-2">4. Exposure - The total number of hours worked by all employees in each establishment, including those in production, maintenance, transportation, clerical, administrative, sales, and other departments.</div>
          </div>
        </div>
        
        <div className="text-xs">
          <div className="ml-4">
            <div className="mb-2">5. Disabling injuries - Work injuries resulting in death, permanent partial disability, or temporary disability.</div>
          </div>
        </div>
        
        <div className="text-xs">
          <div className="ml-4">
            <div className="mb-2">6. Non-disabling injuries (Medical Treatment) - Injuries that do not result in disabling injuries but require first aid or medical attention.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageOne;
