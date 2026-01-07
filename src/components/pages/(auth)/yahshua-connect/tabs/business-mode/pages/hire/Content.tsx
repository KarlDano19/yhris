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
import JobChatModal from '../../components/modals/JobChatModal';
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
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientName: string;
    clientInitials?: string;
  } | null>(null);
  const { jobPostings: initialJobPostings, reviews, applicants, hiredApplicants, getApplicantProfileData } = useHireData();
  const { activeJobs } = useMyJobsData();
  
  // State to manage job postings (combine initial data with newly created jobs)
  const [jobPostings, setJobPostings] = useState(initialJobPostings);

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
    clientInitials: job.clientInitials,
  }));

  // Handler for booking messages from Upcoming Bookings Modal
  const handleBookingMessage = (booking: {
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
    clientInitials?: string;
  }) => {
    setSelectedBookingForMessage({
      id: booking.id,
      clientName: booking.clientName,
      clientInitials: booking.clientInitials,
      title: booking.title,
    });
    setIsUpcomingBookingsModalOpen(false);
    setIsChatModalOpen(true);
  };

  // Helper function to format time from 24-hour to 12-hour format
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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
    // Format date
    const date = new Date(data.scheduleDate);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    
    // Format time
    let formattedTime = '';
    if (data.scheduleTimeFrom && data.scheduleTimeTo) {
      formattedTime = `${formatTime(data.scheduleTimeFrom)} - ${formatTime(data.scheduleTimeTo)}`;
    } else if (data.scheduleTimeFrom) {
      formattedTime = formatTime(data.scheduleTimeFrom);
    }
    
    // Format price range
    const priceRange = data.budgetMax && data.budgetMax !== data.budgetMin
      ? `₱${parseInt(data.budgetMin).toLocaleString()} - ₱${parseInt(data.budgetMax).toLocaleString()}`
      : `₱${parseInt(data.budgetMin).toLocaleString()}`;

    if (editingJobId) {
      // Update existing job
      setJobPostings(prev => prev.map(job => {
        if (job.id === editingJobId) {
          return {
            ...job,
            title: data.jobTitle,
            category: data.category || job.category,
            description: data.description,
            location: data.location,
            date: formattedDate,
            time: formattedTime,
            priceRange,
          };
        }
        return job;
      }));
      setEditingJobId(null);
    } else {
      // Create new job
      const newId = Math.max(...jobPostings.map(j => j.id), 0) + 1;
      
      const newJob = {
        id: newId,
        title: data.jobTitle,
        category: data.category || 'Other',
        location: data.location,
        description: data.description,
        date: formattedDate,
        time: formattedTime,
        priceRange,
        applicants: 0,
        status: 'active',
      };
      
      setJobPostings(prev => [newJob, ...prev]);
    }
  };

  // Get initial data for editing
  const getEditJobData = (jobId: number | null) => {
    if (!jobId) return undefined;
    const job = jobPostings.find(j => j.id === jobId);
    if (!job) return undefined;

    // Parse price range to extract min and max
    const priceMatch = job.priceRange.match(/₱([\d,]+)(?:\s*-\s*₱([\d,]+))?/);
    const budgetMin = priceMatch ? priceMatch[1].replace(/,/g, '') : '';
    const budgetMax = priceMatch && priceMatch[2] ? priceMatch[2].replace(/,/g, '') : '';
    
    // Parse date - format is "Dec 20" or similar
    let scheduleDate = '';
    if (job.date) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateParts = job.date.trim().split(' ');
      if (dateParts.length >= 2) {
        const monthName = dateParts[0];
        const day = dateParts[1];
        const monthIndex = monthNames.indexOf(monthName);
        if (monthIndex !== -1) {
          const currentYear = new Date().getFullYear();
          const date = new Date(currentYear, monthIndex, parseInt(day));
          if (!isNaN(date.getTime())) {
            scheduleDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          }
        }
      }
    }
    
    // Parse time - format is "8:00 AM - 5:00 PM" or "8:00 AM"
    let scheduleTimeFrom = '';
    let scheduleTimeTo = '';
    if (job.time) {
      const timeParts = job.time.split(' - ');
      if (timeParts.length === 2) {
        // Has both from and to times
        scheduleTimeFrom = convert12To24Hour(timeParts[0].trim());
        scheduleTimeTo = convert12To24Hour(timeParts[1].trim());
      } else if (timeParts.length === 1) {
        // Only from time
        scheduleTimeFrom = convert12To24Hour(timeParts[0].trim());
      }
    }
    
    return {
      jobTitle: job.title,
      category: job.category,
      description: job.description,
      location: job.location,
      budgetType: 'fixed' as const, // Default to fixed, could be stored in job data
      budgetMin,
      budgetMax,
      scheduleDate,
      scheduleTimeFrom,
      scheduleTimeTo,
    };
  };

  // Helper function to convert 12-hour format to 24-hour format
  const convert12To24Hour = (time12h: string): string => {
    if (!time12h) return '';
    const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '';
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}`;
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
        onMessage={handleBookingMessage}
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

      {/* Chat Modal */}
      {selectedBookingForMessage && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          clientName={selectedBookingForMessage.clientName}
          clientInitials={selectedBookingForMessage.clientInitials || selectedBookingForMessage.clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          jobTitle={selectedBookingForMessage.title}
        />
      )}
    </>
  );
};

export default Content;
