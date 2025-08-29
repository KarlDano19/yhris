import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageThreeProps {
  data: T_OshProgram;
}

const DocumentPageThree: React.FC<DocumentPageThreeProps> = ({ data }) => {
  return (
    <>
      {/* Document Header */}
      <div id="document-page-3" className="text-left mb-8">
        <h1 className="text-lg font-bold text-gray-900">
          1.0 Company Commitment to Comply with OSH Policy
        </h1>
      </div>

      {/* Company Commitment Content */}
      {data.company_commitment ? (
        <div className="space-y-6 mb-10">
          <div 
            className="text-sm leading-relaxed text-gray-900 prose prose-sm max-w-none [&>p]:mb-6 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.company_commitment }}
          />
        </div>
      ) : (
        <div className="space-y-6 mb-10">
          {/* Default Content if no custom commitment */}
          <div className="text-sm leading-relaxed text-gray-900">
            <span className="font-bold uppercase">{data.company_name || 'COMPANY'}</span> do hereby commit to comply with the requirements of RA 11058 and DOLE Department Order 198-18 (its Implementing Rules and Regulations) and the applicable provisions of the Occupational Safety and Health Standards (OSHS).
          </div>

          <div className="text-sm leading-relaxed text-gray-900">
            We acknowledge the company&apos;s obligation and responsibilities to provide appropriate funds for implementing this OSH program including orientation and training of its employees on OSH, provision and dissemination of IEC materials on safety and health, provision of Personal Protective Equipment (PPE) when necessary and other OSH related requirements and activities, to ensure the protection for our workers and employees against injuries, illnesses and death through safe and healthy working conditions and environment.
          </div>

          <div className="text-sm leading-relaxed text-gray-900">
            We commit to conduct risk assesxsent as required to prevent workplace accidents as well as comply with other provisions of this OSH program. That we are also fully aware of the penalties and sanctions for OSH violations as provided for in RA 11058 and its Implementing Rules and Regulations.
          </div>
        </div>
      )}

      {/* Signature Block */}
      <div className="mt-10 space-y-6 w-3/4 m-40">
        {/* Signature Line */}
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">[Signature]</span>
          <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2 relative">
            {typeof data.signature === 'string' && data.signature ? (
              <img 
                src={data.signature} 
                alt="Signature" 
                className="absolute -bottom-6 left-0 max-w-full max-h-16 object-contain"
              />
            ) : (
              <span className="text-gray-400">No signature available</span>
            )}
          </div>
        </div>

        {/* Name Line */}
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">[Name]</span>
          <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
            {data.name_of_owner}
          </div>
        </div>

        {/* Title Line */}
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">[President] / [Chief Executive Officer] / [Owner]</span>
          <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
            Owner/Manager
          </div>
        </div>

        {/* Date Line */}
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">[Date]:</span>
          <div className="border-b border-gray-300 flex-1 pb-1 min-h-[20px] ml-2">
            {data.date}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageThree;
