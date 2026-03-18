 'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import SeederButton from '@/components/SeederButton';
import CreateBusinessJobModal from './modals/CreateBusinessJobModal';
import UpdateBusinessJobModal from './modals/UpdateBusinessJobModal';
import ViewApplicantsModal from './modals/ViewApplicantsModal';
import ApplicantProfileModal from './modals/ApplicantProfileModal';
import ConfirmHireModal from './modals/ConfirmHireModal';
import SubmitPaymentProofModal from './modals/SubmitPaymentProofModal';
import ViewApplicantDailyProgress from './modals/ViewApplicantDailyProgressModal';
import ViewTimeLogsModal from './modals/ViewTimeLogsModal';
import ReviewApplicantModal from './modals/ReviewApplicantModal';
import ViewPreviousHiresModal from './modals/ViewPreviousHiresModal';
import ChatModal from '@/components/common/chat/ChatModal';
import BusinessJobPostingCard from './components/BusinessJobPostingCard';
import useSeedBusinessJobs from './hooks/useSeedBusinessJobs';
import useUnseedBusinessJobs from './hooks/useUnseedBusinessJobs';
import { useCreateBusinessJob } from './hooks/useCreateBusinessJob';
import { useUpdateBusinessJobDetails } from './hooks/useUpdateBusinessJobDetails';
import { useDeleteBusinessJob } from './hooks/useDeleteBusinessJob';
import { useDuplicateBusinessJobPosting } from './hooks/useDuplicateBusinessJobPosting';
import { useGetMyBusinessJobs } from './hooks/useGetMyBusinessJobs';
import { useUpdateApplicationStatus } from './hooks/useUpdateApplicationStatus';
import { useReviewDailyProgress } from './hooks/useReviewDailyProgress';
import { useSubmitPayment } from './hooks/useSubmitPayment';
import { useSubmitApplicantReview } from './hooks/useSubmitApplicantReview';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDateToLocal } from '@/helpers/date';

import { PlusIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

import { T_BusinessJob, T_BusinessJobApplication, T_ApplicantProfileData, T_HireInfo } from '@/types/business-mode';

// Helper to format time from API (HH:MM) to display format (8:00 AM)
const formatTimeForDisplay = (timeFrom: string | null, timeTo: string | null): string => {
  const format12Hour = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (timeFrom && timeTo) {
    return `${format12Hour(timeFrom)} - ${format12Hour(timeTo)}`;
  } else if (timeFrom) {
    return format12Hour(timeFrom);
  }
  return '';
};

// Helper to format price range from API
const formatPriceRange = (job: T_BusinessJob): string => {
  if (job.budget_type === 'hourly_rate' && job.hourly_rate) {
    return `₱${job.hourly_rate.toLocaleString()}/hr`;
  }
  if (job.min_amount && job.max_amount && job.min_amount !== job.max_amount) {
    return `₱${job.min_amount.toLocaleString()} - ₱${job.max_amount.toLocaleString()}`;
  }
  if (job.min_amount) {
    return `₱${job.min_amount.toLocaleString()}`;
  }
  if (job.max_amount) {
    return `₱${job.max_amount.toLocaleString()}`;
  }
  return '';
};

// Helper to get initials from name
const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Transform API application to frontend Applicant type
const transformApplicationToApplicant = (application: T_BusinessJobApplication) => ({
  id: application.id,
  applicantId: application.applicant,
  name: application.applicant_name || 'Unknown',
  initials: getInitials(application.applicant_name || ''),
  rating: application.applicant_average_rating || 0,
  reviewsCount: application.applicant_reviews_count || 0,
  description: '', // Will be filled from skills or work experience
  services: application.applicant_skills || [],
  appliedDate: application.created_at ? formatDateToLocal(application.created_at, true) : '',
  status: application.status,
  email: application.applicant_email,
  phone: application.applicant_mobile,
  photo: application.applicant_photo,
});

// Transform API application to T_ApplicantProfileData
const transformApplicationToProfile = (application: T_BusinessJobApplication): T_ApplicantProfileData => {
  // Format work experience
  const workExperience = (application.applicant_work_experience || []).map((exp: any) => {
    const dateFrom = exp.dateFrom ? new Date(exp.dateFrom).getFullYear().toString() : '';
    const dateTo = exp.currentlyEmployed ? 'Present' : (exp.dateTo ? new Date(exp.dateTo).getFullYear().toString() : '');
    const period = dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : '';
    
    return {
      position: exp.position || '',
      company: exp.companyOrg || exp.company || '',
      period: period,
    };
  });

  // Format education
  const education = [];
  if (application.applicant_education || application.applicant_college || application.applicant_educational_attainment) {
    education.push({
      degree: application.applicant_education || application.applicant_educational_attainment || '',
      school: application.applicant_college || '',
      year: '', // Year information not available in API response
    });
  }

  // Format certifications
  const certifications = (application.applicant_certifications || []).map((cert: any) => ({
    name: cert.name || '',
    verified: cert.verified || false,
  }));

  // Get resume filename
  const resumeFilename = application.applicant_cv 
    ? application.applicant_cv.split('/').pop() || 'Resume.pdf'
    : '';

  return {
    id: application.id,
    applicantId: application.applicant,
    name: application.applicant_name || 'Unknown',
    initials: getInitials(application.applicant_name || ''),
    rating: application.applicant_average_rating || 0,
    reviewsCount: application.applicant_reviews_count || 0,
    appliedDate: application.created_at ? formatDateToLocal(application.created_at, true) : '',
    applicationMessage: '', // Application message not available in API response
    email: application.applicant_email || '',
    phone: application.applicant_mobile || '',
    location: application.applicant_address || '',
    dateOfBirth: application.applicant_birth_date ? formatDateToLocal(application.applicant_birth_date, true) : '',
    status: application.status,
    skills: application.applicant_skills || [],
    workExperience: workExperience,
    education: education,
    certifications: certifications,
    resume: {
      filename: resumeFilename,
      type: 'PDF Document',
    },
    reviews: [], // Reviews would need to come from a separate endpoint
    photo: application.applicant_photo,
  };
};

const Content = () => {
  // Form Methods
  const createFormMethods = useForm();

  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isUpdateJobModalOpen, setIsUpdateJobModalOpen] = useState(false);
  const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false);
  const [isViewPreviousHiresModalOpen, setIsViewPreviousHiresModalOpen] = useState(false);
  const [isApplicantProfileModalOpen, setIsApplicantProfileModalOpen] = useState(false);
  const [isConfirmHireModalOpen, setIsConfirmHireModalOpen] = useState(false);
  const [isConfirmRejectModalOpen, setIsConfirmRejectModalOpen] = useState(false);
  const [isSubmitPaymentProofModalOpen, setIsSubmitPaymentProofModalOpen] = useState(false);
  const [isViewDailyProgressModalOpen, setIsViewDailyProgressModalOpen] = useState(false);
  const [isViewTimeLogsModalOpen, setIsViewTimeLogsModalOpen] = useState(false);
  const [isReviewApplicantModalOpen, setIsReviewApplicantModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [selectedHireForPayment, setSelectedHireForPayment] = useState<{
    id: number;
    serviceName: string;
    providerName: string;
    priceRange: string;
  } | null>(null);
  const [selectedHireForReview, setSelectedHireForReview] = useState<{
    id: number;
    applicantName: string;
    jobTitle: string;
  } | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
  } | null>(null);
  const [isHiredApplicantChatOpen, setIsHiredApplicantChatOpen] = useState(false);
  const [selectedHiredApplicantForChat, setSelectedHiredApplicantForChat] = useState<{
    jobId: number;
    jobTitle: string;
    applicantId: number;
    applicantName: string;
    applicantInitials: string;
    applicantPhoto: string | null;
  } | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);

  // More menu state for dropdown
  const [moreMenuOpen, setMoreMenuOpen] = useState<{ [key: number]: boolean }>({});
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // API Hooks
  const {
    data: myJobsData,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useGetMyBusinessJobs();
  const createJobMutation = useCreateBusinessJob();
  const updateJobMutation = useUpdateBusinessJobDetails();
  const deleteJobMutation = useDeleteBusinessJob();
  const duplicateJobMutation = useDuplicateBusinessJobPosting();
  const updateStatusMutation = useUpdateApplicationStatus();
  const { mutate: reviewDailyProgress, isLoading: isReviewingProgress } = useReviewDailyProgress();
  const { mutate: submitPayment, isLoading: isSubmittingPayment } = useSubmitPayment();
  const { mutate: submitApplicantReview, isLoading: isSubmittingReview } = useSubmitApplicantReview();
  const seedBusinessJobsMutation = useSeedBusinessJobs();
  const unseedBusinessJobsMutation = useUnseedBusinessJobs();

  // Get job postings from API
  const jobPostings = myJobsData?.records || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside all menu containers
      const isClickOutsideAllMenus = Object.values(menuRefs.current).every(
        (ref) => !ref || !ref.contains(target)
      );

      if (isClickOutsideAllMenus) {
        setMoreMenuOpen({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to scroll and highlight a job
  const scrollAndHighlightJob = (jobId: string) => {
    const element = document.getElementById(`job-${jobId}`);
    if (element) {
      // Scroll to the job posting
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add highlight effect
      element.classList.add('ring-4', 'ring-savoy-blue', 'ring-offset-2');

      // Remove highlight after 3 seconds
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-savoy-blue', 'ring-offset-2');
      }, 3000);
    }
  };

  // Auto-scroll and highlight job when navigating from MyHiresModal
  useEffect(() => {
    const scrollToJobId = sessionStorage.getItem('scrollToJobId');
    if (scrollToJobId && jobPostings.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        scrollAndHighlightJob(scrollToJobId);
        // Clear sessionStorage
        sessionStorage.removeItem('scrollToJobId');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [jobPostings]);

  // Listen for custom event to scroll when already on hire page
  useEffect(() => {
    const handleScrollToJob = (event: Event) => {
      const customEvent = event as CustomEvent<{ jobPostingId: number }>;
      const jobId = customEvent.detail.jobPostingId;

      // Small delay to ensure modal is closed and DOM is ready
      setTimeout(() => {
        scrollAndHighlightJob(jobId.toString());
      }, 150);
    };

    window.addEventListener('scrollToJob', handleScrollToJob);
    return () => window.removeEventListener('scrollToJob', handleScrollToJob);
  }, []);

  // Handle more menu toggle
  const handleMoreMenuClick = (jobId: number) => {
    setMoreMenuOpen((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [jobId]: !prev[jobId],
    }));
  };

  // Handle delete job
  const handleDeleteClick = (jobId: number) => {
    setDeleteJobId(jobId);
    setIsDeleteModalOpen(true);
    setMoreMenuOpen({});
  };

  const handleConfirmDelete = () => {
    if (!deleteJobId) return;

    deleteJobMutation.mutate(deleteJobId, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message="Job deleted successfully." type="success" />, { duration: 5000 });
        setIsDeleteModalOpen(false);
        setDeleteJobId(null);
        refetchJobs();
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to delete job';
        toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
      },
    });
  };

  // Handle seed business jobs
  const handleSeedBusinessJobs = async (count: number, budgetType?: 'fixed_rate' | 'hourly_rate' | 'mix') => {
    try {
      const result = await seedBusinessJobsMutation.mutateAsync({ count, budget_type: budgetType || 'mix' });
      const message = result?.data?.message || result?.message || `Successfully created ${count} job posting(s).`;
      toast.custom(() => <CustomToast message={message} type="success" />, { duration: 5000 });
      refetchJobs();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to seed jobs.'} type="error" />, { duration: 7000 });
    }
  };

  // Handle unseed business jobs
  const handleUnseedBusinessJobs = async () => {
    try {
      const result = await unseedBusinessJobsMutation.mutateAsync();
      const message = result?.data?.message || result?.message || 'Successfully deleted seeded job postings.';
      toast.custom(() => <CustomToast message={message} type="success" />, { duration: 5000 });
      refetchJobs();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to unseed jobs.'} type="error" />, { duration: 7000 });
    }
  };

  // Handle toggle active/inactive
  const handleToggleStatus = (jobId: number, isActive: boolean) => {
    const newIsActive = !isActive;
    const successMessage = newIsActive ? 'Job set as active.' : 'Job set as inactive.';

    updateJobMutation.mutate(
      { jobId, is_active: newIsActive },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message={successMessage} type="success" />, { duration: 5000 });
          setMoreMenuOpen({});
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to update job status.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  // Handle duplicate job posting
  const handleDuplicateJob = (jobId: number) => {
    duplicateJobMutation.mutate(jobId, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message="Job duplicated successfully." type="success" />, { duration: 5000 });
        setMoreMenuOpen({});
        refetchJobs();
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to duplicate job.';
        toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
      },
    });
  };

  const handleViewApplicants = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewApplicantsModalOpen(true);
  };

  const handleViewHistory = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewPreviousHiresModalOpen(true);
  };

  const handleViewProfile = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsViewApplicantsModalOpen(false);
    setIsApplicantProfileModalOpen(true);
  };

  const handleBackToApplicants = () => {
    setIsApplicantProfileModalOpen(false);
    setSelectedApplicationId(null);
    setIsViewApplicantsModalOpen(true);
  };

  const handleMessageApplicant = (applicationId: number) => {
    // TODO: Implement message functionality
    console.log('Message applicant for application:', applicationId); // TODO: Implement message functionality
  };

  const handleHireClick = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsApplicantProfileModalOpen(false);
    setIsViewApplicantsModalOpen(false);
    setIsConfirmHireModalOpen(true);
  };

  const handleRejectClick = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsApplicantProfileModalOpen(false);
    setIsViewApplicantsModalOpen(false);
    setIsConfirmRejectModalOpen(true);
  };

  const handleConfirmHire = () => {
    if (!selectedApplicationId) return;
    
    updateStatusMutation.mutate(
      { applicationId: selectedApplicationId, status: 'accepted' },
      {
        onSuccess: async () => {
          toast.custom(() => <CustomToast message="Applicant hired successfully." type="success" />, { duration: 5000 });
          setIsConfirmHireModalOpen(false);
          setSelectedApplicationId(null);
          // Refetch and then reopen the ViewApplicantsModal with updated data
          await refetchJobs();
          setIsViewApplicantsModalOpen(true);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to hire applicant.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleConfirmReject = () => {
    if (!selectedApplicationId) return;

    updateStatusMutation.mutate(
      { applicationId: selectedApplicationId, status: 'rejected' },
      {
        onSuccess: async () => {
          toast.custom(() => <CustomToast message="Applicant rejected." type="success" />, { duration: 5000 });
          setIsConfirmRejectModalOpen(false);
          setSelectedApplicationId(null);
          // Refetch and then reopen the ViewApplicantsModal with updated data
          await refetchJobs();
          setIsViewApplicantsModalOpen(true);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to reject applicant.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleEditPost = (jobId: number) => {
    setEditingJobId(jobId);
    setIsUpdateJobModalOpen(true);
  };

  const handleSubmitPaymentProofFromJob = (jobId: number, applicationId: number) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return;

    // Find specific application by ID (from hired_applicants)
    const application = job.hired_applicants?.find((app: T_BusinessJobApplication) => app.id === applicationId);
    if (!application) return;

    setSelectedHireForPayment({
      id: application.id,
      serviceName: job.job_title,
      providerName: application.applicant_name || 'Unknown',
      priceRange: formatPriceRange(job),
    });
    setIsSubmitPaymentProofModalOpen(true);
  };


  const handleSubmitPaymentProof = (data: { payment_proof: File; payment_amount?: number }) => {
    if (!selectedHireForPayment) return;

    submitPayment(
      {
        applicationId: selectedHireForPayment.id,
        payment_proof: data.payment_proof,
        payment_amount: data.payment_amount,
      },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message="Payment proof submitted successfully. Payment marked as paid." type="success" />, { duration: 5000 });
          setSelectedHireForPayment(null);
          setIsSubmitPaymentProofModalOpen(false);
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to submit payment proof.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleReviewApplicantFromJob = (jobId: number, applicationId: number) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return;

    // Find specific application by ID (from hired_applicants)
    const application = job.hired_applicants?.find((app: T_BusinessJobApplication) => app.id === applicationId);
    if (!application) return;

    setSelectedHireForReview({
      id: application.id,
      applicantName: application.applicant_name || 'Unknown',
      jobTitle: job.job_title,
    });
    setIsReviewApplicantModalOpen(true);
  };

  const handleChatWithHiredApplicant = (jobId: number, applicantId: number, applicantName: string, applicantPhoto: string | null, applicantInitials: string) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return;

    setSelectedHiredApplicantForChat({
      jobId: job.id,
      jobTitle: job.job_title,
      applicantId,
      applicantName,
      applicantInitials,
      applicantPhoto,
    });
    setIsHiredApplicantChatOpen(true);
  };

  const handleSubmitApplicantReview = (data: { rating: number; review_text?: string }) => {
    if (!selectedHireForReview) return;

    submitApplicantReview(
      {
        applicationId: selectedHireForReview.id,
        rating: data.rating,
        review_text: data.review_text,
      },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message="Review submitted successfully. Thank you for your feedback." type="success" />, { duration: 5000 });
          setSelectedHireForReview(null);
          setIsReviewApplicantModalOpen(false);
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to submit review.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleViewDailyProgress = (jobId: number, applicationId: number) => {
    setSelectedJobId(jobId);
    setSelectedApplicationId(applicationId);
    setIsViewDailyProgressModalOpen(true);
  };

  const handleViewTimeLogs = (jobId: number, applicationId: number) => {
    setSelectedJobId(jobId);
    setSelectedApplicationId(applicationId);
    setIsViewTimeLogsModalOpen(true);
  };

  const handleReviewDailyProgress = (progressId: number, status: 'approved' | 'rejected', feedback: string) => {
    reviewDailyProgress(
      { progressId, status, client_feedback: feedback },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message={`Progress ${status} successfully.`} type="success" />, { duration: 5000 });
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to review progress.';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  // Get accepted hires for current batch only (from API hired_applicants field)
  const getCurrentBatchHires = (job: T_BusinessJob): T_HireInfo[] => {
    const hiredApplicants = job.hired_applicants || [];

    return hiredApplicants.map((app: T_BusinessJobApplication) => ({
      applicationId: app.id,
      applicantId: app.applicant,
      applicantName: app.applicant_name || 'Unknown',
      applicantPhoto: app.applicant_photo || null,
      applicantInitials: getInitials(app.applicant_name || ''),
      paymentStatus: app.payment_status,
      workStatus: app.work_status,
      hasClientReviewed: app.has_client_reviewed || false,
      dailyProgresses: app.daily_progresses || [],
      timeRecords: app.time_records || [],
    }));
  };

  // Get selected job data
  const selectedJob = jobPostings.find((job) => job.id === selectedJobId);

  // Get selected applicant data (from hired_applicants only)
  const selectedApplication = selectedJob?.hired_applicants?.find((app: T_BusinessJobApplication) => app.id === selectedApplicationId);
  const selectedApplicantForHire = selectedApplication ? transformApplicationToApplicant(selectedApplication) : null;
  const applicantProfileData = selectedApplication ? transformApplicationToProfile(selectedApplication) : null;

  // Get all accepted hires for a job (DEPRECATED - use getCurrentBatchHires)
  const getAcceptedHires = (job: T_BusinessJob): T_HireInfo[] => {
    const acceptedApps = job.hired_applicants || [];
    return acceptedApps.map((app: T_BusinessJobApplication) => ({
      applicationId: app.id,
      applicantId: app.applicant,
      applicantName: app.applicant_name || 'Unknown',
      applicantPhoto: app.applicant_photo || null,
      applicantInitials: getInitials(app.applicant_name || ''),
      paymentStatus: app.payment_status,
      workStatus: app.work_status,
      hasClientReviewed: app.has_client_reviewed || false,
      dailyProgresses: app.daily_progresses || [],
      timeRecords: app.time_records || [],
    }));
  };

  // Check if edit/delete should be disabled for a job
  // Disabled when there's ANY hired applicant whose work is not yet completed and reviewed
  const shouldDisableEditDelete = (job: T_BusinessJob) => {
    const hireInfos = getAcceptedHires(job);

    // No hired applicants - allow edit/delete
    if (hireInfos.length === 0) return false;

    // Disable if ANY hire is not completed & reviewed
    const hasActiveHires = hireInfos.some((hire: T_HireInfo) =>
      hire.workStatus !== 'completed' || !hire.hasClientReviewed
    );

    return hasActiveHires;
  };

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 bg-savoy-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" strokeWidth={2.5} />
        </button>
      )}

      <div className="space-y-6">
        {/* Hire Header */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Hire Someone</h2>

            <div className="flex items-center gap-2">
              <SeederButton
                onSeed={handleSeedBusinessJobs}
                onUnseed={handleUnseedBusinessJobs}
                isLoading={seedBusinessJobsMutation.isLoading}
                isUnseeding={unseedBusinessJobsMutation.isLoading}
                maxCount={100}
                defaultCount={5}
                showSeeder={true}
                showBudgetType={true}
              />

              <button
                onClick={() => setIsCreateJobModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={createJobMutation.isLoading}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Post a Job</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingJobs && <LoadingSpinner size="lg" showText text="Loading your job postings..." className="py-8" />}

          {/* Empty State */}
          {!isLoadingJobs && jobPostings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't posted any jobs yet.</p>
              <p className="text-gray-500 text-sm mt-1">Click "Post a Job" to get started.</p>
            </div>
          )}

          {/* Job Postings List */}
          <div className="space-y-4">
            {jobPostings.map((job) => {
              const hiredApplicants = getCurrentBatchHires(job);
              const isHired = hiredApplicants.length > 0;
              const applicantsCount = job.current_batch_applications_count || 0;
              const previousHiresCount = job.previous_batches_applications_count || 0;

              return (
                <BusinessJobPostingCard
                  key={job.id}
                  job={job}
                  hiredApplicants={hiredApplicants}
                  previousHiresCount={previousHiresCount}
                  isHired={isHired}
                  applicantsCount={applicantsCount}
                  isMoreMenuOpen={moreMenuOpen[job.id] || false}
                  menuRef={(el) => {
                    menuRefs.current[job.id] = el;
                  }}
                  onMoreMenuClick={() => handleMoreMenuClick(job.id)}
                  onViewApplicants={() => handleViewApplicants(job.id)}
                  onViewHistory={() => handleViewHistory(job.id)}
                  onViewTimeLogs={(applicationId) => handleViewTimeLogs(job.id, applicationId)}
                  onViewDailyProgress={(applicationId) => handleViewDailyProgress(job.id, applicationId)}
                  onSubmitPaymentProof={(applicationId) => handleSubmitPaymentProofFromJob(job.id, applicationId)}
                  onReviewApplicant={(applicationId) => handleReviewApplicantFromJob(job.id, applicationId)}
                  onChatWithApplicant={(applicantId, applicantName, applicantPhoto, applicantInitials) => handleChatWithHiredApplicant(job.id, applicantId, applicantName, applicantPhoto, applicantInitials)}
                  onEditJob={() => {
                    handleEditPost(job.id);
                    setMoreMenuOpen({});
                  }}
                  onDeleteJob={() => handleDeleteClick(job.id)}
                  onDuplicateJob={() => handleDuplicateJob(job.id)}
                  onToggleStatus={() => handleToggleStatus(job.id, job.is_active)}
                  shouldDisableEditDelete={shouldDisableEditDelete(job)}
                  isUpdateLoading={updateJobMutation.isLoading}
                  isDeleteLoading={deleteJobMutation.isLoading}
                  isDuplicateLoading={duplicateJobMutation.isLoading}
                />
              );
            })}
          </div>

          {/* Load More Button */}
          {!isLoadingJobs && hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More Jobs'}
              </button>
            </div>
          )}
          {!isLoadingJobs && totalRecords > 0 && (
            <div className="text-sm text-gray-600 text-center mt-4">
              Showing {jobPostings.length} of {totalRecords} jobs
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {isCreateJobModalOpen && (
        <CreateBusinessJobModal
          refetch={refetchJobs}
          isOpen={isCreateJobModalOpen}
          setIsOpen={(open: boolean) => setIsCreateJobModalOpen(open)}
          formMethods={createFormMethods}
        />
      )}

      {/* Update Job Modal */}
      {isUpdateJobModalOpen && editingJobId && (
        <UpdateBusinessJobModal
          refetch={refetchJobs}
          isOpen={isUpdateJobModalOpen}
          setIsOpen={(open: boolean) => {
            setIsUpdateJobModalOpen(open);
            if (!open) {
              setEditingJobId(null);
            }
          }}
          editingJobId={editingJobId}
        />
      )}

      {/* View Applicants Modal */}
      {isViewApplicantsModalOpen && selectedJob && (
        <ViewApplicantsModal
          isOpen={isViewApplicantsModalOpen}
          onClose={() => {
            setIsViewApplicantsModalOpen(false);
            setSelectedJobId(null);
          }}
          jobTitle={selectedJob.job_title}
          jobId={selectedJob.id}
          currentBatchNumber={selectedJob.current_batch_number}
          onViewProfile={handleViewProfile}
          onHire={handleHireClick}
          onReject={handleRejectClick}
          onViewDailyProgress={(applicationId: number) => {
            // open daily progress modal for this application
            handleViewDailyProgress(selectedJob.id, applicationId);
            // close applicants modal
            setIsViewApplicantsModalOpen(false);
          }}
        />
      )}

      {/* View Previous Hires Modal */}
      {isViewPreviousHiresModalOpen && selectedJob && (
        <ViewPreviousHiresModal
          isOpen={isViewPreviousHiresModalOpen}
          onClose={() => {
            setIsViewPreviousHiresModalOpen(false);
            setSelectedJobId(null);
          }}
          jobTitle={selectedJob.job_title}
          jobId={selectedJob.id}
          currentBatchNumber={selectedJob.current_batch_number}
        />
      )}

      {/* Confirm Hire Modal */}
      {isConfirmHireModalOpen && selectedJob && selectedApplicantForHire && (
        <ConfirmHireModal
          isOpen={isConfirmHireModalOpen}
          onClose={() => {
            setIsConfirmHireModalOpen(false);
            setSelectedApplicationId(null);
          }}
          applicant={selectedApplicantForHire}
          jobDetails={{
            title: selectedJob.job_title,
            scheduledDate: formatDateToLocal(selectedJob.contract_start_date, true) + (selectedJob.contract_end_date ? ` - ${formatDateToLocal(selectedJob.contract_end_date, true)}` : ''),
            scheduledTime: formatTimeForDisplay(selectedJob.time_from, selectedJob.time_to),
            priceRange: formatPriceRange(selectedJob),
          }}
          onConfirm={handleConfirmHire}
          isLoading={updateStatusMutation.isLoading}
        />
      )}

      {/* Applicant Profile Modal */}
      {isApplicantProfileModalOpen && selectedJob && applicantProfileData && (
        <ApplicantProfileModal
          isOpen={isApplicantProfileModalOpen}
          onClose={handleBackToApplicants}
          jobTitle={selectedJob.job_title}
          jobId={selectedJob.id}
          applicant={applicantProfileData}
          onMessage={handleMessageApplicant}
          onHire={handleHireClick}
          onReject={handleRejectClick}
        />
      )}

      {/* Submit Payment Proof Modal */}
      {isSubmitPaymentProofModalOpen && selectedHireForPayment && (
        <SubmitPaymentProofModal
          isOpen={isSubmitPaymentProofModalOpen}
          onClose={() => {
            setIsSubmitPaymentProofModalOpen(false);
            setSelectedHireForPayment(null);
          }}
          serviceName={selectedHireForPayment.serviceName}
          providerName={selectedHireForPayment.providerName}
          priceRange={selectedHireForPayment.priceRange}
          isSubmitting={isSubmittingPayment}
          onSubmit={handleSubmitPaymentProof}
        />
      )}

      {/* Chat Modal */}
      {isChatModalOpen && selectedBookingForMessage && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          recipientId={selectedBookingForMessage.clientId}
          recipientName={selectedBookingForMessage.clientName}
          recipientInitials={selectedBookingForMessage.clientInitials}
          recipientPhoto={selectedBookingForMessage.clientPhoto}
          jobId={selectedBookingForMessage.id}
          jobTitle={selectedBookingForMessage.title}
        />
      )}

      {/* Hired Applicant Chat Modal */}
      {isHiredApplicantChatOpen && selectedHiredApplicantForChat && (
        <ChatModal
          isOpen={isHiredApplicantChatOpen}
          onClose={() => {
            setIsHiredApplicantChatOpen(false);
            setSelectedHiredApplicantForChat(null);
          }}
          recipientId={selectedHiredApplicantForChat.applicantId}
          recipientName={selectedHiredApplicantForChat.applicantName}
          recipientInitials={selectedHiredApplicantForChat.applicantInitials}
          recipientPhoto={selectedHiredApplicantForChat.applicantPhoto}
          jobId={selectedHiredApplicantForChat.jobId}
          jobTitle={selectedHiredApplicantForChat.jobTitle}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          setIsOpen={(open) => {
            setIsDeleteModalOpen(open);
            if (!open) setDeleteJobId(null);
          }}
          confirmAction={handleConfirmDelete}
          message="Are you sure you want to delete this job posting? This action cannot be undone."
          isLoading={deleteJobMutation.isLoading}
        />
      )}

      {/* Reject Confirmation Modal */}
      {isConfirmRejectModalOpen && (
        <ConfirmModal
          isOpen={isConfirmRejectModalOpen}
          setIsOpen={(open) => {
            setIsConfirmRejectModalOpen(open);
            if (!open) setSelectedApplicationId(null);
          }}
          confirmAction={handleConfirmReject}
          message="Are you sure you want to reject this applicant? This action cannot be undone."
          isLoading={updateStatusMutation.isLoading}
        />
      )}

      {/* View Daily Progress Modal */}
      {isViewDailyProgressModalOpen && selectedJob && selectedApplicationId && (() => {
        const application = selectedJob.applications?.find((app: T_BusinessJobApplication) => app.id === selectedApplicationId);
        return application ? (
          <ViewApplicantDailyProgress
            isOpen={isViewDailyProgressModalOpen}
            onClose={() => {
              setIsViewDailyProgressModalOpen(false);
              setSelectedJobId(null);
              setSelectedApplicationId(null);
            }}
            jobTitle={`${selectedJob.job_title} - ${application.applicant_name || 'Unknown'}`}
            dailyProgresses={application.daily_progresses || []}
            isClient={true}
            onReview={handleReviewDailyProgress}
          />
        ) : null;
      })()}

      {/* View Time Logs Modal */}
      {isViewTimeLogsModalOpen && selectedJob && selectedApplicationId && (() => {
        const application = selectedJob.applications?.find((app: T_BusinessJobApplication) => app.id === selectedApplicationId);
        return application ? (
          <ViewTimeLogsModal
            isOpen={isViewTimeLogsModalOpen}
            onClose={() => {
              setIsViewTimeLogsModalOpen(false);
              setSelectedJobId(null);
              setSelectedApplicationId(null);
            }}
            jobTitle={selectedJob.job_title}
            applicantName={application.applicant_name || 'Unknown'}
            timeRecords={application.time_records || []}
            hourlyRate={selectedJob.hourly_rate}
          />
        ) : null;
      })()}

      {/* Review Applicant Modal */}
      {isReviewApplicantModalOpen && selectedHireForReview && (
        <ReviewApplicantModal
          isOpen={isReviewApplicantModalOpen}
          onClose={() => {
            setIsReviewApplicantModalOpen(false);
            setSelectedHireForReview(null);
          }}
          applicantName={selectedHireForReview.applicantName}
          jobTitle={selectedHireForReview.jobTitle}
          isSubmitting={isSubmittingReview}
          onSubmit={handleSubmitApplicantReview}
        />
      )}

      {/* Tooltips */}
      <Tooltip id="edit-job-tooltip" />
      <Tooltip id="delete-job-tooltip" />
      <Tooltip id="more-options-tooltip" />
    </>
  );
};

export default Content;

