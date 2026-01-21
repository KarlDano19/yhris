
import Modal from '../components/Modal';

interface HiredApplicant {
  id: number;
  jobPostingId: number;
  serviceName: string;
  providerName: string;
  providerInitials?: string;
  status: 'in-progress' | 'completed' | 'pending';
  price: number;
}

interface MyHiresModalProps {
  isOpen: boolean;
  onClose: () => void;
  hires: HiredApplicant[];
  onViewHire: (jobPostingId: number) => void;
}

const MyHiresModal = ({
  isOpen,
  onClose,
  hires,
  onViewHire,
}: MyHiresModalProps) => {
  // Generate initials from provider name if not provided
  const getInitials = (name: string, initials?: string) => {
    if (initials) return initials;
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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

