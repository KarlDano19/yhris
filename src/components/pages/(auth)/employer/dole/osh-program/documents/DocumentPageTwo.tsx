import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTwoProps {
  data: T_OshProgram;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({ data }) => {
  return (
    <>
      {/* Document Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Basic Components of Company OSH Program and Policy
        </h1>
        <h2 className="text-lg text-gray-700">
          (DO 198-18, Chapter IV, Section 12)
        </h2>
      </div>

      {/* Basic Components Content */}
      {data.basic_components && (
      <div className="space-y-3 flex-1">
          <div 
            className="text-sm text-gray-700 [&>p]:flex [&>p]:items-start [&>p]:mb-3 [&>ol]:space-y-3 [&>ul]:space-y-3 [&>li]:flex [&>li]:items-start"
            dangerouslySetInnerHTML={{ __html: data.basic_components }}
          />
        </div>
      )}
    </>
  );
};

export default DocumentPageTwo;
