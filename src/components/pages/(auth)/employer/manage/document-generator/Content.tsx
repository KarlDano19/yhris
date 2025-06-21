'use client';

import { useState, useEffect } from 'react';

import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'react-datepicker/dist/react-datepicker.css';

import Form from "./Form";
import CustomToast from "@/components/CustomToast";
import EmployeeCertificatePreview from "./previews/EmployeeCertificatePreview";
import EmploymentAgreementPreview from "./previews/EmploymentAgreementPreview";
import NoticeToExplainPreview from "./previews/NoticeToExplainPreview";
import usePatchEmployeeIssueItems from '../address-employee-issue/hooks/usePatchEmployeeIssueItems';
import useGetEmployeeIssueItems from '../address-employee-issue/hooks/useGetEmployeeIssueItems';
import useUploadEmployeeIssueAttachments from '../address-employee-issue/hooks/useUploadEmployeeIssueAttachments';
import SignatureModal from "./modals/SignatureModal";
import LetterheadModal from "./modals/LetterheadModal";
import LogoModal from "./modals/LogoModal";

import { EmployeeCertificateFormData } from "@/types/document-generator/documents";
import { EmploymentAgreementFormData } from "@/types/document-generator/documents";
import { NoticeToExplainFormData } from "@/types/document-generator/documents";
import { DocumentType } from "@/types/document-generator/form";
import { print } from './print/index';
import { generateNoticeToExplainHTML } from './print/documents/NoticeToExplain';
import initColorPolyfill from '@/helpers/colorPolyfill';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Content() {
  const { mutate: uploadAttachment } = useUploadEmployeeIssueAttachments();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlDocType = searchParams.get('type') as DocumentType | null;
  const employeeId = searchParams.get('employee');
  
  // Always default to employee certificate type, unless specified in URL
  const [documentType, setDocumentType] = useState<DocumentType>(
    urlDocType && ['employee-certificate', 'employment-agreement', 'notice-to-explain'].includes(urlDocType) 
      ? urlDocType 
      : 'employee-certificate'
  );

  // Fetch employee issue data if employeeId is provided
  const { data: employeeIssueItems, refetch: refetchEmployeeIssues } = useGetEmployeeIssueItems({});
  const [selectedEmployeeIssue, setSelectedEmployeeIssue] = useState<any>(null);
  
  // No longer needed as we're using more granular field disabling
  // const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  
  // State for each document type
  const [employeeCertificateData, setEmployeeCertificateData] = useState<EmployeeCertificateFormData>({
    employeeName: '',
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
    purpose: '',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    letterheadImage: null,
    sampleLetterheadPath: '',
    signature: null,
    documentTitle: 'Certificate of Employment',
    borderColor: '#FFC107'
  });
  
  const [employmentAgreementData, setEmploymentAgreementData] = useState<EmploymentAgreementFormData>({
    employeeName: '',
    companyName: '',
    position: '',
    startDate: '',
    probationPeriod: '6',
    workingHours: '8',
    dailySalary: '1',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    companyAddress: '',
    signature: null,
  });

  const [noticeToExplainData, setNoticeToExplainData] = useState<NoticeToExplainFormData>({
    employeeName: '',
    position: '',
    date: '',
    place: '',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    incidentDate: '',
    incidentPlace: '',
    briefBackground: '',
    preparedBy: '',
    reviewedBy: '',
    receivedBy: '',
    employeeExplanation: '',
    hearingNotes: '',
    managementDecision: '',
    logoImage: null,
    sampleLogoPath: '',
    signature: null,
    borderColor: '#FFC107'
  });
  
  // Modal states
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  
  // Initialize color input polyfill for Safari
  useEffect(() => {
    initColorPolyfill();
  }, []);
  
  // Reset form data when component unmounts - NOT when printing or proceeding
  // This was causing the form to reset after printing
  useEffect(() => {
    // Store a flag to track if this is a real unmount vs a re-render
    let isUnmounting = false;
    
    // Use beforeunload to detect actual page navigation away
    const handleBeforeUnload = () => {
      isUnmounting = true;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Only reset if this is a true unmount (navigating away from the page)
      // not just a re-render caused by printing
      if (isUnmounting) {
        // Reset all form data to initial state when component unmounts
        setEmployeeCertificateData({
          employeeName: '',
          companyName: '',
          position: '',
          startDate: '',
          endDate: '',
          purpose: '',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          letterheadImage: null,
          sampleLetterheadPath: '',
          signature: null,
          documentTitle: 'Certificate of Employment',
          borderColor: '#FFC107'
        });
        
        setEmploymentAgreementData({
          employeeName: '',
          companyName: '',
          position: '',
          startDate: '',
          probationPeriod: '6',
          workingHours: '8',
          dailySalary: '1',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          companyAddress: '',
          signature: null,
        });
        
        setNoticeToExplainData({
          employeeName: '',
          position: '',
          date: '',
          place: '',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          incidentDate: '',
          incidentPlace: '',
          briefBackground: '',
          preparedBy: '',
          reviewedBy: '',
          receivedBy: '',
          employeeExplanation: '',
          hearingNotes: '',
          managementDecision: '',
          logoImage: null,
          sampleLogoPath: '',
          signature: null,
          borderColor: '#FFC107'
        });
      }
    };
  }, []);
  
  // Fetch employee issue data
  useEffect(() => {
    if (employeeId) {
      refetchEmployeeIssues();
    }
  }, [employeeId, refetchEmployeeIssues]);
  
  // Set selected employee issue when data is loaded
  useEffect(() => {
    if (employeeId && employeeIssueItems) {
      // Handle both paginated and non-paginated responses
      const items = employeeIssueItems.records || employeeIssueItems;
      
      if (items && items.length > 0) {
        const employeeIssue = items.find((item: any) => item.id.toString() === employeeId);
        if (employeeIssue) {
          setSelectedEmployeeIssue(employeeIssue);
        }
      }
    }
  }, [employeeId, employeeIssueItems]);
  
  // Populate form with employee data if employeeId is provided
  useEffect(() => {
    if (documentType === 'notice-to-explain' && employeeId && selectedEmployeeIssue) {
      // Format the incident date from API date format
      const incidentDate = selectedEmployeeIssue.incident_date 
        ? new Date(selectedEmployeeIssue.incident_date).toISOString().split('T')[0]
        : '';
      
      // Find the employee info
      const employeeName = selectedEmployeeIssue.name || '';
      const position = selectedEmployeeIssue.position || '';
      const department = selectedEmployeeIssue.department || '';
      const incidentPlace = selectedEmployeeIssue.place_of_incident || '';
      
      // Update form data
      setNoticeToExplainData(prev => ({
        ...prev,
        employeeName,
        position,
        department,
        incidentDate,
        incidentPlace,
        briefBackground: selectedEmployeeIssue.brief_background || '',
        receivedBy: employeeName,
        dateOfIssuance: new Date().toISOString().split('T')[0],
      }));
    }
  }, [documentType, employeeId, selectedEmployeeIssue]);
  
  // Get current data based on document type
  const getCurrentData = () => {
    switch (documentType) {
      case 'employee-certificate':
        return employeeCertificateData;
      case 'employment-agreement':
        return employmentAgreementData;
      case 'notice-to-explain':
        return noticeToExplainData;
      default:
        return employeeCertificateData;
    }
  };
  
  const currentData = getCurrentData();
  
  // Handle document type change
  const handleDocumentTypeChange = (type: DocumentType) => {
    // First set the document type
    setDocumentType(type);
    
    // Then ensure the current data is set to the appropriate data for the new type
    // This prevents React errors when switching between document types with different fields
    switch (type) {
      case 'employee-certificate':
        // No need to update employeeCertificateData as it's already in state
        break;
      case 'employment-agreement':
        // No need to update employmentAgreementData as it's already in state
        break;
      case 'notice-to-explain':
        // No need to update noticeToExplainData as it's already in state
        break;
    }
  };
  
  // Handle form changes
  const handleFormChange = (data: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData(data as EmployeeCertificateFormData);
    } else if (documentType === 'employment-agreement') {
      setEmploymentAgreementData(data as EmploymentAgreementFormData);
    } else if (documentType === 'notice-to-explain') {
      const noticeData = data as NoticeToExplainFormData;
      
      // Ensure receivedBy is synced with employeeName
      if (noticeData.employeeName && (!noticeData.receivedBy || noticeData.receivedBy === noticeToExplainData.receivedBy)) {
        noticeData.receivedBy = noticeData.employeeName;
      }
      
      // If coming from employee issues, preserve the disabled fields
      if (isDocumentTypeDisabled) {
        setNoticeToExplainData(prev => ({
          ...prev,
          // Only update fields that should remain editable
          briefBackground: noticeData.briefBackground,
          preparedBy: noticeData.preparedBy,
          reviewedBy: noticeData.reviewedBy,
          date: noticeData.date,
          place: noticeData.place,
          signature: noticeData.signature,
          borderColor: noticeData.borderColor,
          logoImage: noticeData.logoImage,
          sampleLogoPath: noticeData.sampleLogoPath,
        }));
      } else {
        setNoticeToExplainData(noticeData);
      }
    }
  };
  
  // For handling employee issue update
  const { mutate: updateEmployeeIssue, isLoading: isUpdatingIssue } = usePatchEmployeeIssueItems();
  
  // Handle proceeding (marking as sent and returning to employee issues)
  const handleProceed = () => {
    // Only for notice-to-explain with an employee ID
    if (documentType === 'notice-to-explain' && employeeId) {
      // Show loading toast
      const loadingToast = toast.custom(() => <CustomToast message="Generating PDF document..." type="info" />);
      
      try {
        // Create a hidden container to hold the iframe content
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        document.body.appendChild(container);
        
        // Get the HTML content for the document - use the same function as the print feature
        const htmlContent = generateNoticeToExplainHTML(currentData as NoticeToExplainFormData);
        
        // Add additional styles for better PDF rendering
        const enhancedHtmlContent = htmlContent.replace(
          '<style>',
          `<style>
            /* Override styles for PDF generation */
            body {
              margin: 0;
              padding: 0;
            }
            
            @page {
              size: A4;
              margin: 1cm;
            }

            .document-subtitle {
              margin-bottom: 20px !important;
            }
            
            /* Fix for blank pages by resizing content to fit better */
            html, body {
              height: auto !important;
              overflow: visible !important;
            }
            
            /* Enhance signature spacing */
            .signatures-grid {
              margin-top: 30px !important;
              margin-bottom: 25px !important;
            }
            
            .signature-block {
              padding-bottom: 15px !important;
            }
            
            .signature-line {
              margin-top: 8px !important;
              margin-bottom: 5px !important;
            }
            
            /* Match signature styling from renderSignatures function */
            .signature-table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-size: 12px !important;
              color: #000 !important;
              margin-top: 30px !important;
              margin-bottom: 20px !important;
            }
            
            .signature-cell {
              width: 50% !important;
              padding: 0 12px !important;
              text-align: center !important;
              vertical-align: bottom !important;
            }
            
            .signature-cell-left {
              padding-right: 12px !important;
              padding-left: 0 !important;
            }
            
            .signature-cell-right {
              padding-left: 12px !important;
              padding-right: 0 !important;
            }
            
            .signature-image-container-table {
              height: 30px !important;
              display: flex !important;
              align-items: flex-end !important;
              justify-content: center !important;
            }
            
            .signature-image-table {
              max-width: 150px !important;
              max-height: 50px !important;
              object-fit: contain !important;
            }
            
            .signature-name {
              margin-top: 5px !important;
            }
            
            .signature-title {
              font-weight: bold !important;
              text-align: center !important;
              margin-bottom: 10px !important;
            }
          `
        );
        
        // Create an iframe inside our container to render the HTML content
        const iframe = document.createElement('iframe');
        iframe.style.width = '210mm';  // A4 width
        iframe.style.height = '297mm'; // A4 height
        iframe.style.border = '0';
        container.appendChild(iframe);
        
        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) {
          throw new Error('Could not access iframe document');
        }
        
        // Write the HTML content to the iframe
        iframeDoc.open();
        iframeDoc.write(enhancedHtmlContent);
        iframeDoc.close();
        
        // Wait for iframe to load
        iframe.onload = () => {
          // Get the body element from the iframe
          const content = iframeDoc.body;
          
          // Wait longer for all resources and styles to load completely
          setTimeout(() => {
            // Use html2canvas to capture the content with improved settings
            html2canvas(content, {
              scale: 2.5, // Higher scale for better quality (increased from 2)
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              // Set dimensions to avoid cropping
              width: content.scrollWidth,
              height: content.scrollHeight,
              // Disable scrolling capture to prevent blank pages
              scrollX: 0,
              scrollY: 0,
              // Improve font rendering
              logging: false
            }).then((canvas) => {
              try {
                // Create a new PDF document with 1cm margins
                const pdf = new jsPDF({
                  orientation: 'portrait',
                  unit: 'mm',
                  format: 'a4',
                  compress: true
                });
                
                // Get the image data
                const imgData = canvas.toDataURL('image/png');
                
                // Calculate dimensions, accounting for margins
                const imgWidth = 210 - 20; // A4 width minus 2cm margins
                const pageHeight = 297 - 20; // A4 height minus 2cm margins
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add the image to the PDF with margins
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                
                // Handle multi-page content, but only if it's significantly larger than one page
                // This prevents blank pages
                let heightLeft = imgHeight - pageHeight;
                
                // Only add additional pages if there's substantial content overflow (more than 5mm)
                if (heightLeft > 5) {
                  let position = -(pageHeight - 10); // Start position for next pages
                  
                  while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    position -= pageHeight;
                  }
                }
                
                // Convert the PDF to a blob
                const pdfBlob = pdf.output('blob');
                
                // Convert blob to file
                const pdfFile = new File([pdfBlob], `notice-to-explain-${employeeId}.pdf`, { type: 'application/pdf' });
                
                // Upload the attachment to the server
                uploadAttachment(
                  {
                    employee_issue_id: parseInt(employeeId),
                    nte_attachment: pdfFile
                  },
                  {
                    onSuccess: () => {
                      toast.custom(() => <CustomToast message="PDF document created and uploaded. Ready to send." type="success" />, { duration: 3000 });
                      
                      // Redirect to the address-employee-issue page with parameter to open the modal
                      router.push(`/manage/address-employee-issue?openNteModal=true&employeeId=${employeeId}`);
                      
                      // After successful upload, the NTE attachment can be viewed directly from the server
                      // using the API endpoint we created: /api/employee-issues/nte-attachment/{employee_issue_id}/
                    },
                    onError: (error) => {
                      console.error('Upload error:', error);
                      toast.custom(() => <CustomToast message="Error uploading document. Please try again." type="error" />, { duration: 3000 });
                    }
                  }
                );
                
                // Clean up
                document.body.removeChild(container);
                toast.dismiss(loadingToast);
              } catch (pdfError) {
                console.error('PDF creation error:', pdfError);
                document.body.removeChild(container);
                toast.dismiss(loadingToast);
                toast.custom(() => <CustomToast message="Error creating PDF. Please try again." type="error" />, { duration: 3000 });
              }
            }).catch(canvasError => {
              console.error('Canvas capture error:', canvasError);
              document.body.removeChild(container);
              toast.dismiss(loadingToast);
              toast.custom(() => <CustomToast message="Error capturing document. Please try again." type="error" />, { duration: 3000 });
            });
          }, 2500); // Increased wait time from 1500ms to 2500ms for fonts and styles to load completely
        };
      } catch (error) {
        console.error('Error setting up PDF generation:', error);
        toast.dismiss(loadingToast);
        toast.custom(() => <CustomToast message="Error generating PDF. Please try again." type="error" />, { duration: 3000 });
      }
    }
  };
  
  // Handle print
  const handlePrint = () => {
    try {
      const options = {
        elementId: documentType === 'employee-certificate' 
          ? 'employee-certificate-preview' 
          : documentType === 'employment-agreement'
            ? 'agreement-preview'
            : 'notice-to-explain-preview',
        title: documentType === 'employee-certificate' 
          ? 'Certificate of Employment' 
          : documentType === 'employment-agreement'
            ? 'Employment Agreement'
            : 'Notice to Explain',
        fileName: documentType === 'employee-certificate' 
          ? 'certificate-of-employment' 
          : documentType === 'employment-agreement'
            ? 'employment-agreement'
            : 'notice-to-explain'
      };
      
      print(currentData, options)
        .catch(error => {
          console.error('Print error:', error);
          toast.custom(() => <CustomToast message="There was an error preparing your document. Please try again." type="error" />);
        });
      
      // Toast is now handled in the individual print functions
    } catch (error) {
      console.error('Print error:', error);
      toast.custom(() => <CustomToast message="There was an error preparing your document. Please try again." type="error" />);
    }
  };
  
  // Handle signature modal
  const handleOpenSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };
  
  const handleSignatureSave = (signatureData: string | File | null) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        signature: signatureData
      });
    } else if (documentType === 'employment-agreement') {
      setEmploymentAgreementData({
        ...employmentAgreementData,
        signature: signatureData
      });
    } else if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        signature: signatureData
      });
    }
    
    setIsSignatureModalOpen(false);
  };
  
  // Handle letterhead modal
  const handleOpenLetterheadModal = () => {
    setIsLetterheadModalOpen(true);
  };
  
  const handleLetterheadSelect = (path: string) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        letterheadImage: null,
        sampleLetterheadPath: path
      });
    }
    
    setIsLetterheadModalOpen(false);
  };
  
  const handleLetterheadUpload = (file: File) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        letterheadImage: file,
        sampleLetterheadPath: ''
      });
    }
    
    setIsLetterheadModalOpen(false);
  };
  
  // Handle logo modal
  const handleOpenLogoModal = () => {
    setIsLogoModalOpen(true);
  };
  
  const handleLogoSelect = (path: string) => {
    if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        logoImage: null,
        sampleLogoPath: path
      });
    }
    
    setIsLogoModalOpen(false);
  };
  
  const handleLogoUpload = (file: File) => {
    if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        logoImage: file,
        sampleLogoPath: ''
      });
    }
    
    setIsLogoModalOpen(false);
  };

  // Only allow "notice-to-explain" document type if coming from address-employee-issue page
  const isDocumentTypeDisabled = !!employeeId;

  // Custom function to determine if specific field should be disabled
  const isFieldDisabled = (fieldName: string): boolean => {
    if (!isDocumentTypeDisabled) return false; // If not coming from employee issues, nothing is disabled
    
    // Fields that should be disabled when populated from employee issue data
    const disabledFields = [
      'employeeName',
      'position',
      'incidentDate',
      'incidentPlace'
    ];
    
    return disabledFields.includes(fieldName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex p-4">
          <Link 
            href={employeeId ? "/manage/address-employee-issue" : "/manage"} 
            className="flex-none flex gap-3 items-center hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">Document Generator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="transition-all duration-300">
              <Form 
                documentType={documentType}
                onDocumentTypeChange={handleDocumentTypeChange}
                onFormChange={handleFormChange} 
                initialData={currentData} 
                onPrint={handlePrint}
                onOpenSignatureModal={handleOpenSignatureModal}
                onOpenLetterheadModal={handleOpenLetterheadModal}
                onOpenLogoModal={handleOpenLogoModal}
                onProceed={employeeId && documentType === 'notice-to-explain' ? handleProceed : undefined}
                isDocumentTypeDisabled={isDocumentTypeDisabled}
                isFieldDisabled={isFieldDisabled}
              />
            </div>
            <div className="transition-all duration-300">
              {documentType === 'employee-certificate' ? (
                <div id="employee-certificate-preview">
                  <EmployeeCertificatePreview formData={employeeCertificateData} />
                </div>
              ) : documentType === 'employment-agreement' ? (
                <div id="agreement-preview">
                  <EmploymentAgreementPreview formData={employmentAgreementData} />
                </div>
              ) : (
                <div id="notice-to-explain-preview">
                  <NoticeToExplainPreview data={noticeToExplainData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <SignatureModal 
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />
      
      <LetterheadModal 
        isOpen={isLetterheadModalOpen}
        onClose={() => setIsLetterheadModalOpen(false)}
        onSelect={handleLetterheadSelect}
        onUpload={handleLetterheadUpload}
        selectedPath={documentType === 'employee-certificate' ? 
          (currentData as EmployeeCertificateFormData).sampleLetterheadPath : 
          ''}
      />
      
      <LogoModal 
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onSelect={handleLogoSelect}
        onUpload={handleLogoUpload}
        selectedPath={documentType === 'notice-to-explain' ? (currentData as NoticeToExplainFormData).sampleLogoPath : ''}
      />
    </div>
  );
} 