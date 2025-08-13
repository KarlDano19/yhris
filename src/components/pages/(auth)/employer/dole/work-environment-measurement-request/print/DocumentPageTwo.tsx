import React from 'react';

interface WemRequestData {
  parametersToBeMeasured: {
    physicalHazards: {
      noise: boolean;
      vibration: boolean;
      illumination: boolean;
      heat: boolean;
    };
    chemicalHazards: {
      dust: boolean;
      heavyMetals: boolean;
      organicSolvents: boolean;
      acids: boolean;
      gases: boolean;
      others: boolean;
      othersSpecify?: string;
    };
    ventilation: {
      generalVentilation: boolean;
      localExhaustVentilation: boolean;
    };
  };
  requestingPersonnel: {
    signature: string;
    name: string;
    position: string;
  };
}

interface DocumentPageTwoProps {
  data: WemRequestData;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({ data }) => {
  return (
    <div className="bg-white text-black font-sans text-xs leading-tight max-w-4xl mx-auto p-2" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Parameters to be Measured Section */}
      <div className="mb-6">
        <div className="text-xs font-bold mb-3">
          Please select the parameters to be measured per work area based on the initial assessment of the Safety Officer:
        </div>
        
        {/* Main bordered form section */}
        <div className="border-2 border-black p-4">
          {/* A. Physical Hazards */}
          <div className="mb-4">
            <div className="text-xs font-bold mb-2">A. Physical Hazards:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.physicalHazards.noise ? '✓' : ''}
                </div>
                <span className="text-xs">Noise</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.physicalHazards.vibration ? '✓' : ''}
                </div>
                <span className="text-xs">Vibration</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.physicalHazards.illumination ? '✓' : ''}
                </div>
                <span className="text-xs">Illumination</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.physicalHazards.heat ? '✓' : ''}
                </div>
                <span className="text-xs">Heat</span>
              </div>
            </div>
          </div>

          {/* B. Chemical Hazards */}
          <div className="mb-4">
            <div className="text-xs font-bold mb-2">B. Chemical Hazards:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.dust ? '✓' : ''}
                </div>
                <span className="text-xs">Dust</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.heavyMetals ? '✓' : ''}
                </div>
                <span className="text-xs">Heavy Metals</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.organicSolvents ? '✓' : ''}
                </div>
                <span className="text-xs">Organic Solvents</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.acids ? '✓' : ''}
                </div>
                <span className="text-xs">Acids</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.gases ? '✓' : ''}
                </div>
                <span className="text-xs">Gases</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.others ? '✓' : ''}
                </div>
                <span className="text-xs mr-2">Others: Specify</span>
                <div className="border-b border-black flex-1 pb-1 text-xs">
                  {data.parametersToBeMeasured.chemicalHazards.othersSpecify || ''}
                </div>
              </div>
            </div>
          </div>

          {/* C. Ventilation */}
          <div>
            <div className="text-xs font-bold mb-2">C. Ventilation:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.ventilation.generalVentilation ? '✓' : ''}
                </div>
                <span className="text-xs">General Ventilation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-xs">
                  {data.parametersToBeMeasured.ventilation.localExhaustVentilation ? '✓' : ''}
                </div>
                <span className="text-xs">Local Exhaust Ventilation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agreements and Consent Section */}
      <div className="mb-6 space-y-4">
        {/* Certification/Agreement */}
        <div className="text-xs leading-relaxed">
          <strong>Certification/Agreement:</strong> This is to certify that the company agrees to pay all the expenses incurred during coordination and other pre-WEM activities such as communication, consumables, transportation expense, etc. in the event that the company cancels the WEM on/or 5 working days before the scheduled WEM.
        </div>

        {/* Consent */}
        <div className="text-xs leading-relaxed">
          <strong>Consent:</strong> By filling out this form and signing below, I am giving my consent to the OSHC to collect, process, retain and store my personal data in accordance with the provisions of Republic Act 10173 – Data Privacy Act of 2012.
        </div>
      </div>

      {/* Signature Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-8">
            <div className="text-center relative">
              {data.requestingPersonnel.signature && (
                <div className="absolute w-full right-3 -top-7 z-10">
                  <img 
                    src={data.requestingPersonnel.signature} 
                    alt="Signature" 
                    style={{ 
                      height: '48px', 
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto'
                    }} 
                  />
                </div>
              )}
              <div className="text-center border-b-2 mb-1 border-black">
                {data.requestingPersonnel.name}
              </div>
            </div>
            <div className="text-xs text-center">Signature over Printed Name of Requesting Personnel</div>
          </div>
          <div className="w-1/3">
            <div className="text-center border-b-2 border-black mb-1">
              {data.requestingPersonnel.position}
            </div>
            <div className="text-xs text-center">Position / Designation</div>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="border-t-2 border-black pt-4">
        <div className="text-xs font-bold mb-3">Instructions:</div>
        <div className="text-xs space-y-2">
          <div>Please send the signed and fully accomplished WEM Request Form to the email address below:</div>
          
          <div className="ml-4 space-y-1">
            <div>
              <strong>To:</strong> <a href="mailto:oed@oshc.dole.gov.ph" className="text-blue-600 underline">oed@oshc.dole.gov.ph</a>
            </div>
            <div>
              <strong>Cc:</strong> <a href="mailto:ecd.oshc.wem@gmail.com" className="text-blue-600 underline">ecd.oshc.wem@gmail.com</a> <span className="text-black">(dedicated email for WEM request)</span>
            </div>
          </div>

          <div className="mt-3">
            <strong>Or Fax to:</strong> (632) 8929-60-30; (632) 8924-24-12
          </div>

          <div className="mt-2">
            If faxed, please notify us through the email addresses provided above for proper acknowledgement. Otherwise request will not be processed.
          </div>

          <div className="mt-3">
            <strong>Please address the email to:</strong>
            <div className="ml-4 mt-1">
              <div>ENGR. JOSE MARIA S. BATINO</div>
              <div>Executive Director</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageTwo;
