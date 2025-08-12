import React from 'react';

interface AnnualMedicalReportData {
  establishmentName: string;
  address: string;
  ownerManager: string;
  natureOfBusiness: string;
  totalEmployees: number;
  numberOfShifts: number;
  reportPeriod: {
    from: string;
    to: string;
  };
  shifts?: {
    first: { male: number; female: number; total: number };
    second: { male: number; female: number; total: number };
    third: { male: number; female: number; total: number };
  };
  healthService?: {
    organizedBy: 'establishment' | 'government' | 'other';
    otherSpecify?: string;
    serviceType?: 'solely' | 'common';
  };
  occupationalHealthStaff?: {
    consultant?: { name: string; address: string };
    physician?: { name: string; address: string };
    dentist?: { name: string; address: string };
    nurse?: { name: string; address: string };
    inspectionFrequency?: 'monthly' | 'quarterly' | 'biannual' | 'other';
  };
  emergencyServices?: {
    hasTreatmentRoom: boolean;
    otherDetails?: string;
  };
  workSchedule?: {
    physician: { hours: number; shift: string };
    dentist: { hours: number; shift: string };
    practitioner: { hours: number; shift: string };
    nurse: { hours: number; shift: string };
  };
}

interface DocumentPageOneProps {
  data: AnnualMedicalReportData;
}

const DocumentPageOne: React.FC<DocumentPageOneProps> = ({ data }) => {
  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-left mb-2">
        <div className="text-xs font-bold">DOLE/BWC/HSD/OH-47-A</div>
      </div>

      <div className="text-center mb-3">
        <div className="text-xs">Republic of the Philippines</div>
        <div className="text-xs font-bold">DEPARTMENT OF LABOR AND EMPLOYMENT</div>
        <div className="text-xs">NCR, Pasig City</div>
        <div className="text-sm font-bold mt-2 mb-1">ANNUAL MEDICAL REPORT FORM</div>
        <div className="text-xs font-bold">For Period {data.reportPeriod.from} to {data.reportPeriod.to}</div>
      </div>

      {/* Basic Information */}
      <div className="space-y-1">
        <div className="flex">
          <span className="font-bold text-xs">1. Name of Establishment:</span>
          <div className="flex-1 border-b border-black ml-2 px-1">{data.establishmentName}</div>
        </div>
        <div className="flex">
          <span className="font-bold text-xs">2. Address:</span>
          <div className="flex-1 border-b border-black ml-2 px-1">{data.address}</div>
        </div>
        <div className="flex">
          <span className="font-bold text-xs">3. Name of Owner/Manager:</span>
          <div className="flex-1 border-b border-black ml-2 px-1">{data.ownerManager}</div>
        </div>
        <div className="flex">
          <span className="font-bold text-xs">4. Nature of Business and Production/Service (Ex. Manufacturing Textile):</span>
          <div className="flex-1 border-b border-black ml-2 px-1">{data.natureOfBusiness}</div>
        </div>
        <div className="flex space-x-4">
          <div className="flex">
            <span className="font-bold text-xs">5. Total Number of Employees:</span>
            <div className="border-b border-black ml-2 px-2 w-20">{data.totalEmployees}</div>
          </div>
          <div className="flex">
            <span className="font-bold text-xs">Number of Shifts:</span>
            <div className="border-b border-black ml-2 px-2 w-16">{data.numberOfShifts}</div>
          </div>
        </div>
      </div>

      {/* Employee Distribution Section */}
      <div className="mb-3">
        <div className="text-xs font-bold mb-1">6. Number Distribution of Employees as to nature/workplace, sex and workshift:</div>
        <div className="grid grid-cols-4 w-full mb-2">
          <div className="text-xs font-bold text-center">Office</div>
          <div className="text-xs font-bold text-center col-span-3">Production/Shop</div>
        </div>
        
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-1"></th>
              <th className="p-1 font-bold">1st Shift</th>
              <th className="p-1 font-bold">2nd Shift</th>
              <th className="p-1 font-bold">3rd Shift</th>
            </tr>
          </thead>
            <tbody>
              <tr>
                <td className="p-1 font-bold">Male:</td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.first.male || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.second.male || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.third.male || 'N/A'}</div>
                </td>
              </tr>
              <tr>
                <td className="p-1 font-bold">Female:</td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.first.female || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.second.female || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.third.female || 'N/A'}</div>
                </td>
              </tr>
              <tr>
                <td className="p-1 font-bold">Total:</td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.first.total || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.second.total || 'N/A'}</div>
                </td>
                <td className="px-1 text-center">
                  <div className="border-b border-black mx-2">{data.shifts?.third.total || 'N/A'}</div>
                </td>
              </tr>
            </tbody>
        </table>
      </div>

      {/* Preventive Occupational Health Services */}
      <div className="mb-2">
        <div className="text-xs font-bold">7. Preventive Occupational Health Services: (Check or Cross)</div>
        <div className="ml-4">
          <div className="text-xs mb-1">a. Occupational health services is organized/provided by:</div>
          <div className="ml-4 space-y-0.5">
            <div className="flex items-center">
              <span className="w-6 text-center">({data.healthService?.organizedBy === 'establishment' ? '✓' : ' '})</span>
              <span>the establishment/undertaking</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center">({data.healthService?.organizedBy === 'government' ? '✓' : ' '})</span>
              <span>government authority/institution</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center">({data.healthService?.organizedBy === 'other' ? '✓' : ' '})</span>
              <span>other bodies/groups/institution (specify)</span>
              <div className="border-b border-black ml-2 px-2 flex-1">
                {data.healthService?.otherSpecify || 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xs">b. Occupational health services as described under number 7a above, is organized/provided as a Service:</div>
            <div className="ml-4 space-y-0.5 mt-1">
              <div className="flex items-center">
                <span className="w-6 text-center">({data.healthService?.serviceType === 'solely' ? '✓' : ' '})</span>
                <span>solely for the workers of the establishment/undertaking</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-center">({data.healthService?.serviceType === 'common' ? '✓' : ' '})</span>
                <span>common to a number of establishments/undertakings</span>
                <div className="border-b border-black ml-2 flex-1"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 ml-4">
          <div className="text-xs">c. The employer engages the services of:</div>
          <div className="ml-4 space-y-1 mt-1">
            <div className="flex items-center">
              <span className="w-6 text-center">(✓)</span>
              <span>Occupational Health Consultant (OSH Consultant)</span>
            </div>
            <div className="ml-6 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs">Name:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.consultant?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-xs">Address:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.consultant?.address || 'N/A'}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-6 text-center">( )</span>
              <span>Occupational health physician</span>
            </div>
            <div className="ml-6 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs">Name:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.physician?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-xs">Address:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.physician?.address || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-6 text-center">( )</span>
              <span>Occupational health dentist</span>
            </div>
            <div className="ml-6 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs">Name:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.dentist?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-xs">Address:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.dentist?.address || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-6 text-center">( )</span>
              <span>Occupational health nurse</span>
            </div>
            <div className="ml-6 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs">Name:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.nurse?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-xs">Address:</span>
                <div className="border-b border-black px-1 text-xs">{data.occupationalHealthStaff?.nurse?.address || 'N/A'}</div>
              </div>
            </div>

            <div className="mt-1 text-xs">
              <span>The occupational health physician/practitioner/nurse/personnel conducts an inspection of the workplace:</span>
            </div>
            <div className="flex flex-wrap space-x-4">
              <div className="flex items-center">
                <span className="w-6 text-center">({data.occupationalHealthStaff?.inspectionFrequency === 'monthly' ? '✓' : ' '})</span>
                <span>once every month</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-center">({data.occupationalHealthStaff?.inspectionFrequency === 'quarterly' ? '✓' : ' '})</span>
                <span>once every three (3) months</span>
              </div>
            </div>
            <div className="flex flex-wrap space-x-4">
              <div className="flex items-center">
                <span className="w-6 text-center">({data.occupationalHealthStaff?.inspectionFrequency === 'biannual' ? '✓' : ' '})</span>
                <span>once every two (2) months</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-center">({data.occupationalHealthStaff?.inspectionFrequency === 'other' ? '✓' : ' '})</span>
                <span>once every six (6) months</span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="w-6 text-center">( )</span>
                <span>other details</span>
                <div className="border-b border-black ml-2 flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Occupational Health Services */}
      <div>
        <div className="text-xs font-bold">8. Emergency Occupational Health Services:</div>
        <div className="ml-4">
          <div className="text-xs">a. The employer provides a treatment room/medical clinic in the workplace with medicines and facilities:</div>
          <div className="ml-4 flex space-x-4 mt-0.5">
            <div className="flex items-center">
              <span className="w-6 text-center">({data.emergencyServices?.hasTreatmentRoom ? '✓' : ' '})</span>
              <span>yes</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center">({!data.emergencyServices?.hasTreatmentRoom ? '✓' : ' '})</span>
              <span>no</span>
            </div>
          </div>
          <div className="ml-4 mt-0.5">
            <div className="flex items-center">
              <span className="w-6 text-center">( )</span>
              <span>others, please specify</span>
              <div className="border-b border-black ml-2 flex-1 text-xs">
                {data.emergencyServices?.otherDetails || 'Provided by the client'}
              </div>
            </div>
          </div>
            <div className="mt-2">
              <div className="text-xs">b. Schedule of attendance in the workplace:</div>
              <div className='ml-4'>
                <div className="text-xs text-right font-bold mb-0.5 mr-3">Work shift</div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="text-left w-1/2 ml-2">Occupational health physician</td>
                      <td className="text-center">:</td>
                      <td className="text-center w-16">
                        <div className="border-b border-black">
                          {data.workSchedule?.physician.hours || '____'}
                        </div>
                      </td>
                      <td className="text-center">hrs./day</td>
                      <td className="text-center w-20">
                        <div className="border-b border-black">
                          {data.workSchedule?.physician.shift || '____'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left w-1/2 ml-2">Occupational health dentist</td>
                      <td className="text-center">:</td>
                      <td className="text-center w-16">
                        <div className="border-b border-black">
                          {data.workSchedule?.dentist.hours || '____'}
                        </div>
                      </td>
                      <td className="text-center">hrs./day</td>
                      <td className="text-center w-20">
                        <div className="border-b border-black">
                          {data.workSchedule?.dentist.shift || '____'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left w-1/2 ml-2">Occupational health practitioner</td>
                      <td className="text-center">:</td>
                      <td className="text-center w-16">
                        <div className="border-b border-black">
                          {data.workSchedule?.practitioner.hours || '____'}
                        </div>
                      </td>
                      <td className="text-center">hrs./day</td>
                      <td className="text-center w-20">
                        <div className="border-b border-black">
                          {data.workSchedule?.practitioner.shift || '____'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left w-1/2 ml-2">Occupational health nurse</td>
                      <td className="text-center">:</td>
                      <td className="text-center w-16">
                        <div className="border-b border-black">
                          {data.workSchedule?.nurse.hours || '____'}
                        </div>
                      </td>
                      <td className="text-center">hrs./day</td>
                      <td className="text-center w-20">
                        <div className="border-b border-black">
                          {data.workSchedule?.nurse.shift || '____'}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageOne; 