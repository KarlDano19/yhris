import { OshProgramDocumentPrint } from "./documents/OshProgramDocument";

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
      <OshProgramDocumentPrint  data={data} />
    </div>,
    filename
  );
};
