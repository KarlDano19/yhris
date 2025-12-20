'use client';

import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import YahshuaSISHeader from '../../../../YahshuaSISHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsCard from '../../components/cards/EarningsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import JobRequestCard from '../../components/cards/JobRequestCard';

const Content = () => {
  const [showFilters, setShowFilters] = useState(false);

  const jobRequests = [
    {
      id: 1,
      title: 'Fix Leaking Kitchen Sink',
      clientName: 'MS Maria Santos',
      clientLocation: 'Carmen, Cagayan de Oro',
      distance: '0.8 km',
      rating: 4.8,
      hiresCount: 12,
      description: 'Kitchen sink has been leaking for 2 days. Need immediate repair. All materials provided.',
      time: 'Today, 2:00 PM',
      priceRange: '₱800 - ₱1,200',
      tags: ['Plumbing'],
      urgent: true,
    },
    {
      id: 2,
      title: 'Install Ceiling Fan',
      clientName: 'JC Juan Cruz',
      clientLocation: 'Gusa, Cagayan de Oro',
      distance: '1.5 km',
      rating: 5.0,
      hiresCount: 8,
      description: 'Need electrician to install new ceiling fan in living room. Fan already purchased.',
      time: 'Tomorrow, 9:00 AM',
      priceRange: '₱600 - ₱900',
      tags: ['Electrical'],
      urgent: false,
    },
  ];

  const reviews = [
    {
      id: 1,
      reviewerName: 'Maria Santos',
      reviewerInitials: 'MS',
      role: 'Client',
      quote: 'Excellent work!',
      date: 'Dec 2025',
      rating: 5,
    },
    {
      id: 2,
      reviewerName: 'Juan Cruz',
      reviewerInitials: 'JC',
      role: 'Client',
      quote: 'Great service!',
      date: 'Nov 2025',
      rating: 5,
    },
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
              <EarningsCard thisMonth={45230} jobsDone={23} />
              <QuickActionsCard />
              <BirdsEyeViewCard
                userName="John Doe"
                userInitial="JD"
                rating={4.9}
                reviewCount={27}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Find Work Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Find Work</h2>
                    <p className="text-sm text-gray-600">Browse available job requests near you</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </button>
                </div>

                {/* Job Requests List */}
                <div className="space-y-4">
                  {jobRequests.map((job) => (
                    <JobRequestCard key={job.id} {...job} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
