// Shared jobs data for Home, Find Work, and My Jobs pages
// This is the single source of truth for all job data

export interface Job {
  id: number;
  title: string;
  clientName: string;
  clientInitials?: string;
  clientLocation: string;
  location: string;
  distance?: string;
  rating: number;
  hiresCount?: number;
  description: string;
  time: string;
  priceRange: string;
  tags?: string[];
  status: 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled';
  urgent: boolean;
}

// All jobs including pending and accepted/scheduled
// This represents the complete job list
export const getAllJobs = (): Job[] => {
  return [
    {
      id: 1,
      title: 'Fix Leaking Kitchen Sink',
      clientName: 'Maria Santos',
      clientInitials: 'MS',
      clientLocation: 'Carmen, Cagayan de Oro',
      location: 'Carmen, Cagayan de Oro',
      distance: '0.8 km',
      rating: 4.7,
      hiresCount: 15,
      description: 'Kitchen sink has been leaking for 2 days.',
      time: 'Today, 2:00 PM',
      priceRange: '₱800 - ₱1,200',
      tags: ['Plumbing', 'Sink Repair'],
      status: 'accepted', // This is accepted/scheduled
      urgent: true,
    },
    {
      id: 2,
      title: 'Install Ceiling Fan',
      clientName: 'Juan Cruz',
      clientInitials: 'JC',
      clientLocation: 'Gusa, Cagayan de Oro',
      location: 'Gusa, Cagayan de Oro',
      distance: '1.5 km',
      rating: 5,
      hiresCount: 28,
      description: 'Need electrician to install ceiling fan.',
      time: 'Tomorrow, 9:00 AM',
      priceRange: '₱600 - ₱900',
      tags: ['Electrical', 'Installation'],
      status: 'pending', // This is still pending
      urgent: false,
    },
    {
      id: 3,
      title: 'House Deep Cleaning',
      clientName: 'Ana Garcia',
      clientInitials: 'AG',
      clientLocation: 'Macasandig, Cagayan de Oro',
      location: 'Macasandig, Cagayan de Oro',
      distance: '2.1 km',
      rating: 4.5,
      hiresCount: 5,
      description: 'Need deep cleaning service for 3-bedroom house. All cleaning materials will be provided.',
      time: 'Tomorrow, 10:00 AM - 2:00 PM',
      priceRange: '₱1,500 - ₱2,000',
      tags: ['Cleaning'],
      status: 'pending', // This is still pending
      urgent: false,
    },
    {
      id: 4,
      title: 'Garden Landscaping',
      clientName: 'Robert Tan',
      clientInitials: 'RT',
      clientLocation: 'Lapasan, Cagayan de Oro',
      location: 'Lapasan, Cagayan de Oro',
      distance: '3.5 km',
      rating: 4.9,
      hiresCount: 15,
      description: 'Need landscaping work for front yard garden. Plants and materials will be provided.',
      time: 'Dec 5, 8:00 AM',
      priceRange: '₱2,000 - ₱3,000',
      tags: ['Landscaping'],
      status: 'pending', // This is still pending
      urgent: false,
    },
  ];
};

