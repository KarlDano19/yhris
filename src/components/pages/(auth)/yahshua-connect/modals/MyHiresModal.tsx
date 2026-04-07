
import Modal from '../components/Modal';
import { T_HiredApplicant } from '@/types/business-mode';

interface MyHiresModalProps {
  isOpen: boolean;
  onClose: () => void;
  hires: T_HiredApplicant[];
  onViewHire: (jobPostingId: number) => void;
  onSendPaymentProof?: (hireId: number) => void;
}

const MyHiresModal = ({
  isOpen,
  onClose,
  hires,
  onViewHire,
}: MyHiresModalProps) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString()}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Hires"
      size="2xl"
    >
      <div className="max-h-[70vh] overflow-y-auto -mx-5 px-5">
        <div className="space-y-4">
          {hires.map((hire) => (
            <div
              key={hire.id}
              onClick={() => onViewHire(hire.jobPostingId)}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-savoy-blue transition-all"
            >
              {/* Service Name and Status */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-base font-bold text-gray-900">
                  {hire.serviceName}
                </h4>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    hire.status
                  )}`}
                >
                  {hire.status}
                </span>
              </div>

              {/* Provider Name */}
              <p className="text-sm text-gray-600 mb-3">
                Provider: {hire.providerName}
              </p>

              {/* Price */}
              <p className="text-base font-semibold text-orange-600 mb-3">
                {formatPrice(hire.price)}
              </p>

              {/* View Details Indicator */}
              <div className="text-sm text-savoy-blue font-medium">
                View Details →
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default MyHiresModal;

