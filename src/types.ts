export type Subject = 'mathematics' | 'ict';
export type ResourceType = 'notes' | 'assignment' | 'past-paper' | 'marking-guide';
export type FileFormat = 'pdf' | 'doc';

export interface ResourceItem {
  id: string;
  title: string;
  subject: Subject;
  level: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'All';
  type: ResourceType;
  fileFormat: FileFormat;
  description?: string;
  isFree: boolean;
  priceUgx?: number;
  driveUrl?: string;
  updatedAt?: string;
}

export type AnnouncementCategory = 'notes' | 'exam' | 'holiday' | 'update';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  body: string;
  isCustom?: boolean;
  updatedAt?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string; // e.g. "UGX 30,000 / month" or "UGX 15,000 per paper"
  description?: string;
  features: string[]; // bullets
  badge?: string;
  popular?: boolean;
  order?: number;
}

export interface DriveFolders {
  mathematics: string;
  ict: string;
  pastPapers: string;
  assignments: string;
  markingGuides: string;
}

export interface SiteConfig {
  teacherName: string;
  tagline: string;
  country: string;
  school?: string;
  bio?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  driveEmail: string;
  driveFolders: DriveFolders;
}

export type ActiveTab = 'home' | 'about' | 'resources' | 'support' | 'announcements' | 'admin';
