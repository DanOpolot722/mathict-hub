/* =========================================================================
   MAIN SITE SCRIPT — shared across every page
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyBrandDetails();
  initNav();
  initDarkMode();
  initWhatsApp();
  initBackToTop();
  initVisitorCounter();
  initResourceCounter();
});

/* ---- Fill in name / whatsapp links from config ------------------------ */
function applyBrandDetails() {
  document.querySelectorAll("[data-teacher-name]").forEach(el => el.textContent = SITE_CONFIG.teacherName);
  document.querySelectorAll("[data-tagline]").forEach(el => el.textContent = SITE_CONFIG.tagline);
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => el.href = buildWhatsAppLink());
  document.querySelectorAll("[data-whatsapp-number-display]").forEach(el => el.textContent = "+" + SITE_CONFIG.whatsappNumber);
  document.querySelectorAll("[data-drive-email]").forEach(el => el.textContent = SITE_CONFIG.driveEmail);
}

/* ---- Mobile nav toggle -------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `
    <svg class="icon-hamburger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  const hamburger = toggle.querySelector(".icon-hamburger");
  const close = toggle.querySelector(".icon-close");

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    hamburger.style.display = open ? "none" : "block";
    close.style.display = open ? "block" : "none";
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
}

/* ---- Dark mode ----------------------------------------------------------- */
function initDarkMode() {
  const btn = document.querySelector(".dark-toggle");
  const saved = localStorage.getItem("mathict_theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("mathict_theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("mathict_theme", "dark");
    }
  });
}

/* ---- WhatsApp floating popup --------------------------------------------- */
function initWhatsApp() {
  const fab = document.querySelector(".fab-whatsapp");
  const popup = document.querySelector(".whatsapp-popup");
  const closeBtn = document.querySelector(".whatsapp-popup-close");
  if (!fab || !popup) return;

  fab.addEventListener("click", () => popup.classList.toggle("open"));
  if (closeBtn) closeBtn.addEventListener("click", () => popup.classList.remove("open"));

  const sendBtn = document.querySelector(".whatsapp-popup-send");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const input = document.querySelector(".whatsapp-popup-input");
      const message = (input && input.value.trim()) || SITE_CONFIG.whatsappMessage;
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  }
}

/* ---- Back to top ---------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector(".fab-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 480);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---- Visitor counter (local, per-browser demo counter) -------------------
   NOTE: this is a client-side demo counter stored in localStorage, so it
   only counts visits from the current browser. For a real cross-visitor
   count, connect a service such as Google Analytics or a small backend
   (e.g. Cloudflare Worker + KV) and swap the function body below.
   ---------------------------------------------------------------------- */
function initVisitorCounter() {
  const el = document.querySelector("[data-visitor-count]");
  if (!el) return;
  let count = parseInt(localStorage.getItem("mathict_visits") || "0", 10);
  const lastVisit = sessionStorage.getItem("mathict_visited_session");
  if (!lastVisit) {
    count += 1;
    localStorage.setItem("mathict_visits", String(count));
    sessionStorage.setItem("mathict_visited_session", "1");
  }
  el.textContent = count.toLocaleString();
}

/* ---- Resource + order counters (demo, localStorage-based) ---------------- */
function initResourceCounter() {
  document.querySelectorAll("[data-resource-total]").forEach(el => {
    const cards = document.querySelectorAll(".resource-card").length;
    el.textContent = cards || el.textContent;
  });

  let orders = parseInt(localStorage.getItem("mathict_downloads") || "0", 10);
  document.querySelectorAll("[data-download-count]").forEach(el => el.textContent = orders.toLocaleString());

  // Free samples: these download directly, no WhatsApp order needed.
  document.querySelectorAll("[data-free-download]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      showToast(`Downloading "${btn.getAttribute("data-free-download")}"…`);
    });
  });

  // Premium resources: "Order" buttons don't download directly — they open
  // WhatsApp with a pre-filled order message naming the specific resource.
  document.querySelectorAll("[data-order-resource]").forEach(btn => {
    btn.addEventListener("click", () => {
      orders += 1;
      localStorage.setItem("mathict_downloads", String(orders));
      document.querySelectorAll("[data-download-count]").forEach(el => el.textContent = orders.toLocaleString());

      const resourceName = btn.getAttribute("data-order-resource");
      const message = `Hello Mr. Opolot Dan. I would like to order this premium resource: "${resourceName}". Please share payment details / send it across.`;
      showToast("Opening WhatsApp to place your order…");
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  });
}

/* ---- Toast helper ---------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
