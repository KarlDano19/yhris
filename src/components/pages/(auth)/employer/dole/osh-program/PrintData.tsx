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
import { T_OshProgram } from "@/types/osh-program";

interface PrintOshProgramOptions {
  data: T_OshProgram;
  filename?: string;
  generatePDFLocally: (content: React.ReactElement, filename: string) => Promise<void>;
}

export const printOshProgram = async ({
  data,
  filename = "osh-program.pdf",
  generatePDFLocally
}: PrintOshProgramOptions) => {
  if (!data) {
    throw new Error("No data provided for printing");
  }

  const pageNumbers = Array.from({ length: 14 }, (_, i) => i + 1);
  
  await generatePDFLocally(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <DocumentPageOne data={data as any} isMultiPage={true} pageNumber={pageNumbers[0]} />
      <DocumentPageTwo data={data as any} isMultiPage={true} pageNumber={pageNumbers[1]} />
      <DocumentPageThree data={data as any} isMultiPage={true} pageNumber={pageNumbers[2]} />
      <DocumentPageFour data={data as any} isMultiPage={true} pageNumber={pageNumbers[3]} />
      <DocumentPageFive data={data as any} isMultiPage={true} pageNumber={pageNumbers[4]} />
      <DocumentPageSix data={data as any} isMultiPage={true} pageNumber={pageNumbers[5]} />
      <DocumentPageSeven data={data as any} isMultiPage={true} pageNumber={pageNumbers[6]} />
      <DocumentPageEight data={data as any} isMultiPage={true} pageNumber={pageNumbers[7]} />
      <DocumentPageNine data={data as any} isMultiPage={true} pageNumber={pageNumbers[8]} />
      <DocumentPageTen data={data as any} isMultiPage={true} pageNumber={pageNumbers[9]} />
      <DocumentPageEleven data={data as any} isMultiPage={true} pageNumber={pageNumbers[10]} />
      <DocumentPageTwelve data={data as any} isMultiPage={true} pageNumber={pageNumbers[11]} />
      <DocumentPageThirteen data={data as any} isMultiPage={true} pageNumber={pageNumbers[12]} />
      <DocumentPageFourteen data={data as any} isMultiPage={true} pageNumber={pageNumbers[13]} />
    </div>,
    filename
  );
};
