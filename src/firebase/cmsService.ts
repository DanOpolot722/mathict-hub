import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { ResourceItem, Announcement, PricingPlan, SiteConfig } from '../types';
import { INITIAL_RESOURCES, INITIAL_ANNOUNCEMENTS, INITIAL_PRICING, SITE_CONFIG } from '../data/config';

// Collection references
const RESOURCES_COL = 'resources';
const ANNOUNCEMENTS_COL = 'announcements';
const PRICING_COL = 'pricing';
const SETTINGS_COL = 'settings';
const GENERAL_SETTINGS_DOC = 'general';

/**
 * Real-time listener for Resources with fallback to local defaults if collection is empty
 */
export function subscribeToResources(
  callback: (items: ResourceItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, RESOURCES_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_RESOURCES);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as ResourceItem[];
        callback(items);
      }
    },
    (error) => {
      console.warn('Falling back to local resources:', error);
      callback(INITIAL_RESOURCES);
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time listener for Announcements with fallback to local defaults if collection is empty
 */
export function subscribeToAnnouncements(
  callback: (items: Announcement[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ANNOUNCEMENTS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ANNOUNCEMENTS);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Announcement[];
        // Sort descending by date
        items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        callback(items);
      }
    },
    (error) => {
      console.warn('Falling back to local announcements:', error);
      callback(INITIAL_ANNOUNCEMENTS);
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time listener for Pricing Plans with fallback to local defaults if empty
 */
export function subscribeToPricing(
  callback: (items: PricingPlan[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PRICING_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_PRICING);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as PricingPlan[];
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        callback(items);
      }
    },
    (error) => {
      console.warn('Falling back to local pricing:', error);
      callback(INITIAL_PRICING);
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time listener for Site Settings (Teacher Name, WhatsApp, Bio, School, Drive Folders)
 */
export function subscribeToSettings(
  callback: (settings: SiteConfig) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SETTINGS_COL, GENERAL_SETTINGS_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(SITE_CONFIG);
      } else {
        const data = docSnap.data();
        const merged: SiteConfig = {
          teacherName: data.teacherName || SITE_CONFIG.teacherName,
          tagline: data.tagline || SITE_CONFIG.tagline,
          country: data.country || SITE_CONFIG.country,
          school: data.school || 'Secondary Mathematics & ICT Department',
          bio: data.bio || '',
          heroHeading: data.heroHeading || 'Mathematics & ICT Learning Hub',
          heroSubtitle: data.heroSubtitle || 'Direct access to UNEB curriculum notes, past papers, practical guides, and 1-on-1 support directly from Mr. Opolot Dan.',
          whatsappNumber: data.whatsappNumber || SITE_CONFIG.whatsappNumber,
          whatsappMessage: data.whatsappMessage || SITE_CONFIG.whatsappMessage,
          driveEmail: data.driveEmail || SITE_CONFIG.driveEmail,
          driveFolders: {
            mathematics: data.mathFolder || SITE_CONFIG.driveFolders.mathematics,
            ict: data.ictFolder || SITE_CONFIG.driveFolders.ict,
            pastPapers: data.pastPapersFolder || SITE_CONFIG.driveFolders.pastPapers,
            assignments: data.assignmentsFolder || SITE_CONFIG.driveFolders.assignments,
            markingGuides: data.markingGuidesFolder || SITE_CONFIG.driveFolders.markingGuides,
          }
        };
        callback(merged);
      }
    },
    (error) => {
      console.warn('Falling back to local settings:', error);
      callback(SITE_CONFIG);
      if (onError) onError(error);
    }
  );
}

/**
 * Save Site Settings to Firestore
 */
export async function saveSiteSettings(config: SiteConfig): Promise<void> {
  const path = `${SETTINGS_COL}/${GENERAL_SETTINGS_DOC}`;
  try {
    const docRef = doc(db, SETTINGS_COL, GENERAL_SETTINGS_DOC);
    await setDoc(docRef, {
      teacherName: config.teacherName,
      tagline: config.tagline,
      country: config.country,
      school: config.school || '',
      bio: config.bio || '',
      heroHeading: config.heroHeading || '',
      heroSubtitle: config.heroSubtitle || '',
      whatsappNumber: config.whatsappNumber,
      whatsappMessage: config.whatsappMessage,
      driveEmail: config.driveEmail,
      mathFolder: config.driveFolders.mathematics,
      ictFolder: config.driveFolders.ict,
      pastPapersFolder: config.driveFolders.pastPapers,
      assignmentsFolder: config.driveFolders.assignments,
      markingGuidesFolder: config.driveFolders.markingGuides,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Seed initial data to cloud Firestore if empty
 */
export async function seedInitialDataIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  try {
    const resourcesSnap = await getDocs(collection(db, RESOURCES_COL));
    if (!resourcesSnap.empty) {
      return { seeded: false, message: 'Firestore already populated.' };
    }

    const batch = writeBatch(db);

    // Seed resources
    for (const res of INITIAL_RESOURCES) {
      const docRef = doc(db, RESOURCES_COL, res.id);
      batch.set(docRef, { ...res, updatedAt: new Date().toISOString() });
    }

    // Seed announcements
    for (const ann of INITIAL_ANNOUNCEMENTS) {
      const docRef = doc(db, ANNOUNCEMENTS_COL, ann.id);
      batch.set(docRef, { ...ann, updatedAt: new Date().toISOString() });
    }

    // Seed pricing
    for (const pr of INITIAL_PRICING) {
      const docRef = doc(db, PRICING_COL, pr.id);
      batch.set(docRef, pr);
    }

    // Seed settings
    const settingsRef = doc(db, SETTINGS_COL, GENERAL_SETTINGS_DOC);
    batch.set(settingsRef, {
      teacherName: SITE_CONFIG.teacherName,
      tagline: SITE_CONFIG.tagline,
      country: SITE_CONFIG.country,
      whatsappNumber: SITE_CONFIG.whatsappNumber,
      whatsappMessage: SITE_CONFIG.whatsappMessage,
      driveEmail: SITE_CONFIG.driveEmail,
      mathFolder: SITE_CONFIG.driveFolders.mathematics,
      ictFolder: SITE_CONFIG.driveFolders.ict,
      pastPapersFolder: SITE_CONFIG.driveFolders.pastPapers,
      assignmentsFolder: SITE_CONFIG.driveFolders.assignments,
      markingGuidesFolder: SITE_CONFIG.driveFolders.markingGuides,
      updatedAt: new Date().toISOString()
    });

    await batch.commit();
    return { seeded: true, message: 'Initial educational content successfully seeded to Cloud Firestore!' };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

/**
 * Resource CRUD
 */
export async function saveResource(resource: ResourceItem): Promise<void> {
  const path = `${RESOURCES_COL}/${resource.id}`;
  try {
    const docRef = doc(db, RESOURCES_COL, resource.id);
    await setDoc(docRef, {
      ...resource,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteResource(id: string): Promise<void> {
  const path = `${RESOURCES_COL}/${id}`;
  try {
    const docRef = doc(db, RESOURCES_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Announcement CRUD
 */
export async function saveAnnouncement(ann: Announcement): Promise<void> {
  const path = `${ANNOUNCEMENTS_COL}/${ann.id}`;
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COL, ann.id);
    await setDoc(docRef, {
      ...ann,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const path = `${ANNOUNCEMENTS_COL}/${id}`;
  try {
    const docRef = doc(db, ANNOUNCEMENTS_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Pricing CRUD
 */
export async function savePricingPlan(plan: PricingPlan): Promise<void> {
  const path = `${PRICING_COL}/${plan.id}`;
  try {
    const docRef = doc(db, PRICING_COL, plan.id);
    await setDoc(docRef, plan, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePricingPlan(id: string): Promise<void> {
  const path = `${PRICING_COL}/${id}`;
  try {
    const docRef = doc(db, PRICING_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
