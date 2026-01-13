'use client';

import { useState } from 'react';
import UpcomingBookingsModal from '../../../../modals/UpcomingBookingsModal';
import MyHiresModal from '../../../../modals/MyHiresModal';
import ChatModal from '@/components/common/chat/ChatModal';

interface SpendingTransaction {
  id: number;
  description: string;
  providerName: string;
  amount: number;
  date: string;
  category: string;
}

interface HiredApplicant {
  id: number;
  serviceName: string;
  providerName: string;
  providerInitials: string;
  status: 'pending' | 'in-progress' | 'completed';
  price: number;
}

const Content = () => {
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
    location: string;
    time: string;
    priceRange: string;
  } | null>(null);

  // Spending Data
  const totalSpentThisMonth = 12800;
  const servicesHired = 2;

  const weeklySpendingData = [
    { day: 'W1', amount: 2500 },
    { day: 'W2', amount: 800 },
    { day: 'W3', amount: 3200 },
    { day: 'W4', amount: 1500 },
  ];

  const recentPayments: SpendingTransaction[] = [
    {
      id: 1,
      description: 'Hired: Home Cleaning Service',
      providerName: 'Ana Garcia',
      amount: 800,
      date: '2025-12-03',
      category: 'Service',
    },
    {
      id: 2,
      description: 'Hired: Garden Landscaping',
      providerName: 'Carlos Mendez',
      amount: 1500,
      date: '2025-12-01',
      category: 'Service',
    },
  ];

  // Active Jobs (accepted/scheduled jobs only)
  const activeJobs = [
    {
      id: 1,
      title: 'Fix Leaking Kitchen Sink',
      clientName: 'Maria Santos',
      clientInitials: 'MS',
      location: 'Carmen, Cagayan de Oro',
      time: 'Today, 2:00 PM',
      priceRange: '₱800 - ₱1,200',
      status: 'accepted',
      urgent: true,
    },
  ];

  // Hired Applicants
  const hiredApplicants: HiredApplicant[] = [
    {
      id: 1,
      serviceName: 'Garden Landscaping',
      providerName: 'Carlos Mendez',
      providerInitials: 'CM',
      status: 'in-progress',
      price: 1500,
    },
    {
      id: 2,
      serviceName: 'House Cleaning',
      providerName: 'Ana Garcia',
      providerInitials: 'AG',
      status: 'completed',
      price: 800,
    },
    {
      id: 3,
      serviceName: 'Install Ceiling Fan',
      providerName: 'Pedro Santos',
      providerInitials: 'PS',
      status: 'pending',
      price: 700,
    },
  ];

  const handleSendPaymentProof = (hireId: number) => {
    // TODO: Implement payment proof upload
    console.log('Send payment proof for hire:', hireId);
  };

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientId: job.id, // Using job id as client id (mock data)
    clientName: job.clientName,
    clientInitials: job.clientInitials,
    clientPhoto: null, // Mock data doesn't have photos
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
  }));

  const handleBookingMessage = (booking: {
    id: number;
    title: string;
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
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

        {/* Weekly Spending Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Spending</h3>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklySpendingData.map((item, index) => {
              const maxAmount = Math.max(...weeklySpendingData.map((d) => d.amount));
              const height = (item.amount / maxAmount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-orange-500 rounded-t transition-all hover:bg-orange-600"
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
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          recipientId={selectedBookingForMessage.clientId}
          recipientName={selectedBookingForMessage.clientName}
          recipientInitials={selectedBookingForMessage.clientInitials}
          recipientPhoto={selectedBookingForMessage.clientPhoto}
          jobId={selectedBookingForMessage.id}
          jobTitle={selectedBookingForMessage.title}
        />
      )}
    </>
  );
};

export default Content;


