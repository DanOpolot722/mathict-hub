import { SiteConfig, ResourceItem, Announcement } from '../types';

export const SITE_CONFIG: SiteConfig = {
  teacherName: "Mr. Opolot Dan",
  tagline: "Mathematics & ICT Learning Hub",
  country: "Uganda",
  whatsappNumber: "256763060114",
  whatsappMessage: "Hello Mr. Opolot Dan. I need assistance with Mathematics/ICT studies.",
  driveEmail: "trdanopolot@gmail.com",
  driveFolders: {
    mathematics: "11pIN_ehBj2fZ8SzExnANluLjLCRD0dnU",
    ict: "1g3ZbB6Qip1V25wVLo9GsbXweoDVicrjf",
    pastPapers: "1DlLUqJ18a13nz3eggvDMrZj9v_tQ55PO",
    assignments: "1I3JLeRq5HaJw-ySeTuMyg0FElFNYlPxI",
    markingGuides: "18p7CQVBCTN3ch-LJrZWARBZmoldhZ4KM"
  }
};

export function buildWhatsAppLink(customMessage?: string, number: string = SITE_CONFIG.whatsappNumber): string {
  const msg = encodeURIComponent(customMessage || SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${number}?text=${msg}`;
}

export function buildDriveFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

export function buildDriveEmbedUrl(folderId: string): string {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

export const INITIAL_RESOURCES: ResourceItem[] = [
  // Mathematics
  {
    id: 'math-s1-notes',
    title: 'Senior 1 Mathematics Notes',
    subject: 'mathematics',
    level: 'S1',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Numbers, algebra basics, and geometry foundations · Term 1–3',
    isFree: true,
    driveUrl: 'https://drive.google.com/file/d/1-zDg5yPyZAlIVB6MfZqW3-R9ijJ74x29/view?usp=drive_link'
  },
  {
    id: 'math-s2-notes',
    title: 'Senior 2 Mathematics Notes',
    subject: 'mathematics',
    level: 'S2',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Algebraic expressions, linear equations, and mensuration',
    isFree: false
  },
  {
    id: 'math-s3-notes',
    title: 'Senior 3 Mathematics Notes',
    subject: 'mathematics',
    level: 'S3',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Circle geometry, statistics, and simultaneous equations',
    isFree: false
  },
  {
    id: 'math-s4-notes',
    title: 'Senior 4 Mathematics Notes',
    subject: 'mathematics',
    level: 'S4',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'UCE revision: full syllabus summary and worked examples',
    isFree: false
  },
  {
    id: 'math-s5-notes',
    title: 'Senior 5 Mathematics Notes',
    subject: 'mathematics',
    level: 'S5',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Pure Mathematics: sequences, calculus introduction, vectors',
    isFree: false
  },
  {
    id: 'math-s6-notes',
    title: 'Senior 6 Mathematics Notes',
    subject: 'mathematics',
    level: 'S6',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'UACE revision: statistics, mechanics, and pure mathematics',
    isFree: false
  },
  {
    id: 'math-assign-uce-t2',
    title: 'UCE Mathematics Assignment — Term 2',
    subject: 'mathematics',
    level: 'S3',
    type: 'assignment',
    fileFormat: 'doc',
    description: 'Practice set with step-by-step model answers, Senior 2–3',
    isFree: true,
    driveUrl: 'https://drive.google.com/file/d/14vsFEs_WcT9Y_cdhOkFBVyVbf_YyuVWY/view?usp=sharing'
  },
  {
    id: 'math-pastpaper-uce-p1',
    title: 'UCE Mathematics Past Paper — Paper 1',
    subject: 'mathematics',
    level: 'S4',
    type: 'past-paper',
    fileFormat: 'pdf',
    description: 'Recent national examination paper with topic breakdown',
    isFree: true,
    driveUrl: 'https://drive.google.com/drive/folders/1DlLUqJ18a13nz3eggvDMrZj9v_tQ55PO'
  },
  {
    id: 'math-marking-guide-uce-p1',
    title: 'UCE Mathematics Marking Guide — Paper 1',
    subject: 'mathematics',
    level: 'S4',
    type: 'marking-guide',
    fileFormat: 'pdf',
    description: 'Full solutions, step marks, and examiner marking scheme',
    isFree: false,
    driveUrl: 'https://drive.google.com/file/d/1WndVqKDo-LAcnM-chOQVztXVsohglCCY/view?usp=drive_link'
  },

  // ICT
  {
    id: 'ict-s1-notes',
    title: 'Senior 1 ICT Notes',
    subject: 'ict',
    level: 'S1',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Computer basics, hardware & software, keyboarding and safety',
    isFree: true,
    driveUrl: 'https://drive.google.com/file/d/1Jv2HVKXReFYSX4QJMHAEDOkevm5C9dgt/view?usp=drive_link'
  },
  {
    id: 'ict-s2-notes',
    title: 'Senior 2 ICT Notes',
    subject: 'ict',
    level: 'S2',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Word processing, spreadsheets, and structured file management',
    isFree: false
  },
  {
    id: 'ict-s3-notes',
    title: 'Senior 3 ICT Notes',
    subject: 'ict',
    level: 'S3',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'Databases, network topology, and internet security fundamentals',
    isFree: false
  },
  {
    id: 'ict-s4-notes',
    title: 'Senior 4 ICT Notes',
    subject: 'ict',
    level: 'S4',
    type: 'notes',
    fileFormat: 'pdf',
    description: 'UCE revision: full ICT syllabus summary & practical exam tips',
    isFree: false
  },
  {
    id: 'ict-practical-spreadsheet',
    title: 'Spreadsheet Practical Guide',
    subject: 'ict',
    level: 'S3',
    type: 'notes',
    fileFormat: 'doc',
    description: 'Step-by-step Excel/Calc formulas, cell references, and chart exercises',
    isFree: false
  },
  {
    id: 'ict-assign-files',
    title: 'ICT Practical Assignment — File Management',
    subject: 'ict',
    level: 'S2',
    type: 'assignment',
    fileFormat: 'doc',
    description: 'Practical tasks on directory hierarchies, extensions, and backup methods',
    isFree: true,
    driveUrl: 'https://drive.google.com/drive/folders/1I3JLeRq5HaJw-ySeTuMyg0FElFNYlPxI'
  },
  {
    id: 'ict-pastpaper-uce-p1',
    title: 'UCE ICT Past Paper — Paper 1 (Theory)',
    subject: 'ict',
    level: 'S4',
    type: 'past-paper',
    fileFormat: 'pdf',
    description: 'Recent national examination paper with objective & structured sections',
    isFree: true,
    driveUrl: 'https://drive.google.com/drive/folders/1DlLUqJ18a13nz3eggvDMrZj9v_tQ55PO'
  },
  {
    id: 'ict-marking-guide-uce',
    title: 'UCE ICT Practical Marking Guide',
    subject: 'ict',
    level: 'S4',
    type: 'marking-guide',
    fileFormat: 'pdf',
    description: 'Practical paper walkthrough with expected screenshot outputs',
    isFree: false
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Senior 6 Mathematics: Mechanics notes uploaded',
    category: 'notes',
    date: '2026-07-28',
    body: 'Covers kinematics and forces, with worked past-paper questions. Find it under Resources → Mathematics → Senior 6.'
  },
  {
    id: 'ann-2',
    title: 'Term 3 mock examination timetable released',
    category: 'exam',
    date: '2026-07-20',
    body: 'Mathematics and ICT mocks begin the second week of term. Message on WhatsApp for the full timetable.'
  },
  {
    id: 'ann-3',
    title: 'Holiday revision packet: Algebra & Excel basics',
    category: 'holiday',
    date: '2026-07-10',
    body: 'A combined Mathematics and ICT holiday packet is now available under Resources → Assignments.'
  },
  {
    id: 'ann-4',
    title: 'Learning Hub officially launched',
    category: 'update',
    date: '2026-07-02',
    body: 'Welcome! This hub now hosts all Mathematics and ICT resources in one organised, mobile-friendly place.'
  }
];
