import React from 'react';

interface AttendanceSchedule {
  firstShift?: number;
  secondShift?: number;
  thirdShift?: number;
}

interface OccupationalHealthTraining {
  physician?: boolean;
  dentist?: boolean;
  nurse?: boolean;
  firstAider?: boolean;
  others?: boolean;
  othersSpecify?: string;
}

interface MedicalExamination {
  prePlacement?: number;
  periodic?: number;
  returnToWork?: number;
  transfer?: number;
  special?: number;
  separation?: number;
}

interface DiseaseReportData {
  skin?: {
    allergy?: { male: number; female: number };
    dermatoses?: { male: number; female: number };
    infectionAsFolliculitisAbscessParonychia?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  head?: {
    tensionHeadache?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  eyes?: {
    errorOfRefraction?: { male: number; female: number };
    bacterialViral?: { male: number; female: number };
    cataract?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  mouthAndEnt?: {
    gingivitis?: { male: number; female: number };
    herpesLabialesStomatitis?: { male: number; female: number };
    otitisMediaExterna?: { male: number; female: number };
    deafness?: { male: number; female: number };
    meniereSyndrome?: { male: number; female: number };
    rhinitisAllergic?: { male: number; female: number };
    nasalPolyps?: { male: number; female: number };
    sinusitis?: { male: number; female: number };
    tonsillopharyngitis?: { male: number; female: number };
  };
}

interface DocumentPageTwoProps {
  attendanceSchedule?: AttendanceSchedule;
  occupationalHealthTraining?: OccupationalHealthTraining;
  hasRegularAppraisal?: boolean;
  physicalExam?: MedicalExamination;
  xRays?: MedicalExamination;
  urinalysis?: MedicalExamination;
  stoolExam?: MedicalExamination;
  bloodTest?: MedicalExamination;
  ecg?: MedicalExamination;
  others?: MedicalExamination;
  diseaseData?: DiseaseReportData;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({
  attendanceSchedule,
  occupationalHealthTraining,
  hasRegularAppraisal,
  physicalExam,
  xRays,
  urinalysis,
  stoolExam,
  bloodTest,
  ecg,
  others,
  diseaseData,
}) => {
  const renderConditionRow = (conditionName: string, maleCount?: number, femaleCount?: number) => {
    const total = (maleCount || 0) + (femaleCount || 0);
    
    // Use non-breaking space if no data to maintain format
    const maleDisplay = maleCount ? maleCount.toString() : '\u00A0';
    const femaleDisplay = femaleCount ? femaleCount.toString() : '\u00A0';
    const totalDisplay = total ? total.toString() : '\u00A0';
    
    return (
      <div key={conditionName} className="flex items-center text-xs">
        <div className="flex items-center w-1/2">
          <span className="w-6 text-center">( )</span>
          <span className="ml-2">{conditionName}</span>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{maleDisplay}</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{femaleDisplay}</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{totalDisplay}</div>
        </div>
      </div>
    );
  };

  const renderCategoryHeader = (categoryName: string) => {
    return (
      <div className="text-xs font-bold mb-0.5 mt-1 ml-4">{categoryName}</div>
    );
  };

  const renderExamRow = (examType: string, physicalCount?: number, xRayCount?: number, urinalysisCount?: number) => {
    const physicalDisplay = physicalCount ? physicalCount.toString() : '\u00A0';
    const xRayDisplay = xRayCount ? xRayCount.toString() : '\u00A0';
    const urinalysisDisplay = urinalysisCount ? urinalysisCount.toString() : '\u00A0';
    
    return (
      <div key={examType} className="flex items-center text-xs">
        <div className="w-1/4 text-left">{examType}</div>
        <div className="w-1/4 text-center">
          <div className="border-b border-black mx-2">{physicalDisplay}</div>
        </div>
        <div className="w-1/4 text-center">
          <div className="border-b border-black mx-2">{xRayDisplay}</div>
        </div>
        <div className="w-1/4 text-center">
          <div className="border-b border-black mx-2">{urinalysisDisplay}</div>
        </div>
      </div>
    );
  };

  const renderExamRow2 = (examType: string, stoolCount?: number, bloodCount?: number, ecgCount?: number, othersCount?: number) => {
    const stoolDisplay = stoolCount ? stoolCount.toString() : '\u00A0';
    const bloodDisplay = bloodCount ? bloodCount.toString() : '\u00A0';
    const ecgDisplay = ecgCount ? ecgCount.toString() : '\u00A0';
    const othersDisplay = othersCount ? othersCount.toString() : '\u00A0';
    
    return (
      <div key={examType} className="flex items-center text-xs">
        <div className="w-1/5 text-left">{examType}</div>
        <div className="w-1/5 text-center">
          <div className="border-b border-black mx-2">{stoolDisplay}</div>
        </div>
        <div className="w-1/5 text-center">
          <div className="border-b border-black mx-2">{bloodDisplay}</div>
        </div>
        <div className="w-1/5 text-center">
          <div className="border-b border-black mx-2">{ecgDisplay}</div>
        </div>
        <div className="w-1/5 text-center">
          <div className="border-b border-black mx-2">{othersDisplay}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Schedule of attendance of full time first aider */}
      <div className="mb-2">
        <div className="text-xs ml-4">c. Schedule of attendance of full time first aider:</div>
        <div className="ml-6 space-y-0.5">
          <div className="flex items-center">
            <span className="w-6 text-center">({attendanceSchedule?.firstShift ? '✓' : ' '})</span>
            <span>1st work shift</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({attendanceSchedule?.secondShift ? '✓' : ' '})</span>
            <span>2nd work shift</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({attendanceSchedule?.thirdShift ? '✓' : ' '})</span>
            <span>3rd work shift</span>
          </div>
        </div>
      </div>

      {/* Occupational Health Training */}
      <div className="mb-2">
        <div className="text-xs ml-4">
          d. The following occupational health personnel of the establishment have undergone training in occupational health and safety/first aid:
        </div>
        <div className="ml-6 space-y-0.5">
          <div className="flex items-center">
            <span className="w-6 text-center">({occupationalHealthTraining?.physician ? '✓' : ' '})</span>
            <span>occupational health physician</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({occupationalHealthTraining?.dentist ? '✓' : ' '})</span>
            <span>occupational health dentist</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({occupationalHealthTraining?.nurse ? '✓' : ' '})</span>
            <span>occupational health nurse</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({occupationalHealthTraining?.firstAider ? '✓' : ' '})</span>
            <span>first aider</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({occupationalHealthTraining?.others ? '✓' : ' '})</span>
            <span>others, please specify</span>
            <div className="border-b border-black ml-2 flex-1">
              {occupationalHealthTraining?.othersSpecify || '\u00A0'}
            </div>
          </div>
        </div>
      </div>

      {/* Occupational Health Services */}
      <div className="mb-2">
        <div className="text-xs font-bold">9. Occupational Health Services:</div>
        <div className="ml-4">
          <div className="text-xs mb-1">
            a. The occupational health personnel of this establishment conducts regular appraisal of the sanitation system in the workplace:
          </div>
          <div className="ml-8 flex space-x-6">
            <div className="flex items-center">
              <span className="w-6 text-center">({hasRegularAppraisal ? '✓' : ' '})</span>
              <span>yes</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center">({!hasRegularAppraisal ? '✓' : ' '})</span>
              <span>no</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Examination Numbers */}
      <div className="mb-2">
        <div className="text-xs mb-1 ml-4">b. Number of workers who underwent the following medical examination:</div>
        
        {/* First table - Physical Exam, X-Rays, Urinalysis */}
        <div className="mb-1">
          {/* Headers */}
          <div className="flex items-center text-xs font-bold">
            <div className="w-1/4"></div>
            <div className="w-1/4 text-center">Physical Exam</div>
            <div className="w-1/4 text-center">X-Rays</div>
            <div className="w-1/4 text-center">Urinalysis</div>
          </div>
          {/* Rows */}
          <div className="space-y-0.5 ml-8">
            {renderExamRow('1. Pre-placement', physicalExam?.prePlacement, xRays?.prePlacement, urinalysis?.prePlacement)}
            {renderExamRow('2. Periodic', physicalExam?.periodic, xRays?.periodic, urinalysis?.periodic)}
            {renderExamRow('3. Return-to-work', physicalExam?.returnToWork, xRays?.returnToWork, urinalysis?.returnToWork)}
            {renderExamRow('4. Transfer', physicalExam?.transfer, xRays?.transfer, urinalysis?.transfer)}
            {renderExamRow('5. Special', physicalExam?.special, xRays?.special, urinalysis?.special)}
            {renderExamRow('6. Separation', physicalExam?.separation, xRays?.separation, urinalysis?.separation)}
          </div>
        </div>

        {/* Second table - Stool Exam, Blood Test, ECG, Others */}
        <div className="mb-1">
          {/* Headers */}
          <div className="flex items-center text-xs font-bold ml-8">
            <div className="w-1/5"></div>
            <div className="w-1/5 text-center">Stool Exam</div>
            <div className="w-1/5 text-center">Blood Test</div>
            <div className="w-1/5 text-center">ECG</div>
            <div className="w-1/5 text-center">Others</div>
          </div>
          {/* Rows */}
          <div className="space-y-0.5 ml-8">
            {renderExamRow2('1. Pre-placement', stoolExam?.prePlacement, bloodTest?.prePlacement, ecg?.prePlacement, others?.prePlacement)}
            {renderExamRow2('2. Periodic', stoolExam?.periodic, bloodTest?.periodic, ecg?.periodic, others?.periodic)}
            {renderExamRow2('3. Return-to-work', stoolExam?.returnToWork, bloodTest?.returnToWork, ecg?.returnToWork, others?.returnToWork)}
            {renderExamRow2('4. Transfer', stoolExam?.transfer, bloodTest?.transfer, ecg?.transfer, others?.transfer)}
            {renderExamRow2('5. Special', stoolExam?.special, bloodTest?.special, ecg?.special, others?.special)}
            {renderExamRow2('6. Separation', stoolExam?.separation, bloodTest?.separation, ecg?.separation, others?.separation)}
          </div>
        </div>
      </div>

      {/* Report of Diseases */}
      <div className="mb-2">
        <div className="text-xs font-bold">10. Report of Diseases:</div>
        <div className="text-xs ml-4">a. Number of consultations/treatments for the following diseases:</div>
        
        {/* Column Headers */}
        <div className="flex items-center text-xs font-bold text-center">
          <div className="w-1/2"></div>
          <div className="w-1/6">Male</div>
          <div className="w-1/6">Female</div>
          <div className="w-1/6">Total Number<br/>of Cases</div>
        </div>

        {/* Medical Conditions */}
        <div>
            {/* Skin */}
          {renderCategoryHeader('Skin:')}
          <div className="ml-4">
            {renderConditionRow('allergy', diseaseData?.skin?.allergy?.male, diseaseData?.skin?.allergy?.female)}
            {renderConditionRow('dermatoses', diseaseData?.skin?.dermatoses?.male, diseaseData?.skin?.dermatoses?.female)}
            {renderConditionRow('infection as folliculitis abscess/paro nychia', diseaseData?.skin?.infectionAsFolliculitisAbscessParonychia?.male, diseaseData?.skin?.infectionAsFolliculitisAbscessParonychia?.female)}
            {renderConditionRow('Others', diseaseData?.skin?.others?.male, diseaseData?.skin?.others?.female)}
          </div>

            {/* Head */}
          {renderCategoryHeader('Head:')}
          <div className="ml-4">
            {renderConditionRow('tension headache', diseaseData?.head?.tensionHeadache?.male, diseaseData?.head?.tensionHeadache?.female)}
            {renderConditionRow('Others', diseaseData?.head?.others?.male, diseaseData?.head?.others?.female)}
          </div>

            {/* Eyes */}
          {renderCategoryHeader('Eyes:')}
          <div className="ml-4">
            {renderConditionRow('error of refraction', diseaseData?.eyes?.errorOfRefraction?.male, diseaseData?.eyes?.errorOfRefraction?.female)}
            {renderConditionRow('bacterial/viral conjunctivitis', diseaseData?.eyes?.bacterialViral?.male, diseaseData?.eyes?.bacterialViral?.female)}
            {renderConditionRow('cataract', diseaseData?.eyes?.cataract?.male, diseaseData?.eyes?.cataract?.female)}
            {renderConditionRow('Others', diseaseData?.eyes?.others?.male, diseaseData?.eyes?.others?.female)}
          </div>

            {/* Mouth & ENT */}
          {renderCategoryHeader('Mouth & ENT:')}
          <div className="ml-4">
            {renderConditionRow('Gingivitis', diseaseData?.mouthAndEnt?.gingivitis?.male, diseaseData?.mouthAndEnt?.gingivitis?.female)}
            {renderConditionRow('Herpes labiales/stomatitis', diseaseData?.mouthAndEnt?.herpesLabialesStomatitis?.male, diseaseData?.mouthAndEnt?.herpesLabialesStomatitis?.female)}
            {renderConditionRow('Otitis Media/Externa', diseaseData?.mouthAndEnt?.otitisMediaExterna?.male, diseaseData?.mouthAndEnt?.otitisMediaExterna?.female)}
            {renderConditionRow('Deafness', diseaseData?.mouthAndEnt?.deafness?.male, diseaseData?.mouthAndEnt?.deafness?.female)}
            {renderConditionRow('Meniere Syndrome/Vertigo', diseaseData?.mouthAndEnt?.meniereSyndrome?.male, diseaseData?.mouthAndEnt?.meniereSyndrome?.female)}
            {renderConditionRow('Rhinitis/Allergic', diseaseData?.mouthAndEnt?.rhinitisAllergic?.male, diseaseData?.mouthAndEnt?.rhinitisAllergic?.female)}
            {renderConditionRow('Nasal Polyps', diseaseData?.mouthAndEnt?.nasalPolyps?.male, diseaseData?.mouthAndEnt?.nasalPolyps?.female)}
            {renderConditionRow('Sinusitis', diseaseData?.mouthAndEnt?.sinusitis?.male, diseaseData?.mouthAndEnt?.sinusitis?.female)}
            {renderConditionRow('Tonsillopharyngitis', diseaseData?.mouthAndEnt?.tonsillopharyngitis?.male, diseaseData?.mouthAndEnt?.tonsillopharyngitis?.female)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageTwo;

