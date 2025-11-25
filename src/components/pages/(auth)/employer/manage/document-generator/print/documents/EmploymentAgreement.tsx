import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { EmploymentAgreementFormData, PrintOptions } from '@/types/document-generator/documents';

/**
 * Validates that all required fields in the form data are filled in
 */
const validateRequiredFields = (formData: EmploymentAgreementFormData): boolean => {
  const requiredFields = [
    { name: 'employeeName', label: 'Employee Name', value: formData.employeeName },
    { name: 'companyName', label: 'Company Name', value: formData.companyName },
    { name: 'position', label: 'Position', value: formData.position },
    { name: 'startDate', label: 'Start Date', value: formData.startDate },
    { name: 'dateOfIssuance', label: 'Date of Issuance', value: formData.dateOfIssuance },
    { name: 'signatoryName', label: 'Signatory Name', value: formData.signatoryName },
    { name: 'signatoryPosition', label: 'Signatory Position', value: formData.signatoryPosition }
  ];
  
  // Add documentTitle check only if it exists in the form data
  if ('documentTitle' in formData) {
    requiredFields.push({ name: 'documentTitle', label: 'Document Title', value: (formData as any).documentTitle });
  }
  
  const missingFields = requiredFields.filter(field => !field.value || !field.value.trim());
  
  if (missingFields.length > 0) {
    // Highlight the missing fields by adding a red border
    missingFields.forEach(field => {
      const inputEl = document.querySelector(`input[name="${field.name}"]`) as HTMLInputElement;
      if (inputEl) {
        inputEl.classList.add('border-red-500');
        
        // Add event listener to remove the red border once the field is filled
        inputEl.addEventListener('input', function(this: HTMLInputElement) {
          if (this.value.trim()) {
            this.classList.remove('border-red-500');
          }
        });
      }
    });
    
    // Show a generic toast message
    toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
    return false;
  }

  if (!formData.signature) {
    // Find the signature container and add a red border
    const signatureContainer = document.querySelector('.border-dashed') as HTMLElement;
    if (signatureContainer) {
      signatureContainer.classList.add('border-red-500');
      
      // Remove the red border when the modal is opened
      const signatureButton = document.querySelector('[data-signature-button]');
      if (signatureButton) {
        signatureButton.addEventListener('click', function() {
          if (signatureContainer) {
            signatureContainer.classList.remove('border-red-500');
          }
        });
      }
    }
    
    toast.custom(() => <CustomToast message="Please add a signature to the document" type="error" />);
    return false;
  }
  
  return true;
};

/**
 * Prints an employment agreement with all 5 pages
 */
export const printEmploymentAgreement = (formData: EmploymentAgreementFormData, options: PrintOptions): void => {
  // Validate required fields first
  if (!validateRequiredFields(formData)) return;
  
  const printToastId = toast.custom(() => <CustomToast message="Preparing employment agreement for printing..." type="info" />);
  
  try {
    // Create a hidden iframe for printing
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '800px';
    frame.style.height = '1100px';
    frame.style.border = '0';
    frame.style.opacity = '0';
    frame.style.pointerEvents = 'none';
    
    document.body.appendChild(frame);
    
    // Get the document for the iframe
    const frameDoc = frame.contentWindow?.document;
    if (!frameDoc) {
      document.body.removeChild(frame);
      toast.custom(() => <CustomToast message="Could not create document frame" type="error" />);
      return;
    }
    
    // Get the signature URL if it exists
    let signatureUrl = '';
    if (formData.signature) {
      if (typeof formData.signature === 'string') {
        signatureUrl = formData.signature;
      } else {
        signatureUrl = URL.createObjectURL(formData.signature);
      }
    }
    
    // Format date helper function
    const formatDate = (dateString: string) => {
      if (!dateString) return '[Date]';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (error) {
        return '[Invalid Date]';
      }
    };
    
    // Create HTML content for all 5 pages
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${options.title} - ${formData.employeeName}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
              line-height: 1.5;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .page {
              page-break-after: always;
              padding: 1cm;
              box-sizing: border-box;
              position: relative;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
            }
            .company-name {
              font-weight: bold;
              font-size: 1.1rem;
            }
            .company-address {
              font-size: 0.85rem;
              color: #4b5563;
            }
            .page-number {
              position: absolute;
              bottom: 0.5cm;
              right: 1cm;
              font-size: 0.75rem;
              color: #6b7280;
            }
            .title {
              text-align: center;
              font-size: 1rem;
              font-weight: bold;
              margin: 1.5rem 0 0.25rem 0;
            }
            .section {
              margin-bottom: 1.5rem;
            }
            .section-title {
              font-weight: bold;
              font-size: 0.95rem;
              margin-bottom: 0.5rem;
            }
            p {
              margin: 0.5rem 0;
              font-size: 0.85rem;
            }
            .section-label {
              font-weight: bold;
              font-size: 0.85rem;
              margin: 0.5rem 0;
            }
            .signature-section {
              margin-top: 3rem;
            }
            .signature-line {
              border-top: 1px solid #000;
              width: 33%;
              margin: 0 auto;
              padding-top: 0.5rem;
              text-align: center;
              margin-bottom: 3rem;
            }
            .signature-image {
              height: 3rem;
              margin: 0 auto;
              display: block;
              margin-bottom: 0.5rem;
            }
            .signature-name {
              font-weight: bold;
              text-align: center;
              margin-bottom: 0.25rem;
            }
            .signature-position, .signature-company {
              text-align: center;
              font-size: 0.85rem;
              margin: 0.125rem 0;
            }
            .witness-section {
              display: flex;
              justify-content: space-between;
              margin-top: 4rem;
            }
            .witness {
              width: 45%;
            }
            .witness-line {
              border-top: 1px solid #000;
              padding-top: 0.5rem;
              text-align: center;
            }
            .agreement-glow {
              display: none !important;
            }
            .agreement-preview-container {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .employee-signature-container {
              width: 33%;
              margin: 0 auto;
              margin-bottom: 5rem;
            }
            .employee-signature-line {
              border-top: 1px solid #000;
              width: 45%;
              margin: 0 auto;
              padding-top: 0.5rem;
              text-align: center;
            }
            .signatory-container {
              width: 50%;
              margin: 0 auto;
              margin-bottom: 5rem;
            }
            .signatory-line {
              border-top: 1px solid #000;
              width: 45%;
              margin: 0 auto;
              padding-top: 0.5rem;
              text-align: center;
            }
            .font-bold {
              font-weight: 700 !important;
            }
            .text-center {
              text-align: center;
            }
            .mb-2 {
              margin-bottom: 0.5rem;
            }
            .acknowledgement {
              font-size: 0.85rem;
              text-align: center;
              margin: 2rem 0;
            }
          </style>
        </head>
        <body>
          <!-- Page 1 -->
          <div class="page">
            <div class="header">
              <div class="company-name">${formData.companyName || '[Company Name]'}</div>
              <div class="company-address">${formData.companyAddress || '[Company Address]'}</div>
            </div>
            
            <div class="title">Employment Agreement</div>
            
            <div class="section">
              <p>
                This Employment Agreement ("Agreement") is made and entered into on ${formatDate(formData.dateOfIssuance)} in ${formData.placeOfIssuance || '[Place of Issuance]'} between ${formData.companyName || '[Company Name]'} (hereinafter referred to as "Employer")
              </p>
              <p>and</p>
              <p>
                ${formData.employeeName || '[Employee Name]'} (hereinafter referred to as "Employee")
              </p>
              <p>
                In consideration of the mutual covenants set forth below, Employer agrees to hire Employee and
                Employee agrees to work for Employer as set forth in this Agreement.
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">1. Position and Employment Period</div>
              <p>
                That the Employee is set to commence employment on ${formatDate(formData.startDate)} with ${formData.probationPeriod || '[Probation Period]'} months under
                Probationary status as ${formData.position || '[Position]'}.
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">2. Performance of Duties</div>
              <p>
                The Employee agrees that during the Employment Period he/she shall devote his/her full working
                time, attention, knowledge and skills to the business affairs of the Employer and shall do so in good
                faith, with best efforts, and to the reasonable satisfaction of the Employer. The Employee shall also
                perform such other duties as are customarily performed by other persons in similar such positions,
                as well as such other duties as may be assigned from time to time by the Employer. Employee
                agrees to refrain from any interest, of any kind whatsoever, in any business competitive to
                Employer's business. The Employee further acknowledges they will not engage in any form of
                activity that produces a "conflict of interest" with those of the Employer unless agreed to in
                advance and in writing.
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">3. Performance Evaluations</div>
              <p>
                Performance evaluations are conducted every month for the duration of the Probationary Period to
                discuss job responsibilities, standards, and performance requirements. Additional formal
                performance reviews are conducted to provide both the company and employees the opportunity to
                discuss job tasks, identify and correct performance deficiencies, encourage and recognize strengths,
                and discuss positive, purposeful approaches for meeting goals.
              </p>
            </div>

            <div class="section">
              <div class="section-title">4. Place and Hours of Employment</div>
              <p>
                Employee agrees that their duties shall be primarily rendered at Employer's business premises or at
                such other places as the Employer shall in good faith require. Full time service for the Employee is
                expected which requires a minimum of ${formData.workingHours || '[Working Hours]'} hours per day, exclusive of vacation, or any other form of
                leave as described within this Agreement.
              </p>
            </div>
          </div>
          
          <!-- Page 2 -->
          <div class="page">
            <div class="header">
              <div class="company-name">${formData.companyName || '[Company Name]'}</div>
              <div class="company-address">${formData.companyAddress || '[Company Address]'}</div>
            </div>
            
            <div class="section">
              <div class="section-title">5. Compensation Package</div>
              <p>
                Employee agrees that Employer will pay him every 15<sup>th</sup> and 30<sup>th</sup> of the month his basic salary of
                Php ${formData.dailySalary || '[Daily Salary]'} daily.
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">6. Salary Adjustment</div>
              <p>
                Adjustments to salary and benefits are based on the value contributed by Employee to Employer.
                While salary adjustments are primarily based on merit, The Employer may at times adjust salaries
                depending on overall company performance, and/or the cost of living changes to salaries of
                similarity started employees in the company or industry.
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">7. Benefits</div>
              <p>
                A. SSS, PhilHealth and Pagibig
              </p>
              <p>
                B. Employee may use the 5 days Service Incentive Leave (SIL) after one (1) year of service.
              </p>
            </div>

            <div class="section">
              <div class="section-title">8. Covenants</div>
              <p class="section-label">
                A. Non-Disclosure of Trade Secrets, Customer Lists and Other Proprietary Information
              </p>
              <p>
                during and after the Employment Period, the Employee will not divulge or appropriate to his own
                use or to the use of others, in competition with the Company, any secret or confidential information
                or knowledge pertaining to the business of the Company, or of any of its subsidiaries, obtained by
                him in any way while he was employed by the Company or by any of its subsidiaries. Employee
                agrees not to use, disclose or communicate, in any manner, proprietary information about
                Employer, its operations, clientele, or any other proprietary information, that relate to the business
                of Employer. This includes, but is not limited to, the names of Employer's customers, its marketing
                strategies, operations, or any other information of any kind which would be deemed confidential or
                proprietary information of the Employer. Employee acknowledges that the above information is
                material and confidential and that it affects the profitability of the Employer. The Employee
                understands that any breach of this provision, or of any other Confidentiality and Non-Disclosure
                Agreement, is a material breach of this Agreement.
              </p>
              <p class="section-label">
                B. Non-Solicitation Covenant
              </p>
              <p>
                Employee agrees that for a period of following termination of employment, for any reason
                whatsoever, Employee will not solicit customers or clients of the Employee. By agreeing to this
                covenant, Employee acknowledges that their contributions to Employer are unique to Employer's
                success and that they have significant access to Employer's trade secrets and other confidential or
                proprietary information regarding Employer's customers or clients.
              </p>
            </div>
          </div>
          
          <!-- Page 3 -->
          <div class="page">
            <div class="header">
              <div class="company-name">${formData.companyName || '[Company Name]'}</div>
              <div class="company-address">${formData.companyAddress || '[Company Address]'}</div>
            </div>
            
            <div class="section">
              <p class="section-label">
                C. Non-Recruit Covenant
              </p>
              <p>
                Employee agrees not to recruit any of Employer's employees for the purpose of any outside
                business either during or for a period of 12 months after Employees tenure of employment with
                Employer. Employee agrees that such effort at recruitment also constitutes a violation of the
                non-solicitation covenant set forth above.
              </p>
              <p class="section-label">
                D. Non-Compete Covenant
              </p>
              <p>
                During the period of his employment under this Agreement, the Employee shall not be employed
                by or otherwise engage in or be interested in any business in competition with the Company, or
                with any of its subsidiaries or affiliates.
              </p>
              <p class="section-label">
                E. Remedies
              </p>
              <p>
                If at any time the Employee violates to a material extent any of the covenants or agreements set
                forth in sections C and D, the Company shall have the right to terminate all of its obligations to
                make further payments under this Agreement. The Employee acknowledges that the Company
                would be irreparably injured by a violation of sections C and D and agrees that the Company shall
                be entitled to an injunction restraining the Employee from any actual or threatened breach of
                sections C and D or to any other appropriate equitable remedy without any bond or other security
                being required.
              </p>
              <p class="section-label">
                F. Adherence to Employer's Policies, Procedures, Rules and Regulations
              </p>
              <p>
                The Employee agrees to adhere to all of the policies, procedures, rules and regulations set forth by
                the employer. These policies, procedures, rules and regulations include, but are not limited to, those
                set forth within the Employee Handbook, any summary benefit plan descriptions, or any other
                personnel practices or policies or Employer. To the extent that the Employer's policies, procedures,
                rules and regulations conflict with the terms of this Agreement, the specific terms of this
                Agreement will control.
              </p>
            </div>

            <div class="section">
              <p class="section-label">
                G. Covenant to Notify Management of Unlawful Acts or Practices
              </p>
              <p>
                Employee agrees to abide by the legal and ethics policies of Employer as well as Employer's other
                rules, regulations, policies and procedures. The Employer intends to comply in full with all
                governmental laws and regulations as well as any ethics code applicable to their profession. In the
                event that the Employee is aware of the Employer, or any of its officers, agents or employees,
                violating any such laws, ethics codes, rules, violations to the attention of the Employer immediately
                so that matter may be properly investigated and appropriate action taken.
              </p>
              <p class="section-title">
                10. Property Rights
              </p>
              <p class="section-label">
                A. Existing Customers or Clientele of Employee
              </p>
            </div>
          </div>
          
          <!-- Page 4 -->
          <div class="page">
            <div class="header">
              <div class="company-name">${formData.companyName || '[Company Name]'}</div>
              <div class="company-address">${formData.companyAddress || '[Company Address]'}</div>
            </div>
            
            <div class="section">
              <p>
                Employer agrees that existing customers or clients of Employee will (become the property of
                Employer) (remain the property of the Employer) as the condition of employment.
              </p>
              <p class="section-label">
                B. New Customers or clientele generated While at Work
              </p>
              <p>
                Employee agrees that any customers or clientele generated by Employee pursuant to employment
                with Employer are the customers and clientele of the Employer and subject to the non-disclosure
                and non-solicitation covenants set forth above.
              </p>
              <p class="section-label">
                C. Records and Accounts
              </p>
              <p>
                The Employee agrees that all those records and accounts maintained during the course of
                employment are the property of the Employer, shall remain current and be maintained at the
                Employer's place of business.
              </p>
              <p class="section-label">
                D. Return Upon Termination
              </p>
              <p>
                Employee agrees that upon termination they will return to Employer all of Employer's property,
                including, but not limited to, intellectual property, trade secret information, customer lists,
                operation manuals, employee handbook, records and accounts, materials subject to copyright,
                trademark, or patent protection, customer and Employer information, credit cards, business
                documents, reports, automobiles, keys, passes, and security devices.
              </p>
              <p class="section-label">
                E. Copyrights, Inventions and Patents
              </p>
              <p>
                The Employee understands that any copyrights, inventions or patents created or obtained, in part or
                whole, by the Employee during the course of this Agreement are to be considered "work for hire"
                and the property of the Employer. Employee assigns to Employer all rights and interest in any
                copyright, invention, patents or other property related to business of the Employer.
              </p>
            </div>
          </div>
          
          <!-- Page 5 -->
          <div class="page">
            <div class="header">
              <div class="company-name">${formData.companyName || '[Company Name]'}</div>
              <div class="company-address">${formData.companyAddress || '[Company Address]'}</div>
            </div>
            
            <div class="acknowledgement">
              ACKNOWLEDGES THAT EMPLOYEE HAS READ, UNDERSTOOD, AND AGREES TO
              BE BOUND BY THE TERMS AND CONDITIONS CONTAINED IN THIS AGREEMENT.
            </div>
            
            <div class="signature-section">
              <!-- Employee row -->
              <div style="margin-bottom: 4rem;">
                <div class="w-1/2 mx-auto">
                  <p class="text-center text-xs">${formData.employeeName || '[Employee Name]'}</p>
                  <div class="employee-signature-line">
                    <p class="text-center text-xs font-bold">Employee</p>
                  </div>
                </div>
              </div>
              
              <!-- Signatory with signature -->
              <div style="margin-bottom: 4rem;">
                <div class="w-1/2 mx-auto">
                  ${signatureUrl ? `<img src="${signatureUrl}" class="signature-image" alt="Signature" />` : ''}
                  <p class="text-center text-xs">${formData.signatoryName || '[Signatory Name]'}</p>
                  <div class="signatory-line">
                    <p class="text-center text-xs font-bold">${formData.signatoryPosition || '[Position]'}</p>
                    <p class="text-center text-xs font-bold">${formData.companyName || '[Company Name]'}</p>
                  </div>
                </div>
              </div>
              
              <p style="margin-bottom: 2rem;">Signed in the presence of:</p>
              
              <div class="witness-section">
                <div class="witness">
                  <div class="witness-line">
                    <p class="text-center text-xs font-bold">Witness</p>
                  </div>
                </div>
                <div class="witness">
                  <div class="witness-line">
                    <p class="text-center text-xs font-bold">Witness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Write the HTML to the iframe
    frameDoc.write(html);
    frameDoc.close();
    
    // Wait for the iframe to load
    frame.onload = () => {
      try {
        setTimeout(() => {
          toast.custom(() => <CustomToast message="Print dialog opening..." type="info" />);
          
          // Print the document
          frame.contentWindow?.focus();
          frame.contentWindow?.print();
          
          // Clean up
          setTimeout(() => {
            // Revoke any object URLs we created
            if (formData.signature && typeof formData.signature !== 'string') {
              URL.revokeObjectURL(signatureUrl);
            }
            
            // Remove the iframe
            document.body.removeChild(frame);
            
            toast.custom(() => <CustomToast message="Your document was saved successfully and is ready for use" type="success" />);
          }, 1000);
        }, 500);
      } catch (error) {
        console.error('Print error:', error);
        document.body.removeChild(frame);
        toast.custom(() => <CustomToast message="There was an error printing. Please try again" type="error" />);
      }
    };
  } catch (error) {
    console.error('Print setup error:', error);
    toast.custom(() => <CustomToast message="There was an error setting up the print. Please try again" type="error" />);
  }
}; 