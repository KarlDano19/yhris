'use client';

import { useState } from 'react';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import SpendingChartCard from '../../components/cards/SpendingChartCard';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import MyHiresModal from '../../components/modals/MyHiresModal';
import JobChatModal from '../../components/modals/JobChatModal';
import { useSpendingData, type SpendingTransaction } from '../../hooks/useSpendingData';
import { useMyJobsData } from '../../hooks/useMyJobsData';
import { useHireData } from '../../hooks/useHireData';

const Content = () => {
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

  const { totalSpentThisMonth, servicesHired, weeklySpendingData, recentPayments } = useSpendingData();
  const { activeJobs } = useMyJobsData();
  const { hiredApplicants } = useHireData();

  const handleSendPaymentProof = (hireId: number) => {
    // TODO: Implement payment proof upload
    console.log('Send payment proof for hire:', hireId);
  };

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
    clientInitials: job.clientInitials,
  }));

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
                earnings={45230}
                spending={totalSpentThisMonth}
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
              {/* Spending Title */}
              <h2 className="text-xl font-bold text-gray-900">Spending on Hires</h2>

              {/* Spending Summary Cards - Separate Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-600 mb-2">Total Spent This Month</p>
                  <p className="text-3xl font-bold text-orange-600" title={`₱${totalSpentThisMonth.toLocaleString()}`}>
                    {formatAmount(totalSpentThisMonth)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-600 mb-2">Services Hired</p>
                  <p className="text-3xl font-bold text-blue-600">{servicesHired}</p>
                </div>
              </div>

              {/* Weekly Spending - Using Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <SpendingChartCard data={weeklySpendingData} />
              </div>

              {/* Recent Payments Made */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Payments Made</h2>
                <div className="divide-y divide-gray-200">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {payment.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(payment.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">
                          ₱{payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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


