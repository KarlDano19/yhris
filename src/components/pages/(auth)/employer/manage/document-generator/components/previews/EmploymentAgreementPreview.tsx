'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

import { EmploymentAgreementFormData } from '@/types/document-generator/documents';

interface EmploymentAgreementPreviewProps {
  formData: EmploymentAgreementFormData;
}

export default function EmploymentAgreementPreview({ formData }: EmploymentAgreementPreviewProps) {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    // Handle signature
    if (formData.signature) {
      if (typeof formData.signature === 'string') {
        setSignatureUrl(formData.signature);
      } else {
        const url = URL.createObjectURL(formData.signature);
        setSignatureUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setSignatureUrl(null);
    }
  }, [formData.signature]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '[Date]';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return '[Invalid Date]';
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            {/* Document title - Only on first page */}
            <div className="text-center mb-1 mt-6">
              <h1 className="text-sm font-bold text-black">Employment Agreement</h1>
            </div>
            
            {/* Page 1 - Matches exactly what's in the first image */}
            <div className="mb-6">
              <p className="text-xs text-black mb-4">
                This Employment Agreement (&quot;Agreement&quot;) is made and entered into on {formData.dateOfIssuance ? formatDate(formData.dateOfIssuance) : '[Date of Issuance]'} in {formData.placeOfIssuance || '[Place of Issuance]'} between {formData.companyName || '[Company Name]'} (hereinafter referred to as &quot;Employer&quot;)
              </p>
              <p className="text-xs text-black mb-4">
                and
              </p>
              <p className="text-xs text-black mb-4">
                {formData.employeeName || '[Employee Name]'} (hereinafter referred to as Employee&quot;)
              </p>
              <p className="text-xs text-black mb-4">
                In consideration of the mutual covenants set forth below, Employer agrees to hire Employee and
                Employee agrees to work for Employer as set forth in this Agreement.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">1. Position and Employment Period</h2>
              <p className="text-xs text-black mb-4">
                That the Employee is set to commence employment on {formData.startDate ? formatDate(formData.startDate) : '[Start Date]'} with {formData.probationPeriod || '[Probation Period]'} months under
                Probationary status as {formData.position || '[Position]'}.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">2. Performance of Duties</h2>
              <p className="text-xs text-black mb-4">
                The Employee agrees that during the Employment Period he/she shall devote his/her full working
                time, attention, knowledge and skills to the business affairs of the Employer and shall do so in good
                faith, with best efforts, and to the reasonable satisfaction of the Employer. The Employee shall also
                perform such other duties as are customarily performed by other persons in similar such positions,
                as well as such other duties as may be assigned from time to time by the Employer. Employee
                agrees to refrain from any interest, of any kind whatsoever, in any business competitive to
                Employer&apos;s business. The Employee further acknowledges they will not engage in any form of
                activity that produces a &quot;conflict of interest&quot; with those of the Employer unless agreed to in
                advance and in writing.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">3. Performance Evaluations</h2>
              <p className="text-xs text-black mb-4">
                Performance evaluations are conducted every month for the duration of the Probationary Period to
                discuss job responsibilities, standards, and performance requirements. Additional formal
                performance reviews are conducted to provide both the company and employees the opportunity to
                discuss job tasks, identify and correct performance deficiencies, encourage and recognize strengths,
                and discuss positive, purposeful approaches for meeting goals.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">4. Place and Hours of Employment</h2>
              <p className="text-xs text-black mb-4">
                Employee agrees that their duties shall be primarily rendered at Employer&apos;s business premises or at
                such other places as the Employer shall in good faith require. Full time service for the Employee is
                expected which requires a minimum of {formData.workingHours || '[Working Hours]'} hours per day, exclusive of vacation, or any other form of
                leave as described within this Agreement.
              </p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Page 2 - Matches exactly what's in the second image */}
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">5. Compensation Package</h2>
              <p className="text-xs text-black mb-4">
                Employee agrees that Employer will pay him every 15<sup>th</sup> and 30<sup>th</sup> of the month his basic salary of
                Php {formData.dailySalary || '[Daily Salary]'} daily.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">6. Salary Adjustment</h2>
              <p className="text-xs text-black mb-4">
                Adjustments to salary and benefits are based on the value contributed by Employee to Employer.
                While salary adjustments are primarily based on merit, The Employer may at times adjust salaries
                depending on overall company performance, and/or the cost of living changes to salaries of
                similarity started employees in the company or industry.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">7. Benefits</h2>
              <p className="text-xs text-black mb-4">
                A. SSS, PhilHealth and Pagibig
              </p>
              <p className="text-xs text-black mb-4">
                B. Employee may use the 5 days Service Incentive Leave (SIL) after one (1) year of service.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-bold mb-2 text-black">8. Covenants</h2>
              <p className="text-xs font-bold text-black mb-4">
                A. Non-Disclosure of Trade Secrets, Customer Lists and Other Proprietary Information
              </p>
              <p className="text-xs text-black mb-4">
                during and after the Employment Period, the Employee will not divulge or appropriate to his own
                use or to the use of others, in competition with the Company, any secret or confidential information
                or knowledge pertaining to the business of the Company, or of any of its subsidiaries, obtained by
                him in any way while he was employed by the Company or by any of its subsidiaries. Employee
                agrees not to use, disclose or communicate, in any manner, proprietary information about
                Employer, its operations, clientele, or any other proprietary information, that relate to the business
                of Employer. This includes, but is not limited to, the names of Employer&apos;s customers, its marketing
                strategies, operations, or any other information of any kind which would be deemed confidential or
                proprietary information of the Employer. Employee acknowledges that the above information is
                material and confidential and that it affects the profitability of the Employer. The Employee
                understands that any breach of this provision, or of any other Confidentiality and Non-Disclosure
                Agreement, is a material breach of this Agreement.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                B. Non-Solicitation Covenant
              </p>
              <p className="text-xs text-black mb-4">
                Employee agrees that for a period of following termination of employment, for any reason
                whatsoever, Employee will not solicit customers or clients of the Employee. By agreeing to this
                covenant, Employee acknowledges that their contributions to Employer are unique to Employer&apos;s
                success and that they have significant access to Employer&apos;s trade secrets and other confidential or
                proprietary information regarding Employer&apos;s customers or clients.
              </p>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Page 3 - Matches exactly what's in the third image */}
            <div className="mb-6">
              <p className="text-xs font-bold text-black mb-4">
                C. Non-Recruit Covenant
              </p>
              <p className="text-xs text-black mb-4">
                Employee agrees not to recruit any of Employer&apos;s employees for the purpose of any outside
                business either during or for a period of 12 months after Employees tenure of employment with
                Employer. Employee agrees that such effort at recruitment also constitutes a violation of the
                non-solicitation covenant set forth above.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                D. Non-Compete Covenant
              </p>
              <p className="text-xs text-black mb-4">
                During the period of his employment under this Agreement, the Employee shall not be employed
                by or otherwise engage in or be interested in any business in competition with the Company, or
                with any of its subsidiaries or affiliates.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                E. Remedies
              </p>
              <p className="text-xs text-black mb-4">
                If at any time the Employee violates to a material extent any of the covenants or agreements set
                forth in sections C and D, the Company shall have the right to terminate all of its obligations to
                make further payments under this Agreement. The Employee acknowledges that the Company
                would be irreparably injured by a violation of sections C and D and agrees that the Company shall
                be entitled to an injunction restraining the Employee from any actual or threatened breach of
                sections C and D or to any other appropriate equitable remedy without any bond or other security
                being required.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                F. Adherence to Employer&apos;s Policies, Procedures, Rules and Regulations
              </p>
              <p className="text-xs text-black mb-4">
                The Employee agrees to adhere to all of the policies, procedures, rules and regulations set forth by
                the employer. These policies, procedures, rules and regulations include, but are not limited to, those
                set forth within the Employee Handbook, any summary benefit plan descriptions, or any other
                personnel practices or policies or Employer. To the extent that the Employer&apos;s policies, procedures,
                rules and regulations conflict with the terms of this Agreement, the specific terms of this
                Agreement will control.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-black mb-4">
                G. Covenant to Notify Management of Unlawful Acts or Practices
              </p>
              <p className="text-xs text-black mb-4">
                Employee agrees to abide by the legal and ethics policies of Employer as well as Employer&apos;s other
                rules, regulations, policies and procedures. The Employer intends to comply in full with all
                governmental laws and regulations as well as any ethics code applicable to their profession. In the
                event that the Employee is aware of the Employer, or any of its officers, agents or employees,
                violating any such laws, ethics codes, rules, violations to the attention of the Employer immediately
                so that matter may be properly investigated and appropriate action taken.
              </p>
              <p className="text-sm text-black mb-4 font-bold">
                10. Property Rights
              </p>
              <p className="text-xs font-bold text-black mb-4">
                A. Existing Customers or Clientele of Employee
              </p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Page 4 - Matches exactly what's in the fourth image */}
            <div className="mb-6">
              <p className="text-xs text-black mb-4">
                Employer agrees that existing customers or clients of Employee will (become the property of
                Employer) (remain the property of the Employer) as the condition of employment.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                B. New Customers or clientele generated While at Work
              </p>
              <p className="text-xs text-black mb-4">
                Employee agrees that any customers or clientele generated by Employee pursuant to employment
                with Employer are the customers and clientele of the Employer and subject to the non-disclosure
                and non-solicitation covenants set forth above.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                C. Records and Accounts
              </p>
              <p className="text-xs text-black mb-4">
                The Employee agrees that all those records and accounts maintained during the course of
                employment are the property of the Employer, shall remain current and be maintained at the
                Employer&apos;s place of business.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                D. Return Upon Termination
              </p>
              <p className="text-xs text-black mb-4">
                Employee agrees that upon termination they will return to Employer all of Employer&apos;s property,
                including, but not limited to, intellectual property, trade secret information, customer lists,
                operation manuals, employee handbook, records and accounts, materials subject to copyright,
                trademark, or patent protection, customer and Employer information, credit cards, business
                documents, reports, automobiles, keys, passes, and security devices.
              </p>
              <p className="text-xs font-bold text-black mb-4">
                E. Copyrights, Inventions and Patents
              </p>
              <p className="text-xs text-black mb-4">
                The Employee understands that any copyrights, inventions or patents created or obtained, in part or
                whole, by the Employee during the course of this Agreement are to be considered &quot;work for hire&quot;
                and the property of the Employer. Employee assigns to Employer all rights and interest in any
                copyright, invention, patents or other property related to business of the Employer.
              </p>
            </div>
          </>
        );
      case 5:
        return (
          <>
            {/* Page 5 - Matches exactly what's in the fifth image */}
            
            {/* Acknowledgement */}
            <div className="mb-6 text-center mt-8">
              <p className="text-xs text-black mb-2">
                ACKNOWLEDGES THAT EMPLOYEE HAS READ, UNDERSTOOD, AND AGREES TO
                BE BOUND BY THE TERMS AND CONDITIONS CONTAINED IN THIS AGREEMENT.
              </p>
            </div>
            
            {/* Signatory section */}
            <div className="mt-8 pt-6">
              {/* Employee row */}
              <div className="mb-16">
                <div className="w-1/3 mx-auto">
                  <p className="text-center text-xs text-black">{formData.employeeName || '[Employee Name]'}</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-center text-xs text-black font-bold">Employee</p>
                  </div>
                </div>
              </div>
              
              {/* Ms. April row */}
              <div className="mb-16">
                <div className="w-1/2 mx-auto">
                  {/* Signature Image */}
                  {signatureUrl && (
                    <div className="text-center mb-2">
                      <Image 
                        src={signatureUrl}
                        alt="Signature" 
                        className="h-12 object-contain mx-auto"
                        width={150}
                        height={48}
                      />
                    </div>
                  )}
                  <p className="text-center text-xs text-black">{formData.signatoryName || '[Signatory Name]'}</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-center text-xs text-black font-bold">{formData.signatoryPosition || '[Position]'}</p>
                    <p className="text-center text-xs text-black font-bold">{formData.companyName || '[Company Name]'}</p>
                  </div>
                </div>
              </div>
              
              {/* Witness section */}
              <div>
                <p className="mb-14 text-xs text-black">Signed in the presence of:</p>
                <div className="flex justify-between">
                  <div className="w-1/2 pr-4">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-center text-xs text-black font-bold">Witness</p>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-center text-xs text-black font-bold">Witness</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-12 agreement-preview-container border-rounded-">
      {/* Title visible in UI but hidden when printing */}
      <h2 className="text-2xl font-bold mb-6 text-black preview-header print-hide">Preview</h2>
      
      <div className="flex flex-col">
        {/* Container for agreement with light effect */}
        <div className="relative mb-6">
          {/* Outer glow effects - only visible in preview */}
          <div className="absolute inset-0 -m-6 rounded-3xl opacity-10 blur-xl print-hide" style={{ backgroundColor: '#FFC107' }}></div>
          <div className="absolute inset-0 -m-4 rounded-3xl opacity-20 blur-lg print-hide" style={{ backgroundColor: '#FFC107' }}></div>
          <div className="absolute inset-0 -m-2 rounded-3xl opacity-30 blur-md print-hide" style={{ backgroundColor: '#FFC107' }}></div>
          
          {/* Agreement content */}
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.01]">
            {/* Inner light effect - hidden when printing */}
            <div className="absolute inset-0 rounded-lg from-white to-amber-50 agreement-glow print-hide"></div>
            
            <div className="relative preview-container" style={{ minHeight: '883px' }}>
              {/* Company header */}
              <div className="text-center mb-8">
                  <h2 className="text-md font-bold text-black">{formData.companyName || '[Company Name]'}</h2>
                  <p className="text-xs text-gray-600">{formData.companyAddress || '[Company Address]'}</p>
              </div>
              
              {/* Dynamic content based on current page */}
              {renderPageContent()}
            </div>
          </div>
        </div>
        
        {/* Pagination controls - completely outside the glowing effect container */}
        <div className="flex justify-between items-center px-2 print-hide max-w-3xl mx-auto w-full" style={{ padding: '10px 20px', borderRadius: '8px' }}>
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          
          <div className="text-center">
            <span className="font-medium text-black">Page {currentPage} of {totalPages}</span>
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 