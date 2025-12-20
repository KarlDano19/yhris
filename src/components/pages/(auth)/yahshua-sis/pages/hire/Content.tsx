'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import YahshuaSISHeader from '../../YahshuaSISHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from '../../tabs/business-mode/components/cards/ProfileCard';
import QuickActionsCard from '../../tabs/business-mode/components/cards/QuickActionsCard';
import EarningsCard from '../../tabs/business-mode/components/cards/EarningsCard';
import BirdsEyeViewCard from '../../tabs/business-mode/components/cards/BirdsEyeViewCard';
import { ClockIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Content = () => {
  const jobPostings = [
    {
      id: 1,
      title: 'House Cleaning Service Needed',
      category: 'Cleaning',
      location: 'Carmen, CDO',
      description: 'Looking for someone to do general house cleaning.',
      date: 'Dec 20',
      time: '8:00 AM',
      priceRange: '₱500 - ₱800',
      applicants: 5,
      status: 'active',
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
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
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
              {/* Hire Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Hire Someone</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <PlusIcon className="h-5 w-5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                {/* Job Postings List */}
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {job.category} • {job.location}
                          </p>
                          <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                        </div>
                        {job.status === 'active' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {job.date}, {job.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span className="font-semibold text-green-600">{job.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors">
                          View Applicants
                        </button>
                        <button className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Edit Post
                        </button>
                      </div>
                    </div>
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
