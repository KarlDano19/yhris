import React from 'react';

import DocumentPageOne from './DocumentPageOne';
import DocumentPageTwo from './DocumentPageTwo';
import DocumentPageThree from './DocumentPageThree';
import DocumentPageFour from './DocumentPageFour';
import DocumentPageFive from './DocumentPageFive';
import DocumentPageSix from './DocumentPageSix';
import DocumentPageSeven from './DocumentPageSeven';
import DocumentPageEight from './DocumentPageEight';
import DocumentPageNine from './DocumentPageNine';
import DocumentPageTen from './DocumentPageTen';
import DocumentPageEleven from './DocumentPageEleven';
import DocumentPageTwelve from './DocumentPageTwelve';

import { T_OshProgram } from '@/types/osh-program';

interface OshProgramDocumentProps {
  data: T_OshProgram;
}

// Common A4 page styles
const a4PageStyles = {
  pageBreakAfter: 'always' as const,
  breakAfter: 'page' as const,
  width: '210mm',
  minHeight: '297mm', // Changed from fixed height to minHeight
  margin: '0 auto',
  marginBottom: '40px', // Increased gap between pages for preview
  fontFamily: 'Arial, sans-serif',
  boxSizing: 'border-box' as const,
  padding: '32px 35px 32px 50px',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

// A4 Page wrapper component
const A4Page: React.FC<{ children: React.ReactNode; isLastPage?: boolean }> = ({ 
  children, 
  isLastPage = false 
}) => (
  <div 
    className="a4-page"
    style={{ 
      ...a4PageStyles,
      pageBreakAfter: isLastPage ? 'auto' : 'always',
      breakAfter: isLastPage ? 'auto' : 'page',
      marginBottom: isLastPage ? '0' : '40px'
    }}
  >
    {children}
  </div>
);

const OshProgramDocument: React.FC<OshProgramDocumentProps> = ({ data }) => {
  return (
    <div className="text-black font-sans text-xs leading-tight">
      <style jsx>{`
        .a4-page {
          page-break-after: always;
          break-after: page;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 40px;
        }
        
        @media print {
          .a4-page {
            page-break-after: always;
            break-after: page;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 20px 25px 20px 30px !important;
            box-shadow: none !important;
            margin-bottom: 0 !important;
            font-family: Arial, sans-serif !important;
            box-sizing: border-box !important;
            background-color: white !important;
            border-radius: 0 !important;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white !important;
          }
          /* Page margins are now handled by useFileforge hook */
        }
      `}</style>
      
      <A4Page>
        <DocumentPageOne data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageTwo data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageThree data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageFour data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageFive data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageSix data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageSeven data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageEight data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageNine data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageTen data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageEleven data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageTwelve data={data} />
      </A4Page>
      
      <A4Page>
        <DocumentPageThirteen data={data} />
      </A4Page>
      
      <A4Page isLastPage={true}>
        <DocumentPageFourteen data={data} />
      </A4Page>
    </div>
  );
};

export default OshProgramDocument;
