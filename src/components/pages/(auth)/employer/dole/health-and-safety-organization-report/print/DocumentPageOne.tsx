import React from 'react';

interface HealthAndSafetyReportData {
  dateFiled: string;
  regionalLaborOfficeNo: string;
  fileNumber: string;
  establishmentName: string;
  address: string;
  natureOfBusiness: string;
  personsEmployed: {
    management: {
      shifts: Array<{
        male: number;
        female: number;
      }>;
    };
    total: {
      male: number;
      female: number;
    };
  };
  policyAndProgram: string;
  safetyCommittee: {
    type: string;
    members: {
      chairman: {
        name: string;
        position: string;
      };
      members: Array<{
        name: string;
        position: string;
      }>;
      secretary: {
        name: string;
        position: string;
      };
    };
  };
  technicalInformation: {
    processDescription: string;
  };
  submittedBy: {
    name: string;
    position: string;
  };
}

interface DocumentPageOneProps {
  data: HealthAndSafetyReportData;
}

const DocumentPageOne: React.FC<DocumentPageOneProps> = ({ data }) => {
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (num: number): string => {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="bg-white text-black font-sans text-sm leading-tight max-w-4xl mx-auto p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="relative mb-4">
        {/* Document code - positioned absolutely to the left */}
        <div className="absolute left-0 top-0">
          <div className="text-xs">DOLE/BWC/OHSD/IP-5</div>
        </div>

        {/* Centered header text */}
        <div className="text-center mx-auto max-w-xs">
          <div className="text-sm">Republic of the Philippines</div>
          <div className="text-sm font-bold">DEPARTMENT OF LABOR AND EMPLOYMENT</div>
          <div className="text-sm font-bold">BUREAU OF WORKING CONDITIONS</div>
          <div className="text-sm">Manila</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <div className="text-md font-bold">REPORT ON HEALTH AND SAFETY ORGANIZATION</div>
      </div>

      {/* Document Details - Right aligned block */}
      <div className="mb-4 space-y-2 ml-auto w-1/3">
        <div className="flex items-center">
          <span className="text-xs font-bold mr-2">Date Filed:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs text-center">
            {data.dateFiled}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-bold mr-2">Regional Labor Office No.:</span>
          <div className="border-b border-black w-16 pb-1 text-xs text-center">
            {data.regionalLaborOfficeNo}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-bold mr-2">File Number:</span>
          <div className="border-b border-black flex-1 pb-1 text-xs text-center">
            {data.fileNumber}
          </div>
        </div>
      </div>

      {/* Establishment Information */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center">
          <span className="text-sm font-bold mr-2">Name of Establishment:</span>
          <div className="border-b border-black flex-1 pb-1 text-sm">
            {data.establishmentName}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-bold mr-2">Address:</span>
          <div className="border-b border-black flex-1 pb-1 text-sm">
            {data.address}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-bold mr-2">Nature of Business:</span>
          <div className="border-b border-black flex-1 pb-1 text-sm">
            {data.natureOfBusiness}
          </div>
        </div>
      </div>

      {/* Persons Employed Section */}
      <div className="mb-4">
        <div className="text-sm font-bold mb-2">Persons Employed, Including:</div>
        <div className="flex items-start mb-2">
          <span className="text-sm font-bold ml-8 mr-8">Management:</span>
          <div className="space-y-1">
            {data.personsEmployed.management.shifts.map((shift, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm">{index + 1}{getOrdinalSuffix(index + 1)} Shift:</div>
                <div className="w-16 text-sm">Male</div>
                <div className="border-b border-black w-20 pb-1 text-sm text-center mr-8">
                  {shift.male}
                </div>
                <div className="w-16 text-sm">Female</div>
                <div className="border-b border-black w-20 pb-1 text-sm text-center">
                  {shift.female === 0 ? '-' : shift.female}
                </div>
              </div>
            ))}
            <div className="flex items-center font-bold">
              <div className="w-20 text-sm">TOTAL:</div>
              <div className="w-16 text-sm">Male:</div>
              <div className="border-b border-black w-20 pb-1 text-sm text-center mr-8 font-bold">
                {data.personsEmployed.total.male}
              </div>
              <div className="w-16 text-sm">Female:</div>
              <div className="border-b border-black w-20 pb-1 text-sm text-center font-bold">
                {data.personsEmployed.total.female}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-4">
        {/* A. Policy and Program on Safety and Health */}
        <div>
          <div className="flex items-center">
            <span className="text-sm font-bold mr-8">A. Policy and Program on Safety and Health:</span>
            <span className='text-sm'>(Refer to attachment)</span>
          </div>
        </div>

        {/* B. Composition of Safety and Health Committee */}
        <div>
          <div className="flex items-center mb-2">
            <span className="text-sm font-bold mr-8">B. Composition of Safety and Health Committee:</span>
            <span className="text-sm mr-2">Type:</span>
            <div className="border-b border-black w-16 pb-1 text-sm text-center">
              {data.safetyCommittee.type}
            </div>
          </div>
          <div className="text-left ml-8 mb-2">
            <span className="text-sm font-bold">Central Safety Committee</span>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-bold ml-8">Name</div>
              <div className="font-bold">Position of Establishment</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm ml-8">
              <div>Chairman: <span className="underline">{data.safetyCommittee.members.chairman.name}</span></div>
              <div className="underline">{data.safetyCommittee.members.chairman.position}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm ml-8">
              <div>Members: <span className="underline">{data.safetyCommittee.members.members[0]?.name}</span></div>
              <div className="underline">{data.safetyCommittee.members.members[0]?.position}</div>
            </div>
            {data.safetyCommittee.members.members.slice(1).map((member, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 text-sm ml-8">
                <div className="ml-8 underline">{member.name}</div>
                <div className="underline">{member.position}</div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 text-sm ml-8">
              <div>Secretary: <span className="underline">{data.safetyCommittee.members.secretary.name}</span></div>
              <div className="underline">{data.safetyCommittee.members.secretary.position}</div>
            </div>
          </div>
        </div>

        {/* C. Technical Information */}
        <div >
          <div className="text-sm font-bold mb-1 ml-1">C. Technical Information:</div>
          <div className="text-sm mb-1 ml-8">a. Brief description of process operation and number and kind of equipment</div>
          <div className="text-center text-sm ml-8">
            (Refer to attachment)
          </div>
        </div>
      </div>

      {/* Submitted By Section */}
      <div className="mt-6 text-left">
        <div className="text-sm font-bold mb-1">Submitted by:</div>
        <div className="text-sm underline mb-1">
          {data.submittedBy.name}
        </div>
        <div className="text-sm">
          {data.submittedBy.position}
        </div>
      </div>
    </div>
  );
};

export default DocumentPageOne;
