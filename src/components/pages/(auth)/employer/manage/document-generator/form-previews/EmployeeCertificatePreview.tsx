import Image from 'next/image';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';

interface EmployeeCertificatePreviewProps {
  formData: EmployeeCertificateFormData;
}

export default function EmployeeCertificatePreview({ formData }: EmployeeCertificatePreviewProps) {
  // Format the date if it exists using native Date methods
  const formattedIssueDate = formData.dateOfIssuance 
    ? new Date(formData.dateOfIssuance).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : '[Date of Issuance]';

  const formattedStartDate = formData.startDate
    ? new Date(formData.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '[Start Date]';

  // If end date exists, show it, otherwise use "Present"
  const endDateText = formData.endDate
    ? new Date(formData.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Present';
    
  // Validate that end date is after start date if both exist
  const validateDates = () => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      return endDate >= startDate;
    }
    return true;
  };
  
  const datesAreValid = validateDates();

  // Border color with fallback to default amber
  const borderColor = formData.borderColor || '#FFC107';

  // Check if we have either a custom letterhead or a sample letterhead
  const hasLetterhead = formData.letterheadImage || formData.sampleLetterheadPath;

  return (
    <div className="mt-12 certificate-preview-container">
      {/* Title visible in UI but hidden when printing */}
      <h2 className="text-2xl font-bold mb-6 text-black preview-header print-hide">Preview</h2>
      
      {/* Container for certificate with light effect */}
      <div className="relative">
        {/* Outer glow effects - only visible in preview */}
        <div className="absolute inset-0 -m-6 rounded-3xl opacity-10 blur-xl print-hide" style={{ backgroundColor: borderColor }}></div>
        <div className="absolute inset-0 -m-4 rounded-3xl opacity-20 blur-lg print-hide" style={{ backgroundColor: borderColor }}></div>
        <div className="absolute inset-0 -m-2 rounded-3xl opacity-30 blur-md print-hide" style={{ backgroundColor: borderColor }}></div>
        
        {/* Certificate content with letterhead background */}
        <div className="bg-white rounded-2xl shadow-lg relative overflow-hidden certificate-content transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.01]">
          {/* Inner light effect - hidden when printing */}
          <div className="absolute inset-0 rounded-lg from-white to-amber-50 certificate-glow print-hide"></div>
          
          {/* Letterhead as full background */}
          <div className="relative min-h-[515px] md:min-h-[815px] letterhead-background">
            {/* Letterhead background image - custom uploaded */}
            {formData.letterheadImage && (
              <div className="absolute inset-0 letterhead-image-container">
                <Image 
                  src={URL.createObjectURL(formData.letterheadImage)}
                  alt="Letterhead Background"
                  fill
                  style={{ objectFit: 'contain', opacity: 1, position: 'absolute', zIndex: 0 }}
                  priority
                />
              </div>
            )}
            
            {/* Letterhead background image - sample */}
            {!formData.letterheadImage && formData.sampleLetterheadPath && (
              <div className="absolute inset-0 letterhead-image-container">
                <Image 
                  src={formData.sampleLetterheadPath}
                  alt="Sample Letterhead Background"
                  fill
                  style={{ objectFit: 'contain', opacity: 1, position: 'absolute', zIndex: 0 }}
                  priority
                />
              </div>
            )}
            
            {/* Content overlaid on letterhead */}
            <div className="relative z-10 p-4 sm:p-6 md:p-8 certificate-inner-content">
              {/* Top spacing to match where letterhead would be */}
              <div className="mb-24 sm:mb-32 md:mb-44"></div>
              
              {/* Decorative line */}
              <div className="w-full border-b-2 mb-6 sm:mb-8 md:mb-10 certificate-border" style={{ borderColor }}></div>
              
              {/* Certificate Title */}
              <h1 className="text-center text-lg sm:text-xl md:text-1xl font-bold mb-4 sm:mb-6 md:mb-8 text-black certificate-title">
                {formData.documentTitle || '[Certificate Title]'}
              </h1>
              
              {/* Certificate Body */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-black certificate-body mx-auto max-w-3xl text-left">
                <p className="text-xs sm:text-sm">
                  This is to certify that <span className="font-semibold" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {formData.employeeName || '[Employee Name]'}
                  </span> {formData.endDate ? 'was employed by' : 'is currently employed by'} <span className="font-semibold" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {formData.companyName || '[Company Name]'}
                  </span> as <span className="font-semibold" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {formData.position || '[Position]'}
                  </span> from <span className="font-semibold">
                    {formattedStartDate}
                  </span> to <span className={`font-semibold ${!datesAreValid ? 'text-red-500' : ''}`}>
                    {datesAreValid ? endDateText : 'Invalid date (end date before start date)'}
                  </span>.
                </p>
                
                <p className="text-xs sm:text-sm" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                  This certificate is issued for {formData.purpose || '___________'}
                </p>
                
                <p className="text-xs sm:text-sm">
                  Issued this {formattedIssueDate} in {formData.placeOfIssuance || '[Place of Issuance]'}.
                </p>
              </div>

              {/* Decorative line */}
              <div className="w-full border-b-2 mt-6 sm:mt-8 md:mt-10 certificate-border" style={{ borderColor }}></div>
              
              {/* Signature Section */}
              <div className="mt-6 sm:mt-8 md:mt-10 pt-3 sm:pt-4 md:pt-6 text-black certificate-signature">
                {/* Signature Image */}
                {formData.signature && (
                  <div className="-mb-1 sm:-mb-1 relative h-12">
                    <Image 
                      src={typeof formData.signature === 'string' 
                        ? formData.signature 
                        : URL.createObjectURL(formData.signature as File)}
                      alt="Signature" 
                      width={150}
                      height={48}
                      style={{ objectFit: 'contain', height: '3rem' }}
                    />
                  </div>
                )}
                <p className="font-semibold mb-1 certificate-signature-name text-sm sm:text-base" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{formData.signatoryName || '[Signatory Name]'}</p>
                <p className="text-xs mb-1 certificate-signature-position" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{formData.signatoryPosition || '[Position]'}</p>
                <p className="text-xs certificate-signature-company" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{formData.companyName || '[Company Name]'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 