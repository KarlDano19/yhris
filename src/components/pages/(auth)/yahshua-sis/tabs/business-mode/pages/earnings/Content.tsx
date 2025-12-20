'use client';

import { useState } from 'react';
import YahshuaSISHeader from '../../../../YahshuaSISHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsCard from '../../components/cards/EarningsCard';
import EarningsChartCard from '../../components/cards/EarningsChartCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';

const Content = () => {
  const weeklyData = [
    { day: 'W1', amount: 12500 },
    { day: 'W2', amount: 9800 },
    { day: 'W3', amount: 15200 },
    { day: 'W4', amount: 7700 },
  ];

  const trendingServices = [
    {
      id: 1,
      name: 'Plumbing',
      icon: '🔧',
      active: 34,
      change: '+12%',
      changeType: 'increase',
    },
    {
      id: 2,
      name: 'Electrical',
      icon: '💡',
      active: 28,
      change: '+8%',
      changeType: 'increase',
    },
    {
      id: 3,
      name: 'Cleaning',
      icon: '✨',
      active: 45,
      change: '+15%',
      changeType: 'increase',
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
              {/* Earnings This Month */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Earnings This Month</h2>
                <div className="grid grid-cols-4 gap-4">
                  {weeklyData.map((week) => (
                    <div key={week.day} className="text-center">
                      <p className="text-sm text-gray-600 mb-2">{week.day}</p>
                      <p className="text-xl font-bold text-gray-900">₱{(week.amount / 1000).toFixed(1)}k</p>
                    </div>
                  ))}
                </div>
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
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                          {service.icon}
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
    </>
  );
};

export default Content;



