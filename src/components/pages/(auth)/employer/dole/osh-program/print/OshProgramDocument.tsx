import React, { useState, useEffect, useRef } from 'react';

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
import DocumentPageThirteen from './DocumentPageThirteen';
import DocumentPageFourteen from './DocumentPageFourteen';

import { T_OshProgram } from '@/types/osh-program';
import { ChevronUpIcon } from "@heroicons/react/24/solid";

interface OshProgramDocumentProps {
  data: T_OshProgram;
}

// Common A4 page styles
const a4PageStyles = {
  pageBreakAfter: 'always' as const,
  breakAfter: 'page' as const,
  width: '210mm',
  minHeight: '297mm',
  margin: '0 auto',
  marginBottom: '20px',
  fontFamily: 'Arial, sans-serif',
  boxSizing: 'border-box' as const,
  padding: '32px 35px 32px 50px',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

// A4 Page wrapper component
const A4Page: React.FC<{ 
  children: React.ReactNode; 
  isLastPage?: boolean; 
  noPageBreak?: boolean;
  forPrint?: boolean;
}> = ({ 
  children, 
  isLastPage = false,
  noPageBreak = false,
  forPrint = false
}) => (
  <div 
    className="a4-page"
    style={{ 
      ...(forPrint ? {} : a4PageStyles),
      pageBreakAfter: isLastPage ? 'auto' : (noPageBreak ? 'auto' : 'always'),
      breakAfter: isLastPage ? 'auto' : (noPageBreak ? 'auto' : 'page'),
      marginBottom: isLastPage ? '0' : '20px'
    }}
  >
    {children}
  </div>
);

// Shared document content component
const DocumentContent: React.FC<{ data: T_OshProgram; forPrint?: boolean }> = ({ data, forPrint = false }) => (
  <>
    <A4Page forPrint={forPrint}>
      <DocumentPageOne data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint}>
      <DocumentPageTwo data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint}>
      <DocumentPageThree data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageFour data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageFive data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageSix data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageSeven data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageEight data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageNine data={data} />
    </A4Page>

    <A4Page forPrint={forPrint} noPageBreak={true}>
      <DocumentPageTen data={data} />
    </A4Page>

    <A4Page forPrint={forPrint}>
      <DocumentPageEleven data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint}>
      <DocumentPageTwelve data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint}>
      <DocumentPageThirteen data={data} />
    </A4Page>
    
    <A4Page forPrint={forPrint} isLastPage={true}>
      <DocumentPageFourteen data={data} />
    </A4Page>
  </>
);

// Preview
const OshProgramDocumentPreview: React.FC<OshProgramDocumentProps> = ({ data }) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const documentElement = documentRef.current;
      if (documentElement) {
        const { scrollTop, scrollHeight, clientHeight } = documentElement;
        // Show button when scrolled down more than 300px or near bottom
        const shouldShow = scrollTop > 300 || (scrollTop + clientHeight >= scrollHeight - 50);
        setShowScrollToTop(shouldShow);
      }
    };

    const documentElement = documentRef.current;
    if (documentElement) {
      documentElement.addEventListener('scroll', handleScroll);
      // Check initial scroll position
      handleScroll();
      
      return () => {
        documentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToTop = () => {
    const documentElement = documentRef.current;
    if (documentElement) {
      documentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={documentRef}
        className="text-black leading-tight max-h-[77vh] overflow-auto"
      >
        <DocumentContent data={data} />
      </div>
      
      {/* Floating Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-savoy-blue hover:bg-savoy-blue-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2"
          title="Scroll to top"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default OshProgramDocumentPreview;


// Print
export const OshProgramDocumentPrint: React.FC<OshProgramDocumentProps> = ({ data }) => {
  return (
    <div className="text-black font-sans text-xs leading-tight">
      <style jsx>{`
        .a4-page {
          page-break-after: always;
          break-after: page;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 20px;
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
        }
      `}</style>
      
      <DocumentContent data={data} forPrint={true} />
    </div>
  );
};
