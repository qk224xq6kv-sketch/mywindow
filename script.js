// Language switcher
document.getElementById('languageSelect').addEventListener('change', (e) => {
  const lang = e.target.value;
  document.querySelectorAll('[data-de][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
  });
});

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
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
  }
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Nachricht erhalten. Wir melden uns bald!');
  e.target.reset();
});
// Flip cards (Services)
function toggleFlip(card) {
  document.querySelectorAll(".flip-card.is-flipped").forEach((el) => {
    if (el !== card) el.classList.remove("is-flipped");
  });
  card.classList.toggle("is-flipped");
}
