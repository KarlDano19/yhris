'use client';

type T_OnboardingChecklist = {
  id: number;
  name: string;
  description: string;
  video_url?: string;
};

type T_OnboardingPhase = {
  id: number;
  name: string;
  description: string;
  checklists: T_OnboardingChecklist[];
};

type ChecklistGroupProps = {
  phase: T_OnboardingPhase;
};

const ChecklistGroup = ({ phase }: ChecklistGroupProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800">{phase.name}</h3>
        {phase.description && <p className="text-xs text-gray-500 mt-0.5">{phase.description}</p>}
      </div>

      <div className="space-y-2">
        {phase.checklists.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              {item.description && (
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistGroup;
