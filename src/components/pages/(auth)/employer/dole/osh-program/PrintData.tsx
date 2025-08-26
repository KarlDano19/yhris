import DocumentPageOne from "./print/DocumentPageOne";
import DocumentPageTwo from "./print/DocumentPageTwo";
import DocumentPageThree from "./print/DocumentPageThree";
import DocumentPageFour from "./print/DocumentPageFour";
import DocumentPageFive from "./print/DocumentPageFive";
import DocumentPageSix from "./print/DocumentPageSix";
import DocumentPageSeven from "./print/DocumentPageSeven";
import DocumentPageEight from "./print/DocumentPageEight";
import DocumentPageNine from "./print/DocumentPageNine";
import DocumentPageTen from "./print/DocumentPageTen";
import DocumentPageEleven from "./print/DocumentPageEleven";
import DocumentPageTwelve from "./print/DocumentPageTwelve";
import DocumentPageThirteen from "./print/DocumentPageThirteen";
import DocumentPageFourteen from "./print/DocumentPageFourteen";
import Document from "./print/Document";

import { T_OshProgram } from "@/types/osh-program";

interface PrintOshProgramOptions {
  data: T_OshProgram;
  filename?: string;
  generatePDFLocally: (content: React.ReactElement, filename: string) => Promise<void>;
}

// Function to check if page 4 needs pagination
const needsPageFourPagination = (data: T_OshProgram): boolean => {
  try {
    const riskData = typeof data.emergency_and_disaster_preparedness === 'string' 
      ? JSON.parse(data.emergency_and_disaster_preparedness) 
      : data.emergency_and_disaster_preparedness || [];
    
    return Array.isArray(riskData) && riskData.length >= 15;
  } catch (error) {
    return false;
  }
};

// Function to render page content based on page index
const renderPageContent = (pageIndex: number, data: T_OshProgram) => {
  switch (pageIndex) {
    case 1:
      return <DocumentPageOne data={data as any} />;
    case 2:
      return <DocumentPageTwo data={data as any} />;
    case 3:
      return <DocumentPageThree data={data as any} />;
    case 4:
      return <DocumentPageFour data={data as any} pageNumber={1} />;
    case 4.1:
      return <DocumentPageFour data={data as any} pageNumber={4.1} />;
    case 4.2:
      return <DocumentPageFour data={data as any} pageNumber={4.2} />;
    case 5:
      return <DocumentPageFive data={data as any} />;
    case 6:
      return <DocumentPageSix data={data as any} />;
    case 7:
      return <DocumentPageSeven data={data as any} />;
    case 8:
      return <DocumentPageEight data={data as any} />;
    case 9:
      return <DocumentPageNine data={data as any} />;
    case 10:
      return <DocumentPageTen data={data as any} />;
    case 11:
      return <DocumentPageEleven data={data as any} />;
    case 12:
      return <DocumentPageTwelve data={data as any} />;
    case 13:
      return <DocumentPageThirteen data={data as any} />;
    case 14:
      return <DocumentPageFourteen data={data as any} />;
    default:
      return <DocumentPageOne data={data as any} />;
  }
};

export const printOshProgram = async ({
  data,
  filename = "osh-program.pdf",
  generatePDFLocally
}: PrintOshProgramOptions) => {
  if (!data) {
    throw new Error("No data provided for printing");
  }

  // Determine page numbers based on whether page 4 needs pagination
  const needsPagination = needsPageFourPagination(data);
  let pageNumbers: (number | number)[] = [];
  
  if (needsPagination) {
    // If page 4 needs pagination, replace page 4 with 4.1 and 4.2
    pageNumbers = [1, 2, 3, 4.1, 4.2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  } else {
    // Normal page numbering
    pageNumbers = Array.from({ length: 14 }, (_, i) => i + 1);
  }
  
  await generatePDFLocally(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {pageNumbers.map((pageNumber) => (
        <Document key={pageNumber} isMultiPage={true} pageNumber={pageNumber}>
          {renderPageContent(pageNumber, data)}
        </Document>
      ))}
    </div>,
    filename
  );
};
