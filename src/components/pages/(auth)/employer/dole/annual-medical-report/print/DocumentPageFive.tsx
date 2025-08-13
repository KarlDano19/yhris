import React from 'react';

interface InjuryData {
  male?: number;
  female?: number;
}

interface ImmunizationData {
  tetanusToxoid?: InjuryData;
  tetanusAntitoxin?: InjuryData;
  tetanusGlobulin?: InjuryData;
  hepatitisB?: InjuryData;
  rabiesVaccine?: InjuryData;
  others?: InjuryData;
}

interface HealthEducationData {
  individual?: boolean;
  groupDiscussions?: boolean;
  visualDisplays?: boolean;
}

interface OtherHealthPrograms {
  nutrition?: {
    seminar?: boolean;
    visualAids?: boolean;
    counselling?: boolean;
  };
  maternalChildCare?: {
    seminar?: boolean;
    visualAids?: boolean;
    counselling?: boolean;
  };
  familyPlanning?: {
    seminar?: boolean;
    visualAids?: boolean;
    counselling?: boolean;
  };
  mentalHealth?: {
    seminar?: boolean;
    visualAids?: boolean;
    counselling?: boolean;
  };
  personalHealthMaintenance?: {
    seminar?: boolean;
    visualAids?: boolean;
    counselling?: boolean;
  };
}

interface PhysicalFitnessProgram {
  sportsActivities?: {
    yes?: boolean;
    no?: boolean;
  };
  calisthenics?: {
    yes?: boolean;
    no?: boolean;
  };
  others?: string;
}

interface ChemicalHazards {
  dust?: { substance: string; workers: number };
  liquids?: { substance: string; workers: number };
  mistFumes?: { substance: string; workers: number };
  gas?: { substance: string; workers: number };
  others?: { substance: string; workers: number };
}

interface PhysicalHazards {
  noise?: { substance: string; workers: number };
  temperatureHumidity?: { substance: string; workers: number };
  pressure?: { substance: string; workers: number };
  illumination?: { substance: string; workers: number };
  radiationUltraviolet?: { substance: string; workers: number };
  vibration?: { substance: string; workers: number };
}

interface DocumentPageFiveProps {
  additionalInjuries?: {
    amputation?: InjuryData;
    crushingInjuries?: InjuryData;
    spinalInjuries?: InjuryData;
    cranialInjuries?: InjuryData;
    sprains?: InjuryData;
    dislocationFractures?: InjuryData;
    burns?: InjuryData;
  };
  immunizationProgram?: ImmunizationData;
  medicalRecordsKeeping?: {
    done?: boolean;
    notDone?: boolean;
  };
  healthEducation?: HealthEducationData;
  otherHealthPrograms?: OtherHealthPrograms;
  physicalFitnessProgram?: PhysicalFitnessProgram;
  chemicalHazards?: ChemicalHazards;
  physicalHazards?: PhysicalHazards;
}

const DocumentPageFive: React.FC<DocumentPageFiveProps> = ({
  additionalInjuries,
  immunizationProgram,
  medicalRecordsKeeping,
  healthEducation,
  otherHealthPrograms,
  physicalFitnessProgram,
  chemicalHazards,
  physicalHazards,
}) => {
  // For accidents - no checkboxes (like section 11)
  const renderAccidentRow = (injuryName: string, maleCount?: number, femaleCount?: number) => {
    const total = (maleCount || 0) + (femaleCount || 0);
    
    const maleDisplay = maleCount ? maleCount.toString() : '\u00A0';
    const femaleDisplay = femaleCount ? femaleCount.toString() : '\u00A0';
    const totalDisplay = total ? total.toString() : '\u00A0';
    
    return (
      <div key={injuryName} className="flex items-center text-xs">
        <div className="w-1/2 text-left">{injuryName}</div>
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

  // For immunization - no checkboxes
  const renderImmunizationRow = (injuryName: string, maleCount?: number, femaleCount?: number) => {
    const total = (maleCount || 0) + (femaleCount || 0);
    
    const maleDisplay = maleCount ? maleCount.toString() : '\u00A0';
    const femaleDisplay = femaleCount ? femaleCount.toString() : '\u00A0';
    const totalDisplay = total ? total.toString() : '\u00A0';
    
    return (
      <div key={injuryName} className="flex items-center text-xs">
        <div className="w-1/2 text-left ml-4">{injuryName}</div>
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

  // For health programs table
  const renderHealthProgramRow = (programName: string, seminar?: boolean, visualAids?: boolean, counselling?: boolean) => {
    return (
      <div key={programName} className="flex items-center text-xs">
        <div className="w-1/2 text-left">{programName}</div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{seminar ? '✓' : '\u00A0'}</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{visualAids ? '✓' : '\u00A0'}</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">{counselling ? '✓' : '\u00A0'}</div>
        </div>
      </div>
    );
  };

  // For hazards sections
  const renderHazardRow = (hazardName: string, substance?: string, workers?: number, isSubItem = false) => {
    const workersDisplay = workers ? workers.toString() : '\u00A0';
    
    return (
      <div key={hazardName} className="flex items-center text-xs">
        <div className={`w-3/4 text-left ${isSubItem ? 'ml-8' : ''}`}>
          <div className="flex items-center">
            <span className="w-6 text-center">( )</span>
            <span className="ml-2">{hazardName}</span>
          </div>
          {substance && (
            <div className="border-b border-black mt-1 min-h-4">
              {substance}
            </div>
          )}
        </div>
        <div className="w-1/4 text-center">
          <div className="border-b border-black mx-2">{workersDisplay}</div>
        </div>
      </div>
    );
  };

  const renderCheckbox = (isChecked?: boolean) => isChecked ? '✓' : ' ';

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Additional Injuries - Continuing from page 4 */}
      <div className="mb-2">
        <div className="ml-4">
          {renderAccidentRow('Amputation, loss of body parts', additionalInjuries?.amputation?.male, additionalInjuries?.amputation?.female)}
          {renderAccidentRow('Crushing Injuries', additionalInjuries?.crushingInjuries?.male, additionalInjuries?.crushingInjuries?.female)}
          {renderAccidentRow('Spinal Injuries', additionalInjuries?.spinalInjuries?.male, additionalInjuries?.spinalInjuries?.female)}
          {renderAccidentRow('Cranial Injuries', additionalInjuries?.cranialInjuries?.male, additionalInjuries?.cranialInjuries?.female)}
          {renderAccidentRow('Sprains', additionalInjuries?.sprains?.male, additionalInjuries?.sprains?.female)}
          {renderAccidentRow('Dislocation/Fractures', additionalInjuries?.dislocationFractures?.male, additionalInjuries?.dislocationFractures?.female)}
          {renderAccidentRow('Burns', additionalInjuries?.burns?.male, additionalInjuries?.burns?.female)}
        </div>
      </div>

      {/* Immunization Program */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">12. Immunization Program</div>
        <div className="text-xs mb-1 ml-4">(Indicate number immunized)</div>
        
        {/* Column Headers */}
        <div className="flex items-center text-xs font-bold mb-1 text-center">
          <div className="w-1/2 ml-4"></div>
          <div className="w-1/6">Male</div>
          <div className="w-1/6">Female</div>
          <div className="w-1/6">Total</div>
        </div>

        {/* Immunization rows */}
        <div>
          {renderImmunizationRow('Tetanus Toxoid Injection', immunizationProgram?.tetanusToxoid?.male, immunizationProgram?.tetanusToxoid?.female)}
          {renderImmunizationRow('Tetanus Antitoxin Injection', immunizationProgram?.tetanusAntitoxin?.male, immunizationProgram?.tetanusAntitoxin?.female)}
          {renderImmunizationRow('Tetanus Globulin Injection', immunizationProgram?.tetanusGlobulin?.male, immunizationProgram?.tetanusGlobulin?.female)}
          {renderImmunizationRow('Hepatitis B Vaccine', immunizationProgram?.hepatitisB?.male, immunizationProgram?.hepatitisB?.female)}
          {renderImmunizationRow('Rabies Vaccine', immunizationProgram?.rabiesVaccine?.male, immunizationProgram?.rabiesVaccine?.female)}          
          {renderImmunizationRow('Others (Please specify)', immunizationProgram?.others?.male, immunizationProgram?.others?.female)}
        </div>
      </div>

      {/* Keeping of Medical Records */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">13. Keeping of Medical records of Workers (Please check)</div>
        <div className="ml-4 flex items-center space-x-6">
          <div className="flex items-center">
            <span className="w-6 text-center">({renderCheckbox(medicalRecordsKeeping?.done)})</span>
            <span>done</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({renderCheckbox(medicalRecordsKeeping?.notDone)})</span>
            <span>not done</span>
          </div>
        </div>
      </div>

      {/* Health Education and Counselling */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">14. Health Education and Counselling by Health and Safety Personnel: (Please check one ormore)</div>
        <div className="ml-4 space-y-0.5">
          <div className="flex items-center">
            <span className="w-6 text-center">({renderCheckbox(healthEducation?.individual)})</span>
            <span>done individually as each worker comes to the clinic for consultation.</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({renderCheckbox(healthEducation?.groupDiscussions)})</span>
            <span>done in organized group discussions/seminars.</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center">({renderCheckbox(healthEducation?.visualDisplays)})</span>
            <span>done with the use of visual displays and/or educational materials, leaflets, etc.</span>
          </div>
        </div>
      </div>

      {/* Other Health Programs */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">15. Other Health Programs: (Please check)</div>
        
        {/* Column Headers */}
        <div className="flex items-center text-xs font-bold mb-1">
          <div className="w-1/2 ml-4">Kinds of Program</div>
          <div className="w-1/6 text-center">Seminar</div>
          <div className="w-1/6 text-center">Use of Visual<br/>Aid/Materials</div>
          <div className="w-1/6 text-center">Counselling</div>
        </div>

        {/* Program rows */}
        <div className="ml-4">
          {renderHealthProgramRow('Nutrition Program', otherHealthPrograms?.nutrition?.seminar, otherHealthPrograms?.nutrition?.visualAids, otherHealthPrograms?.nutrition?.counselling)}
          {renderHealthProgramRow('Maternal and Child Care Program', otherHealthPrograms?.maternalChildCare?.seminar, otherHealthPrograms?.maternalChildCare?.visualAids, otherHealthPrograms?.maternalChildCare?.counselling)}
          {renderHealthProgramRow('Family Planning Program', otherHealthPrograms?.familyPlanning?.seminar, otherHealthPrograms?.familyPlanning?.visualAids, otherHealthPrograms?.familyPlanning?.counselling)}
          {renderHealthProgramRow('Mental Health Activities', otherHealthPrograms?.mentalHealth?.seminar, otherHealthPrograms?.mentalHealth?.visualAids, otherHealthPrograms?.mentalHealth?.counselling)}
          {renderHealthProgramRow('Personal Health Maintenance', otherHealthPrograms?.personalHealthMaintenance?.seminar, otherHealthPrograms?.personalHealthMaintenance?.visualAids, otherHealthPrograms?.personalHealthMaintenance?.counselling)}
        </div>
      </div>

      {/* Physical Fitness Program */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">Physical fitness Program: (Please check)</div>
        <div className="ml-4 text-xs space-y-0.5">
          <div className="flex items-center">
            <span className="mr-4">Sports Activities</span>
            <span className="w-6 text-center">({renderCheckbox(physicalFitnessProgram?.sportsActivities?.yes)})</span>
            <span className="mr-4">Yes</span>
            <span className="w-6 text-center">({renderCheckbox(physicalFitnessProgram?.sportsActivities?.no)})</span>
            <span>No</span>
          </div>
          <div className="flex items-center">
            <span className="mr-4">Others (Please specify):</span>
            <div className="border-b border-black min-h-[1rem] text-xs inline-block">
              {physicalFitnessProgram?.others || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Hazards in the workplace */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">16. Hazards in the workplace: (Please check and give details of the substance)</div>
        
        {/* Column Headers */}
        <div className="flex text-xs font-bold mb-1">
          <div className="w-2/3 flex">
            <div className="w-6"></div>
            <div className="w-48"></div>
            <div className="flex-1 text-center">Substances and/or<br/>Sources</div>
          </div>
          <div className="w-1/3 text-center">Number of workers<br/>exposed</div>
        </div>

        {/* Chemical Hazards */}
        <div className="mb-1 ml-4">
          <div className="text-xs font-bold mb-0.5">a) Chemical Hazards:</div>
          <div className="text-xs">
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">dust (Ex. Silica dust)</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {chemicalHazards?.dust?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {chemicalHazards?.dust?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">liquids (Ex. Mercury)</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {chemicalHazards?.liquids?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {chemicalHazards?.liquids?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">mist/fumes/vapors (Ex. Mist<br/>from paint spraying)</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {chemicalHazards?.mistFumes?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {chemicalHazards?.mistFumes?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">gas (Ex. CO, H2S)</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {chemicalHazards?.gas?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {chemicalHazards?.gas?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">others (please specify)<br/>(Ex. Solvents)</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {chemicalHazards?.others?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {chemicalHazards?.others?.workers || ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Hazards */}
        <div className="mb-1 ml-4">
          <div className="text-xs font-bold mb-0.5">b) Physical Hazards:</div>
          <div className="text-xs">
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">noise</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.noise?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.noise?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">temperature/humidity</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.temperatureHumidity?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.temperatureHumidity?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">pressure</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.pressure?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.pressure?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">illumination</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.illumination?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.illumination?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">radiation/ultraviolet/<br/>microwave</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.radiationUltraviolet?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.radiationUltraviolet?.workers || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-0.5">
              <div className="w-2/3 flex items-center">
                <span className="w-6 text-center">( )</span>
                <span className="ml-1 w-48">vibration</span>
                <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                  {physicalHazards?.vibration?.substance || ''}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                  {physicalHazards?.vibration?.workers || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageFive;
