import Modal from '../../../../../components/Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmAcceptJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  clientName: string;
  isLoading?: boolean;
}

const ConfirmAcceptJobModal = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  clientName,
  isLoading = false,
}: ConfirmAcceptJobModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Job Application"
      size="md"
    >
      <div className="p-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accept This Job?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            You are about to apply for:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-gray-900">{jobTitle}</p>
            <p className="text-xs text-gray-600 mt-1">Client: {clientName}</p>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to submit your application for this job?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{isLoading ? 'Submitting...' : 'Yes, Accept Job'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmAcceptJobModal;
