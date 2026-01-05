export interface EmploymentDocument {
  id: number;
  name: string;
  status: 'required' | 'uploaded';
  fileUrl?: string;
}

export interface WorkExperience {
  id: number;
  position: string;
  company: string;
  period: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  verified: boolean;
}

export interface PortfolioItem {
  id: number;
  title: string;
  type: string;
  url: string;
  icon: 'cart' | 'building';
}

export const useProfileData = () => {
  // Employment Documents
  const documents: EmploymentDocument[] = [
    { id: 1, name: 'Medical Certificate', status: 'required' },
    { id: 2, name: 'Certificate of Employment', status: 'required' },
    { id: 3, name: 'Birth Certificate', status: 'required' },
    { id: 4, name: 'Diploma', status: 'required' },
    { id: 5, name: 'Transcript of Records (TOR)', status: 'required' },
    { id: 6, name: 'NBI/Police Clearance', status: 'required' },
  ];

  // Work Experience
  const workExperience: WorkExperience[] = [
    { id: 1, position: 'UX/UI Designer', company: 'Freelance', period: '2022-01 - Present' },
    { id: 2, position: 'Junior Designer', company: 'StartupPH', period: '2020-01 - 2022-01' },
  ];

  // Education
  const education: Education[] = [
    { id: 1, degree: 'BS Information Technology', school: 'XU - Xavier University', period: '2016 - 2020' },
  ];

  // Skills
  const skills: string[] = [
    'UX Research', 'Wireframing', 'Prototyping', 'Figma', 'Plumbing', 'Electrical Work'
  ];

  // Certifications
  const certifications: Certification[] = [
    { id: 1, name: 'Google UX Design Certificate', issuer: 'Google', verified: true },
    { id: 2, name: 'Licensed Master Plumber', issuer: 'PRC Philippines', verified: true },
  ];

  // Portfolio
  const portfolio: PortfolioItem[] = [
    { id: 1, title: 'E-commerce App Redesign', type: 'Mobile App', url: '#', icon: 'cart' },
    { id: 2, title: 'Banking Dashboard', type: 'Web App', url: '#', icon: 'building' },
  ];

  return {
    documents,
    workExperience,
    education,
    skills,
    certifications,
    portfolio,
  };
};

