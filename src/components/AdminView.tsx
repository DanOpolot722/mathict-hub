import React, { useState, useEffect } from 'react';
import { 
  Announcement, 
  AnnouncementCategory, 
  ResourceItem, 
  PricingPlan, 
  Subject, 
  ResourceType, 
  FileFormat, 
  SiteConfig 
} from '../types';
import { useToast } from './Toast';
import { useAuth, PRIMARY_ADMIN_EMAIL } from '../firebase/AuthContext';
import { 
  saveAnnouncement, 
  deleteAnnouncement, 
  saveResource, 
  deleteResource, 
  savePricingPlan, 
  deletePricingPlan,
  saveSiteSettings,
  seedInitialDataIfEmpty 
} from '../firebase/cmsService';
import { 
  Lock, 
  LogOut, 
  Bell, 
  FileText, 
  DollarSign, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Database, 
  ShieldCheck, 
  FolderOpen,
  Phone,
  User,
  GraduationCap
} from 'lucide-react';

interface AdminViewProps {
  announcements: Announcement[];
  resources: ResourceItem[];
  pricing: PricingPlan[];
  siteConfig: SiteConfig;
}

export function AdminView({
  announcements,
  resources,
  pricing,
  siteConfig,
}: AdminViewProps) {
  const { showToast } = useToast();
  const { currentUser, isAdmin, isLoading, loginWithGoogle, loginWithPasscode, logout, isPasscodeAuthenticated } = useAuth();
  const [adminTab, setAdminTab] = useState<'announcements' | 'resources' | 'pricing' | 'site_content' | 'folders'>('announcements');
  const [isSeeding, setIsSeeding] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authErrorDetail, setAuthErrorDetail] = useState<string | null>(null);

  // --- Announcement Form State ---
  const [annId, setAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('notes');
  const [annDate, setAnnDate] = useState(new Date().toISOString().slice(0, 10));
  const [annBody, setAnnBody] = useState('');
  const [isSubmittingAnn, setIsSubmittingAnn] = useState(false);

  // --- Resource Form State (Description is strictly removed/optional) ---
  const [resId, setResId] = useState<string | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState<Subject>('mathematics');
  const [resLevel, setResLevel] = useState<'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'All'>('S1');
  const [resType, setResType] = useState<ResourceType>('notes');
  const [resFileFormat, setResFileFormat] = useState<FileFormat>('pdf');
  const [resIsFree, setResIsFree] = useState<boolean>(true);
  const [resPriceUgx, setResPriceUgx] = useState<string>('15000');
  const [resDriveUrl, setResDriveUrl] = useState('');
  const [isSubmittingRes, setIsSubmittingRes] = useState(false);

  // --- Pricing Plan Form State (Description removed) ---
  const [planId, setPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planFeatures, setPlanFeatures] = useState('');
  const [planBadge, setPlanBadge] = useState('');
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  // --- Site Content & Settings Form State ---
  const [teacherName, setTeacherName] = useState(siteConfig.teacherName);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [country, setCountry] = useState(siteConfig.country);
  const [school, setSchool] = useState(siteConfig.school || '');
  const [bio, setBio] = useState(siteConfig.bio || '');
  const [heroHeading, setHeroHeading] = useState(siteConfig.heroHeading || '');
  const [heroSubtitle, setHeroSubtitle] = useState(siteConfig.heroSubtitle || '');
  const [whatsappNumber, setWhatsappNumber] = useState(siteConfig.whatsappNumber);
  const [whatsappMessage, setWhatsappMessage] = useState(siteConfig.whatsappMessage);
  const [driveEmail, setDriveEmail] = useState(siteConfig.driveEmail);
  const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);

  // --- Folders State ---
  const [mathFolder, setMathFolder] = useState(siteConfig.driveFolders.mathematics);
  const [ictFolder, setIctFolder] = useState(siteConfig.driveFolders.ict);
  const [pastPapersFolder, setPastPapersFolder] = useState(siteConfig.driveFolders.pastPapers);
  const [assignmentsFolder, setAssignmentsFolder] = useState(siteConfig.driveFolders.assignments);
  const [markingGuidesFolder, setMarkingGuidesFolder] = useState(siteConfig.driveFolders.markingGuides);

  useEffect(() => {
    setTeacherName(siteConfig.teacherName);
    setTagline(siteConfig.tagline);
    setCountry(siteConfig.country);
    setSchool(siteConfig.school || '');
    setBio(siteConfig.bio || '');
    setHeroHeading(siteConfig.heroHeading || '');
    setHeroSubtitle(siteConfig.heroSubtitle || '');
    setWhatsappNumber(siteConfig.whatsappNumber);
    setWhatsappMessage(siteConfig.whatsappMessage);
    setDriveEmail(siteConfig.driveEmail);
    setMathFolder(siteConfig.driveFolders.mathematics);
    setIctFolder(siteConfig.driveFolders.ict);
    setPastPapersFolder(siteConfig.driveFolders.pastPapers);
    setAssignmentsFolder(siteConfig.driveFolders.assignments);
    setMarkingGuidesFolder(siteConfig.driveFolders.markingGuides);
  }, [siteConfig]);

  // --- Announcement Handlers ---
  const handleEditAnnouncement = (ann: Announcement) => {
    setAnnId(ann.id);
    setAnnTitle(ann.title);
    setAnnCategory(ann.category);
    setAnnDate(ann.date);
    setAnnBody(ann.body);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetAnnForm = () => {
    setAnnId(null);
    setAnnTitle('');
    setAnnCategory('notes');
    setAnnDate(new Date().toISOString().slice(0, 10));
    setAnnBody('');
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) {
      showToast('Please provide both title and details', 'error');
      return;
    }
    setIsSubmittingAnn(true);
    try {
      const item: Announcement = {
        id: annId || `ann-${Date.now()}`,
        title: annTitle.trim(),
        category: annCategory,
        date: annDate || new Date().toISOString().slice(0, 10),
        body: annBody.trim(),
        isCustom: true,
      };
      await saveAnnouncement(item);
      showToast(annId ? 'Announcement updated!' : 'New announcement posted live!', 'success');
      resetAnnForm();
    } catch (error) {
      showToast('Failed to save announcement.', 'error');
    } finally {
      setIsSubmittingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to remove this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      showToast('Announcement deleted from cloud', 'info');
    } catch (error) {
      showToast('Failed to delete announcement.', 'error');
    }
  };

  // --- Resource Handlers (Description removed) ---
  const handleEditResource = (item: ResourceItem) => {
    setResId(item.id);
    setResTitle(item.title);
    setResSubject(item.subject);
    setResLevel(item.level);
    setResType(item.type);
    setResFileFormat(item.fileFormat);
    setResIsFree(item.isFree);
    setResPriceUgx(item.priceUgx ? String(item.priceUgx) : '15000');
    setResDriveUrl(item.driveUrl || '');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetResForm = () => {
    setResId(null);
    setResTitle('');
    setResSubject('mathematics');
    setResLevel('S1');
    setResType('notes');
    setResFileFormat('pdf');
    setResIsFree(true);
    setResPriceUgx('15000');
    setResDriveUrl('');
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) {
      showToast('Please provide a title for the material', 'error');
      return;
    }
    setIsSubmittingRes(true);
    try {
      const item: ResourceItem = {
        id: resId || `res-${Date.now()}`,
        title: resTitle.trim(),
        subject: resSubject,
        level: resLevel,
        type: resType,
        fileFormat: resFileFormat,
        isFree: resIsFree,
        priceUgx: !resIsFree && resPriceUgx ? parseInt(resPriceUgx, 10) : undefined,
        driveUrl: resDriveUrl.trim() || undefined,
      };
      await saveResource(item);
      showToast(resId ? 'Resource updated in cloud database!' : 'New resource published live!', 'success');
      resetResForm();
    } catch (error) {
      showToast('Failed to save resource.', 'error');
    } finally {
      setIsSubmittingRes(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to remove this resource?')) return;
    try {
      await deleteResource(id);
      showToast('Resource removed from cloud', 'info');
    } catch (error) {
      showToast('Failed to delete resource.', 'error');
    }
  };

  // --- Pricing Handlers (Description removed) ---
  const handleEditPricing = (plan: PricingPlan) => {
    setPlanId(plan.id);
    setPlanName(plan.name);
    setPlanPrice(plan.price);
    setPlanFeatures(plan.features.join('\n'));
    setPlanBadge(plan.badge || '');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetPricingForm = () => {
    setPlanId(null);
    setPlanName('');
    setPlanPrice('');
    setPlanFeatures('');
    setPlanBadge('');
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim() || !planPrice.trim()) {
      showToast('Please provide a package name and price', 'error');
      return;
    }
    setIsSubmittingPlan(true);
    try {
      const item: PricingPlan = {
        id: planId || `plan-${Date.now()}`,
        name: planName.trim(),
        price: planPrice.trim(),
        features: planFeatures
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        badge: planBadge.trim() || undefined,
      };
      await savePricingPlan(item);
      showToast(planId ? 'Pricing package updated!' : 'New pricing package created!', 'success');
      resetPricingForm();
    } catch (error) {
      showToast('Failed to save pricing package.', 'error');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleDeletePricing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    try {
      await deletePricingPlan(id);
      showToast('Pricing package deleted', 'info');
    } catch (error) {
      showToast('Failed to delete pricing package.', 'error');
    }
  };

  // --- Site Settings & Content Handler ---
  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSettings(true);
    try {
      const updatedConfig: SiteConfig = {
        teacherName: teacherName.trim() || siteConfig.teacherName,
        tagline: tagline.trim() || siteConfig.tagline,
        country: country.trim() || siteConfig.country,
        school: school.trim(),
        bio: bio.trim(),
        heroHeading: heroHeading.trim(),
        heroSubtitle: heroSubtitle.trim(),
        whatsappNumber: whatsappNumber.trim() || siteConfig.whatsappNumber,
        whatsappMessage: whatsappMessage.trim() || siteConfig.whatsappMessage,
        driveEmail: driveEmail.trim() || siteConfig.driveEmail,
        driveFolders: {
          mathematics: mathFolder.trim() || siteConfig.driveFolders.mathematics,
          ict: ictFolder.trim() || siteConfig.driveFolders.ict,
          pastPapers: pastPapersFolder.trim() || siteConfig.driveFolders.pastPapers,
          assignments: assignmentsFolder.trim() || siteConfig.driveFolders.assignments,
          markingGuides: markingGuidesFolder.trim() || siteConfig.driveFolders.markingGuides,
        }
      };
      await saveSiteSettings(updatedConfig);
      showToast('Site content & settings updated live across the entire website!', 'success');
    } catch (error) {
      showToast('Failed to update site settings.', 'error');
    } finally {
      setIsSubmittingSettings(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await seedInitialDataIfEmpty();
      showToast(res.message, 'success');
    } catch (error) {
      showToast('Error syncing initial data to Firestore.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC]">Verifying administrator credentials...</p>
      </div>
    );
  }

  // 2. Unauthenticated View (Strictly restricted to Mr. Opolot Dan)
  if (!isAdmin) {
    const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginWithPasscode(passcodeInput);
      if (success) {
        showToast('Teacher Passcode Accepted! Welcome Mr. Dan.', 'success');
        setPasscodeInput('');
        setAuthErrorDetail(null);
      } else {
        showToast('Incorrect Teacher Passcode. Please try again.', 'error');
      }
    };

    return (
      <div className="max-w-md mx-auto py-12 px-4 pb-20">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B3E91] to-[#14B8A6] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Private Teacher Admin
            </h1>
            <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
              Exclusively for Mr. Opolot Dan (<strong>{PRIMARY_ADMIN_EMAIL}</strong>).
            </p>
          </div>

          {/* Error explanation banner if Google popup errored */}
          {authErrorDetail && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <strong className="block font-semibold">Sign-In Note:</strong>
              <p>{authErrorDetail}</p>
              <p className="opacity-90">You can use your Master Teacher Passcode below to enter directly!</p>
            </div>
          )}

          {/* Primary Option: Google Sign-in */}
          <div className="space-y-3 pt-1">
            <button
              onClick={async () => {
                setAuthErrorDetail(null);
                try {
                  await loginWithGoogle();
                  showToast('Teacher Admin Authenticated!', 'success');
                } catch (e: any) {
                  const msg = e?.message || '';
                  if (msg === 'UNAUTHORIZED_ACCOUNT') {
                    setAuthErrorDetail(`You signed in with an unauthorized account. Access is strictly granted to ${PRIMARY_ADMIN_EMAIL}.`);
                    showToast('Access Denied: Only trdanopolot@gmail.com is authorized.', 'error');
                  } else if (e?.code === 'auth/unauthorized-domain' || msg.includes('unauthorized domain')) {
                    setAuthErrorDetail('Google requires GitHub Pages (danopolot722.github.io) in Firebase Authorized Domains. Use the Teacher Passcode below to log in right now!');
                    showToast('Domain not yet authorized in Firebase. Use Passcode below.', 'error');
                  } else if (e?.code === 'auth/popup-blocked') {
                    setAuthErrorDetail('Your mobile/browser blocked the Google popup window. Please allow popups or use the Passcode below.');
                    showToast('Popup was blocked by your browser.', 'error');
                  } else {
                    setAuthErrorDetail(e?.message || 'Google Sign-In was cancelled or encountered a network error.');
                    showToast('Google Sign-In error. Try passcode below.', 'error');
                  }
                }
              }}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-white dark:bg-[#0A1E33] border-2 border-gray-200 dark:border-white/20 hover:border-[#14B8A6] text-[#142433] dark:text-white font-semibold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-[#0E2540] px-3 text-xs font-mono text-[#4E6478] dark:text-[#9FB6CC] uppercase shrink-0">
              Or Master Passcode
            </span>
          </div>

          {/* Secondary Option: Direct Teacher Passcode */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Enter Teacher Passcode
              </label>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#0B3E91] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard
  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#EEF5FC] dark:from-[#0A1E33] dark:to-[#061A2E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Teacher Admin (Sole Manager)
            </span>
            <span className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
              {currentUser?.email || 'Passcode Authenticated'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
            Master Site Manager (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC]">
            Update announcements, learning materials, rates, bio, contact phone, and drive folders without coding.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0B3E91]/10 text-[#0B3E91] dark:text-[#58A6FF] hover:bg-[#0B3E91]/20 transition-colors"
            title="Sync default curriculum to database"
          >
            <Database className="w-3.5 h-3.5" />
            {isSeeding ? 'Syncing...' : 'Sync Curriculum'}
          </button>

          <button
            onClick={() => {
              logout();
              showToast('Signed out of Admin', 'info');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setAdminTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'announcements'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcements ({announcements.length})
        </button>

        <button
          onClick={() => setAdminTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'resources'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          Notes &amp; Papers ({resources.length})
        </button>

        <button
          onClick={() => setAdminTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'pricing'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Rates &amp; Packages ({pricing.length})
        </button>

        <button
          onClick={() => setAdminTab('site_content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'site_content'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <User className="w-4 h-4" />
          Bio, School &amp; Contact
        </button>

        <button
          onClick={() => setAdminTab('folders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'folders'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Drive Folders
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ANNOUNCEMENTS */}
      {/* ======================================================== */}
      {adminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#14B8A6]" />
                {annId ? 'Edit Announcement' : 'Post New Announcement'}
              </h2>
              {annId && (
                <button
                  type="button"
                  onClick={resetAnnForm}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Senior 4 mock examination timetable released"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Category
                  </label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  >
                    <option value="notes">📘 New Notes</option>
                    <option value="exam">⏱️ Exam Schedule</option>
                    <option value="holiday">🏖️ Holiday Work</option>
                    <option value="update">📢 School Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={annDate}
                    onChange={(e) => setAnnDate(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Details / Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  placeholder="Notice details..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAnn}
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#2FE0C4] text-white hover:text-[#0B3E91] font-semibold text-sm flex items-center justify-center gap-2 shadow"
              >
                <Check className="w-4 h-4" />
                {isSubmittingAnn ? 'Saving...' : annId ? 'Update Announcement' : 'Publish Announcement'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Active Announcements ({announcements.length})
            </h2>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="glass-panel p-4 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0B3E91]/10 text-[#0B3E91] dark:text-[#58A6FF] font-semibold">
                        {ann.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                        {ann.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B3E91] dark:text-[#EAF2FA] truncate">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC] line-clamp-2">
                      {ann.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditAnnouncement(ann)}
                      className="p-2 rounded-xl text-[#0B3E91] dark:text-[#58A6FF] hover:bg-black/5"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NOTES & PAPERS (DESCRIPTION REMOVED) */}
      {/* ======================================================== */}
      {adminTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#2E7DF2]" />
                {resId ? 'Edit Material / Note' : 'Add New Learning Material'}
              </h2>
              {resId && (
                <button
                  type="button"
                  onClick={resetResForm}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Senior 4 Mathematics Circles &amp; Tangents Revision"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2E7DF2]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Subject
                  </label>
                  <select
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value as Subject)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  >
                    <option value="mathematics">Mathematics</option>
                    <option value="ict">ICT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Class
                  </label>
                  <select
                    value={resLevel}
                    onChange={(e) => setResLevel(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  >
                    <option value="S1">Senior 1</option>
                    <option value="S2">Senior 2</option>
                    <option value="S3">Senior 3</option>
                    <option value="S4">Senior 4</option>
                    <option value="S5">Senior 5</option>
                    <option value="S6">Senior 6</option>
                    <option value="All">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Type
                  </label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as ResourceType)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  >
                    <option value="notes">Class Notes</option>
                    <option value="assignment">Assignment</option>
                    <option value="past-paper">Past Paper</option>
                    <option value="marking-guide">Marking Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Format
                  </label>
                  <select
                    value={resFileFormat}
                    onChange={(e) => setResFileFormat(e.target.value as FileFormat)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  >
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="doc">Word / Doc</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="resIsFree"
                    checked={resIsFree}
                    onChange={(e) => setResIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-[#14B8A6]"
                  />
                  <label htmlFor="resIsFree" className="text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA]">
                    Free Sample / Downloadable
                  </label>
                </div>

                {!resIsFree && (
                  <div>
                    <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                      Price (UGX)
                    </label>
                    <input
                      type="number"
                      value={resPriceUgx}
                      onChange={(e) => setResPriceUgx(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full text-sm p-2 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Google Drive / Direct File Link (Optional)
                </label>
                <input
                  type="url"
                  value={resDriveUrl}
                  onChange={(e) => setResDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2E7DF2]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRes}
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#2E7DF2] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
              >
                <Check className="w-4 h-4" />
                {isSubmittingRes ? 'Saving...' : resId ? 'Update Material' : 'Save Material to Cloud'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Active Resources ({resources.length})
            </h2>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="glass-panel p-4 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                        {res.subject.toUpperCase()} · {res.level}
                      </span>
                      {res.isFree ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                          Free
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">
                          UGX {res.priceUgx ? res.priceUgx.toLocaleString() : 'Paid'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#0B3E91] dark:text-[#EAF2FA] truncate">
                      {res.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditResource(res)}
                      className="p-2 rounded-xl text-[#0B3E91] dark:text-[#58A6FF] hover:bg-black/5"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PRICING & PACKAGES (DESCRIPTION REMOVED) */}
      {/* ======================================================== */}
      {adminTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                {planId ? 'Edit Package Rate' : 'Set New Price Package'}
              </h2>
              {planId && (
                <button
                  type="button"
                  onClick={resetPricingForm}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSavePricing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Package / Service Name
                </label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. 1-on-1 Online Live Tutoring"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Price &amp; Billing Interval
                  </label>
                  <input
                    type="text"
                    required
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    placeholder="e.g. UGX 50,000 / month or UGX 20,000"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={planBadge}
                    onChange={(e) => setPlanBadge(e.target.value)}
                    placeholder="e.g. Popular, Discounted"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Features / Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={planFeatures}
                  onChange={(e) => setPlanFeatures(e.target.value)}
                  placeholder="Personal coaching with Mr. Dan&#10;Weekly problem walkthroughs&#10;Exam papers included"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPlan}
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
              >
                <Check className="w-4 h-4" />
                {isSubmittingPlan ? 'Saving...' : planId ? 'Update Price Package' : 'Publish Price Package'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Active Packages &amp; Rates ({pricing.length})
            </h2>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {pricing.map((plan) => (
                <div
                  key={plan.id}
                  className="glass-panel p-5 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {plan.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold mb-1 inline-block">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                        {plan.name}
                      </h3>
                      <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {plan.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditPricing(plan)}
                        className="p-2 rounded-xl text-[#0B3E91] dark:text-[#58A6FF] hover:bg-black/5"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePricing(plan.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {plan.features.length > 0 && (
                    <ul className="text-xs text-[#4E6478] dark:text-[#9FB6CC] space-y-1 pt-1 border-t border-gray-100 dark:border-white/5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: BIO, SCHOOL & CONTACT DETAILS */}
      {/* ======================================================== */}
      {adminTab === 'site_content' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
              <User className="w-5 h-5 text-[#14B8A6]" />
              Teacher Profile, Contact &amp; Header
            </h2>
            <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC] mt-1">
              Changes made here update your name, tagline, WhatsApp phone number, and hero text immediately across the site.
            </p>
          </div>

          <form onSubmit={handleSaveSiteContent} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Tagline / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  WhatsApp Number (with country code, no +)
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Google Drive / Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={driveEmail}
                  onChange={(e) => setDriveEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  School / Affiliation
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Secondary Mathematics &amp; ICT Department"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Home Hero Heading
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Mathematics &amp; ICT Learning Hub"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Default WhatsApp Initial Greeting Message
              </label>
              <input
                type="text"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSettings}
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#0B3E91] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
            >
              <Check className="w-4 h-4" />
              {isSubmittingSettings ? 'Saving...' : 'Save Profile &amp; Contact Details'}
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: GOOGLE DRIVE FOLDERS */}
      {/* ======================================================== */}
      {adminTab === 'folders' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#2E7DF2]" />
              Connected Google Drive Folders
            </h2>
            <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC] mt-1">
              Replace folder IDs below whenever you create or organize new Google Drive folders for students.
            </p>
          </div>

          <form onSubmit={handleSaveSiteContent} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Mathematics Folder ID
              </label>
              <input
                type="text"
                required
                value={mathFolder}
                onChange={(e) => setMathFolder(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                ICT Folder ID
              </label>
              <input
                type="text"
                required
                value={ictFolder}
                onChange={(e) => setIctFolder(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Past Papers Folder ID
              </label>
              <input
                type="text"
                required
                value={pastPapersFolder}
                onChange={(e) => setPastPapersFolder(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Assignments Folder ID
              </label>
              <input
                type="text"
                required
                value={assignmentsFolder}
                onChange={(e) => setAssignmentsFolder(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Marking Guides Folder ID
              </label>
              <input
                type="text"
                required
                value={markingGuidesFolder}
                onChange={(e) => setMarkingGuidesFolder(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSettings}
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#0B3E91] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
            >
              <Check className="w-4 h-4" />
              {isSubmittingSettings ? 'Saving...' : 'Update Google Drive Folders'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
