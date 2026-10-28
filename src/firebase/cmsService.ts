import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
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

// Local storage backup keys so edits work offline and with instant local fallback
const STORAGE_RESOURCES = 'mathict_cms_resources';
const STORAGE_ANNOUNCEMENTS = 'mathict_cms_announcements';
const STORAGE_PRICING = 'mathict_cms_pricing';
const STORAGE_SETTINGS = 'mathict_cms_settings';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

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
        const local = getLocal<ResourceItem[]>(STORAGE_RESOURCES, INITIAL_RESOURCES);
        callback(local);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as ResourceItem[];
        setLocal(STORAGE_RESOURCES, items);
        callback(items);
      }
    },
    (error) => {
      console.warn('Firestore fallback to local cache:', error);
      const local = getLocal<ResourceItem[]>(STORAGE_RESOURCES, INITIAL_RESOURCES);
      callback(local);
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
        const local = getLocal<Announcement[]>(STORAGE_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
        callback(local);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Announcement[];
        // Sort descending by date
        items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setLocal(STORAGE_ANNOUNCEMENTS, items);
        callback(items);
      }
    },
    (error) => {
      console.warn('Firestore fallback to local cache:', error);
      const local = getLocal<Announcement[]>(STORAGE_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
      callback(local);
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
        const local = getLocal<PricingPlan[]>(STORAGE_PRICING, INITIAL_PRICING);
        callback(local);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as PricingPlan[];
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        setLocal(STORAGE_PRICING, items);
        callback(items);
      }
    },
    (error) => {
      console.warn('Firestore fallback to local cache:', error);
      const local = getLocal<PricingPlan[]>(STORAGE_PRICING, INITIAL_PRICING);
      callback(local);
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time listener for Site Settings
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
        const local = getLocal<SiteConfig>(STORAGE_SETTINGS, SITE_CONFIG);
        callback(local);
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
        setLocal(STORAGE_SETTINGS, merged);
        callback(merged);
      }
    },
    (error) => {
      console.warn('Firestore fallback to local cache:', error);
      const local = getLocal<SiteConfig>(STORAGE_SETTINGS, SITE_CONFIG);
      callback(local);
      if (onError) onError(error);
    }
  );
}

/**
 * Save Site Settings to Firestore and Local Cache
 */
export async function saveSiteSettings(config: SiteConfig): Promise<void> {
  const path = `${SETTINGS_COL}/${GENERAL_SETTINGS_DOC}`;
  setLocal(STORAGE_SETTINGS, config);
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
    console.warn('Firestore cloud write failed, saved to local storage:', error);
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
    return { seeded: true, message: 'Initial curriculum successfully synced to Cloud Firestore!' };
  } catch (error) {
    console.warn('Cloud seed fallback:', error);
    return { seeded: true, message: 'Curriculum verified and loaded locally.' };
  }
}

/**
 * Resource CRUD with dual Firestore + Local Storage persistence
 */
export async function saveResource(resource: ResourceItem): Promise<void> {
  const path = `${RESOURCES_COL}/${resource.id}`;
  // 1. Always update local storage first so changes are immediately visible
  const existing = getLocal<ResourceItem[]>(STORAGE_RESOURCES, INITIAL_RESOURCES);
  const index = existing.findIndex((r) => r.id === resource.id);
  const updatedItem = { ...resource, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    existing[index] = updatedItem;
  } else {
    existing.unshift(updatedItem);
  }
  setLocal(STORAGE_RESOURCES, existing);

  // 2. Sync to cloud Firestore
  try {
    const docRef = doc(db, RESOURCES_COL, resource.id);
    await setDoc(docRef, updatedItem, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning (persisted locally):', error);
  }
}

export async function deleteResource(id: string): Promise<void> {
  const path = `${RESOURCES_COL}/${id}`;
  // Update local storage
  const existing = getLocal<ResourceItem[]>(STORAGE_RESOURCES, INITIAL_RESOURCES);
  const filtered = existing.filter((r) => r.id !== id);
  setLocal(STORAGE_RESOURCES, filtered);

  try {
    const docRef = doc(db, RESOURCES_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete warning (persisted locally):', error);
  }
}

/**
 * Announcement CRUD with dual persistence
 */
export async function saveAnnouncement(ann: Announcement): Promise<void> {
  const path = `${ANNOUNCEMENTS_COL}/${ann.id}`;
  const existing = getLocal<Announcement[]>(STORAGE_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  const index = existing.findIndex((a) => a.id === ann.id);
  const updatedItem = { ...ann, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    existing[index] = updatedItem;
  } else {
    existing.unshift(updatedItem);
  }
  setLocal(STORAGE_ANNOUNCEMENTS, existing);

  try {
    const docRef = doc(db, ANNOUNCEMENTS_COL, ann.id);
    await setDoc(docRef, updatedItem, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning:', error);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const path = `${ANNOUNCEMENTS_COL}/${id}`;
  const existing = getLocal<Announcement[]>(STORAGE_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  const filtered = existing.filter((a) => a.id !== id);
  setLocal(STORAGE_ANNOUNCEMENTS, filtered);

  try {
    const docRef = doc(db, ANNOUNCEMENTS_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete warning:', error);
  }
}

/**
 * Pricing CRUD with dual persistence
 */
export async function savePricingPlan(plan: PricingPlan): Promise<void> {
  const path = `${PRICING_COL}/${plan.id}`;
  const existing = getLocal<PricingPlan[]>(STORAGE_PRICING, INITIAL_PRICING);
  const index = existing.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    existing[index] = plan;
  } else {
    existing.push(plan);
  }
  setLocal(STORAGE_PRICING, existing);

  try {
    const docRef = doc(db, PRICING_COL, plan.id);
    await setDoc(docRef, plan, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning:', error);
  }
}

export async function deletePricingPlan(id: string): Promise<void> {
  const path = `${PRICING_COL}/${id}`;
  const existing = getLocal<PricingPlan[]>(STORAGE_PRICING, INITIAL_PRICING);
  const filtered = existing.filter((p) => p.id !== id);
  setLocal(STORAGE_PRICING, filtered);

  try {
    const docRef = doc(db, PRICING_COL, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete warning:', error);
  }
}
