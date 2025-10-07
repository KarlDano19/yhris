import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface PipelineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  pipelineInfo: string;
  numberOfApplicants: number;
  pipelineData?: { [stageTitle: string]: number };
}

const PipelineInfoModal: React.FC<PipelineInfoModalProps> = ({
  isOpen,
  onClose,
  role,
  pipelineInfo,
  numberOfApplicants,
  pipelineData
}) => {
  if (!isOpen) return null;

  // Parse the pipeline information into stages
  const parsePipelineStages = (pipelineInfo: string, pipelineData?: { [stageTitle: string]: number }) => {
    if (numberOfApplicants === 0) {
      return [{ stage: 'No applicants yet', count: 0 }];
    }

    if (pipelineData) {
      return Object.entries(pipelineData).map(([stage, count]) => ({
        stage,
        count
      }));
    }

    // Fallback: parse from the pipelineInfo string
    if (pipelineInfo.includes(':')) {
      return pipelineInfo.split(', ').map(item => {
        const [stage, count] = item.split(': ');
        return {
          stage: stage.trim(),
          count: parseInt(count.trim()) || 0
        };
      });
    }

    return [{ stage: pipelineInfo, count: numberOfApplicants }];
  };

  const stages = parsePipelineStages(pipelineInfo, pipelineData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pipeline Details</h2>
            <p className="text-sm text-gray-600 mt-1">{role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {numberOfApplicants === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">No applicants yet</div>
              <p className="text-gray-400 text-sm mt-2">This job posting hasn't received any applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">Total Applicants</span>
                  <span className="text-blue-900 font-bold text-lg">{numberOfApplicants}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Pipeline Stages</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {stages.map((stage, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-gray-600 font-semibold">{stage.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Total in Pipeline</span>
                  <span className="text-green-900 font-bold">
                    {stages.reduce((sum, stage) => sum + stage.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipelineInfoModal;