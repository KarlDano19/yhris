import React from 'react';

interface WemRequestData {
  dateOfApplication: string;
  companyName: string;
  address: string;
  region: string;
  emailAddress: string;
  telFaxNo: string;
  industryType: {
    manufacturing: boolean;
    manufacturingSpecify?: string;
    services: boolean;
    servicesSpecify?: string;
    others: boolean;
    othersSpecify?: string;
  };
  numberOfWorkers: {
    male: number;
    female: number;
    total: number;
  };
  riskClassification: 'low' | 'medium' | 'high';
  safetyOfficers: {
    names: string[];
    levels: {
      safetyOfficer1: boolean;
      safetyOfficer2: boolean;
      safetyOfficer3: boolean;
      accreditedSafetyOfficer3: boolean;
      safetyOfficer4: boolean;
    };
  };
  purposeOfWemRequest: {
    workplaceImprovement: boolean;
    clientRequirement: boolean;
    others: boolean;
    othersSpecify?: string;
    oshsCompliance: boolean;
    isoCompliance: boolean;
    requiredByLaborInspector: boolean;
  };
  wemMonitoringCapability: {
    internalMonitoringCapability: string;
    equipmentOwned: string;
    conductingInternalWem: boolean;
    dateOfInternalMonitoring?: string;
    personnelConductedWem?: string;
  };
  wemConductedBy: {
    oshc: boolean;
    oshcDate?: string;
    accreditedProvider: boolean;
    accreditedProviderDate?: string;
    accreditedProviderName?: string;
    none: boolean;
  };
}

interface WemRequestDocumentProps {
  data: WemRequestData;
}

const WemRequestDocument: React.FC<WemRequestDocumentProps> = ({ data }) => {
    return (
      <div className="bg-white text-black font-sans text-xs leading-tight max-w-4xl mx-auto p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header Section */}
        <div className="mb-1">
          {/* WEM Banner Image */}
          <div className="flex justify-center">
            <img 
              src="/assets/WEM-banner.png" 
              alt="OSHC WEM Banner" 
              className="max-w-xl"
            />
          </div>
        </div>
  
        {/* Title */}
        <div className="text-center mb-1">
          <div className="text-sm font-bold">WORK ENVIRONMENT MEASUREMENT (WEM) REQUEST</div>
        </div>
  
        {/* Instructions */}
        <div className="mb-1 text-xs">
          <ul className="list-disc list-inside space-y-0.5">
            <li>Print/write <strong>LEGIBLY</strong>.</li>
            <li>Mark appropriate boxes with <strong>&quot;✓&quot;.</strong></li>
            <li>Write <strong>&quot;NONE&quot;</strong> if not present or not existing in the company.</li>
            <li><strong>Incomplete request form will not be processed and be sent back to the company&apos;s email address. Please do not leave any unanswered items.</strong></li>
          </ul>
        </div>
  
        {/* Main Form - Single large bordered table */}
        <div className="border-2 border-black">
          {/* First Row - Basic Company Info */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/3 border-r border-black p-3">
                <div className="mb-1">
                  <div className="text-xs font-bold mb-1">Date of Application:</div>
                  <div className="border-b border-black pb-1">{data.dateOfApplication}</div>
                </div>
              </div>
              <div className="w-1/3 border-r border-black p-3">
                <div className="mb-1">
                  <div className="text-xs font-bold mb-1">Company Name:</div>
                  <div className="border-b border-black pb-1">{data.companyName}</div>
                </div>
              </div>
              <div className="w-1/3 p-3">
                <div className="mb-1">
                  <div className="text-xs font-bold mb-1">Address:</div>
                  <div className="border-b border-black pb-1">{data.address}</div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Second Row - Contact and Region */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/3 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">Region</div>
                <div className="border-b border-black pb-1">{data.region}</div>
              </div>
              <div className="w-1/3 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">Email address:</div>
                <div className="border-b border-black pb-1">{data.emailAddress}</div>
              </div>
              <div className="w-1/3 p-3">
                <div className="text-xs font-bold mb-1">Tel./Fax No:</div>
                <div className="border-b border-black pb-1">{data.telFaxNo}</div>
              </div>
            </div>
          </div>
  
          {/* Third Row - Industry Type and Workers */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/2 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">Type of Industry/Nature of Business (Pls. specify)</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                      {data.industryType.manufacturing ? '✓' : ''}
                    </div>
                    <span className="mr-2">Manufacturing of</span>
                    <div className="border-b border-black flex-1 pb-1">
                      {data.industryType.manufacturingSpecify || ''}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                      {data.industryType.services ? '✓' : ''}
                    </div>
                    <span className="mr-2">Service/s</span>
                    <div className="border-b border-black flex-1 pb-1">
                      {data.industryType.servicesSpecify || ''}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                      {data.industryType.others ? '✓' : ''}
                    </div>
                    <span className="mr-2">Others</span>
                    <div className="border-b border-black flex-1 pb-1">
                      {data.industryType.othersSpecify || ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 p-3">
                <div className="text-xs font-bold mb-1">Number of Workers (including outsource personnel):</div>
                <div className="space-y-2 mb-1">
                  <div className="flex items-center">
                    <span className="mr-2 w-12">Male:</span>
                    <div className="border-b border-black w-16 pb-1">{data.numberOfWorkers.male}</div>
                    <span className="mx-2 w-16">Female:</span>
                    <div className="border-b border-black w-16 pb-1">{data.numberOfWorkers.female}</div>
                    <span className="mx-2 w-12">Total:</span>
                    <div className="border-b border-black w-16 pb-1">{data.numberOfWorkers.total}</div>
                  </div>
                </div>
                <div className="text-xs font-bold mb-1">Risk Classification:</div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-1 flex items-center justify-center text-xs">
                      {data.riskClassification === 'low' ? '✓' : ''}
                    </div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-1 flex items-center justify-center text-xs">
                      {data.riskClassification === 'medium' ? '✓' : ''}
                    </div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-1 flex items-center justify-center text-xs">
                      {data.riskClassification === 'high' ? '✓' : ''}
                    </div>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Fourth Row - Safety Officers */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/2 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">Name of Safety Officer(s):</div>
                <div className="border-b border-black pb-1">{data.safetyOfficers.names.join(', ') || ''}</div>
              </div>
              <div className="w-1/2 p-3">
                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.safetyOfficers.levels.safetyOfficer1 ? '✓' : ''}
                      </div>
                      <span className="text-xs">Safety Officer 1</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.safetyOfficers.levels.safetyOfficer2 ? '✓' : ''}
                      </div>
                      <span className="text-xs">Safety Officer 2</span>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.safetyOfficers.levels.safetyOfficer3 ? '✓' : ''}
                      </div>
                      <span className="text-xs">Safety Officer 3</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.safetyOfficers.levels.accreditedSafetyOfficer3 ? '✓' : ''}
                      </div>
                      <span className="text-xs">Accredited Safety Officer 3</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.safetyOfficers.levels.safetyOfficer4 ? '✓' : ''}
                      </div>
                      <span className="text-xs">Safety Officer 4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Fifth Row - Purpose of WEM Request */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-2/3 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">Purpose of WEM Request:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.purposeOfWemRequest.workplaceImprovement ? '✓' : ''}
                      </div>
                      <span className="text-xs">Workplace Improvement</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.purposeOfWemRequest.clientRequirement ? '✓' : ''}
                      </div>
                      <span className="text-xs">Client/Customer Requirement</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-4 h-4 border border-black mr-2 mt-0.5 flex items-center justify-center text-xs">
                        {data.purposeOfWemRequest.others ? '✓' : ''}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs">Others: </span>
                        <span className="text-xs italic">Specify</span>
                        <div className="border-b border-black mt-1 pb-1 text-xs">
                          {data.purposeOfWemRequest.othersSpecify || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.purposeOfWemRequest.oshsCompliance ? '✓' : ''}
                      </div>
                      <span className="text-xs">OSHS Compliance</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                        {data.purposeOfWemRequest.isoCompliance ? '✓' : ''}
                      </div>
                      <span className="text-xs">ISO Compliance</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/3 p-3">
                <div className="flex items-start">
                  <div className="w-4 h-4 border border-black mr-2 mt-0.5 flex items-center justify-center text-xs">
                    {data.purposeOfWemRequest.requiredByLaborInspector ? '✓' : ''}
                  </div>
                  <span className="text-xs">Required by Labor Inspector (attach notice of inspection report)</span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Sixth Row - WEM Monitoring */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/4 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">WEM Internal Monitoring Capability</div>
                <div className="border-b border-black pb-1 text-xs">
                  {data.wemMonitoringCapability.internalMonitoringCapability}
                </div>
              </div>
              <div className="w-1/4 border-r border-black p-3">
                <div className="text-xs font-bold mb-1">WEM Equipment owned by company</div>
                <div className="border-b border-black pb-1 text-xs">
                  {data.wemMonitoringCapability.equipmentOwned}
                </div>
              </div>
              <div className="w-1/2 p-3">
                <div className="text-xs font-bold mb-1">Conducting internal WEM?</div>
                <div className="flex space-x-4 mb-1">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-1 flex items-center justify-center text-xs">
                      {data.wemMonitoringCapability.conductingInternalWem ? '✓' : ''}
                    </div>
                    <span className="text-xs">Yes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-black mr-1 flex items-center justify-center text-xs">
                      {!data.wemMonitoringCapability.conductingInternalWem ? '✓' : ''}
                    </div>
                    <span className="text-xs">No</span>
                  </div>
                </div>
                {data.wemMonitoringCapability.conductingInternalWem && (
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs mr-2">Date of Internal Monitoring:</span>
                      <div className="border-b border-black flex-1 pb-1 text-xs">
                        {data.wemMonitoringCapability.dateOfInternalMonitoring || ''}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2">Name of Personnel who conducted WEM:</span>
                      <div className="border-b border-black flex-1 pb-1 text-xs">
                        {data.wemMonitoringCapability.personnelConductedWem || ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Last Row - WEM Conducted by */}
          <div className="p-3">
            <div className="text-xs font-bold mb-1">WEM Conducted by:</div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.wemConductedBy.oshc ? '✓' : ''}
                </div>
                <span className="text-xs mr-4">OSHC</span>
                <span className="text-xs mr-2">Date of last WEM:</span>
                <div className="border-b border-black w-32 pb-1 text-xs">
                  {data.wemConductedBy.oshcDate || ''}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.wemConductedBy.accreditedProvider ? '✓' : ''}
                </div>
                <span className="text-xs mr-4">Accredited WEM Provider:</span>
                <div className="border-b border-black flex-1 pb-1 mr-4 text-xs">
                  {data.wemConductedBy.accreditedProviderName || ''}
                </div>
                <span className="text-xs mr-2">Date of last WEM:</span>
                <div className="border-b border-black w-32 pb-1 text-xs">
                  {data.wemConductedBy.accreditedProviderDate || ''}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-8">
                  <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                    {data.wemConductedBy.none ? '✓' : ''}
                  </div>
                  <span className="text-xs">None (New Client)</span>
                </div>
                <span className="text-xs mr-2">Conducted by:</span>
                <div className="border-b border-black flex-1 pb-1 text-xs"></div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer Note */}
        <div className="mt-2 text-xs">
          <div className="font-bold">Note: Please attach improvements initiated / administered based on WEM recommendations.</div>
        </div>
      </div>
    );
};

export default WemRequestDocument; 