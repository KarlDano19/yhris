export interface SpendingTransaction {
  id: number;
  description: string;
  providerName: string;
  amount: number;
  date: string;
  category: string;
}

export interface WeeklySpendingData {
  day: string;
  amount: number;
}

export const useSpendingData = () => {
  const totalSpentThisMonth = 12800;
  const servicesHired = 2;

  const weeklySpendingData: WeeklySpendingData[] = [
    { day: 'W1', amount: 2500 },
    { day: 'W2', amount: 800 },
    { day: 'W3', amount: 3200 },
    { day: 'W4', amount: 1500 },
  ];

  const recentPayments: SpendingTransaction[] = [
    {
      id: 1,
      description: 'Hired: Home Cleaning Service',
      providerName: 'Ana Garcia',
      amount: 800,
      date: '2025-12-03',
      category: 'Service',
    },
    {
      id: 2,
      description: 'Hired: Garden Landscaping',
      providerName: 'Carlos Mendez',
      amount: 1500,
      date: '2025-12-01',
      category: 'Service',
    },
  ];

  return {
    totalSpentThisMonth,
    servicesHired,
    weeklySpendingData,
    recentPayments,
  };
};

