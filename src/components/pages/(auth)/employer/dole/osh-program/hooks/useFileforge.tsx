import { useState } from 'react';

import { compile } from '@fileforge/react-print';

interface UseFileforgeProps {
  onSuccess?: (pdfUrl?: string) => void;
  onError?: (error: Error) => void;
  pageMargins?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const useFileforge = ({ onSuccess, onError, pageMargins }: UseFileforgeProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Default margins
  const defaultMargins = {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in'
  };

  // Merge custom margins with defaults
  const margins = {
    ...defaultMargins,
    ...pageMargins
  };

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
          <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
          <style>
            /* React Quill styles for print - matching preview exactly */
            .ql-editor {
              box-sizing: border-box;
              line-height: 1.42;
              height: 100%;
              outline: none;
              overflow-y: auto;
              tab-size: 4;
              -moz-tab-size: 4;
              text-align: left;
              white-space: pre-wrap;
              word-wrap: break-word;
              padding: 0 !important;
            }
            
            .ql-editor ul { 
              padding-left: unset !important;
            }
            
            .ql-editor ul > li {
              padding-left: 0.5em !important;
            }
            
            .ql-editor ol {
              padding-left: 0;
              list-style-type: none;
            }
            
            .ql-editor ol > li {
              list-style-type: none;
            }
            
            /* React Quill indentation styles - matching quill-tooltips.css */
            .ql-indent-1 {
              margin-left: 1.25rem !important;
            }
            .ql-indent-2 {
              margin-left: 2.5rem !important;
            }
            .ql-indent-3 {
              margin-left: 3.75rem !important;
            }
            .ql-indent-4 {
              margin-left: 5rem !important;
            }

            @media print {
              body { 
                margin: 0; 
                padding: 0;
                color: black !important;
                background: white !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .preview-container {
                background-color: white !important;
                padding: 0 !important;
              }
              .a4-page {
                box-shadow: none !important;
                border-radius: 0 !important;
                margin-bottom: 0 !important;
                background-color: white !important;
              }
              @page {
                margin: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
                size: A4;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
        </html>
      `;

      // Create a hidden iframe for printing
      const frame = document.createElement('iframe');
      frame.style.position = 'fixed';
      frame.style.right = '0';
      frame.style.bottom = '0';
      frame.style.width = '210mm'; // A4 width
      frame.style.height = '297mm'; // A4 height
      frame.style.border = '0';
      frame.style.opacity = '0';
      frame.style.visibility = 'hidden';
      frame.style.overflow = 'hidden';
      
      document.body.appendChild(frame);
      
      // Get the document for the iframe
      const frameDoc = frame.contentWindow?.document;
      if (!frameDoc) {
        document.body.removeChild(frame);
        throw new Error("Could not create document frame");
      }
      
      // Write HTML content to the iframe
      frameDoc.open();
      frameDoc.write(fullHtml);
      frameDoc.close();
      
      // Wait for the iframe to load, then print
      frame.onload = () => {
        try {
          setTimeout(() => {
            frame.contentWindow?.focus();
            frame.contentWindow?.print();
            
            // Clean up - remove the iframe after printing
            setTimeout(() => {
              document.body.removeChild(frame);
            }, 1000);
          }, 500);
        } catch (error) {
          console.error('Print error:', error);
          document.body.removeChild(frame);
          onError?.(error as Error);
        }
      };

      onSuccess?.();
    } catch (error) {
      console.error('Error generating PDF locally:', error);
      onError?.(error as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDFLocally,
    isGenerating,
  };
};

export default useFileforge;