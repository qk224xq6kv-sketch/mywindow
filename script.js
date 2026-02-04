document.addEventListener("DOMContentLoaded", () => {
  // Services-Accordion (immer nur eins offen)
  document.querySelectorAll(".service-card").forEach((card) => {
    const btn = card.querySelector(".service-head");
    const body = card.querySelector(".service-body");
    if (!btn || !body) return;

    function closeOthers() {
      document.querySelectorAll(".service-card").forEach((other) => {
        if (other === card) return;
        const obtn = other.querySelector(".service-head");
        const obody = other.querySelector(".service-body");
        other.classList.remove("is-open");
        if (obtn) obtn.setAttribute("aria-expanded", "false");
        if (obody) obody.hidden = true;
      });
    }

    function toggle() {
      const open = card.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      body.hidden = !open;
      if (open) closeOthers();
    }

    // Initial schließen
    body.hidden = true;
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", toggle);

    // Tastatur Support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        card.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        body.hidden = true;
      }
    });
  });
});
