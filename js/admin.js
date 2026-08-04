/* =========================================================================
   ADMIN PANEL
   This is a client-side demo admin panel. Because the site is a static
   GitHub Pages site with no server, everything here is stored in the
   browser's localStorage on the device used to log in — it is a way to
   preview how announcements/links management would work, and to keep
   your own editing notes. It is NOT a secure, multi-user backend.

   For a real production admin (usable from any device, by only you),
   swap this for a small headless CMS (e.g. Google Sheets as a data
   source, Firebase, or Netlify/Cloudflare Forms) — the render functions
   below (renderAnnouncementsAdmin, etc.) are the only places you'd need
   to point at a real API instead of localStorage.
   ========================================================================= */

const ADMIN_PASSCODE = "15000314"; // change this, then tell trusted admins the new code

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".admin-panel")) return;
  initAdminAuth();
  initAdminNav();
  renderAnnouncementsAdmin();
  renderSettingsAdmin();
  initAdminForms();
});

/* ---- Auth (very light — localStorage flag, demo only) --------------------- */
function initAdminAuth() {
  const loginForm = document.querySelector("#admin-login-form");
  const loggedIn = sessionStorage.getItem("mathict_admin") === "1";
  toggleAdminAccess(loggedIn);

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const val = document.querySelector("#admin-passcode").value;
      if (val === ADMIN_PASSCODE) {
        sessionStorage.setItem("mathict_admin", "1");
        toggleAdminAccess(true);
        showToast("Welcome back, admin.");
      } else {
        showToast("Incorrect passcode.");
      }
    });
  }

  const logoutBtn = document.querySelector("#admin-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("mathict_admin");
    toggleAdminAccess(false);
  });
}

function toggleAdminAccess(isLoggedIn) {
  document.querySelector(".admin-login").style.display = isLoggedIn ? "none" : "block";
  document.querySelector(".admin-panel-inner").style.display = isLoggedIn ? "grid" : "none";
}

/* ---- Sidebar nav ------------------------------------------------------- */
function initAdminNav() {
  document.querySelectorAll("[data-admin-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-view]").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-view").forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#view-${btn.dataset.adminView}`).classList.add("active");
    });
  });
}

/* ---- Announcements CRUD (localStorage) --------------------------------- */
function getAnnouncements() {
  const raw = localStorage.getItem("mathict_announcements");
  return raw ? JSON.parse(raw) : [];
}
function saveAnnouncements(list) {
  localStorage.setItem("mathict_announcements", JSON.stringify(list));
}

function renderAnnouncementsAdmin() {
  const list = document.querySelector("#admin-announcement-list");
  if (!list) return;
  const items = getAnnouncements();
  list.innerHTML = items.length ? "" : `<p class="empty-state">No announcements added yet. Use the form to add one — it will also appear on the public Announcements page.</p>`;

  items.slice().reverse().forEach((item, revIdx) => {
    const idx = items.length - 1 - revIdx;
    const row = document.createElement("div");
    row.className = "admin-list-item";
    row.innerHTML = `
      <div>
        <span class="badge ${item.category}">${item.category}</span>
        <strong style="display:block;">${escapeHtml(item.title)}</strong>
        <small style="color:var(--ink-soft);">${item.date}</small>
      </div>
      <button class="btn btn-outline btn-sm" data-remove-idx="${idx}">Remove</button>`;
    list.appendChild(row);
  });

  list.querySelectorAll("[data-remove-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const items2 = getAnnouncements();
      items2.splice(Number(btn.dataset.removeIdx), 1);
      saveAnnouncements(items2);
      renderAnnouncementsAdmin();
      showToast("Announcement removed.");
    });
  });
}

/* ---- Settings (whatsapp number / drive email — display only in demo) --- */
function renderSettingsAdmin() {
  const numberField = document.querySelector("#setting-whatsapp");
  const emailField = document.querySelector("#setting-drive-email");
  if (numberField) numberField.value = "+" + SITE_CONFIG.whatsappNumber;
  if (emailField) emailField.value = SITE_CONFIG.driveEmail;
}

/* ---- Forms --------------------------------------------------------------- */
function initAdminForms() {
  const annForm = document.querySelector("#admin-announcement-form");
  if (annForm) {
    annForm.addEventListener("submit", e => {
      e.preventDefault();
      const items = getAnnouncements();
      items.push({
        title: document.querySelector("#ann-title").value,
        category: document.querySelector("#ann-category").value,
        date: document.querySelector("#ann-date").value || new Date().toISOString().slice(0, 10),
        body: document.querySelector("#ann-body").value
      });
      saveAnnouncements(items);
      annForm.reset();
      renderAnnouncementsAdmin();
      showToast("Announcement saved.");
    });
  }

  const settingsForm = document.querySelector("#admin-settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", e => {
      e.preventDefault();
      showToast("Settings like this are read from js/config.js. Edit that file and redeploy to change them site-wide.");
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
