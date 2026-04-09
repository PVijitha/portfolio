export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web' | 'Mobile' | 'Dashboard';
  tags: string[];
  imageUrl: string;
  pinned?: boolean;
  pinOrder?: number | null;
  caseStudy: {
    problem: string;
    research: string;
    wireframes: string;
    finalUI: string;
    outcome: string;
    gallery?: string[];
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
