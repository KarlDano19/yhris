// Gig Opportunities Dummy Data

export interface GigOpportunity {
  id: number;
  title: string;
  category: string;
  postedDate: string; // e.g., "1 day ago", "3 hours ago"
  clientName: string;
  clientInitials?: string;
  clientPhoto?: string | null;
  rating: number;
  jobsPosted: number; // Number of jobs the client has posted
  skills: string[]; // Required skills/technologies
  budgetMin: number;
  budgetMax: number;
  duration: string; // e.g., "2-3 weeks", "1 week"
  proposalsCount: number;
  description: string;
  requirements?: string[]; // Project requirements as bullet points
  clientId?: number;
}

// Gig Opportunities Dummy Data
export const dummyGigOpportunities: GigOpportunity[] = [
  {
    id: 1,
    title: 'Build a Simple E-commerce Website',
    category: 'Web Development',
    postedDate: '1 day ago',
    clientName: 'Maria Santos',
    clientInitials: 'MS',
    rating: 4.8,
    jobsPosted: 12,
    skills: ['React', 'Node.js', 'E-commerce', 'Payment Integration'],
    budgetMin: 25000,
    budgetMax: 35000,
    duration: '2-3 weeks',
    proposalsCount: 8,
    description: 'I need a simple e-commerce website for my small business selling handmade crafts. The website should be user-friendly and allow customers to browse products, add to cart, and checkout easily.',
    requirements: [
      'Responsive design',
      'Payment gateway integration (GCash, Maya)',
      'Product catalog with categories',
      'Basic inventory management',
    ],
    clientId: 101,
  },
  {
    id: 2,
    title: 'Logo Design for Coffee Shop',
    category: 'Graphic Design',
    postedDate: '3 hours ago',
    clientName: 'Juan dela Cruz',
    clientInitials: 'JD',
    rating: 5.0,
    jobsPosted: 3,
    skills: ['Logo Design', 'Branding', 'Adobe Illustrator'],
    budgetMin: 5000,
    budgetMax: 8000,
    duration: '1 week',
    proposalsCount: 15,
    description: 'Looking for a creative logo design for a new coffee shop opening soon. Need something modern and inviting that represents our brand values.',
    requirements: [
      'Modern and minimalist design',
      'Vector format (AI, SVG)',
      'Color variations (full color, black & white)',
      'Brand guidelines document',
    ],
    clientId: 102,
  },
  {
    id: 3,
    title: 'Ceiling Fan Installation',
    category: 'Home Services',
    postedDate: '5 hours ago',
    clientName: 'Roberto Reyes',
    clientInitials: 'RR',
    rating: 4.5,
    jobsPosted: 7,
    skills: ['Electrical', 'Installation', 'Home Repair'],
    budgetMin: 2000,
    budgetMax: 3500,
    duration: '1 day',
    proposalsCount: 5,
    description: 'Need professional installation of ceiling fan in living room. Must have proper electrical wiring knowledge and tools.',
    requirements: [
      'Licensed electrician preferred',
      'Proper safety equipment',
      'Clean installation',
      'Warranty on work',
    ],
    clientId: 103,
  },
  {
    id: 4,
    title: 'Mobile App Development - React Native',
    category: 'Web Development',
    postedDate: '2 days ago',
    clientName: 'Sarah Garcia',
    clientInitials: 'SG',
    rating: 4.9,
    jobsPosted: 8,
    skills: ['React Native', 'Mobile Development', 'API Integration'],
    budgetMin: 50000,
    budgetMax: 75000,
    duration: '1-2 months',
    proposalsCount: 12,
    description: 'Looking for an experienced React Native developer to build a mobile app for iOS and Android. Must have experience with API integration and state management.',
    requirements: [
      'React Native experience (2+ years)',
      'API integration',
      'State management (Redux/MobX)',
      'App store deployment',
    ],
    clientId: 104,
  },
  {
    id: 5,
    title: 'Video Editing for YouTube Channel',
    category: 'Video Editing',
    postedDate: '6 hours ago',
    clientName: 'Anna Rodriguez',
    clientInitials: 'AR',
    rating: 4.5,
    jobsPosted: 5,
    skills: ['Video Editing', 'Premiere Pro', 'After Effects'],
    budgetMin: 8000,
    budgetMax: 12000,
    duration: '2 weeks',
    proposalsCount: 9,
    description: 'Need a video editor for our YouTube channel. Must be skilled in Premiere Pro or Final Cut Pro. Looking for someone who can create engaging edits with transitions and effects.',
    requirements: [
      'Premiere Pro or Final Cut Pro',
      'Color grading',
      'Motion graphics',
      'Quick turnaround time',
    ],
    clientId: 105,
  },
  {
    id: 6,
    title: 'Copywriting for Product Descriptions',
    category: 'Writing',
    postedDate: '1 day ago',
    clientName: 'Robert Lim',
    clientInitials: 'RL',
    rating: 4.4,
    jobsPosted: 4,
    skills: ['Copywriting', 'SEO Writing', 'E-commerce'],
    budgetMin: 5000,
    budgetMax: 10000,
    duration: '1 week',
    proposalsCount: 7,
    description: 'E-commerce store needs compelling product descriptions written for 50 products. Must be SEO-friendly and conversion-focused. Experience with e-commerce copywriting required.',
    requirements: [
      'SEO-optimized content',
      'Conversion-focused copy',
      'E-commerce experience',
      'Quick delivery',
    ],
    clientId: 106,
  },
  {
    id: 7,
    title: 'Data Entry and Excel Management',
    category: 'Data Entry',
    postedDate: '4 hours ago',
    clientName: 'Lisa Chen',
    clientInitials: 'LC',
    rating: 4.6,
    jobsPosted: 6,
    skills: ['Excel', 'Data Entry', 'Data Analysis'],
    budgetMin: 3000,
    budgetMax: 5000,
    duration: '3-5 days',
    proposalsCount: 11,
    description: 'Need help organizing and entering data into Excel spreadsheets. Must be detail-oriented and proficient in Excel formulas and functions.',
    requirements: [
      'Excel proficiency',
      'Attention to detail',
      'Data validation',
      'Quick turnaround',
    ],
    clientId: 107,
  },
  {
    id: 8,
    title: 'Photography for Corporate Event',
    category: 'Photography',
    postedDate: '1 day ago',
    clientName: 'David Wong',
    clientInitials: 'DW',
    rating: 4.9,
    jobsPosted: 10,
    skills: ['Event Photography', 'Corporate Events', 'Photo Editing'],
    budgetMin: 20000,
    budgetMax: 30000,
    duration: '1 day',
    proposalsCount: 6,
    description: 'Corporate event photography needed for company anniversary. Must have professional camera equipment and experience with event photography. Deliverables include edited photos.',
    requirements: [
      'Professional camera equipment',
      'Event photography experience',
      'Photo editing',
      'High-resolution images',
    ],
    clientId: 108,
  },
];

