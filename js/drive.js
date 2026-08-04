/* =========================================================================
   GOOGLE DRIVE INTEGRATION
   Renders a live, dynamically-loading list of files from a shared Google
   Drive folder using Google's public embeddedfolderview endpoint — no API
   key needed. Folders must be shared as "Anyone with the link can view".
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-drive-folder]").forEach(container => {
    const folderKey = container.getAttribute("data-drive-folder");
    const folderId = SITE_CONFIG.driveFolders[folderKey];
    renderDriveEmbed(container, folderId);
  });
});

function renderDriveEmbed(container, folderId) {
  const isPlaceholder = !folderId || folderId.startsWith("GOOGLE_DRIVE_");

  if (isPlaceholder) {
    container.innerHTML = `
      <div class="drive-embed">
        <div class="empty-state">
          📁 No folder connected yet.<br>
          Add this folder's ID in <code>js/config.js</code> to display its files here.
        </div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="drive-embed">
      <iframe src="${buildDriveEmbedUrl(folderId)}" loading="lazy" title="Google Drive folder"></iframe>
      <div class="drive-embed-note">Live folder · ${SITE_CONFIG.driveEmail}</div>
    </div>`;
}
