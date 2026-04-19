import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import WarningRed from '@/svg/WarningRed';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: 'book' | 'message' | 'proposal';
  tab?: 'gig-opportunities' | 'hire-talent';
}

const LoginRequiredModal = ({ isOpen, onClose, action = 'book', tab }: LoginRequiredModalProps) => {
  if (!isOpen) return null;

  const getActionText = () => {
    switch (action) {
      case 'book':
        return 'book this talent';
      case 'message':
        return 'message this talent';
      case 'proposal':
        return 'send a proposal for this gig';
      default:
        return 'perform this action';
    }
  };

  const actionText = getActionText();

  // Determine color palette based on tab (warning icon is always red)
  const isGigOpportunities = tab === 'gig-opportunities';
  const primaryColorClasses = {
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    buttonBg: isGigOpportunities ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700',
    buttonBorder: isGigOpportunities ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-green-600 text-green-600 hover:bg-green-50',
  };

  return (
    <div className="fixed inset-0 z-[10000]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${primaryColorClasses.iconBg} mb-4`}>
              <WarningRed className="h-10 w-10" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Login Required
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              You need to be logged in as an applicant to {actionText}. Please log in or create an account to continue.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/applicant/login"
                className={`flex-1 px-4 py-2.5 ${primaryColorClasses.buttonBg} text-white rounded-lg font-semibold transition-colors text-center`}
                onClick={onClose}
              >
                Log In
              </Link>
              <Link
                href="/applicant/register"
                className={`flex-1 px-4 py-2.5 border ${primaryColorClasses.buttonBorder} bg-white rounded-lg font-semibold transition-colors text-center`}
                onClick={onClose}
              >
                Create Account
              </Link>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;

