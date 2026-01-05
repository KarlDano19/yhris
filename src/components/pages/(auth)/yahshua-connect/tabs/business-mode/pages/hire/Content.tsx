'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, CalendarIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import PostJobModal from '../../components/modals/PostJobModal';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import MyHiresModal from '../../components/modals/MyHiresModal';
import ViewApplicantsModal from './modals/ViewApplicantsModal';
import ApplicantProfileModal from './modals/ApplicantProfileModal';
import ConfirmHireModal from './modals/ConfirmHireModal';
import SubmitPaymentProofModal from '../../components/modals/SubmitPaymentProofModal';
import { useHireData } from '../../hooks/useHireData';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false);
  const [isApplicantProfileModalOpen, setIsApplicantProfileModalOpen] = useState(false);
  const [isConfirmHireModalOpen, setIsConfirmHireModalOpen] = useState(false);
  const [isSubmitPaymentProofModalOpen, setIsSubmitPaymentProofModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [selectedHireForPayment, setSelectedHireForPayment] = useState<{
    id: number;
    serviceName: string;
    providerName: string;
    priceRange: string;
  } | null>(null);
  const [hiredApplicantsByJob, setHiredApplicantsByJob] = useState<Map<number, { applicantId: number; applicantName: string; paymentProofSubmitted?: boolean }>>(new Map());
  const { jobPostings, reviews, applicants, hiredApplicants, getApplicantProfileData } = useHireData();
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

  const handlePostJob = (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  }) => {
    if (editingJobId) {
      // TODO: Implement API call to update job
      console.log('Updating job:', editingJobId, data);
      setEditingJobId(null);
    } else {
      // TODO: Implement API call to post job
      console.log('Posting job:', data);
    }
    // For now, just log the data
  };

  // Get initial data for editing
  const getEditJobData = (jobId: number | null) => {
    if (!jobId) return undefined;
    const job = jobPostings.find(j => j.id === jobId);
    if (!job) return undefined;

    // Parse price range to extract min and max
    const priceMatch = job.priceRange.match(/₱(\d+)\s*-\s*₱(\d+)/);
    const budgetMin = priceMatch ? priceMatch[1] : '500';
    const budgetMax = priceMatch ? priceMatch[2] : '1000';
    
    // Parse date and time
    const dateMatch = job.date.match(/(\w+\s+\d+)/);
    const timeMatch = job.time.match(/(\d+):(\d+)\s*(AM|PM)/);
    
    // For now, using defaults - TODO: Parse actual date/time from job data
    return {
      jobTitle: job.title,
      category: job.category,
      description: job.description,
      location: job.location,
      budgetType: 'fixed' as const, // Default to fixed, could be stored in job data
      budgetMin,
      budgetMax,
      scheduleDate: '', // TODO: Parse from job.date
      scheduleTimeFrom: '', // TODO: Parse from job.time
      scheduleTimeTo: '', // TODO: Parse from job.time if available
    };
  };

  const handleViewApplicants = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewApplicantsModalOpen(true);
  };

  const handleViewProfile = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setIsViewApplicantsModalOpen(false);
    setIsApplicantProfileModalOpen(true);
  };

  const handleBackToApplicants = () => {
    setIsApplicantProfileModalOpen(false);
    setIsViewApplicantsModalOpen(true);
  };

  const handleMessageApplicant = (applicantId: number) => {
    // TODO: Implement message functionality
    console.log('Message applicant:', applicantId);
  };

  const handleHireClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setIsApplicantProfileModalOpen(false);
    setIsConfirmHireModalOpen(true);
  };

  const handleConfirmHire = (message?: string) => {
    // TODO: Implement API call to hire applicant
    console.log('Hiring applicant:', selectedApplicantId, 'with message:', message);
    
    if (selectedJobId && selectedApplicantId) {
      const applicant = applicants.find(app => app.id === selectedApplicantId);
      if (applicant) {
        setHiredApplicantsByJob(prev => {
          const newMap = new Map(prev);
          newMap.set(selectedJobId, {
            applicantId: selectedApplicantId,
            applicantName: applicant.name,
          });
          return newMap;
        });
      }
    }
    
    setIsConfirmHireModalOpen(false);
    setSelectedApplicantId(null);
    setSelectedJobId(null);
  };

  const handleEditPost = (jobId: number) => {
    const job = jobPostings.find(j => j.id === jobId);
    if (job) {
      setEditingJobId(jobId);
      setIsPostJobModalOpen(true);
    }
  };

  const handleSubmitPaymentProofFromJob = (jobId: number) => {
    const hireInfo = hiredApplicantsByJob.get(jobId);
    if (hireInfo) {
      const job = jobPostings.find(j => j.id === jobId);
      if (job) {
        setSelectedHireForPayment({
          id: jobId, // Using jobId as identifier
          serviceName: job.title,
          providerName: hireInfo.applicantName,
          priceRange: job.priceRange,
        });
        setIsSubmitPaymentProofModalOpen(true);
      }
    }
  };

  const handleSendPaymentProof = (hireId: number) => {
    const hire = hiredApplicants.find(h => h.id === hireId);
    if (hire) {
      setSelectedHireForPayment({
        id: hire.id,
        serviceName: hire.serviceName,
        providerName: hire.providerName,
        priceRange: `₱${hire.price.toLocaleString()}`,
      });
      setIsMyHiresModalOpen(false);
      setIsSubmitPaymentProofModalOpen(true);
    }
  };

  const handleSubmitPaymentProof = (file: File) => {
    // TODO: Implement payment proof upload
    console.log('Submit payment proof for hire:', selectedHireForPayment?.id, file);
    
    // Update payment proof status for the hired applicant
    if (selectedHireForPayment?.id) {
      setHiredApplicantsByJob(prev => {
        const newMap = new Map(prev);
        const hireInfo = newMap.get(selectedHireForPayment.id);
        if (hireInfo) {
          newMap.set(selectedHireForPayment.id, {
            ...hireInfo,
            paymentProofSubmitted: true,
          });
        }
        return newMap;
      });
    }
    
    setSelectedHireForPayment(null);
  };

  const selectedJob = jobPostings.find((job) => job.id === selectedJobId);
  const selectedApplicant = applicants.find((app) => app.id === selectedApplicantId);

  const applicantProfileData = getApplicantProfileData(selectedApplicantId);

  return (
    <>
      {/* <YahshuaConnectHeader /> */} {/* Moved to header.tsx */}
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
                spending={12800}
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
              {/* Hire Header */}
              <div className="bg-white rounded-lg shadow-sm  p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Hire Someone</h2>
                  <button
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                {/* Job Postings List */}
                <div className="space-y-4">
                  {jobPostings.map((job) => {
                    const hireInfo = hiredApplicantsByJob.get(job.id);
                    const isHired = !!hireInfo;
                    
                    return (
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
                        {isHired ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            Hired
                          </span>
                        ) : job.status === 'active' && (
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
                          <span>{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Hired Info */}
                      {isHired && hireInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-savoy-blue mb-2">
                            Hired: {hireInfo.applicantName}
                          </p>
                          {hireInfo.paymentProofSubmitted ? (
                            <p className="text-sm text-gray-700 flex items-center gap-1">
                              Payment proof submitted <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            </p>
                          ) : (
                            <button
                              onClick={() => handleSubmitPaymentProofFromJob(job.id)}
                              className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline"
                            >
                              Submit Payment Proof
                            </button>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewApplicants(job.id)}
                          className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                          View Applicants ({applicants.length})
                        </button>
                        <button
                          onClick={() => handleEditPost(job.id)}
                          className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Edit Post
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => {
          setIsPostJobModalOpen(false);
          setEditingJobId(null);
        }}
        onSubmit={handlePostJob}
        initialData={getEditJobData(editingJobId)}
      />

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
      />

      {/* View Applicants Modal */}
      {selectedJob && (
        <ViewApplicantsModal
          isOpen={isViewApplicantsModalOpen}
          onClose={() => {
            setIsViewApplicantsModalOpen(false);
            setSelectedJobId(null);
          }}
          jobTitle={selectedJob.title}
          applicants={applicants}
          onViewProfile={handleViewProfile}
          onHire={handleHireClick}
        />
      )}

      {/* Confirm Hire Modal */}
      {selectedJob && selectedApplicant && (
        <ConfirmHireModal
          isOpen={isConfirmHireModalOpen}
          onClose={() => {
            setIsConfirmHireModalOpen(false);
            setSelectedApplicantId(null);
          }}
          applicant={selectedApplicant}
          jobDetails={{
            title: selectedJob.title,
            scheduledDate: selectedJob.date,
            scheduledTime: selectedJob.time,
            priceRange: selectedJob.priceRange,
          }}
          onConfirm={handleConfirmHire}
        />
      )}

      {/* My Hires Modal */}
      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
      />

      {/* Applicant Profile Modal */}
      {selectedJob && applicantProfileData && (
        <ApplicantProfileModal
          isOpen={isApplicantProfileModalOpen}
          onClose={() => {
            setIsApplicantProfileModalOpen(false);
            setSelectedApplicantId(null);
          }}
          jobTitle={selectedJob.title}
          applicant={applicantProfileData}
          onBack={handleBackToApplicants}
          onMessage={handleMessageApplicant}
          onHire={handleHireClick}
        />
      )}

      {/* Submit Payment Proof Modal */}
      {selectedHireForPayment && (
        <SubmitPaymentProofModal
          isOpen={isSubmitPaymentProofModalOpen}
          onClose={() => {
            setIsSubmitPaymentProofModalOpen(false);
            setSelectedHireForPayment(null);
          }}
          serviceName={selectedHireForPayment.serviceName}
          providerName={selectedHireForPayment.providerName}
          priceRange={selectedHireForPayment.priceRange}
          onSubmit={handleSubmitPaymentProof}
        />
      )}
    </>
  );
};

export default Content;
