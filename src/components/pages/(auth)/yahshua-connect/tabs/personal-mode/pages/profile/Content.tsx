'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import MyApplicationsModal from '../../../../modals/MyApplicationsModal';
import SavedJobsModal from '../../../../modals/SavedJobsModal';
import TrainingsInProgressModal from '../../../../modals/TrainingsInProgressModal';
import BasicInformationModal from './modals/BasicInformationModal';
import WorkExperienceModal from './modals/WorkExperienceModal';
import EducationModal from './modals/EducationModal';
import SkillsAndCertificationModal from './modals/SkillsAndCertificationModal';
import PortfolioModal from './modals/PortfolioModal';
import AddWorkExperienceModal from './modals/AddWorkExperienceModal';
import AddEducationModal from './modals/AddEducationModal';
import AddCertificationModal from './modals/AddCertificationModal';
import AddProjectModal from './modals/AddProjectModal';
import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon as AcademicCapIconOutline } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';

const Content = () => {
  const router = useRouter();
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showSavedJobsModal, setShowSavedJobsModal] = useState(false);
  const [showTrainingsModal, setShowTrainingsModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSkillsCertModal, setShowSkillsCertModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showAddWorkExperienceModal, setShowAddWorkExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddCertificationModal, setShowAddCertificationModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);

  const quickActions = [
    {
      icon: UserIcon,
      label: 'Edit Profile',
      onClick: () => router.push('/yahshua-connect/profile'),
    },
    {
      icon: DocumentTextIcon,
      label: 'My Applications',
      count: 1,
      onClick: () => setShowApplicationsModal(true),
    },
    {
      icon: BookmarkIcon,
      label: 'Saved Jobs',
      count: 1,
      onClick: () => setShowSavedJobsModal(true),
    },
    {
      icon: AcademicCapIconOutline,
      label: 'Trainings in Progress',
      count: 1,
      onClick: () => setShowTrainingsModal(true),
    },
  ];

  const applications = [
    {
      id: 1,
      title: 'Junior UX/UI Designer',
      company: 'The ABBA Initiative, OPC',
      logo: 'AI',
      appliedDate: 'Dec 10, 2025',
      status: 'Under Review',
    },
  ];

  const savedJobs = [
    {
      id: 2,
      title: 'Junior UX/UI Designer',
      company: 'ABC Company',
      location: 'Cebu',
      salary: '₱50,000 - ₱55,000',
      logo: 'AC',
      saved: true,
    },
  ];

  const trainingsInProgress = [
    {
      id: 2,
      title: 'UX Psychology Fundamentals',
      instructor: 'Dr. Michael Park',
      duration: '5 hrs',
      level: 'Beginner',
      rating: 4.9,
      progress: 45,
      price: 'FREE',
    },
  ];

  const userProfile = {
    name: 'John Doe',
    title: 'UX/UI Designer • Plumber',
    initial: 'JD',
    rating: 4.9,
    reviews: 27,
    completion: 66,
    basicInfo: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+63 912 345 6789',
      location: 'Cagayan de Oro, Philippines',
      birthday: 'January 15, 1995',
    },
    workExperience: [
      {
        id: 1,
        title: 'UX/UI Designer',
        company: 'Freelance',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: 'Creating user-centered designs for various clients',
      },
      {
        id: 2,
        title: 'Junior Designer',
        company: 'StartupPH',
        startDate: '2020-01',
        endDate: '2022-01',
        current: false,
        description: 'Mobile app designs and branding projects',
      },
    ],
    education: [
      {
        id: 1,
        degree: 'BS Information Technology',
        school: 'XU - Xavier University',
        startYear: '2016',
        endYear: '2020',
        note: 'Graduated with honors',
      },
    ],
    skills: [
      'UX Research',
      'Wireframing',
      'Prototyping',
      'Figma',
      'Plumbing',
      'Electrical Work',
    ],
    certifications: [
      {
        id: 1,
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        verified: true,
        issuedDate: '2023-03',
        idNumber: 'GUX-2023-12345',
      },
      {
        id: 2,
        name: 'Licensed Master Plumber',
        issuer: 'PRC Philippines',
        verified: true,
        issuedDate: '2021-06',
        expiresDate: '2024-06',
        idNumber: 'PRC-PLM-98765',
      },
    ],
    portfolio: [
      {
        id: 1,
        title: 'E-commerce App Redesign',
        image: '🛒',
        type: 'Mobile App',
        link: 'https://behance.net/project1',
        description: 'Complete redesign',
      },
      {
        id: 2,
        title: 'Banking Dashboard',
        image: '🏦',
        type: 'Web App',
        link: 'https://dribbble.com/project2',
        description: 'Financial dashboard',
      },
    ],
  };

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
      );
    });
  };

  return (
    <>
      <YahshuaConnectHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name={userProfile.name}
                title={userProfile.title}
                initial={userProfile.initial}
                profileCompletion={userProfile.completion}
              />
              <QuickActionsCard actions={quickActions} />
              <BirdsEyeViewCard
                userName={userProfile.name}
                userInitial={userProfile.initial}
                rating={userProfile.rating}
                reviewCount={userProfile.reviews}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="bg-gradient-to-r from-blue-500 to-yellow-400 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                    {userProfile.initial}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                    <p className="text-white/90">{userProfile.title}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {renderStars(userProfile.rating)}
                    </div>
                    <p className="text-2xl font-bold">{userProfile.rating} Rating</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{userProfile.reviews}</p>
                    <p className="text-sm text-white/90">Reviews</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{userProfile.completion}%</p>
                    <p className="text-sm text-white/90">Complete</p>
                  </div>
                </div>
              </div>

              {/* Profile Sections */}
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <button
                    onClick={() => setShowBasicInfoModal(true)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                  >
                    <span className="text-lg font-semibold text-gray-800">Basic Information</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
                  </button>
                </div>

                {/* Work Experience */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <button
                    onClick={() => setShowWorkExperienceModal(true)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                  >
                    <span className="text-lg font-semibold text-gray-800">Work Experience</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
                  </button>
                </div>

                {/* Education */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <button
                    onClick={() => setShowEducationModal(true)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                  >
                    <span className="text-lg font-semibold text-gray-800">Education</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
                  </button>
                </div>

                {/* Skills & Certifications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <button
                    onClick={() => setShowSkillsCertModal(true)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                  >
                    <span className="text-lg font-semibold text-gray-800">Skills & Certifications</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
                  </button>
                </div>

                {/* Portfolio */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <button
                    onClick={() => setShowPortfolioModal(true)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                  >
                    <span className="text-lg font-semibold text-gray-800">Portfolio</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MyApplicationsModal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        applications={applications}
      />
      <SavedJobsModal
        isOpen={showSavedJobsModal}
        onClose={() => setShowSavedJobsModal(false)}
        savedJobs={savedJobs}
      />
      <TrainingsInProgressModal
        isOpen={showTrainingsModal}
        onClose={() => setShowTrainingsModal(false)}
        trainings={trainingsInProgress}
      />

      {/* Profile Section Modals */}
      <BasicInformationModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        basicInfo={userProfile.basicInfo}
        onSave={(data) => {
          // Update userProfile.basicInfo with data
          console.log('Save basic info:', data);
        }}
      />

      <WorkExperienceModal
        isOpen={showWorkExperienceModal}
        onClose={() => setShowWorkExperienceModal(false)}
        workExperience={userProfile.workExperience}
        onEdit={(id) => {
          const exp = userProfile.workExperience.find((e) => e.id === id);
          setEditingWorkExperience(exp);
          setShowWorkExperienceModal(false);
          setShowAddWorkExperienceModal(true);
        }}
        onAdd={() => {
          setEditingWorkExperience(null);
          setShowWorkExperienceModal(false);
          setShowAddWorkExperienceModal(true);
        }}
        onSave={(data) => {
          console.log('Save work experience:', data);
        }}
      />

      <AddWorkExperienceModal
        isOpen={showAddWorkExperienceModal}
        onClose={() => {
          setShowAddWorkExperienceModal(false);
          setEditingWorkExperience(null);
        }}
        initialData={editingWorkExperience}
        onSave={(data) => {
          console.log('Save work experience:', data);
          setShowAddWorkExperienceModal(false);
          setEditingWorkExperience(null);
        }}
      />

      <EducationModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        education={userProfile.education}
        onEdit={(id) => {
          const edu = userProfile.education.find((e) => e.id === id);
          setEditingEducation(edu);
          setShowEducationModal(false);
          setShowAddEducationModal(true);
        }}
        onAdd={() => {
          setEditingEducation(null);
          setShowEducationModal(false);
          setShowAddEducationModal(true);
        }}
        onSave={(data) => {
          console.log('Save education:', data);
        }}
      />

      <AddEducationModal
        isOpen={showAddEducationModal}
        onClose={() => {
          setShowAddEducationModal(false);
          setEditingEducation(null);
        }}
        initialData={editingEducation}
        onSave={(data) => {
          console.log('Save education:', data);
          setShowAddEducationModal(false);
          setEditingEducation(null);
        }}
      />

      <SkillsAndCertificationModal
        isOpen={showSkillsCertModal}
        onClose={() => setShowSkillsCertModal(false)}
        skills={userProfile.skills}
        certifications={userProfile.certifications}
        onAddCertification={() => {
          setEditingCertification(null);
          setShowSkillsCertModal(false);
          setShowAddCertificationModal(true);
        }}
        onSave={(skills, certifications) => {
          console.log('Save skills and certifications:', { skills, certifications });
        }}
      />

      <AddCertificationModal
        isOpen={showAddCertificationModal}
        onClose={() => {
          setShowAddCertificationModal(false);
          setEditingCertification(null);
        }}
        initialData={editingCertification}
        onSave={(data) => {
          console.log('Save certification:', data);
          setShowAddCertificationModal(false);
          setEditingCertification(null);
        }}
      />

      <PortfolioModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        portfolio={userProfile.portfolio}
        onEdit={(id) => {
          const project = userProfile.portfolio.find((p) => p.id === id);
          setEditingProject(project);
          setShowPortfolioModal(false);
          setShowAddProjectModal(true);
        }}
        onAdd={() => {
          setEditingProject(null);
          setShowPortfolioModal(false);
          setShowAddProjectModal(true);
        }}
        onSave={(data) => {
          console.log('Save portfolio:', data);
        }}
      />

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => {
          setShowAddProjectModal(false);
          setEditingProject(null);
        }}
        initialData={editingProject}
        onSave={(data) => {
          console.log('Save project:', data);
          setShowAddProjectModal(false);
          setEditingProject(null);
        }}
      />
    </>
  );
};

export default Content;
