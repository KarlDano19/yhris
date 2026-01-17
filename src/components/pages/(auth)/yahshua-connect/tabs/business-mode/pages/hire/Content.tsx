'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import CreateBusinessJobModal from './modals/CreateBusinessJobModal';
import UpdateBusinessJobModal from './modals/UpdateBusinessJobModal';
import ViewApplicantsModal from './modals/ViewApplicantsModal';
import ApplicantProfileModal from './modals/ApplicantProfileModal';
import ConfirmHireModal from './modals/ConfirmHireModal';
import SubmitPaymentProofModal from './modals/SubmitPaymentProofModal';
import ViewDailyProgressModal from '../my-jobs/modals/ViewDailyProgressModal';
import ViewTimeLogsModal from './modals/ViewTimeLogsModal';
import ReviewApplicantModal from './modals/ReviewApplicantModal';
import ChatModal from '@/components/common/chat/ChatModal';
import { useCreateBusinessJob } from './hooks/useCreateBusinessJob';
import { useUpdateBusinessJobDetails } from './hooks/useUpdateBusinessJobDetails';
import { useDeleteBusinessJob } from './hooks/useDeleteBusinessJob';
import { useGetMyBusinessJobs } from './hooks/useGetMyBusinessJobs';
import { useUpdateApplicationStatus } from './hooks/useUpdateApplicationStatus';
import { useReviewDailyProgress } from './hooks/useReviewDailyProgress';
import { useSubmitPayment } from './hooks/useSubmitPayment';
import { useSubmitApplicantReview } from './hooks/useSubmitApplicantReview';
import LoadingSpinner from '@/components/LoadingSpinner';

import { T_BusinessJob, T_BusinessJobApplication, T_CreateBusinessJobData, T_ApplicantProfileData } from '@/types/business-mode';

import { PlusIcon, ClockIcon, CurrencyDollarIcon, UserGroupIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';

// Helper to format date from API (YYYY-MM-DD) to display format (Dec 20)
const formatDateForDisplay = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
};

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
  appliedDate: application.created_at ? new Date(application.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
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
    appliedDate: application.created_at 
      ? new Date(application.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
      : '',
    applicationMessage: '', // Application message not available in API response
    email: application.applicant_email || '',
    phone: application.applicant_mobile || '',
    location: application.applicant_address || '',
    dateOfBirth: application.applicant_birth_date 
      ? new Date(application.applicant_birth_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '',
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
  };
};

const Content = () => {
  // Form Methods
  const createFormMethods = useForm();

  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isUpdateJobModalOpen, setIsUpdateJobModalOpen] = useState(false);
  const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false);
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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);

  // More menu state for dropdown
  const [moreMenuOpen, setMoreMenuOpen] = useState<{ [key: number]: boolean }>({});
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // API Hooks
  const { data: myJobsData, isLoading: isLoadingJobs, refetch: refetchJobs } = useGetMyBusinessJobs({ page_size: 100 });
  const createJobMutation = useCreateBusinessJob();
  const updateJobMutation = useUpdateBusinessJobDetails();
  const deleteJobMutation = useDeleteBusinessJob();
  const updateStatusMutation = useUpdateApplicationStatus();
  const { mutate: reviewDailyProgress, isLoading: isReviewingProgress } = useReviewDailyProgress();
  const { mutate: submitPayment, isLoading: isSubmittingPayment } = useSubmitPayment();
  const { mutate: submitApplicantReview, isLoading: isSubmittingReview } = useSubmitApplicantReview();

  // Get job postings from API
  const jobPostings = myJobsData?.records || [];

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
        toast.custom(() => <CustomToast message="Job deleted successfully" type="success" />, { duration: 5000 });
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

  // Handle toggle active/inactive
  const handleToggleStatus = (jobId: number, isActive: boolean) => {
    const newIsActive = !isActive;
    const successMessage = newIsActive ? 'Job set as active' : 'Job set as inactive';

    updateJobMutation.mutate(
      { jobId, is_active: newIsActive },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message={successMessage} type="success" />, { duration: 5000 });
          setMoreMenuOpen({});
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to update job status';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleCreateJob = (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleStartDate: string;
    scheduleEndDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  }) => {
    // Round coordinates to 6 decimal places to stay within backend's validation limit
    const roundedLatitude = data.latitude ? Math.round(data.latitude * 1000000) / 1000000 : null;
    const roundedLongitude = data.longitude ? Math.round(data.longitude * 1000000) / 1000000 : null;

    // Prepare API payload
    const apiData: T_CreateBusinessJobData = {
      job_title: data.jobTitle,
      category: data.category || 'Other',
      description: data.description,
      location: data.location,
      latitude: roundedLatitude,
      longitude: roundedLongitude,
      budget_type: data.budgetType === 'hourly' ? 'hourly_rate' : 'fixed_rate',
      contract_start_date: data.scheduleStartDate,
      contract_end_date: data.scheduleEndDate || null,
      time_from: data.scheduleTimeFrom || null,
      time_to: data.scheduleTimeTo || null,
    };

    // Set budget amounts based on type
    if (data.budgetType === 'hourly') {
      apiData.hourly_rate = parseFloat(data.budgetMin) || null;
    } else {
      apiData.min_amount = parseFloat(data.budgetMin) || null;
      apiData.max_amount = data.budgetMax ? parseFloat(data.budgetMax) : parseFloat(data.budgetMin) || null;
    }

    // Create new job
    createJobMutation.mutate(apiData, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message="Job posted successfully" type="success" />, { duration: 5000 });
        setIsCreateJobModalOpen(false);
        refetchJobs();
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to create job';
        toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
      },
    });
  };

  const handleViewApplicants = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewApplicantsModalOpen(true);
  };

  const handleViewProfile = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsViewApplicantsModalOpen(false);
    setIsApplicantProfileModalOpen(true);
  };

  const handleBackToApplicants = () => {
    setIsApplicantProfileModalOpen(false);
    setIsViewApplicantsModalOpen(true);
  };

  const handleMessageApplicant = (applicationId: number) => {
    // TODO: Implement message functionality
    console.log('Message applicant for application:', applicationId);
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
          toast.custom(() => <CustomToast message="Applicant hired successfully!" type="success" />, { duration: 5000 });
          setIsConfirmHireModalOpen(false);
          setSelectedApplicationId(null);
          // Refetch and then reopen the ViewApplicantsModal with updated data
          await refetchJobs();
          setIsViewApplicantsModalOpen(true);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to hire applicant';
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
          toast.custom(() => <CustomToast message="Applicant rejected" type="success" />, { duration: 5000 });
          setIsConfirmRejectModalOpen(false);
          setSelectedApplicationId(null);
          // Refetch and then reopen the ViewApplicantsModal with updated data
          await refetchJobs();
          setIsViewApplicantsModalOpen(true);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to reject applicant';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleEditPost = (jobId: number) => {
    setEditingJobId(jobId);
    setIsUpdateJobModalOpen(true);
  };

  const handleSubmitPaymentProofFromJob = (jobId: number) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return;

    // Find accepted application
    const acceptedApp = job.applications?.find((app) => app.status === 'accepted');
    if (!acceptedApp) return;

    setSelectedHireForPayment({
      id: acceptedApp.id,
      serviceName: job.job_title,
      providerName: acceptedApp.applicant_name || 'Unknown',
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
          toast.custom(() => <CustomToast message="Payment proof submitted successfully! Payment marked as paid." type="success" />, { duration: 5000 });
          setSelectedHireForPayment(null);
          setIsSubmitPaymentProofModalOpen(false);
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to submit payment proof';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleReviewApplicantFromJob = (jobId: number) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return;

    // Find accepted application
    const acceptedApp = job.applications?.find((app) => app.status === 'accepted');
    if (!acceptedApp) return;

    setSelectedHireForReview({
      id: acceptedApp.id,
      applicantName: acceptedApp.applicant_name || 'Unknown',
      jobTitle: job.job_title,
    });
    setIsReviewApplicantModalOpen(true);
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
          toast.custom(() => <CustomToast message="Review submitted successfully! Thank you for your feedback." type="success" />, { duration: 5000 });
          setSelectedHireForReview(null);
          setIsReviewApplicantModalOpen(false);
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to submit review';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  const handleViewDailyProgress = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewDailyProgressModalOpen(true);
  };

  const handleViewTimeLogs = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsViewTimeLogsModalOpen(true);
  };

  const handleReviewDailyProgress = (progressId: number, status: 'approved' | 'rejected', feedback: string) => {
    reviewDailyProgress(
      { progressId, status, client_feedback: feedback },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message={`Progress ${status} successfully!`} type="success" />, { duration: 5000 });
          refetchJobs();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to review progress';
          toast.custom(() => <CustomToast message={message} type="error" />, { duration: 7000 });
        },
      }
    );
  };

  // Get selected job data
  const selectedJob = jobPostings.find((job) => job.id === selectedJobId);

  // Get applicants for selected job
  const selectedJobApplicants = selectedJob?.applications?.map(transformApplicationToApplicant) || [];

  // Get selected applicant data
  const selectedApplication = selectedJob?.applications?.find((app) => app.id === selectedApplicationId);
  const selectedApplicantForHire = selectedApplication ? transformApplicationToApplicant(selectedApplication) : null;
  const applicantProfileData = selectedApplication ? transformApplicationToProfile(selectedApplication) : null;

  // Check if job has accepted hire
  const getAcceptedHire = (job: T_BusinessJob) => {
    const acceptedApp = job.applications?.find((app) => app.status === 'accepted');
    if (!acceptedApp) return null;
    return {
      applicantId: acceptedApp.applicant,
      applicantName: acceptedApp.applicant_name || 'Unknown',
      paymentStatus: acceptedApp.payment_status,
      workStatus: acceptedApp.work_status,
      hasClientReviewed: acceptedApp.has_client_reviewed || false,
    };
  };

  // Check if edit/delete should be disabled for a job
  // Disabled when there's a hired applicant whose work is not yet completed and reviewed
  const shouldDisableEditDelete = (job: T_BusinessJob) => {
    const hireInfo = getAcceptedHire(job);

    // No hired applicant - allow edit/delete
    if (!hireInfo) return false;

    // Work completed AND client has reviewed - allow edit/delete
    if (hireInfo.workStatus === 'completed' && hireInfo.hasClientReviewed) {
      return false;
    }

    // Work in progress or not reviewed yet - disable edit/delete
    return true;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Hire Header */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Hire Someone</h2>
            <button
              onClick={() => setIsCreateJobModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              disabled={createJobMutation.isLoading}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Post a Job</span>
            </button>
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
              const hireInfo = getAcceptedHire(job);
              const isHired = !!hireInfo;
              const applicantsCount = job.applications?.length || 0;

              return (
                <div
                  key={job.id}
                  className={`bg-white rounded-xl p-5 hover:shadow-md transition-shadow ${
                    job.is_active ? 'border border-gray-200' : 'border-2 border-red-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${job.is_active ? 'text-gray-900' : 'text-red-500'}`}>
                        {job.job_title}
                      </h3>
                      <p className={`text-sm mb-3 ${job.is_active ? 'text-gray-600' : 'text-red-400'}`}>
                        {job.category} • {job.location}
                      </p>
                      <p className={`text-sm mb-4 ${job.is_active ? 'text-gray-700' : 'text-red-400'}`}>
                        {job.description}
                      </p>
                    </div>
                    {!job.is_active ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Inactive
                      </span>
                    ) : isHired ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Hired
                      </span>
                    ) : job.status === 'active' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                      </span>
                    ) : job.status === 'in_progress' ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    ) : job.status === 'completed' ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    ) : null}
                  </div>

                  {/* Job Details */}
                  <div className={`flex flex-wrap items-center gap-4 mb-4 text-sm ${job.is_active ? 'text-gray-600' : 'text-red-400'}`}>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {formatDateForDisplay(job.contract_start_date)}
                        {job.contract_end_date && ` - ${formatDateForDisplay(job.contract_end_date)}`}
                        {job.time_from && `, ${formatTimeForDisplay(job.time_from, job.time_to)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span className={`font-semibold ${job.is_active ? 'text-green-600' : 'text-red-500'}`}>
                        {formatPriceRange(job)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>
                        {applicantsCount} applicant{applicantsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Hired Info */}
                  {isHired && hireInfo && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-savoy-blue mb-2">Hired: {hireInfo.applicantName}</p>
                      
                      {/* Contractual Job - View Time Logs and/or Daily Progress */}
                      {job.contract_end_date && hireInfo.workStatus !== 'not_started' && (
                        <div className="flex flex-wrap gap-3 mb-2">
                          {/* Hourly rate jobs - always show View Time Logs */}
                          {job.budget_type === 'hourly_rate' && (
                            <button
                              onClick={() => handleViewTimeLogs(job.id)}
                              className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline flex items-center gap-1"
                            >
                              <ClockIcon className="h-4 w-4" />
                              View Time Logs
                            </button>
                          )}
                          {/* Fixed rate jobs OR hourly rate jobs with daily progress required - show View Daily Progress */}
                          {(job.budget_type === 'fixed_rate' || (job.budget_type === 'hourly_rate' && job.is_daily_progress_required)) && (
                            <button
                              onClick={() => handleViewDailyProgress(job.id)}
                              className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline flex items-center gap-1"
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                              View Daily Progress
                            </button>
                          )}
                        </div>
                      )}

                      {hireInfo.paymentStatus === 'paid' ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            Payment completed <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          </p>
                          {!hireInfo.hasClientReviewed && (
                            <button
                              onClick={() => handleReviewApplicantFromJob(job.id)}
                              className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline"
                            >
                              Review Applicant
                            </button>
                          )}
                        </div>
                      ) : hireInfo.workStatus === 'completed' ? (
                        <button
                          onClick={() => handleSubmitPaymentProofFromJob(job.id)}
                          className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline"
                        >
                          Submit Payment Proof
                        </button>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Work status: {hireInfo.workStatus === 'started' ? 'In Progress' : 'Not Started'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleViewApplicants(job.id)}
                      className="px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      View Applicants ({applicantsCount})
                    </button>

                    {/* More Menu Dropdown */}
                    <div 
                      className="relative more-menu-container" 
                      ref={(el) => {
                        menuRefs.current[job.id] = el;
                      }}
                    >
                      <button
                        onClick={() => handleMoreMenuClick(job.id)}
                        className="flex items-center"
                        data-tooltip-id="more-options-tooltip"
                        data-tooltip-content="More Options"
                      >
                        <MoreIconWithBorder />
                      </button>

                      {moreMenuOpen[job.id] && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{ minWidth: '160px' }}>
                          <ul className="py-1 text-left">
                            <li>
                              <button
                                onClick={() => {
                                  handleEditPost(job.id);
                                  setMoreMenuOpen({});
                                }}
                                disabled={updateJobMutation.isLoading || shouldDisableEditDelete(job)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={shouldDisableEditDelete(job) ? 'Cannot edit while applicant is working. Complete the job and review first.' : ''}
                              >
                                Edit Job
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDeleteClick(job.id)}
                                disabled={deleteJobMutation.isLoading || shouldDisableEditDelete(job)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={shouldDisableEditDelete(job) ? 'Cannot delete while applicant is working. Complete the job and review first.' : ''}
                              >
                                Delete Job
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleToggleStatus(job.id, job.is_active)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                              >
                                <span className={!job.is_active ? 'text-green-600' : 'text-red-500'}>
                                  {job.is_active ? 'Set as Inactive' : 'Set as Active'}
                                </span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          applicants={selectedJobApplicants}
          onViewProfile={handleViewProfile}
          onHire={handleHireClick}
          onReject={handleRejectClick}
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
            scheduledDate: formatDateForDisplay(selectedJob.contract_start_date) + (selectedJob.contract_end_date ? ` - ${formatDateForDisplay(selectedJob.contract_end_date)}` : ''),
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
          onClose={() => {
            setIsApplicantProfileModalOpen(false);
            setSelectedApplicationId(null);
          }}
          jobTitle={selectedJob.job_title}
          jobId={selectedJob.id}
          applicant={applicantProfileData}
          onBack={handleBackToApplicants}
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
      {isViewDailyProgressModalOpen && selectedJob && (
        <ViewDailyProgressModal
          isOpen={isViewDailyProgressModalOpen}
          onClose={() => {
            setIsViewDailyProgressModalOpen(false);
            setSelectedJobId(null);
          }}
          jobTitle={selectedJob.job_title}
          dailyProgresses={
            selectedJob.applications
              ?.find((app) => app.status === 'accepted')
              ?.daily_progresses || []
          }
          isClient={true}
          onReview={handleReviewDailyProgress}
        />
      )}

      {/* View Time Logs Modal */}
      {isViewTimeLogsModalOpen && selectedJob && (() => {
        const acceptedApp = selectedJob.applications?.find((app) => app.status === 'accepted');
        return (
          <ViewTimeLogsModal
            isOpen={isViewTimeLogsModalOpen}
            onClose={() => {
              setIsViewTimeLogsModalOpen(false);
              setSelectedJobId(null);
            }}
            jobTitle={selectedJob.job_title}
            applicantName={acceptedApp?.applicant_name || 'Unknown'}
            timeRecords={acceptedApp?.time_records || []}
            hourlyRate={selectedJob.hourly_rate}
          />
        );
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
