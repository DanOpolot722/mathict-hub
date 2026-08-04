/* =========================================================================
   SITE CONFIGURATION
   Edit the values below to update contact details and Google Drive links.
   Nothing else in the site needs to change when you update these.
   ========================================================================= */

const SITE_CONFIG = {
  teacherName: "Mr. Opolot Dan",
  tagline: "Mathematics & ICT Learning Hub",
  country: "Uganda",

  /* ---- Contact -------------------------------------------------------- */
  // Full international number, digits only, no + or spaces.
  whatsappNumber: "256763060114",
  whatsappMessage: "Hello Mr. Opolot Dan. I need assistance with Mathematics/ICT studies.",

  // Google Drive account that owns the shared folders below.
  driveEmail: "trdanopolot@gmail.com",

  /* ---- Google Drive folder IDs -----------------------------------------
     Replace each placeholder with the ID from the folder's share link:
     https://drive.google.com/drive/folders/COPY_THIS_PART_ID
     Folders must be shared as "Anyone with the link can view".
     ------------------------------------------------------------------- */
  driveFolders: {
    mathematics: "11pIN_ehBj2fZ8SzExnANluLjLCRD0dnU",
    ict: "1g3ZbB6Qip1V25wVLo9GsbXweoDVicrjf",
    pastPapers: "1DlLUqJ18a13nz3eggvDMrZj9v_tQ55PO",
    assignments: "1I3JLeRq5HaJw-ySeTuMyg0FElFNYlPxI",
    markingGuides: "18p7CQVBCTN3ch-LJrZWARBZmoldhZ4KM"
  }
};

// Build a WhatsApp click-to-chat link with the pre-filled message.
function buildWhatsAppLink(customMessage) {
  const msg = encodeURIComponent(customMessage || SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${msg}`;
}

// Build an embeddable Google Drive folder view URL (no API key required
// as long as the folder is shared as "Anyone with the link can view").
function buildDriveEmbedUrl(folderId) {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}
