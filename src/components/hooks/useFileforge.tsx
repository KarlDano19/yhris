import { useState } from 'react';
import { compile } from '@fileforge/react-print';

interface UseFileforgeProps {
  onSuccess?: (pdfUrl?: string) => void;
  onError?: (error: Error) => void;
}

const useFileforge = ({ onSuccess, onError }: UseFileforgeProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFLocally = async (
    component: React.ReactElement,
    filename: string = 'document.pdf'
  ) => {
    try {
      setIsGenerating(true);

      // Compile React component to HTML
      const compiledHtml = await compile(component);

      // Create complete HTML document with proper styling
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${filename}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
                color: black !important;
                background: white !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              @page {
                margin: 0.1in;
                size: A4;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: black;
              background: white;
            }
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
        </html>
      `;

      // Open in new window and print
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(fullHtml);
        newWindow.document.close();
        
        // Wait for content to load, then print
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.focus();
            newWindow.print();
          }, 500);
        };
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error generating PDF locally:', error);
      onError?.(error as Error);
    } finally {
      setIsGenerating(false);
    }
  };



  const previewHTML = async (component: React.ReactElement) => {
    try {
      setIsGenerating(true);

      // Compile React component to HTML
      const compiledHtml = await compile(component);

      // Create complete HTML document with proper styling
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Annual Medical Report Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 20px;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
                color: black !important;
                background: white !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                margin: 0.5in;
                size: A4;
              }
            }
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
        </html>
      `;

      // Open HTML in new window for preview
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(fullHtml);
        newWindow.document.close();
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error previewing HTML:', error);
      onError?.(error as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDFLocally,
    previewHTML,
    isGenerating,
  };
};

export default useFileforge; 