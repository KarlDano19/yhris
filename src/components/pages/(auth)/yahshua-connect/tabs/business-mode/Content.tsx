'use client';

import { useState } from 'react';
import { FunnelIcon, BoltIcon, SparklesIcon, UserIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
// import YahshuaConnectHeader from '../../YahshuaConnectHeader'; // Moved to header.tsx
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import EarningsCard from './components/cards/EarningsCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import JobRequestCard from './components/cards/JobRequestCard';
import EarningsChartCard from './components/cards/EarningsChartCard';
import FilterRequestsModal from './components/modals/FilterRequestsModal';
import UpcomingBookingsModal from './components/modals/UpcomingBookingsModal';
import ToolsIcon from '@/svg/ToolsIcons';
import { useHomeData } from './hooks/useHomeData';
import { useMyJobsData } from './hooks/useMyJobsData';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const { activeJobs } = useMyJobsData();

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
  }));

  const { thisMonthEarnings, weeklyData, jobRequests, trendingServices } = useHomeData();

  const handleApplyFilters = (filters: {
    location: string;
    skills: string[];
    urgentOnly: boolean;
  }) => {
    // TODO: Implement filter logic
    console.log('Applied filters:', filters);
  };

  return (
    <>
      {/* <YahshuaConnectHeader /> */} {/* Moved to header.tsx */}
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
              <QuickActionsCard
                actions={[
                  {
                    icon: UserIcon,
                    label: 'Edit Profile',
                    href: '/personal-mode/business-mode/edit-profile',
                  },
                  {
                    icon: BriefcaseIcon,
                    label: 'Active Jobs',
                    count: activeJobs.length,
                    badgeColor: 'green',
                    href: '/personal-mode/business-mode/my-jobs',
                  },
                  {
                    icon: CalendarIcon,
                    label: 'Upcoming Bookings',
                    count: activeJobs.length,
                    badgeColor: 'purple',
                    onClick: () => setIsUpcomingBookingsModalOpen(true),
                  },
                  {
                    icon: CurrencyDollarIcon,
                    label: 'View Earnings',
                    href: '/personal-mode/business-mode/earnings',
                  },
                ]}
              />
            </div>
          </div>

          {/* Center Content - Single Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Nearby Job Requests */}
              <div className="bg-white rounded-lg shadow-sm  p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Nearby Job Requests</h2>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {jobRequests.map((job) => (
                    <JobRequestCard key={job.id} {...job} />
                  ))}
                </div>
              </div>

              {/* Earnings This Month */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Earnings This Month</h2>
                <EarningsChartCard data={weeklyData} showTitle={false} />
              </div>

              {/* Trending Services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Trending Services</h2>
                <div className="space-y-4">
                  {trendingServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          {service.iconType === 'tools' ? (
                            <ToolsIcon className="h-6 w-6" />
                          ) : service.iconType === 'bolt' ? (
                            <BoltIcon className="h-6 w-6 text-blue-600" />
                          ) : (
                            <SparklesIcon className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.active} active</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${service.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                          {service.change}
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

      {/* Filter Requests Modal */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
      />
    </>
  );
};

export default Content;
