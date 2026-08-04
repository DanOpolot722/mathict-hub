/* =========================================================================
   RESOURCE SEARCH
   Filters visible .resource-card elements by title/description text.
   Works across whichever tab panel is currently active.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("[data-resource-search]");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".resource-card");
    let anyVisible = false;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const match = query === "" || text.includes(query);
      card.style.display = match ? "flex" : "none";
      if (match) anyVisible = true;
    });

    document.querySelectorAll(".resource-list").forEach(list => {
      const visibleCards = [...list.querySelectorAll(".resource-card")].filter(c => c.style.display !== "none");
      let empty = list.parentElement.querySelector(".search-empty");
      if (visibleCards.length === 0 && query !== "") {
        if (!empty) {
          empty = document.createElement("p");
          empty.className = "search-empty empty-state";
          empty.textContent = `No resources match "${query}" in this section.`;
          list.after(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    });
  });

  /* Tab switching (used on the Resources page) */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#${target}`).classList.add("active");
    });
  });
});
