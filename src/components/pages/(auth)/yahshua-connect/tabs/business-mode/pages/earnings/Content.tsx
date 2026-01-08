'use client';

import { useState } from 'react';
import TransactionDetailsModal from './TransactionDetailsModal';

interface Transaction {
  id: number;
  description: string;
  clientName: string;
  amount: number;
  date: string;
  category: string;
}

const Content = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data
  const thisMonthEarnings = 45230;
  const jobsCompleted = 23;

  const weeklyData = [
    { day: 'W1', amount: 12500 },
    { day: 'W2', amount: 9800 },
    { day: 'W3', amount: 15200 },
    { day: 'W4', amount: 7700 },
  ];

  const recentPayments: Transaction[] = [
    {
      id: 1,
      description: 'Fix Leaking Sink',
      clientName: 'Maria Santos',
      amount: 1000,
      date: '2025-12-12',
      category: 'Service',
    },
    {
      id: 2,
      description: 'Install Ceiling Fan',
      clientName: 'Juan Cruz',
      amount: 750,
      date: '2025-12-10',
      category: 'Service',
    },
  ];

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Downloading receipt for transaction:', selectedTransaction?.id);
    // You can implement the actual download logic here
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format amount with K notation if >= 1000
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      // Show one decimal place if needed, otherwise no decimal
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}K`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Earnings Title */}
      <h2 className="text-xl font-bold text-gray-900">Earnings</h2>

      {/* Earnings Summary Cards - Separate Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-2">This Month</p>
          <p className="text-3xl font-bold text-green-600" title={`₱${thisMonthEarnings.toLocaleString()}`}>
            {formatAmount(thisMonthEarnings)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-2">Jobs Completed</p>
          <p className="text-3xl font-bold text-blue-600">{jobsCompleted}</p>
        </div>
      </div>

      {/* Weekly Breakdown Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Breakdown</h3>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((item, index) => {
            const maxAmount = Math.max(...weeklyData.map((d) => d.amount));
            const height = (item.amount / maxAmount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`₱${item.amount.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Payments</h2>
        <div className="divide-y divide-gray-200">
          {recentPayments.map((payment, index) => (
            <button
              key={payment.id}
              onClick={() => handleTransactionClick(payment)}
              className="w-full flex items-center justify-between py-4 hover:bg-gray-50 transition-colors text-left first:pt-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {payment.description} - {payment.clientName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(payment.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  +₱{payment.amount.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Page-specific Modals */}
      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </div>
  );
};

export default Content;



