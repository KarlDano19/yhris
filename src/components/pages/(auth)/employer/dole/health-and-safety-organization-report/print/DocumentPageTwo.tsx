import React from 'react';

interface SafetyCommitteeData {
  generalRequirement: string;
  safetyCommitteeTypes: {
    typeA: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeB: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeC: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeD: {
      workerRange: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
    typeE: {
      description: string;
      chairman: string;
      members: string[];
      secretary: string;
    };
  };
}

interface DocumentPageTwoProps {
  data: SafetyCommitteeData;
}

const DocumentPageTwo: React.FC<DocumentPageTwoProps> = ({ data }) => {
  return (
    <div className="bg-white text-black font-sans text-sm leading-tight max-w-4xl mx-auto p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="text-center mb-3">
        <div className="text-sm">Republic of the Philippines</div>
        <div className="text-sm font-bold">DEPARTMENT OF LABOR AND EMPLOYMENT</div>
        <div className="text-sm font-bold">CORDILLERA ADMINISTRATIVE REGION</div>
        <div className="text-sm">Baguio City</div>
      </div>

      {/* Subject Line */}
      <div className="text-center mb-2">
        <div className="text-sm font-bold">ORGANIZATION OF SAFETY COMMITTEE</div>
      </div>

      {/* General Requirement Section */}
      <div className="mb-2">
        <div className="text-sm font-bold mb-2">GENERAL REQUIREMENT:</div>
        <div className="text-sm leading-relaxed">
          A safety committee must be organized within sixty (60) days after the standards take effect, or within one (1) month for new establishments from the start of business operations. In both cases, the Safety Committee is required to reorganize every January of the following year.
        </div>
      </div>

      {/* Type and Composition of Safety Committee Section */}
      <div className="mb-2">
        <div className="text-sm font-bold mb-3">Type and Composition of Safety Committee</div>
        
        {/* TYPE A */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">TYPE A: For workplaces having over four hundred (400) workers.</div>
          <div className="ml-4 space-y-1">
            <div className="text-sm">
              <span className="font-bold">Chairman:</span> The Manager or authorized representative.
            </div>
            <div className="text-sm">
              <span className="font-bold">Members:</span>
            </div>
            <div className="text-sm ml-4">• Two workers (who must be union workers) and the company physician.</div>
            <div className="text-sm">
              <span className="font-bold">Secretary:</span> The safety man.
            </div>
          </div>
        </div>

        {/* TYPE B */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">TYPE B: For workplaces having 200 - 400 workers.</div>
          <div className="ml-4 space-y-1">
            <div className="text-sm">
              <span className="font-bold">Chairman:</span> The Manager or his authorized representative.
            </div>
            <div className="text-sm">
              <span className="font-bold">Members:</span>
            </div>
            <div className="text-sm ml-4">• One supervisor, one worker, and the company physician or company nurse.</div>
            <div className="text-sm">
              <span className="font-bold">Secretary:</span> The safety man.
            </div>
          </div>
        </div>

        {/* TYPE C */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">TYPE C: For workplaces having 100 - 200 workers.</div>
          <div className="ml-4 space-y-1">
            <div className="text-sm">
              <span className="font-bold">Chairman:</span> The Manager of his authorized representative.
            </div>
            <div className="text-sm">
              <span className="font-bold">Members:</span>
            </div>
            <div className="text-sm ml-4">• One foreman, one worker, and the first aider.</div>
            <div className="text-sm">
              <span className="font-bold">Secretary:</span> Appointed by the chairman.
            </div>
          </div>
        </div>

        {/* TYPE D */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">TYPE D: For workplaces with less than 100 workers.</div>
          <div className="ml-4 space-y-1">
            <div className="text-sm">
              <span className="font-bold">Chairman:</span> Manager.
            </div>
            <div className="text-sm">
              <span className="font-bold">Members:</span>
            </div>
            <div className="text-sm ml-4">• One foreman and one worker.</div>
            <div className="text-sm">
              <span className="font-bold">Secretary:</span> Appointed by the Chairman.
            </div>
          </div>
        </div>

        {/* TYPE E */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">TYPE E: Joint Committee</div>
          <div className="text-sm mb-2">
            This type is for situations where two or more establishments are housed under one building, and their individual safety committees organize themselves into a joint coordination committee to plan and implement activities.
          </div>
          <div className="ml-4 space-y-1">
            <div className="text-sm">
              <span className="font-bold">Chairman:</span> The chairman of an established committee.
            </div>
            <div className="text-sm">
              <span className="font-bold">Members:</span>
            </div>
            <div className="text-sm ml-4">• Two supervisors from two different establishments.</div>
            <div className="text-sm">
              <span className="font-bold">Secretary:</span> Appointed by the Chairman (with a note that in high-rise buildings, the secretary shall be the building administrator).
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm absolute bottom-4 left-4">
        <div>fn:sc-form</div>
        <div>06152006 che</div>
      </div>
    </div>
  );
};

export default DocumentPageTwo;
