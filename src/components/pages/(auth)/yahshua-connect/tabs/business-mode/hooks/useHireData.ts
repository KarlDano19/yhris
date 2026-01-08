import { T_ApplicantProfileData } from '@/types/business-mode';

// Type alias for backward compatibility
type ApplicantProfileData = T_ApplicantProfileData;

// Hired Applicant type (for mock data)
interface HiredApplicant {
  id: number;
  serviceName: string;
  providerName: string;
  providerInitials: string;
  status: 'pending' | 'in-progress' | 'completed';
  price: number;
}

export interface JobPosting {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  date: string;
  time: string;
  priceRange: string;
  applicants: number;
  status: string;
}

export interface Review {
  id: number;
  reviewerName: string;
  reviewerInitials: string;
  role: string;
  quote: string;
  date: string;
  rating: number;
}

export interface Applicant {
  id: number;
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  description: string;
  services: string[];
  appliedDate: string;
}

export const useHireData = () => {
  const jobPostings: JobPosting[] = [
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

  const reviews: Review[] = [
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

  const applicants: Applicant[] = [
    {
      id: 1,
      name: 'Ana Garcia',
      initials: 'AG',
      rating: 4.7,
      reviewsCount: 15,
      description: 'I have 5 years of experience in house cleaning. I bring my own equipment and supplies.',
      services: ['House Cleaning', 'Deep Cleaning', 'Laundry', 'Organizing'],
      appliedDate: 'Dec 15, 2025',
    },
    {
      id: 2,
      name: 'Pedro Santos',
      initials: 'PS',
      rating: 4.9,
      reviewsCount: 28,
      description: 'Professional cleaner with 8 years experience. I specialize in deep cleaning and post-construction cleanup.',
      services: ['House Cleaning', 'Deep Cleaning', 'Post-Construction Cleanup', 'Window Cleaning', 'Carpet Cleaning'],
      appliedDate: 'Dec 14, 2025',
    },
  ];

  // Mock hired applicants data
  const hiredApplicants: HiredApplicant[] = [
    {
      id: 1,
      serviceName: 'Garden Landscaping',
      providerName: 'Carlos Mendez',
      providerInitials: 'CM',
      status: 'in-progress',
      price: 1500,
    },
    {
      id: 2,
      serviceName: 'House Cleaning',
      providerName: 'Ana Garcia',
      providerInitials: 'AG',
      status: 'completed',
      price: 800,
    },
    {
      id: 3,
      serviceName: 'Install Ceiling Fan',
      providerName: 'Pedro Santos',
      providerInitials: 'PS',
      status: 'pending',
      price: 700,
    },
  ];

  // Mock detailed applicant profile data generator
  const getApplicantProfileDataById = (applicantId: number | null): ApplicantProfileData | null => {
    if (!applicantId) return null;
    const applicant = applicants.find(app => app.id === applicantId);
    if (!applicant) return null;

    // This is mock data - in production, this would come from an API
    return {
      id: applicant.id,
      name: applicant.name,
      initials: applicant.initials,
      rating: applicant.rating,
      reviewsCount: applicant.reviewsCount,
      appliedDate: applicant.appliedDate,
      applicationMessage: applicant.description,
      email: 'ana.garcia@email.com',
      phone: '+63 917 123 4567',
      location: 'Carmen, Cagayan de Oro',
      dateOfBirth: 'March 10, 1992',
      skills: applicant.services,
      workExperience: [
        {
          position: 'Professional Cleaner',
          company: 'CleanPro Services',
          period: '2020 - Present',
        },
        {
          position: 'Housekeeper',
          company: 'Private Residence',
          period: '2018 - 2020',
        },
      ],
      education: [
        {
          degree: 'High School Diploma',
          school: 'CDO National High School',
          year: '2010',
        },
      ],
      certifications: [
        {
          name: 'TESDA Housekeeping NC II',
          verified: true,
        },
      ],
      resume: {
        filename: 'Ana_Garcia_Resume.pdf',
        type: 'PDF Document',
      },
      reviews: [
        {
          reviewerName: 'Maria Santos',
          reviewerInitials: 'MS',
          quote: 'Very thorough and professional!',
          date: 'Nov 2025',
          rating: 5,
        },
        {
          reviewerName: 'Juan Cruz',
          reviewerInitials: 'JC',
          quote: 'Always on time and does excellent work.',
          date: 'Oct 2025',
          rating: 5,
        },
        {
          reviewerName: 'Lisa Reyes',
          reviewerInitials: 'LR',
          quote: 'Good service, would hire again.',
          date: 'Sep 2025',
          rating: 4.5,
        },
      ],
    };
  };

  return {
    jobPostings,
    reviews,
    applicants,
    hiredApplicants,
    getApplicantProfileData: getApplicantProfileDataById,
  };
};

