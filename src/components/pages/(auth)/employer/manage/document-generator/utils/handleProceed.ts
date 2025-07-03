import type { NoticeToExplainFormData } from '@/types/document-generator/documents';

export function handleProceedUtil({
  documentType,
  employeeId,
  currentData,
  uploadAttachment,
  router,
  toast,
  CustomToast,
  generateNoticeToExplainHTML,
  jsPDF,
  html2canvas
}: {
  documentType: string;
  employeeId: string;
  currentData: NoticeToExplainFormData;
  uploadAttachment: (data: any, callbacks: any) => void;
  router: any;
  toast: any;
  CustomToast: any;
  generateNoticeToExplainHTML: (data: NoticeToExplainFormData) => string;
  jsPDF: any;
  html2canvas: any;
}) {
  if (documentType === 'notice-to-explain' && employeeId) {
    try {
      // Create a hidden container to hold the iframe content
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      // Get the HTML content for the document - use the same function as the print feature
      const htmlContent = generateNoticeToExplainHTML(currentData);

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
            margin: 0.1cm 1cm 0cm 1cm;
          }

          .document-subtitle {
            margin-bottom: 20px !important;
          }
          
          html, body {
            height: auto !important;
            overflow: hidden !important;
          }
          
          .logo-container {
            margin-top: 0.5rem !important;
          }

          .space {
            height: 100% !important;
          }
          
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
          
          .footer-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 12px !important;
            color: #000 !important;
            margin-top: 30px !important;
            margin-bottom: 20px !important;
          }
          
          .footer-cell {
            width: 50% !important;
            padding: 0 12px !important;
            text-align: center !important;
            vertical-align: bottom !important;
          }
          
          .footer-cell-left {
            padding-right: 12px !important;
            padding-left: 0 !important;
          }

          .footer-line {
            border-bottom: 1px solid #000 !important;
            margin-top: 10px !important;
          }
          
          .footer-cell-right {
            padding-left: 12px !important;
            padding-right: 0 !important;
          }
          
          .footer-title {
            font-weight: bold !important;
            text-align: center !important;
            margin-bottom: 10px !important;
          }

          /* Signature container styles for the HR Representative section */
          .signature-container {
            position: relative !important;
            min-height: 20px !important;
          }

          .signature-image-container {
            position: absolute !important;
            width: 100% !important;
            right: 3px !important;
            top: -25px !important;
            z-index: 10 !important;
            text-align: center !important;
          }

          .signature-image {
            max-width: 150px !important;
            height: 48px !important;
            object-fit: contain !important;
            margin: 0 auto !important;
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
        const content = iframeDoc.body;
        setTimeout(() => {
          html2canvas(content, {
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: content.scrollWidth,
            height: content.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            logging: false
          }).then((canvas: any) => {
            try {
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
              });
              pdf.setDrawColor(255, 255, 255, 0);
              const imgData = canvas.toDataURL('image/png');
              const imgWidth = 210 - 20;
              const pageHeight = 297 - 20;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              const headerBreakPoint = iframeDoc.querySelector('.page-break-before');
              let useSinglePageApproach = true;
              if (headerBreakPoint) {
                useSinglePageApproach = false;
                const firstPageCanvas = document.createElement('canvas');
                const firstPageCtx = firstPageCanvas.getContext('2d');
                const headerPosition = headerBreakPoint.getBoundingClientRect();
                if (firstPageCtx) {
                  firstPageCanvas.width = canvas.width;
                  firstPageCanvas.height = headerPosition.top * 2.5;
                  firstPageCtx.drawImage(
                    canvas,
                    0, 0, canvas.width, firstPageCanvas.height,
                    0, 0, firstPageCanvas.width, firstPageCanvas.height
                  );
                  const firstPageImgData = firstPageCanvas.toDataURL('image/png');
                  pdf.addImage(firstPageImgData, 'PNG', 10, 0, imgWidth, (firstPageCanvas.height * imgWidth) / firstPageCanvas.width);
                  pdf.addPage();
                  const secondPageCanvas = document.createElement('canvas');
                  const secondPageCtx = secondPageCanvas.getContext('2d');
                  if (secondPageCtx) {
                    secondPageCanvas.width = canvas.width;
                    secondPageCanvas.height = canvas.height - firstPageCanvas.height;
                    secondPageCtx.drawImage(
                      canvas,
                      0, firstPageCanvas.height, canvas.width, secondPageCanvas.height,
                      0, 0, secondPageCanvas.width, secondPageCanvas.height
                    );
                    const secondPageImgData = secondPageCanvas.toDataURL('image/png');
                    pdf.addImage(secondPageImgData, 'PNG', 10, 0, imgWidth, (secondPageCanvas.height * imgWidth) / secondPageCanvas.width);
                  }
                }
              }
              if (useSinglePageApproach) {
                pdf.addImage(imgData, 'PNG', 10, 0, imgWidth, imgHeight);
                let heightLeft = imgHeight - pageHeight;
                let position = -(pageHeight);
                const minPageHeight = 20; // Only add a new page if more than 20mm left
                while (heightLeft > minPageHeight) {
                  pdf.addPage();
                  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;
                  position -= pageHeight;
                }
              }
              const pdfBlob = pdf.output('blob');
              const pdfFile = new File([pdfBlob], `notice-to-explain-${employeeId}.pdf`, { type: 'application/pdf' });
              uploadAttachment(
                {
                  employee_issue_id: parseInt(employeeId),
                  nte_attachment: pdfFile
                },
                {
                  onSuccess: (): void => {
                    toast.custom(() => CustomToast({ message: "PDF document created and uploaded. Ready to send.", type: "success" }), { duration: 3000 });
                    router.push(`/manage/address-employee-issue?openNteModal=true&employeeId=${employeeId}`);
                  },
                  onError: (error: any): void => {
                    console.error('Upload error:', error);
                    toast.custom(() => CustomToast({ message: "Error uploading document. Please try again.", type: "error" }), { duration: 3000 });
                  }
                }
              );
              document.body.removeChild(container);
            } catch (pdfError) {
              console.error('PDF creation error:', pdfError);
              document.body.removeChild(container);
              toast.custom(() => CustomToast({ message: "Error creating PDF. Please try again.", type: "error" }), { duration: 3000 });
            }
          }).catch((canvasError: any) => {
            console.error('Canvas capture error:', canvasError);
            document.body.removeChild(container);
            toast.custom(() => CustomToast({ message: "Error capturing document. Please try again.", type: "error" }), { duration: 3000 });
          });
        }, 2500);
      };
    } catch (error) {
      console.error('Error setting up PDF generation:', error);
      toast.custom(() => CustomToast({ message: "Error generating PDF. Please try again.", type: "error" }), { duration: 3000 });
    }
  }
}
