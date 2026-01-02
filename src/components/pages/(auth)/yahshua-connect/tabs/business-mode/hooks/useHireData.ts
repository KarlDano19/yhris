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

  return {
    jobPostings,
    reviews,
  };
};

