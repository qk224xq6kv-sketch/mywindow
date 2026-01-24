document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Vielen Dank! Ihr Termin wurde angefordert. Wir werden Sie bald kontaktieren.');
    this.reset();
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns baldmöglichst bei Ihnen melden.');
    this.reset();
});
