/* =========================================================================
   PUBLIC ANNOUNCEMENTS RENDERER
   Displays announcements added through the admin panel (stored in
   localStorage on this browser) above the static examples on the page.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const holder = document.querySelector("#live-announcements");
  if (!holder) return;

  const raw = localStorage.getItem("mathict_announcements");
  const items = raw ? JSON.parse(raw) : [];
  if (!items.length) return;

  items.slice().reverse().forEach(item => {
    const d = new Date(item.date);
    const day = isNaN(d) ? "--" : String(d.getDate()).padStart(2, "0");
    const mon = isNaN(d) ? "" : d.toLocaleString(undefined, { month: "short" });

    const el = document.createElement("div");
    el.className = "announcement";
    el.innerHTML = `
      <div class="a-date"><span class="day">${day}</span><span class="mon">${mon}</span></div>
      <div>
        <span class="badge ${item.category}">${item.category}</span>
        <h4 style="font-size:1rem; color:var(--navy);">${escapeAnn(item.title)}</h4>
        <p style="margin-top:4px;">${escapeAnn(item.body || "")}</p>
      </div>`;
    holder.appendChild(el);
  });
});

function escapeAnn(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
