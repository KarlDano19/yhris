export interface Transaction {
  id: number;
  description: string;
  clientName: string;
  amount: number;
  date: string;
  category: string;
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

export interface WeeklyData {
  day: string;
  amount: number;
}

export const useEarningsData = () => {
  const thisMonthEarnings = 45230;
  const jobsCompleted = 23;

  const weeklyData: WeeklyData[] = [
    { day: 'W1', amount: 12500 },
    { day: 'W2', amount: 9800 },
    { day: 'W3', amount: 15200 },
    { day: 'W4', amount: 7700 },
  ];

  const recentPayments: Transaction[] = [
    {
      id: 1,
      description: 'Fix Leaking Sink',
      clientName: 'Maria Santos',
      amount: 1000,
      date: '2025-12-12',
      category: 'Service',
    },
    {
      id: 2,
      description: 'Install Ceiling Fan',
      clientName: 'Juan Cruz',
      amount: 750,
      date: '2025-12-10',
      category: 'Service',
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
    thisMonthEarnings,
    jobsCompleted,
    weeklyData,
    recentPayments,
    reviews,
  };
};

