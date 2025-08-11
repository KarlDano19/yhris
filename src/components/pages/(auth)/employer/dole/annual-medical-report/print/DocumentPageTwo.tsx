import React from 'react';

interface MedicalReportData {
  respiratory?: {
    laryngitis?: { male: number; female: number };
    bronchitis?: { male: number; female: number };
    bronchialAsthma?: { male: number; female: number };
    pneumonia?: { male: number; female: number };
    silicosis?: { male: number; female: number };
    pneumoconiosis?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  heartAndBloodVessel?: {
    hypertension?: { male: number; female: number };
    hypotension?: { male: number; female: number };
    anginaPectoris?: { male: number; female: number };
    myocardialInfarction?: { male: number; female: number };
    vascularDisturbances?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  gastrointestinal?: {
    gastroenteritis?: { male: number; female: number };
    amoebiasis?: { male: number; female: number };
    gastritis?: { male: number; female: number };
    appendicitis?: { male: number; female: number };
    cholecystitis?: { male: number; female: number };
    liverCirrhosis?: { male: number; female: number };
    hepaticAbscess?: { male: number; female: number };
    cancerHepatic?: { male: number; female: number };
    ulcer?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  genitoUrinary?: {
    urinaryTractInfection?: { male: number; female: number };
    stones?: { male: number; female: number };
    cancer?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  reproductive?: {
    dysmenorrhea?: { male: number; female: number };
    infectionCervicitis?: { male: number; female: number };
    abortionSpontaneous?: { male: number; female: number };
    hyperemesis?: { male: number; female: number };
    uterineTumors?: { male: number; female: number };
    cervicalPolypCancer?: { male: number; female: number };
    ovarianCyst?: { male: number; female: number };
    sexuallyTransmitted?: { male: number; female: number };
    herniaInguinal?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  neuromuscular?: {
    peripheralNeuritis?: { male: number; female: number };
    paralysis?: { male: number; female: number };
    arthritis?: { male: number; female: number };
    others?: { male: number; female: number };
  };
  lymphaticsAndCirculatory?: {
    anemia?: { male: number; female: number };
    leukemia?: { male: number; female: number };
    cerebrovascularAccidents?: { male: number; female: number };
  };
}

interface DocumentPageTwoProps {
  data: MedicalReportData;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({ data }) => {
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
      <div className="text-xs font-bold mb-0.5 mt-1">{categoryName}</div>
    );
  };

  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Column Headers */}
      <div className="flex items-center text-xs font-bold mb-1 text-center">
        <div className="w-1/2"></div>
        <div className="w-1/6">Male</div>
        <div className="w-1/6">Female</div>
        <div className="w-1/6">Total Number<br/>Of Cases</div>
      </div>

      {/* Medical Conditions */}
      <div>
        <div className="ml-4">
          {renderConditionRow('Laryngitis', data.respiratory?.laryngitis?.male, data.respiratory?.laryngitis?.female)}
          {renderConditionRow('Others', data.respiratory?.others?.male, data.respiratory?.others?.female)}
        </div>
        {/* Respiratory */}
        {renderCategoryHeader('Respiratory:')}
        <div className="ml-4">
          {renderConditionRow('Bronchitis', data.respiratory?.bronchitis?.male, data.respiratory?.bronchitis?.female)}
          {renderConditionRow('Bronchial asthma', data.respiratory?.bronchialAsthma?.male, data.respiratory?.bronchialAsthma?.female)}
          {renderConditionRow('Pneumonia', data.respiratory?.pneumonia?.male, data.respiratory?.pneumonia?.female)}
          {renderConditionRow('Tuberculosis', data.respiratory?.silicosis?.male, data.respiratory?.silicosis?.female)}
          {renderConditionRow('Pneumoconiosis', data.respiratory?.pneumoconiosis?.male, data.respiratory?.pneumoconiosis?.female)}
          {renderConditionRow('Others', data.respiratory?.others?.male, data.respiratory?.others?.female)}
        </div>

        {/* Heart and Blood Vessel */}
        {renderCategoryHeader('Heart and Blood Vessel:')}
        <div className="ml-4">
          {renderConditionRow('Hypertension', data.heartAndBloodVessel?.hypertension?.male, data.heartAndBloodVessel?.hypertension?.female)}
          {renderConditionRow('Hypotension', data.heartAndBloodVessel?.hypotension?.male, data.heartAndBloodVessel?.hypotension?.female)}
          {renderConditionRow('Angina Pectoris', data.heartAndBloodVessel?.anginaPectoris?.male, data.heartAndBloodVessel?.anginaPectoris?.female)}
          {renderConditionRow('Myocardial Infarction', data.heartAndBloodVessel?.myocardialInfarction?.male, data.heartAndBloodVessel?.myocardialInfarction?.female)}
          {renderConditionRow('Vascular disturbances in extremities due to continuous vibration', data.heartAndBloodVessel?.vascularDisturbances?.male, data.heartAndBloodVessel?.vascularDisturbances?.female)}
          {renderConditionRow('Others', data.heartAndBloodVessel?.others?.male, data.heartAndBloodVessel?.others?.female)}
        </div>

        {/* Gastrointestinal */}
        {renderCategoryHeader('Gastrointestinal:')}
        <div className="ml-4">
          {renderConditionRow('gastroenteritis/diarrhea', data.gastrointestinal?.gastroenteritis?.male, data.gastrointestinal?.gastroenteritis?.female)}
          {renderConditionRow('amoebiasis', data.gastrointestinal?.amoebiasis?.male, data.gastrointestinal?.amoebiasis?.female)}
          {renderConditionRow('gastritis/hyperacidity', data.gastrointestinal?.gastritis?.male, data.gastrointestinal?.gastritis?.female)}
          {renderConditionRow('appendicitis', data.gastrointestinal?.appendicitis?.male, data.gastrointestinal?.appendicitis?.female)}
          {renderConditionRow('infectious hepatitis', data.gastrointestinal?.cholecystitis?.male, data.gastrointestinal?.cholecystitis?.female)}
          {renderConditionRow('liver cirrhosis', data.gastrointestinal?.liverCirrhosis?.male, data.gastrointestinal?.liverCirrhosis?.female)}
          {renderConditionRow('hepatic abscess', data.gastrointestinal?.hepaticAbscess?.male, data.gastrointestinal?.hepaticAbscess?.female)}
          {renderConditionRow('cancer (hepatic/gastric)', data.gastrointestinal?.cancerHepatic?.male, data.gastrointestinal?.cancerHepatic?.female)}
          {renderConditionRow('ulcer', data.gastrointestinal?.ulcer?.male, data.gastrointestinal?.ulcer?.female)}
          {renderConditionRow('Others', data.gastrointestinal?.others?.male, data.gastrointestinal?.others?.female)}
        </div>

        {/* Genito Urinary */}
        {renderCategoryHeader('Genito Urinary:')}
        <div className="ml-4">
          {renderConditionRow('Urinary tract infection', data.genitoUrinary?.urinaryTractInfection?.male, data.genitoUrinary?.urinaryTractInfection?.female)}
          {renderConditionRow('Stones', data.genitoUrinary?.stones?.male, data.genitoUrinary?.stones?.female)}
          {renderConditionRow('Cancer', data.genitoUrinary?.cancer?.male, data.genitoUrinary?.cancer?.female)}
          {renderConditionRow('Others', data.genitoUrinary?.others?.male, data.genitoUrinary?.others?.female)}
        </div>

        {/* Reproductive */}
        {renderCategoryHeader('Reproductive:')}
        <div className="ml-4">
          {renderConditionRow('Dysmenorrhea', data.reproductive?.dysmenorrhea?.male, data.reproductive?.dysmenorrhea?.female)}
          {renderConditionRow('Infection (Cervicitis) (Vaginitis)', data.reproductive?.infectionCervicitis?.male, data.reproductive?.infectionCervicitis?.female)}
          {renderConditionRow('Abortion (Spontaneous) (Threatened)', data.reproductive?.abortionSpontaneous?.male, data.reproductive?.abortionSpontaneous?.female)}
          {renderConditionRow('Hyperemesis Gravidarium', data.reproductive?.hyperemesis?.male, data.reproductive?.hyperemesis?.female)}
          {renderConditionRow('Uterine Tumors', data.reproductive?.uterineTumors?.male, data.reproductive?.uterineTumors?.female)}
          {renderConditionRow('Cervical Polyp/Cancer', data.reproductive?.cervicalPolypCancer?.male, data.reproductive?.cervicalPolypCancer?.female)}
          {renderConditionRow('Ovarian Cyst/Tumors', data.reproductive?.ovarianCyst?.male, data.reproductive?.ovarianCyst?.female)}
          {renderConditionRow('Sexually-Transmitted diseases', data.reproductive?.sexuallyTransmitted?.male, data.reproductive?.sexuallyTransmitted?.female)}
          {renderConditionRow('Hernia (Inguinal) (Femoral)', data.reproductive?.herniaInguinal?.male, data.reproductive?.herniaInguinal?.female)}
          {renderConditionRow('Others', data.reproductive?.others?.male, data.reproductive?.others?.female)}
        </div>

        {/* Neuromuscular/Skeletal/Joints */}
        {renderCategoryHeader('Neuromuscular/Skeletal/Joints:')}
        <div className="ml-4">
          {renderConditionRow('Peripheral Neuritis', data.neuromuscular?.peripheralNeuritis?.male, data.neuromuscular?.peripheralNeuritis?.female)}
          {renderConditionRow('Torticollis', data.neuromuscular?.paralysis?.male, data.neuromuscular?.paralysis?.female)}
          {renderConditionRow('Arthritis', data.neuromuscular?.arthritis?.male, data.neuromuscular?.arthritis?.female)}
          {renderConditionRow('Others', data.neuromuscular?.others?.male, data.neuromuscular?.others?.female)}
        </div>

        {/* Lymphatics and Circulatory */}
        {renderCategoryHeader('Lymphatics and Circulatory:')}
        <div className="ml-4">
          {renderConditionRow('Anemia', data.lymphaticsAndCirculatory?.anemia?.male, data.lymphaticsAndCirculatory?.anemia?.female)}
          {renderConditionRow('Leukemia', data.lymphaticsAndCirculatory?.leukemia?.male, data.lymphaticsAndCirculatory?.leukemia?.female)}
          {renderConditionRow('Cerebrovascular Accidents', data.lymphaticsAndCirculatory?.cerebrovascularAccidents?.male, data.lymphaticsAndCirculatory?.cerebrovascularAccidents?.female)}
        </div>
      </div>
    </div>
  );
};

export default DocumentPageTwo;
