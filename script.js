// Language switcher (safe)
const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
  languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    document.querySelectorAll('[data-de][data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });
  });
}


// Booking form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) bookingForm.addEventListener('submit', async (e) => {
});

  e.preventDefault();
  
  const inputs = e.target.querySelectorAll('input, select, textarea');
  const formData = {
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    date: inputs[3].value,
    service: inputs[4].value,
    notes: inputs[5].value
  };

  try {
    const response = await fetch('/book-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Termin erfolgreich gebucht! Sie erhalten eine Email und SMS.');
      e.target.reset();
    } else {
      alert('Fehler: ' + result.message);
    }
  } catch (error) {
    alert('Fehler beim Senden: ' + error.message);
  }// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', (e) => {

e.preventDefault();
  alert('Nachricht erhalten. Wir melden uns bald!');
  e.target.reset();
});
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

  btn.addEventListener("click", toggle);

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


// Vorteil-Accordion (Memory-Effekt: nur eins offen)
const advAccordion = document.getElementById("advAccordion");
if (advAccordion) {
  advAccordion.querySelectorAll(".adv-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;

      // alles schließen
      advAccordion.querySelectorAll(".adv-panel").forEach((p) => {
        if (p !== panel) p.hidden = true;
      });

      advAccordion.querySelectorAll(".adv-item").forEach((b) => {
        if (b !== btn) {
          b.setAttribute("aria-expanded", "false");
          const icon = b.querySelector(".adv-icon");
          if (icon) icon.textContent = "+";
        }
      });

      // aktuelles togglen
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;

      const icon = btn.querySelector(".adv-icon");
      if (icon) icon.textContent = isOpen ? "+" : "–";
    });
  });
}

