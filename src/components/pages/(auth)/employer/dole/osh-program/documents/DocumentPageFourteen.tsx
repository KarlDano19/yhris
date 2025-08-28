import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageFourteenProps {
  data: T_OshProgram;
}

const DocumentPageFourteen: React.FC<DocumentPageFourteenProps> = ({ data }) => {
  // Define the dust control facilities with their field names
  const dustControlFacilities = [
    {
      name: 'Adequate supply of drinking water',
      valueField: 'adequate_supply_of_drinking_water',
      remarksField: 'adequate_supply_of_drinking_water_remarks',
      attachmentField: 'adequate_supply_of_drinking_water_attachment'
    },
    {
      name: 'Adequate sanitary and washing facilities',
      valueField: 'adequate_sanitary_and_washing_facilities',
      remarksField: 'adequate_sanitary_and_washing_facilities_remarks',
      attachmentField: 'adequate_sanitary_and_washing_facilities_attachment'
    },
    {
      name: 'Suitable living accommodation (if applicable)',
      valueField: 'suitable_living_accommodation',
      remarksField: 'suitable_living_accommodation_remarks',
      attachmentField: 'suitable_living_accommodation_attachment'
    },
    {
      name: 'Separate sanitary, washing and sleeping facilities (if applicable)',
      valueField: 'separate_sanitary_washing_and_sleeping_facilities',
      remarksField: 'separate_sanitary_washing_and_sleeping_facilities_remarks',
      attachmentField: 'separate_sanitary_washing_and_sleeping_facilities_attachment'
    },
    {
      name: 'Lactation station (in consonance with DOLE D.O. 143-15)',
      valueField: 'lactation_station',
      remarksField: 'lactation_station_remarks',
      attachmentField: 'lactation_station_attachment'
    },
    {
      name: 'Ramps, railings, and the like',
      valueField: 'ramps_railings_and_like',
      remarksField: 'ramps_railings_and_like_remarks',
      attachmentField: 'ramps_railings_and_like_attachment'
    },
    {
      name: 'Other workers\' welfare facilities as prescribed by OSHS and other related issuances',
      valueField: 'other_workers_welfare_facilities',
      remarksField: 'other_workers_welfare_facilities_remarks',
      attachmentField: 'other_workers_welfare_facilities_attachment'
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .facility-card {
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
          Dust Control and Management Facilities & Attachments
        </h1>
      </div>

      {/* Facilities with Attachments */}
      <div className="mb-6">
        <div className="space-y-4">
          {dustControlFacilities.map((facility, index) => {
            const hasAttachment = data[facility.attachmentField as keyof T_OshProgram];
            const facilityValue = data[facility.valueField as keyof T_OshProgram];
            const remarks = data[facility.remarksField as keyof T_OshProgram];
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-3 facility-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {facility.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <span className="text-xs text-gray-600">Status: </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          facilityValue === true 
                            ? 'bg-green-100 text-green-800' 
                            : facilityValue === false 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {facilityValue === true ? '✓ Yes' : facilityValue === false ? '✗ No' : 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Attachment: </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          hasAttachment ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {hasAttachment ? '📎 Available' : 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Remarks: </span>
                        <span className="text-xs text-gray-700">{remarks ? remarks as string : 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachment Display */}
                {hasAttachment && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md attachment-container">
                    {typeof hasAttachment === 'string' && hasAttachment ? (
                      <>
                        {/* Check if it's an image */}
                        {hasAttachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="text-center">
                            <img 
                              src={hasAttachment}
                              alt={`Attachment for ${facility.name}`}
                              className="max-w-full h-auto border border-gray-300 rounded mx-auto attachment-image"
                              style={{ maxHeight: '350px', maxWidth: '450px', objectFit: 'contain' }}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {hasAttachment.split('/').pop()}
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
                                href={hasAttachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                              >
                                View Document
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                {hasAttachment.split('/').pop()}
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
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Facilities:</span>
            <span className="font-medium ml-2">{dustControlFacilities.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Attachments Available:</span>
            <span className="font-medium ml-2">
              {dustControlFacilities.filter(facility => 
                data[facility.attachmentField as keyof T_OshProgram]
              ).length}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div>
            <span className="text-gray-600">Facilities with &quot;Yes&quot;:</span>
            <span className="font-medium ml-2">
              {dustControlFacilities.filter(facility => 
                data[facility.valueField as keyof T_OshProgram] === true
              ).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Facilities with &quot;No&quot;:</span>
            <span className="font-medium ml-2">
              {dustControlFacilities.filter(facility => 
                data[facility.valueField as keyof T_OshProgram] === false
              ).length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageFourteen;
