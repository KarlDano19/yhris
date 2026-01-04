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

  return {
    jobPostings,
    reviews,
    applicants,
  };
};

