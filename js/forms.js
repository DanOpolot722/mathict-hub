/* =========================================================================
   STUDENT SUPPORT FORMS
   Every form marked [data-whatsapp-form] is compiled into a single message
   and opened as a WhatsApp chat — there is no server involved, so nothing
   is stored beyond what WhatsApp itself keeps in the conversation.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-whatsapp-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const parts = [];
      form.querySelectorAll("input, select, textarea").forEach(field => {
        if (!field.value) return;
        const label = field.previousElementSibling && field.previousElementSibling.tagName === "LABEL"
          ? field.previousElementSibling.textContent
          : field.id;
        parts.push(`${label}: ${field.value}`);
      });

      const message = `Hello Mr. Opolot Dan.\n\n${parts.join("\n")}`;
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  });
});
