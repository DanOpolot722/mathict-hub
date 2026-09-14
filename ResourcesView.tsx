import { useState, useMemo } from 'react';
import { ResourceItem, Subject } from '../types';
import { INITIAL_RESOURCES, SITE_CONFIG, buildWhatsAppLink, buildDriveFolderUrl, buildDriveEmbedUrl } from '../data/config';
import { useToast } from './Toast';
import { 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  FolderOpen, 
  Lock, 
  Gift, 
  Filter, 
  BookOpen, 
  Monitor, 
  ChevronRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface ResourcesViewProps {
  onOrderPlaced: () => void;
}

export function ResourcesView({ onOrderPlaced }: ResourcesViewProps) {
  const { showToast } = useToast();
  const [activeSubject, setActiveSubject] = useState<Subject>('mathematics');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDriveFolder, setActiveDriveFolder] = useState<keyof typeof SITE_CONFIG.driveFolders>('mathematics');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return INITIAL_RESOURCES.filter((res) => {
      if (res.subject !== activeSubject) return false;
      if (selectedLevel !== 'All' && res.level !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchDesc = res.description.toLowerCase().includes(q);
        const matchLevel = res.level.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLevel) return false;
      }
      return true;
    });
  }, [activeSubject, selectedLevel, searchQuery]);

  // Group by resource type
  const notesResources = filteredResources.filter((r) => r.type === 'notes');
  const assignments = filteredResources.filter((r) => r.type === 'assignment');
  const pastPapers = filteredResources.filter((r) => r.type === 'past-paper');
  const markingGuides = filteredResources.filter((r) => r.type === 'marking-guide');

  const handleFreeDownload = (item: ResourceItem) => {
    showToast(`Downloading free resource: "${item.title}"...`, 'success');
    if (item.driveUrl) {
      window.open(item.driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`Sample ready. Inquiring on WhatsApp...`, 'info');
      const msg = `Hello Mr. Opolot Dan. I am downloading the free sample for "${item.title}".`;
      window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
    }
  };

  const handleOrderResource = (item: ResourceItem) => {
    onOrderPlaced();
    showToast(`Opening WhatsApp to order "${item.title}"...`, 'success');
    const msg = `Hello Mr. Opolot Dan. I would like to order this premium resource: "${item.title}". Please share payment details / send it across.`;
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const levels = activeSubject === 'mathematics' 
    ? ['All', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'] 
    : ['All', 'S1', 'S2', 'S3', 'S4'];

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <section className="relative overflow-hidden pt-8 pb-10 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#14B8A6] text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2FE0C4] text-xs font-mono font-medium">
            <FolderOpen className="w-3.5 h-3.5" />
            UNEB Secondary Curriculum Materials
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Learning Resources &amp; Past Papers
          </h1>
          <p className="text-sm sm:text-base text-[#C7D6DC] leading-relaxed">
            Organised by class level for Senior 1 through Senior 6. Browse free samples or order full premium revision packets via WhatsApp.
          </p>
        </div>
      </section>

      {/* Search & Subject Tabs Controls */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-[#4E6478] dark:text-[#9FB6CC] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, class (e.g. S4), past papers..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#0A1E33] border border-gray-200 dark:border-white/15 text-sm sm:text-base text-[#142433] dark:text-white placeholder:text-[#4E6478]/70 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4E6478] hover:text-[#0B3E91]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Notice on Free Samples vs Premium */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F2A73B]/10 border border-[#F2A73B]/30 text-xs sm:text-sm text-[#142433] dark:text-[#EAF2FA]">
          <Gift className="w-5 h-5 text-[#F2A73B] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#A9700C] dark:text-[#F2C572] block mb-0.5">
              Free Samples + Premium Packets
            </span>
            Key foundation resources (like Senior 1 Notes &amp; Term 2 assignments) are <strong>100% Free</strong>. Full syllabus revision packets and marking guides are <strong>Premium</strong> — tap "Order via WhatsApp" to request them directly from Mr. Dan.
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Mathematics vs ICT tab switch */}
          <div className="inline-flex p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <button
              onClick={() => {
                setActiveSubject('mathematics');
                setSelectedLevel('All');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                activeSubject === 'mathematics'
                  ? 'bg-white dark:bg-[#0E2540] text-[#0B3E91] dark:text-[#58A6FF] shadow-sm'
                  : 'text-[#4E6478] dark:text-[#9FB6CC] hover:text-[#0B3E91]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#2E7DF2]" />
              Mathematics (S1–S6)
            </button>
            <button
              onClick={() => {
                setActiveSubject('ict');
                setSelectedLevel('All');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                activeSubject === 'ict'
                  ? 'bg-white dark:bg-[#0E2540] text-[#14B8A6] dark:text-[#2FE0C4] shadow-sm'
                  : 'text-[#4E6478] dark:text-[#9FB6CC] hover:text-[#14B8A6]'
              }`}
            >
              <Monitor className="w-4 h-4 text-[#14B8A6]" />
              ICT (S1–S4)
            </button>
          </div>

          {/* Level Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-mono text-[#4E6478] dark:text-[#9FB6CC] shrink-0 mr-1 hidden sm:inline">
              Class:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all min-h-[36px] ${
                  selectedLevel === lvl
                    ? 'bg-[#0B3E91] dark:bg-[#2E7DF2] text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Sections */}
      <div className="space-y-8">
        {/* Section: Class Notes */}
        {notesResources.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#14B8A6]" />
                Class Notes
              </h2>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC]">
                {notesResources.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {notesResources.map((item) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  onFreeDownload={() => handleFreeDownload(item)}
                  onOrder={() => handleOrderResource(item)}
                  onPreview={() => setPreviewItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section: Assignments */}
        {assignments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2E7DF2]" />
                Assignments &amp; Practice Sets
              </h2>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC]">
                {assignments.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {assignments.map((item) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  onFreeDownload={() => handleFreeDownload(item)}
                  onOrder={() => handleOrderResource(item)}
                  onPreview={() => setPreviewItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section: Past Papers */}
        {pastPapers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F2A73B]" />
                National Examination Past Papers
              </h2>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC]">
                {pastPapers.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {pastPapers.map((item) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  onFreeDownload={() => handleFreeDownload(item)}
                  onOrder={() => handleOrderResource(item)}
                  onPreview={() => setPreviewItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section: Marking Guides */}
        {markingGuides.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#14B8A6]" />
                Marking Guides &amp; Solutions
              </h2>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC]">
                {markingGuides.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {markingGuides.map((item) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  onFreeDownload={() => handleFreeDownload(item)}
                  onOrder={() => handleOrderResource(item)}
                  onPreview={() => setPreviewItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredResources.length === 0 && (
          <div className="text-center py-12 p-6 glass-panel rounded-3xl space-y-3">
            <Search className="w-8 h-8 text-[#4E6478] mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              No resources match your search
            </h3>
            <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] max-w-sm mx-auto">
              Try searching a different class level, clearing the filter, or request the specific topic directly on WhatsApp.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#14B8A6] text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Google Drive Shared Folders Section */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#0B3E91] dark:text-[#58A6FF]">
              <FolderOpen className="w-5 h-5 text-[#2E7DF2]" />
              <h2 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Live Google Drive Archive
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1">
              Direct cloud repository owned by <strong>{SITE_CONFIG.driveEmail}</strong>. Free to browse on mobile or desktop.
            </p>
          </div>

          <a
            href={buildDriveFolderUrl(SITE_CONFIG.driveFolders[activeDriveFolder])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3E91] dark:bg-[#2E7DF2] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#1451B8] transition-all min-h-[44px]"
          >
            <span>Open in Google Drive</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Folder Selectors */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SITE_CONFIG.driveFolders) as Array<keyof typeof SITE_CONFIG.driveFolders>).map((key) => {
            const labels: Record<string, string> = {
              mathematics: 'Mathematics Folder',
              ict: 'ICT Folder',
              pastPapers: 'Past Papers Folder',
              assignments: 'Assignments Folder',
              markingGuides: 'Marking Guides Folder',
            };
            const isSelected = activeDriveFolder === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDriveFolder(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
                  isSelected
                    ? 'bg-[#14B8A6] text-white font-bold shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
                }`}
              >
                📁 {labels[key]}
              </button>
            );
          })}
        </div>

        {/* Folder Container / Iframe */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#061A2E]">
          <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="font-mono text-[#4E6478] dark:text-[#9FB6CC]">
              Folder ID: {SITE_CONFIG.driveFolders[activeDriveFolder]}
            </span>
            <span className="text-[#14B8A6] font-semibold">Public Viewer Mode</span>
          </div>

          <div className="relative w-full h-80 sm:h-96">
            <iframe
              src={buildDriveEmbedUrl(SITE_CONFIG.driveFolders[activeDriveFolder])}
              title={`Google Drive folder for ${activeDriveFolder}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4E6478] dark:text-[#9FB6CC] gap-2 text-center sm:text-left">
            <span>If the preview above is restricted on your phone's browser, tap the button to open directly in Google Drive app.</span>
            <a
              href={buildDriveFolderUrl(SITE_CONFIG.driveFolders[activeDriveFolder])}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2E7DF2] dark:text-[#58A6FF] hover:underline shrink-0"
            >
              Open Full Folder →
            </a>
          </div>
        </div>
      </section>

      {/* Preview Modal for Sample Notes */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E2540] border border-gray-200 dark:border-white/15 p-6 sm:p-7 shadow-2xl space-y-4">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#4E6478] dark:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                previewItem.isFree
                  ? 'bg-[#14B8A6]/15 text-[#14B8A6]'
                  : 'bg-[#F2A73B]/15 text-[#A9700C] dark:text-[#F2C572]'
              }`}>
                {previewItem.isFree ? '🎁 Free Sample' : '🔒 Premium Resource'}
              </span>
              <h3 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                {previewItem.title}
              </h3>
              <p className="text-xs text-[#14B8A6] font-mono font-semibold">
                Class: {previewItem.level} · Subject: {previewItem.subject.toUpperCase()}
              </p>
            </div>

            <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed bg-[#EEF5FC] dark:bg-white/5 p-3.5 rounded-2xl">
              {previewItem.description}
            </p>

            {previewItem.isFree ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                  This sample is ready for instant viewing or offline PDF download:
                </p>
                <div className="flex gap-2.5">
                  <a
                    href={previewItem.driveUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setPreviewItem(null)}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0B3E91] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Document
                  </a>
                  <button
                    onClick={() => {
                      handleFreeDownload(previewItem);
                      setPreviewItem(null);
                    }}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#2FE0C4] text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                  To access the full comprehensive version with model solutions, order via WhatsApp from Mr. Dan:
                </p>
                <button
                  onClick={() => {
                    handleOrderResource(previewItem);
                    setPreviewItem(null);
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
                >
                  <FolderOpen className="w-4 h-4" />
                  Order via WhatsApp Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ResourceCardProps {
  key?: string | number;
  item: ResourceItem;
  onFreeDownload: () => void;
  onOrder: () => void;
  onPreview: () => void;
}

// Single Resource Card Component
function ResourceCard({
  item,
  onFreeDownload,
  onOrder,
  onPreview,
}: ResourceCardProps) {

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* File Info */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Badge icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-xs ${
          item.fileFormat === 'pdf'
            ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30'
            : 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
        }`}>
          {item.fileFormat.toUpperCase()}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {item.isFree ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/30">
                🎁 Free Sample
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F2A73B]/15 text-[#A9700C] dark:text-[#F2C572] border border-[#F2A73B]/30">
                🔒 Premium
              </span>
            )}
            <span className="text-[11px] font-mono text-[#4E6478] dark:text-[#9FB6CC]">
              {item.level}
            </span>
          </div>

          <h4 className="text-base font-bold text-[#0B3E91] dark:text-[#EAF2FA] leading-snug truncate">
            {item.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-white/10">
        <button
          onClick={onPreview}
          className="flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-white/20 text-[#0B3E91] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          View
        </button>

        {item.isFree ? (
          <button
            onClick={onFreeDownload}
            className="flex-1 sm:flex-none min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#14B8A6] hover:bg-[#2FE0C4] text-white hover:text-[#0B3E91] flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            Download Free
          </button>
        ) : (
          <button
            onClick={onOrder}
            className="flex-1 sm:flex-none min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#1EBE5A] text-white flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Order on WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
