'use client';

import { useMemo } from 'react';
import { BriefcaseIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import useGetApplicationByUser from '@/components/pages/(auth)/applicant/application-tracker/hooks/useGetApplicationByUser';
import JobCard from './components/cards/JobCard';
import AlmostThereJobCard from './components/cards/AlmostThereJobCard';
import TrainingCard from './components/cards/TrainingCard';

const Content = () => {
  // Fetch applications data
  const { data: applicationsData, isLoading: isApplicationsLoading } = useGetApplicationByUser({});

  // Calculate counts
  const applicationsCount = useMemo(() => {
    if (!applicationsData || !Array.isArray(applicationsData)) return 0;
    return applicationsData.length;
  }, [applicationsData]);

  // Trainings in progress count (placeholder - TODO: implement when API is available)
  const trainingsInProgressCount = 1;

  // Rating (placeholder - TODO: get from applicant profile or reviews API)
  const rating = 4.9;

  const jobsMatched = [
    {
      id: 1,
      title: 'Junior UX/UI Designer',
      company: 'The ABBA Initiative, OPC',
      location: 'Manila',
      type: 'Full-time',
      salary: '₱ 30,000 - ₱ 35,000',
      tags: ['UX Research', 'Wireframing', 'Prototyping'],
      logo: 'AI',
      saved: false,
      match: 92,
      applied: true,
    },
    {
      id: 2,
      title: 'Junior UX/UI Designer',
      company: 'ABC Company',
      location: 'Cebu',
      type: 'Full-time',
      salary: '₱ 50,000 - ₱ 55,000',
      tags: ['UX Research', 'Wireframing', 'Prototyping'],
      logo: 'AC',
      saved: true,
      match: 88,
      applied: false,
    },
  ];

  const almostThereJob = {
    title: 'Senior UX/UI Designer',
    company: 'The ABBA Initiative, OPC',
    matchPercentage: 85,
    missingSkills: ['Design System', 'UX Psychology'],
    logo: 'A',
  };

  const recommendedTraining = {
    title: 'Mastering Design System',
    duration: '3 hrs',
    level: 'Intermediate',
    price: 'FREE',
  };


  return (
    <div className="space-y-6">
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {isApplicationsLoading ? '...' : applicationsCount}
              </p>
              <p className="text-sm text-gray-600">Applications</p>
            </div>
          </div>
        </div>

        {/* Trainings In Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{trainingsInProgressCount}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Matched */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Jobs Matched</h2>
                  <p className="text-sm text-gray-600">Jobs that match with you!</p>
                </div>

                <div className="space-y-4">
                  {jobsMatched.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              </div>

              {/* Single Column Layout for Almost-There Jobs and Recommended Training */}
              <div className="space-y-6">
                <AlmostThereJobCard {...almostThereJob} />
                <TrainingCard {...recommendedTraining} />
              </div>
    </div>
  );
};

export default Content;
