import Modal from '../../../../../components/Modal';

import { formatDateToLocal } from '@/helpers/date';

import { BriefcaseIcon } from '@heroicons/react/24/outline';

interface StartJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  clientName: string;
  contractStartDate: string;
  contractEndDate: string | null;
  isContractual: boolean;
  onConfirm: () => void;
}

const StartJobModal = ({
  isOpen,
  onClose,
  jobTitle,
  clientName,
  contractStartDate,
  contractEndDate,
  isContractual,
  onConfirm,
}: StartJobModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Job"
      size="md"
      footerContent={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Job
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Job Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <BriefcaseIcon className="h-8 w-8 text-savoy-blue" />
          </div>
        </div>

        {/* Job Information */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900">{jobTitle}</h3>
          <p className="text-sm text-gray-600">Client: {clientName}</p>
        </div>

        {/* Contract Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Start Date:</span>
            <span className="text-sm text-gray-900">
              {formatDateToLocal(contractStartDate, true)}
            </span>
          </div>
          {contractEndDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">End Date:</span>
              <span className="text-sm text-gray-900">
                {formatDateToLocal(contractEndDate, true)}
              </span>
            </div>
          )}
          {isContractual && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Contract Duration:</span>
              <span className="text-sm text-gray-900">
                {Math.ceil(
                  (new Date(contractEndDate!).getTime() -
                    new Date(contractStartDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{' '}
                days
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            {isContractual ? (
              <>
                <span className="font-semibold">Contractual Job:</span> You will need to submit
                daily progress reports with proof of work for each day of the contract period.
              </>
            ) : (
              <>
                <span className="font-semibold">Single-Day Job:</span> After starting, you can
                upload proof of completion when you finish the work.
              </>
            )}
          </p>
        </div>

        {/* Confirmation Message */}
        <p className="text-center text-sm text-gray-600">
          Are you ready to start working on this job?
        </p>
      </div>
    </Modal>
  );
};

export default StartJobModal;

