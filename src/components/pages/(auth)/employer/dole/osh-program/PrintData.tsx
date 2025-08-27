import OshProgramDocument from "./print/OshProgramDocument";

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

  // Generate PDF using the single-page document approach
  await generatePDFLocally(
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
        @media print {
          .page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
      <OshProgramDocument data={data} />
    </div>,
    filename
  );
};
