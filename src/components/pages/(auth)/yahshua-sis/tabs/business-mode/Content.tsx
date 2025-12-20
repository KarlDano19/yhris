'use client';

import YahshuaSISHeader from '../../YahshuaSISHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import EarningsCard from './components/cards/EarningsCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import JobRequestCard from './components/cards/JobRequestCard';
import EarningsChartCard from './components/cards/EarningsChartCard';
import UpcomingBookingsCard from './components/cards/UpcomingBookingsCard';
import ReviewsCard from './components/cards/ReviewsCard';

const Content = () => {
  const jobRequests = [
    {
      id: 1,
      title: 'Fix Leaking Kitchen Sink',
      clientName: 'Marla Santos',
      clientLocation: 'Carmen, Cagayan de Oro',
      distance: '0.8 km',
      rating: 4.8,
      hiresCount: 12,
      description: 'Kitchen sink has been leaking for 2 days. Need immediate repair. All materials provided.',
      time: 'Today, 2:00 PM - 4:00 PM',
      priceRange: '₱900 - ₱1,200',
      tags: ['Plumbing', 'Sink Repair'],
      urgent: true,
    },
    {
      id: 2,
      title: 'Install Ceiling Fan',
      clientName: 'Juan Cruz',
      clientLocation: 'Gusa',
      distance: '1.5 km away',
      rating: 5,
      hiresCount: 8,
      description: 'Need electrician to install new ceiling fan in living room. Fan already purchased.',
      time: 'Dec 2, 9:00 AM',
      priceRange: '₱500 - ₱800',
      tags: ['Electrical', 'Installation'],
      urgent: false,
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      title: 'Fix Leaking Sink',
      client: 'Marla Santos',
      location: 'Carmen',
      time: 'Today, 2:00 PM',
      price: 1000,
    },
    {
      id: 2,
      title: 'Install Ceiling Fan',
      client: 'Juan Cruz',
      location: 'Gusa',
      time: 'Dec 2, 9:00 AM',
      price: 750,
    },
  ];

  const recentReviews = [
    {
      id: 1,
      clientName: 'Maria Santos',
      clientInitials: 'MS',
      rating: 5,
      comment: 'Excellent work! Very professional and fixed the problem quickly.',
      date: '2 days ago',
    },
  ];

  const weeklyData = [
    { day: 'W1', amount: 8500 },
    { day: 'W2', amount: 11200 },
    { day: 'W3', amount: 14800 },
    { day: 'W4', amount: 10730 },
  ];

  return (
    <>
      <YahshuaSISHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Three Column Layout */}
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
              />
              <EarningsCard
                thisMonth={45230}
                jobsDone={23}
              />
              <QuickActionsCard />
            </div>
          </div>

          {/* Center Content - Single Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Nearby Job Requests */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Nearby Job Requests</h2>
                    <p className="text-sm text-gray-600">Based on your location and skills</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {jobRequests.map((job) => (
                    <JobRequestCard key={job.id} {...job} />
                  ))}
                </div>
              </div>

              {/* Earnings Chart */}
              <EarningsChartCard data={weeklyData} />

              {/* Upcoming Bookings */}
              <UpcomingBookingsCard bookings={upcomingBookings} />

              {/* Reviews */}
              <ReviewsCard reviews={recentReviews} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
