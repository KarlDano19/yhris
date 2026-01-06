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
import JobChatModal from '../../components/modals/JobChatModal';
import { useEarningsData, type Transaction } from '../../hooks/useEarningsData';
import { useMyJobsData } from '../../hooks/useMyJobsData';
import { useHireData } from '../../hooks/useHireData';
import { useJobState } from '../../contexts/JobStateContext';
import { useHomeData } from '../../hooks/useHomeData';

const Content = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
  } | null>(null);

  const { thisMonthEarnings, jobsCompleted, weeklyData, recentPayments, reviews } = useEarningsData();
  const { activeJobs } = useMyJobsData();
  const { hiredApplicants } = useHireData();
  const { acceptedJobIds } = useJobState();
  const { jobRequests } = useHomeData();

  const handleSendPaymentProof = (hireId: number) => {
    // TODO: Implement payment proof upload
    console.log('Send payment proof for hire:', hireId);
  };

  // Transform activeJobs for the modal, and also include newly accepted jobs from jobRequests
  const acceptedJobsFromRequests = jobRequests
    .filter((job) => acceptedJobIds.has(job.id))
    .map((job) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.clientLocation,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    }));

  // Combine activeJobs (from hardcoded data) with newly accepted jobs
  const allUpcomingBookings = [
    ...activeJobs.map((job) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.location,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    })),
    // Add newly accepted jobs that aren't already in activeJobs
    ...acceptedJobsFromRequests.filter(
      (newJob) => !activeJobs.some((existingJob) => existingJob.id === newJob.id)
    ),
  ];

  const upcomingBookings = allUpcomingBookings;

  const handleBookingMessage = (booking: {
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
  }) => {
    setSelectedBookingForMessage(booking);
    setIsUpcomingBookingsModalOpen(false);
    setIsChatModalOpen(true);
  };

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
      {/* <YahshuaConnectHeader /> */} {/* Moved to header.tsx */}
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
                    count: upcomingBookings.length,
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
        onMessage={handleBookingMessage}
      />

      {/* My Hires Modal */}
      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
      />

      {/* Chat Modal */}
      {selectedBookingForMessage && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          clientName={selectedBookingForMessage.clientName}
          clientInitials={selectedBookingForMessage.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          jobTitle={selectedBookingForMessage.title}
        />
      )}
    </>
  );
};

export default Content;



