'use client';

import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import YahshuaSISHeader from '../../YahshuaSISHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import JobCard from './components/cards/JobCard';
import AlmostThereJobCard from './components/cards/AlmostThereJobCard';
import TrainingCard from './components/cards/TrainingCard';
import ProfileChecklistCard from './components/cards/ProfileChecklistCard';
import PeopleCard from './components/cards/PeopleCard';

const Content = () => {
  const quickActions = [
    {
      icon: DocumentTextIcon,
      label: 'My Applications',
      count: 10,
      href: '/yahshua-sis/applications',
    },
    {
      icon: BookmarkIcon,
      label: 'Saved Jobs',
      count: 4,
      href: '/yahshua-sis/saved-jobs',
    },
    {
      icon: AcademicCapIcon,
      label: 'Trainings in Progress',
      count: 2,
      href: '/yahshua-sis/trainings',
    },
  ];

  const jobsMatched = [
    {
      id: 1,
      title: 'Junior UX/UI Designer',
      company: 'The ABBA Initiative, OPC',
      location: 'Manila',
      type: 'Full-time',
      salary: '₱ 30,000 - ₱ 35,000',
      tags: ['UX Research', 'Wireframing', 'UI-fidelity Designs', 'Prototyping'],
      logo: 'A',
      saved: false,
    },
    {
      id: 2,
      title: 'Junior UX/UI Designer',
      company: 'ABC Company',
      location: 'Cebu',
      type: 'Full-time',
      salary: '₱ 50,000 - ₱ 52,000',
      tags: ['UX Research', 'Wireframing', 'UI-fidelity Designs', 'Prototyping'],
      logo: 'AG',
      saved: false,
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

  const profileChecklist = [
    { label: 'Basic Information', completed: true },
    { label: 'Work Experience', completed: true },
    { label: 'Skills & Certifications', completed: false },
  ];

  const peopleYouMayKnow = [
    {
      id: 1,
      name: 'Harry Stylinson',
      title: 'Senior UX Designer',
      initials: 'HS',
      color: 'bg-purple-400',
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
                name="Yuri Shimizu"
                title="Aspiring UX/UI Designer"
                initial="Y"
                profileCompletion={65}
              />
              <QuickActionsCard actions={quickActions} />
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Jobs Matched */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Jobs Matched</h2>
                  <p className="text-sm text-gray-600">Jobs that match with you!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobsMatched.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              </div>

              {/* Two Column Layout for Almost-There Jobs and Recommended Training */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AlmostThereJobCard {...almostThereJob} />
                <TrainingCard {...recommendedTraining} />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileChecklistCard items={profileChecklist} />
              <PeopleCard people={peopleYouMayKnow} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
