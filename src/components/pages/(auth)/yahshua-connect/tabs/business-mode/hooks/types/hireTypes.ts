export interface HiredApplicant {
  id: number;
  serviceName: string;
  providerName: string;
  providerInitials: string;
  status: 'in-progress' | 'completed' | 'pending';
  price: number;
}

export interface ApplicantProfileData {
  id: number;
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  appliedDate: string;
  applicationMessage: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  skills: string[];
  workExperience: {
    position: string;
    company: string;
    period: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: {
    name: string;
    verified: boolean;
  }[];
  resume: {
    filename: string;
    type: string;
  };
  reviews: {
    reviewerName: string;
    reviewerInitials: string;
    quote: string;
    date: string;
    rating: number;
  }[];
}


