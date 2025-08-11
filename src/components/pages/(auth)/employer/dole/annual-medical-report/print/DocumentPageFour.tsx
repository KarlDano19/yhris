import React from 'react';

interface InfectiousDiseases {
  lymphadenitis?: { male: number; female: number };
  lymphoma?: { male: number; female: number };
  influenza?: { male: number; female: number };
  typhoidParatyphoid?: { male: number; female: number };
  cholera?: { male: number; female: number };
  measles?: { male: number; female: number };
  mumps?: { male: number; female: number };
  malaria?: { male: number; female: number };
  schistosomiasis?: { male: number; female: number };
  herpesZoster?: { male: number; female: number };
  chickenPox?: { male: number; female: number };
  germanMeasles?: { male: number; female: number };
  rabies?: { male: number; female: number };
  others?: { male: number; female: number };
}

interface PhysicalEnvironmentDiseases {
  noiseVibration?: {
    deafnessNoiseInduced?: { male: number; female: number };
    otosclerosis?: { male: number; female: number };
    musculoSkeletalDisturbances?: { male: number; female: number };
    fatigue?: { male: number; female: number };
  };
  temperatureHumidity?: {
    heatStrokes?: { male: number; female: number };
    heatCramps?: { male: number; female: number };
    dehydration?: { male: number; female: number };
    heatExhaustion?: { male: number; female: number };
    others?: { male: number; female: number };
    coldTemperature?: {
      chilblain?: { male: number; female: number };
      frostBite?: { male: number; female: number };
      immersionFoot?: { male: number; female: number };
      generalHypothermia?: { male: number; female: number };
      others?: { male: number; female: number };
    };
  };
  pressureAbnormalities?: {
    decompressionSickness?: {
      airEmbolism?: { male: number; female: number };
      caissonsDisease?: { male: number; female: number };
    };
    barotrauma?: { male: number; female: number };
    hypoxia?: { male: number; female: number };
    altitudeSickness?: { male: number; female: number };
  };
  radiation?: {
    cataracts?: { male: number; female: number };
    keratitis?: { male: number; female: number };
    burns?: { male: number; female: number };
    radiationRelatedCancers?: { male: number; female: number };
  };
}

interface OccupationalAccidents {
  contusionBruises?: { male: number; female: number };
  abrasions?: { male: number; female: number };
  cuts?: { male: number; female: number };
  concussion?: { male: number; female: number };
  avulsion?: { male: number; female: number };
}

interface DocumentPageFourProps {
  infectiousDiseases?: InfectiousDiseases;
  physicalEnvironmentDiseases?: PhysicalEnvironmentDiseases;
  occupationalAccidents?: OccupationalAccidents;
}

const DocumentPageFour: React.FC<DocumentPageFourProps> = ({
  infectiousDiseases,
  physicalEnvironmentDiseases,
  occupationalAccidents,
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

  const renderAccidentRow = (conditionName: string, maleCount?: number, femaleCount?: number) => {
    const total = (maleCount || 0) + (femaleCount || 0);
    
    // Use non-breaking space if no data to maintain format
    const maleDisplay = maleCount ? maleCount.toString() : '\u00A0';
    const femaleDisplay = femaleCount ? femaleCount.toString() : '\u00A0';
    const totalDisplay = total ? total.toString() : '\u00A0';
    
    return (
      <div key={conditionName} className="flex items-center text-xs">
        <div className="w-1/2 text-left ">{conditionName}</div>
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
      <div className="text-xs font-bold mb-0.5 mt-1">{categoryName}</div>
    );
  };

  const renderSubCategoryHeader = (categoryName: string) => {
    return (
      <div className="text-xs font-bold mb-0.5 mt-1 ml-4">{categoryName}</div>
    );
  };

  const renderTotalRow = () => {
    return (
      <div className="flex items-center text-xs font-bold mt-1">
        <div className="w-1/2">TOTAL NUMBER</div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">&nbsp;</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">&nbsp;</div>
        </div>
        <div className="w-1/6 text-center">
          <div className="border-b border-black mx-2">&nbsp;</div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Medical Conditions with Checkboxes */}
      <div className="mb-2">
        {/* First two conditions before header */}
        <div className="ml-4">
          {renderConditionRow('Lymphadenitis', infectiousDiseases?.lymphadenitis?.male, infectiousDiseases?.lymphadenitis?.female)}
          {renderConditionRow('Lymphoma', infectiousDiseases?.lymphoma?.male, infectiousDiseases?.lymphoma?.female)}
        </div>

        {/* Infectious Diseases */}
        {renderCategoryHeader('Infectious Diseases:')}
        <div className="ml-4">
          {renderConditionRow('Influenza', infectiousDiseases?.influenza?.male, infectiousDiseases?.influenza?.female)}
          {renderConditionRow('Typhoid/paratyphoid fever', infectiousDiseases?.typhoidParatyphoid?.male, infectiousDiseases?.typhoidParatyphoid?.female)}
          {renderConditionRow('Cholera', infectiousDiseases?.cholera?.male, infectiousDiseases?.cholera?.female)}
          {renderConditionRow('Measles', infectiousDiseases?.measles?.male, infectiousDiseases?.measles?.female)}
          {renderConditionRow('Mumps', infectiousDiseases?.mumps?.male, infectiousDiseases?.mumps?.female)}
          {renderConditionRow('Malaria', infectiousDiseases?.malaria?.male, infectiousDiseases?.malaria?.female)}
          {renderConditionRow('Schistosomiasis', infectiousDiseases?.schistosomiasis?.male, infectiousDiseases?.schistosomiasis?.female)}
          {renderConditionRow('Herpes Zoster', infectiousDiseases?.herpesZoster?.male, infectiousDiseases?.herpesZoster?.female)}
          {renderConditionRow('Chicken Pox', infectiousDiseases?.chickenPox?.male, infectiousDiseases?.chickenPox?.female)}
          {renderConditionRow('German Measles', infectiousDiseases?.germanMeasles?.male, infectiousDiseases?.germanMeasles?.female)}
          {renderConditionRow('Rabies', infectiousDiseases?.rabies?.male, infectiousDiseases?.rabies?.female)}
          {renderConditionRow('Others', infectiousDiseases?.others?.male, infectiousDiseases?.others?.female)}
        </div>

        {/* Diseases due to Physical Environment */}
        {renderCategoryHeader('Diseases due to Physical Environment:')}
        
        {/* a) Diseases due to Noise and vibration */}
        {renderSubCategoryHeader('a)    Diseases due to Noise and vibration')}
        <div className="ml-8">
          {renderConditionRow('Deafness (noise induced)', physicalEnvironmentDiseases?.noiseVibration?.deafnessNoiseInduced?.male, physicalEnvironmentDiseases?.noiseVibration?.deafnessNoiseInduced?.female)}
          {renderConditionRow('Otosclerosis', physicalEnvironmentDiseases?.noiseVibration?.otosclerosis?.male, physicalEnvironmentDiseases?.noiseVibration?.otosclerosis?.female)}
          {renderConditionRow('Musculo-skeletal', physicalEnvironmentDiseases?.noiseVibration?.musculoSkeletalDisturbances?.male, physicalEnvironmentDiseases?.noiseVibration?.musculoSkeletalDisturbances?.female)}
          {renderConditionRow('disturbances', physicalEnvironmentDiseases?.noiseVibration?.fatigue?.male, physicalEnvironmentDiseases?.noiseVibration?.fatigue?.female)}
        </div>

        {/* b) Diseases due to Temperature And Humidity abnormalities */}
        {renderSubCategoryHeader('b)    Diseases due to Temperature')}
        <div className="ml-4 text-xs font-bold mb-0.5">And Humidity abnormalities:</div>
        <div className="ml-8">
          {renderConditionRow('Hot Temperature:', physicalEnvironmentDiseases?.temperatureHumidity?.heatStrokes?.male, physicalEnvironmentDiseases?.temperatureHumidity?.heatStrokes?.female)}
          {renderConditionRow('heat strokes', physicalEnvironmentDiseases?.temperatureHumidity?.heatCramps?.male, physicalEnvironmentDiseases?.temperatureHumidity?.heatCramps?.female)}
          {renderConditionRow('heat cramps', physicalEnvironmentDiseases?.temperatureHumidity?.dehydration?.male, physicalEnvironmentDiseases?.temperatureHumidity?.dehydration?.female)}
          {renderConditionRow('dehydration', physicalEnvironmentDiseases?.temperatureHumidity?.heatExhaustion?.male, physicalEnvironmentDiseases?.temperatureHumidity?.heatExhaustion?.female)}
          {renderConditionRow('heat exhaustion', physicalEnvironmentDiseases?.temperatureHumidity?.others?.male, physicalEnvironmentDiseases?.temperatureHumidity?.others?.female)}
          {renderConditionRow('others', physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.chilblain?.male, physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.chilblain?.female)}
          
          {/* Cold Temperature subsection */}
          <div className="text-xs font-bold mb-0.5 mt-1">Cold Temperature:</div>
          <div className="ml-4">
            {renderConditionRow('Chilblain', physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.frostBite?.male, physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.frostBite?.female)}
            {renderConditionRow('frost bite', physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.immersionFoot?.male, physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.immersionFoot?.female)}
            {renderConditionRow('immersion foot', physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.generalHypothermia?.male, physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.generalHypothermia?.female)}
            {renderConditionRow('general hypothermia', physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.others?.male, physicalEnvironmentDiseases?.temperatureHumidity?.coldTemperature?.others?.female)}
            {renderConditionRow('others', physicalEnvironmentDiseases?.pressureAbnormalities?.decompressionSickness?.airEmbolism?.male, physicalEnvironmentDiseases?.pressureAbnormalities?.decompressionSickness?.airEmbolism?.female)}
          </div>
        </div>

        {/* c) Diseases due to Pressure Abnormalities */}
        {renderSubCategoryHeader('c)    Diseases due to Pressure')}
        <div className="ml-4 text-xs font-bold mb-0.5">Abnormalities:</div>
        <div className="ml-8">
          {/* Decompression Sickness subsection */}
          <div className="text-xs font-bold mb-0.5 mt-1">Decompression Sickness:</div>
          <div className="ml-4">
            {renderConditionRow('air embolism', physicalEnvironmentDiseases?.pressureAbnormalities?.decompressionSickness?.caissonsDisease?.male, physicalEnvironmentDiseases?.pressureAbnormalities?.decompressionSickness?.caissonsDisease?.female)}
            {renderConditionRow('caissons disease', physicalEnvironmentDiseases?.pressureAbnormalities?.barotrauma?.male, physicalEnvironmentDiseases?.pressureAbnormalities?.barotrauma?.female)}
          </div>
          {renderConditionRow('barotrauma', physicalEnvironmentDiseases?.pressureAbnormalities?.hypoxia?.male, physicalEnvironmentDiseases?.pressureAbnormalities?.hypoxia?.female)}
          {renderConditionRow('hypoxia', physicalEnvironmentDiseases?.pressureAbnormalities?.altitudeSickness?.male, physicalEnvironmentDiseases?.pressureAbnormalities?.altitudeSickness?.female)}
          {renderConditionRow('altitude sickness', physicalEnvironmentDiseases?.radiation?.cataracts?.male, physicalEnvironmentDiseases?.radiation?.cataracts?.female)}
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex items-center text-xs font-bold mb-1 text-center">
        <div className="w-1/2"></div>
        <div className="w-1/6">Male</div>
        <div className="w-1/6">Female</div>
        <div className="w-1/6">Total Number<br/>of Cases</div>
      </div>

      {/* d) Diseases due to radiation */}
      <div className="mb-2">
        {renderSubCategoryHeader('d)    Diseases due to radiation:')}
        <div className="ml-8">
          {renderConditionRow('cataracts', physicalEnvironmentDiseases?.radiation?.keratitis?.male, physicalEnvironmentDiseases?.radiation?.keratitis?.female)}
          {renderConditionRow('keratitis', physicalEnvironmentDiseases?.radiation?.burns?.male, physicalEnvironmentDiseases?.radiation?.burns?.female)}
          {renderConditionRow('burns', physicalEnvironmentDiseases?.radiation?.radiationRelatedCancers?.male, physicalEnvironmentDiseases?.radiation?.radiationRelatedCancers?.female)}
          {renderConditionRow('radiation-related cancers')}
        </div>
        {renderTotalRow()}
      </div>

      {/* Report of Occupational Accidents/Injuries */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">11. Report of Occupational Accidents/Injuries:</div>
        
        {/* Column Headers */}
        <div className="flex items-center text-xs font-bold mb-1">
          <div className="w-1/2 ml-10">Nature</div>
          <div className="w-1/6 text-center">Male</div>
          <div className="w-1/6 text-center">Female</div>
          <div className="w-1/6 text-center">Number of<br/>Cases</div>
        </div>

        {/* Accident conditions - no checkboxes */}
        <div className="ml-4">
          {renderAccidentRow('Contusion, bruises, hematoma', occupationalAccidents?.contusionBruises?.male, occupationalAccidents?.contusionBruises?.female)}
          {renderAccidentRow('Abrasions', occupationalAccidents?.abrasions?.male, occupationalAccidents?.abrasions?.female)}
          {renderAccidentRow('Cuts, lacerations, punctures', occupationalAccidents?.cuts?.male, occupationalAccidents?.cuts?.female)}
          {renderAccidentRow('Concussion', occupationalAccidents?.concussion?.male, occupationalAccidents?.concussion?.female)}
          {renderAccidentRow('Avulsion', occupationalAccidents?.avulsion?.male, occupationalAccidents?.avulsion?.female)}
        </div>
      </div>
    </div>
  );
};

export default DocumentPageFour;
