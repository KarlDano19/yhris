import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageFourteenProps {
  data: T_OshProgram;
}

const DocumentPageFourteen: React.FC<DocumentPageFourteenProps> = ({ data }) => {
  // Parse health personnel data
  const getHealthPersonnel = () => {
    try {
      const healthPersonnelData = typeof data.health_personnel === 'string' 
        ? JSON.parse(data.health_personnel) 
        : data.health_personnel || [];
      
      return Array.isArray(healthPersonnelData) ? healthPersonnelData : [];
    } catch (error) {
      return [];
    }
  };

  const healthPersonnel = getHealthPersonnel();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .personnel-card {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .attachment-container {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .attachment-image {
              max-height: 300px !important;
              max-width: 400px !important;
            }
          }
        `
      }} />
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-2">
          Emergency Occupational Health Personnel and Facilities
        </h1>
      </div>

      {/* Health Personnel with Attachments */}
      <div className="mb-6">
        <div className="space-y-4">
          {healthPersonnel.length > 0 ? (
            healthPersonnel.map((personnel: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 personnel-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {personnel.shift_area_department || `Health Personnel ${index + 1}`}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <span className="text-xs text-gray-600">Total Workers: </span>
                        <span className="text-xs text-gray-700 font-medium">{personnel.total_workers || 0}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Health Personnel: </span>
                        <span className="text-xs text-gray-700 font-medium">{personnel.health_personnel_name || 'Not specified'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-gray-600">Facilities: </span>
                        <span className="text-xs text-gray-700">{personnel.facilities || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {personnel.attachment ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Attachment
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✗ No Attachment
                      </span>
                    )}
                  </div>
                </div>

                {/* Attachment Display */}
                {personnel.attachment && (
                  <div className="mt-3 bg-gray-50 p-4 rounded-md attachment-container">
                    {typeof personnel.attachment === 'string' && personnel.attachment ? (
                      <>
                        {/* Check if it's an image */}
                        {personnel.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="text-center">
                            <img 
                              src={personnel.attachment}
                              alt={`Attachment for ${personnel.shift_area_department}`}
                              className="max-w-full h-auto border border-gray-300 rounded mx-auto attachment-image"
                              style={{ maxHeight: '350px', maxWidth: '450px', objectFit: 'contain' }}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {personnel.attachment.split('/').pop()}
                            </p>
                          </div>
                        ) : (
                          /* For non-image files, show download link */
                          <div className="flex items-center justify-center space-x-2 py-8">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="text-center">
                              <a 
                                href={personnel.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                              >
                                View Document
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                {personnel.attachment.split('/').pop()}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4">
                        Attachment format not recognized for preview.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-8">
              No emergency occupational health personnel have been added yet.
            </p>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Health Personnel:</span>
            <span className="font-medium ml-2">{healthPersonnel.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Attachments Available:</span>
            <span className="font-medium ml-2">
              {healthPersonnel.filter((personnel: any) => personnel.attachment).length}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div>
            <span className="text-gray-600">Total Workers Covered:</span>
            <span className="font-medium ml-2">
              {healthPersonnel.reduce((total: number, personnel: any) => 
                total + (personnel.total_workers || 0), 0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Personnel with Names:</span>
            <span className="font-medium ml-2">
              {healthPersonnel.filter((personnel: any) => 
                personnel.health_personnel_name && personnel.health_personnel_name.trim() !== ''
              ).length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageFourteen;
