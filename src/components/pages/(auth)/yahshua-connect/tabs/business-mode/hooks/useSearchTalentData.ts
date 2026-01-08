export interface Talent {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  jobsDone: number;
  portfolioCount?: number;
  location: string;
  hourlyMin: number;
  hourlyMax: number;
  skills: string[];
  languages: string[];
  education?: string;
  about?: string;
  availability?: string;
}

const talents: Talent[] = [
  {
    id: 1,
    name: 'Carlo Mendoza',
    title: 'Full-Stack Developer',
    rating: 4.9,
    reviews: 47,
    jobsDone: 52,
    portfolioCount: 12,
    location: 'Cagayan de Oro City',
    hourlyMin: 800,
    hourlyMax: 1200,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    languages: ['English', 'Filipino'],
    education: 'BS Computer Science - UP Diliman',
    about: 'Senior developer with 8 years of experience building scalable web applications. Specialized in fintech and e-commerce solutions.',
    availability: 'Available Now',
  },
  {
    id: 2,
    name: 'Patricia Lim',
    title: 'UI/UX Designer',
    rating: 5.0,
    reviews: 31,
    jobsDone: 38,
    portfolioCount: 8,
    location: 'Cebu City',
    hourlyMin: 600,
    hourlyMax: 900,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    languages: ['English', 'Filipino'],
    education: 'BS Information Design - Ateneo de Manila University',
    about: 'Designs intuitive experiences with a research-first approach. Strong portfolio in mobile-first product design.',
    availability: 'Available Now',
  },
  {
    id: 3,
    name: 'Miguel Torres',
    title: 'Licensed Electrician',
    rating: 4.7,
    reviews: 89,
    jobsDone: 156,
    portfolioCount: 24,
    location: 'Butuan City',
    hourlyMin: 600,
    hourlyMax: 900,
    skills: ['Electrical Wiring', 'Installation', 'Troubleshooting', 'Solar Panels'],
    languages: ['English', 'Filipino'],
    education: 'Certified Master Electrician',
    about: 'Specializes in residential and commercial electrical work with emphasis on safety and standards compliance.',
    availability: 'Available Now',
  },
];

const useSearchTalentData = () => {
  return { talents };
};

export default useSearchTalentData;
