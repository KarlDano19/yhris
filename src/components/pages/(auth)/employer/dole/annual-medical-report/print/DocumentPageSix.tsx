import React from 'react';

interface PhysicalHazardsOthers {
  substance?: string;
  workers?: number;
}

interface BiologicalHazards {
  viral?: { substance: string; workers: number };
  bacterial?: { substance: string; workers: number };
  fungal?: { substance: string; workers: number };
  parasitic?: { substance: string; workers: number };
  others?: { substance: string; workers: number };
}

interface ErgonomicStress {
  exhaustingPhysicalWork?: { substance: string; workers: number };
  prolongedStanding?: { substance: string; workers: number };
  excessiveMentalEffort?: { substance: string; workers: number };
  unfavorableWorkPosture?: { substance: string; workers: number };
  staticMonotonousWork?: { substance: string; workers: number };
  othersSpecify?: { substance: string; workers: number };
}

interface DocumentPageSixProps {
  physicalHazardsOthers?: PhysicalHazardsOthers;
  biologicalHazards?: BiologicalHazards;
  ergonomicStress?: ErgonomicStress;
  submittedBy?: {
    name?: string;
    signature?: string;
    date?: string;
  };
  notedBy?: {
    employer?: string;
    signature?: string;
    date?: string;
  };
}

const DocumentPageSix: React.FC<DocumentPageSixProps> = ({
  physicalHazardsOthers,
  biologicalHazards,
  ergonomicStress,
  submittedBy,
  notedBy,
}) => {
  return (
    <div className="text-black bg-white font-sans text-xs leading-tight max-w-4xl mx-auto p-4">
      {/* Continuation - Others (Please specify) */}
      <div className="mb-2 ml-4">
        <div className="flex items-center mb-0.5">
          <div className="w-2/3 flex items-center">
            <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
            <span className="ml-1 w-48">Others (Please specify)</span>
            <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
              {physicalHazardsOthers?.substance || ''}
            </div>
          </div>
          <div className="w-1/3 text-center">
            <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
              {physicalHazardsOthers?.workers || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Biological Hazards */}
      <div className="mb-2 ml-4">
        <div className="text-xs font-bold mb-0.5">c) Biological Hazards:</div>
        <div className="text-xs">
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Viral</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {biologicalHazards?.viral?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {biologicalHazards?.viral?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Bacterial</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {biologicalHazards?.bacterial?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {biologicalHazards?.bacterial?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Fungal</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {biologicalHazards?.fungal?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {biologicalHazards?.fungal?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Parasitic</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {biologicalHazards?.parasitic?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {biologicalHazards?.parasitic?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Others</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {biologicalHazards?.others?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {biologicalHazards?.others?.workers || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ergonomic Stress */}
      <div className="mb-2 ml-4">
        <div className="text-xs font-bold mb-0.5">d) Ergonomic Stress:</div>
        <div className="text-xs">
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Exhausting physical work</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.exhaustingPhysicalWork?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.exhaustingPhysicalWork?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Prolonged standing</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.prolongedStanding?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.prolongedStanding?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Excessive mental effort</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.excessiveMentalEffort?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.excessiveMentalEffort?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Unfavorable work posture</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.unfavorableWorkPosture?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.unfavorableWorkPosture?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Static/monotonous work</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.staticMonotonousWork?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.staticMonotonousWork?.workers || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-0.5">
            <div className="w-2/3 flex items-center">
              <span className="w-6 text-center">(<span className="text-xs text-white">{'✓'}</span>)</span>
              <span className="ml-1 w-48">Others, specify</span>
              <div className="border-b border-black flex-1 min-h-[1rem] text-xs">
                {ergonomicStress?.othersSpecify?.substance || ''}
              </div>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-black mx-4 min-h-[1rem] text-xs">
                {ergonomicStress?.othersSpecify?.workers || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-8 space-y-6">
        {/* Submitted by */}
        <div>
          <div className="text-xs font-bold mb-2">Submitted by:</div>
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-8">
              <div className="text-center relative">
                {submittedBy?.signature && (
                  <div className="absolute w-full right-3 -top-7 z-10">
                    <img 
                      src={submittedBy.signature} 
                      alt="Signature" 
                      style={{ 
                        height: '48px', 
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto'
                      }} 
                    />
                  </div>
                )}
                <div className="text-center border-b-2 mb-1 border-black">
                  {submittedBy?.name || ''}
                </div>
              </div>
              <div className="text-xs text-center">Prepared by</div>
            </div>
            <div className="w-1/3">
              <div className="text-center border-b-2 border-black mb-1">
                {submittedBy?.date || ''}
              </div>
              <div className="text-xs text-center">Date</div>
            </div>
          </div>
        </div>

        {/* Noted by */}
        <div>
          <div className="text-xs font-bold mb-2">Noted by:</div>
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-8">
              <div className="text-center relative">
                {notedBy?.signature && (
                  <div className="absolute w-full right-3 -top-7 z-10">
                    <img 
                      src={notedBy.signature} 
                      alt="Signature" 
                      style={{ 
                        height: '48px', 
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto'
                      }} 
                    />
                  </div>
                )}
                <div className="text-center border-b-2 mb-1 border-black">
                  {notedBy?.employer || ''}
                </div>
              </div>
              <div className="text-xs text-center">Noted by</div>
            </div>
            <div className="w-1/3">
              <div className="text-center border-b-2 border-black mb-1">
                {notedBy?.date || ''}
              </div>
              <div className="text-xs text-center">Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPageSix;
