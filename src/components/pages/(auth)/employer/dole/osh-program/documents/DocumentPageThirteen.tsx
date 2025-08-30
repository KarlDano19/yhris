import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageThirteenProps {
  data: T_OshProgram;
}

const DocumentPageThirteen: React.FC<DocumentPageThirteenProps> = ({ data }) => {
  // Parse safety officers data
  const getSafetyOfficers = () => {
    try {
      const safetyOfficersData = typeof data.safety_officers === 'string' 
        ? JSON.parse(data.safety_officers) 
        : data.safety_officers || [];
      
      return Array.isArray(safetyOfficersData) ? safetyOfficersData : [];
    } catch (error) {
      return [];
    }
  };

  const safetyOfficers = getSafetyOfficers();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .officer-card {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .certificate-container {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .certificate-image {
              max-height: 500px !important;
              max-width: 600px !important;
            }
          }
        `
      }} />
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-2">
          Safety Officers and Certificates
        </h1>
      </div>

      {/* Safety Officer Certificates */}
      <div className="mb-6">
        <div className="space-y-6">
          {safetyOfficers.length > 0 ? (
            safetyOfficers.map((officer: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 officer-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {officer.name || `Safety Officer ${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Training: {officer.training_and_hours || 'Not specified'}
                    </p>
                  </div>
                  <div className="text-right">
                    {officer.certificate ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Certificate
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✗ No Certificate
                      </span>
                    )}
                  </div>
                </div>

                {/* Certificate Display */}
                {officer.certificate && (
                  <div className="mt-3 bg-gray-50 p-4 rounded-md certificate-container">
                    {typeof officer.certificate === 'string' && officer.certificate ? (
                      <>
                        {/* Check if it's an image */}
                        {officer.certificate.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="text-center">
                            <img 
                              src={officer.certificate}
                              alt={`Certificate for ${officer.name}`}
                              className="max-w-full h-auto border border-gray-300 rounded mx-auto certificate-image"
                              style={{ maxHeight: '500px', maxWidth: '600px', objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          /* For non-image files, show download link */
                          <div className="flex items-center justify-center space-x-2 py-8">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="text-center">
                              <a 
                                href={officer.certificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                              >
                                View Certificate Document
                              </a>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4">
                        Certificate format not recognized for preview.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-8">
              No safety officers have been added yet.
            </p>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Safety Officers:</span>
            <span className="font-medium ml-2">{safetyOfficers.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Certificates Uploaded:</span>
            <span className="font-medium ml-2">
              {safetyOfficers.filter((officer: any) => officer.certificate).length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageThirteen;
