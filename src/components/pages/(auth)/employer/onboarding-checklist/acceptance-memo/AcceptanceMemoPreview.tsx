'use client';

import React from 'react';

export type T_MemoFormData = {
  companyName: string;
  startDate: string;
  endDate: string;
  authorityName: string;
  authorityPosition: string;
  authorityDate: string;
  signature: string | null;
  checks: {
    systemSetup: boolean;
    employeeData: boolean;
    systemConfig: boolean;
    userTraining: boolean;
    systemNavigation: boolean;
  };
};

const CHECK_LABELS = [
  { key: 'systemSetup', label: 'System Setup Completed' },
  { key: 'employeeData', label: 'Employee Data Successfully Uploaded / Encoded' },
  { key: 'systemConfig', label: 'System Configuration Verified' },
  { key: 'userTraining', label: 'User Training and Orientation Completed' },
  { key: 'systemNavigation', label: 'System Navigation and Basic Workflows Tested' },
] as const;

const AcceptanceMemoPreview = ({ formData }: { formData: T_MemoFormData }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '___________';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className='mt-12'>
      {/* Title */}
      <h2 className='text-2xl font-bold mb-6 text-black'>Preview</h2>

      {/* Glow container */}
      <div className='relative'>
        {/* Three-layer glow effect */}
        <div
          className='absolute inset-0 -m-6 rounded-3xl opacity-10 blur-xl'
          style={{ backgroundColor: '#355FD0' }}
        ></div>
        <div
          className='absolute inset-0 -m-4 rounded-3xl opacity-20 blur-lg'
          style={{ backgroundColor: '#355FD0' }}
        ></div>
        <div
          className='absolute inset-0 -m-2 rounded-3xl opacity-30 blur-md'
          style={{ backgroundColor: '#355FD0' }}
        ></div>

        {/* Document card */}
        <div className='bg-white rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.01]'>
          <div className='relative min-h-[515px] md:min-h-[815px]'>
            {/* Document content */}
            <div className='relative z-10 p-4 sm:p-6 md:p-8 text-sm font-serif leading-relaxed text-gray-800'>
              {/* Header */}
              <div className='text-center mb-4'>
                <p className='font-bold text-base tracking-wide uppercase'>YAHSHUA HRIS</p>
                <p className='font-bold text-lg uppercase tracking-wider mt-1'>ACCEPTANCE MEMO</p>
              </div>

              {/* Instruction */}
              <p className='italic text-xs text-gray-500 text-center mb-3'>
                This document confirms the successful completion of the YAHSHUA HRIS onboarding process.
              </p>

              <hr className='border-gray-400 mb-4' />

              {/* Body paragraph 1 */}
              <p className='mb-4 text-justify'>
                This is to certify that{' '}
                <span className='font-semibold underline'>
                  {formData.companyName || '[Company/Firm/Institution]'}
                </span>{' '}
                has successfully completed the initial onboarding and setup of the YAHSHUA Human Resource
                Information System (HRIS), and that the following have been accomplished:
              </p>

              {/* Checklist items */}
              <ul className='mb-4 space-y-1 pl-2'>
                {CHECK_LABELS.map(({ key, label }) => (
                  <li key={key} className='flex items-start gap-2'>
                    <span className='mt-0.5 text-base leading-none'>
                      {formData.checks[key] ? '☑' : '☐'}
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              {/* Subscription period */}
              <p className='mb-4 text-justify'>
                The subscription period covered by this memo is from{' '}
                <span className='font-semibold underline'>
                  {formatDate(formData.startDate)}
                </span>{' '}
                to{' '}
                <span className='font-semibold underline'>
                  {formatDate(formData.endDate)}
                </span>
                .
              </p>

              {/* Body paragraph 2 */}
              <p className='mb-6 text-justify'>
                By accepting this memo, the authorized representative of the above-named organization confirms
                that all onboarding activities have been satisfactorily completed and that the system is ready
                for full operational use.
              </p>

              <hr className='border-gray-400 mb-6' />

              {/* Authorized by */}
              <div className='mt-4'>
                <p className='font-semibold mb-4'>Authorized by:</p>

                {/* Signature area */}
                <div className='mb-3 h-16 flex items-end'>
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt='Signature'
                      className='max-h-14 max-w-[180px] object-contain'
                    />
                  ) : (
                    <div className='w-48 border-b border-gray-400' />
                  )}
                </div>

                <div className='space-y-3'>
                  <div>
                    <p className='border-b border-gray-400 pb-0.5 min-w-[240px] inline-block font-semibold'>
                      {formData.authorityName || '\u00A0'}
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>Full Name</p>
                  </div>
                  <div>
                    <p className='border-b border-gray-400 pb-0.5 min-w-[240px] inline-block'>
                      {formData.authorityPosition || '\u00A0'}
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>Position / Designation</p>
                  </div>
                  <div>
                    <p className='border-b border-gray-400 pb-0.5 min-w-[180px] inline-block'>
                      {formData.authorityDate
                        ? new Date(formData.authorityDate + 'T00:00:00').toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                          })
                        : '\u00A0'}
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>Date (MM/DD/YYYY)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceMemoPreview;
