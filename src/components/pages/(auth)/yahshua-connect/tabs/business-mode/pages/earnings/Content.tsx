'use client';

import { useState } from 'react';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsChartCard from '../../components/cards/EarningsChartCard';
import TransactionDetailsModal from './TransactionDetailsModal';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import MyHiresModal from '../../components/modals/MyHiresModal';
import { useEarningsData, type Transaction } from '../../hooks/useEarningsData';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);

  const { thisMonthEarnings, jobsCompleted, weeklyData, recentPayments, reviews } = useEarningsData();
  const { activeJobs } = useMyJobsData();

  const handleSendPaymentProof = (hireId: number) => {
    // TODO: Implement payment proof upload
    console.log('Send payment proof for hire:', hireId);
  };

  // Mock hired applicants data
  const hiredApplicants = [
    {
      id: 1,
      serviceName: 'Garden Landscaping',
      providerName: 'Carlos Mendez',
      providerInitials: 'CM',
      status: 'in-progress' as const,
      price: 1500,
    },
  ];

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
  }));

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
    <>
      <YahshuaConnectHeader />
      <FloatingMenuBar />
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name="John Doe"
                title="Plumber • Electrician"
                rating={4.9}
                reviewsCount={27}
                initial="JD"
                availableForBookings={true}
                earnings={thisMonthEarnings}
                spending={12800}
                onAvailabilityChange={(isAvailable) => {
                  console.log('Availability changed:', isAvailable);
                }}
              />
              <QuickActionsCard
                actions={[
                  {
                    icon: CalendarIcon,
                    label: 'Upcoming Bookings',
                    count: activeJobs.length,
                    badgeColor: 'purple',
                    onClick: () => setIsUpcomingBookingsModalOpen(true),
                  },
                  {
                    icon: UserGroupIcon,
                    label: 'My Hires',
                    onClick: () => setIsMyHiresModalOpen(true),
                  },
                ]}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
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

              {/* Weekly Breakdown - Using Chart */}
              <EarningsChartCard data={weeklyData} />

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
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
        onDownloadReceipt={handleDownloadReceipt}
      />

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
      />

      {/* My Hires Modal */}
      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
      />
    </>
  );
};

export default Content;



