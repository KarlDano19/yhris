import { ArrowDownTrayIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Modal from '../../../../components/Modal';

interface Transaction {
  id: number;
  description: string;
  clientName: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onDownloadReceipt: () => void;
}

const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onDownloadReceipt,
}: TransactionDetailsModalProps) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
      footerContent={
        <button
          onClick={onDownloadReceipt}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-lg transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Download Receipt</span>
        </button>
      }
    >
      {/* Transaction Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Amount */}
      <div className="text-center mb-3">
        <p className="text-4xl font-bold text-green-600">
          +₱{transaction.amount.toLocaleString()}
        </p>
      </div>

      {/* Date */}
      <div className="text-center mb-8">
        <p className="text-base text-gray-600">{formatDate(transaction.date)}</p>
      </div>

      {/* Details Section */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <div className="space-y-5">
          <div className="flex justify-between items-start">
            <span className="text-lg font-medium text-gray-500">Description</span>
            <span className="text-lg font-bold text-gray-900 text-right max-w-[65%]">
              {transaction.description} - {transaction.clientName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-500">Category</span>
            <span className="text-lg font-bold text-gray-900">{transaction.category}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;

