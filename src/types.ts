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
  description: string;
  isFree: boolean;
  driveUrl?: string;
}

export type AnnouncementCategory = 'notes' | 'exam' | 'holiday' | 'update';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  body: string;
  isCustom?: boolean;
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
  whatsappNumber: string;
  whatsappMessage: string;
  driveEmail: string;
  driveFolders: DriveFolders;
}

export type ActiveTab = 'home' | 'about' | 'resources' | 'support' | 'announcements' | 'admin';
