'use client';

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

const CHECK_LABELS: { key: keyof T_MemoFormData['checks']; label: string }[] = [
  { key: 'systemSetup', label: 'System Setup Completed' },
  { key: 'employeeData', label: 'Employee Data Successfully Uploaded / Encoded' },
  { key: 'systemConfig', label: 'System Configuration Verified' },
  { key: 'userTraining', label: 'User Training and Orientation Completed' },
  { key: 'systemNavigation', label: 'System Navigation and Basic Workflows Tested' },
];

function formatDate(dateStr: string) {
  if (!dateStr) return '_______________';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AcceptanceMemoPreview({ formData }: { formData: T_MemoFormData }) {
  return (
    <div className='bg-white p-8 w-full text-sm text-gray-800 font-serif'>
      {/* Header */}
      <div className='text-center mb-5'>
        <h1 className='text-2xl font-bold uppercase tracking-wide'>Acceptance Memo</h1>
        <p className='text-sm text-gray-500 mt-1'>YAHSHUA Human Resource Information System</p>
      </div>

      <hr className='border-gray-300 mb-5' />

      {/* Introduction */}
      <p className='mb-5 leading-relaxed'>
        This Acceptance Memo certifies that{' '}
        <strong>{formData.companyName || '_______________'}</strong> has successfully completed the
        YAHSHUA HRIS Onboarding process covering the period from{' '}
        <strong>{formatDate(formData.startDate)}</strong> to{' '}
        <strong>{formatDate(formData.endDate)}</strong>.
      </p>

      {/* Checklist */}
      <p className='font-semibold mb-3'>The following onboarding activities have been completed:</p>
      <div className='space-y-2 mb-6 pl-2'>
        {CHECK_LABELS.map(({ key, label }) => (
          <div key={key} className='flex items-center gap-4'>
            <div
              className={`w-5 h-5 flex-shrink-0 rounded border ${
                formData.checks[key] ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
              } flex items-center justify-center`}
            >
              {formData.checks[key] && (
                <svg className='w-3 h-3 text-white' viewBox='0 0 12 12' fill='none'>
                  <path d='M2 6l3 3 5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              )}
            </div>
            <span className={formData.checks[key] ? 'text-gray-800' : 'text-gray-400'}>{label}</span>
          </div>
        ))}
      </div>

      {/* Acknowledgment */}
      <p className='mb-6 leading-relaxed'>
        By signing below, the authorized representative of{' '}
        <strong>{formData.companyName || '_______________'}</strong> acknowledges receipt of
        all onboarding deliverables and confirms readiness to operate the YAHSHUA HRIS independently.
      </p>

      {/* Signature block */}
      <div className='mt-8 border-t border-gray-200 pt-6'>
        <p className='text-xs text-gray-500 mb-4'>Authorized Representative:</p>

        {formData.signature ? (
          <img
            src={formData.signature}
            alt='Signature'
            className='h-16 w-auto object-contain mb-2'
          />
        ) : (
          <div className='h-16 border-b border-gray-400 mb-2 w-56' />
        )}

        <p className='font-semibold'>{formData.authorityName || '_______________'}</p>
        <p className='text-gray-500'>{formData.authorityPosition || '_______________'}</p>
        <p className='text-gray-400 text-xs mt-1'>{formatDate(formData.authorityDate)}</p>
      </div>
    </div>
  );
}
