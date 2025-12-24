
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  category: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  zalo?: string;
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  description: string;
  order?: number;
}

export interface GuestMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  replied: boolean;
}

export interface PublicDocument {
  id: string;
  name: string;
  label?: string;
  description?: string;
  type: string;
  uploadDate: string;
  url: string;
  order?: number;
}

export interface SiteConfig {
  heroVideoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  mission: string;
  vision: string;
  address: string;
  phone: string;
  zalo: string;
  email: string;
  googleMapsEmbed: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  establishmentDecision: string;
  businessLicense: string;
  representative: string;
  foundingDate: string;
  brandNamePrincipal: string;
  brandNameSub: string;
  brandShortName: string;
  brandLogoImage?: string;
  // Dynamic Stats
  statsYears?: string;
  statsTeachers?: string;
  statsCourses?: string;
  statsSatisfaction?: string;
}

export type AppState = {
  config: SiteConfig;
  courses: Course[];
  teachers: Teacher[];
  achievements: Achievement[];
  messages: GuestMessage[];
  isAuthenticated: boolean;
  lastLoginDay?: string;
  categories: string[];
  publicDocuments: PublicDocument[];
};
