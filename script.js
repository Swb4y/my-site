document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new URLSearchParams(new FormData(form));
  const action = form.getAttribute('action') || '/contact';
  const method = (form.getAttribute('method') || 'POST').toUpperCase();
  try {
    const response = await fetch(action, {
      method: method,
      headers: { 'Accept': 'application/json' },
      body: data
    });
    if (response.ok) {
      form.style.display = 'none';
      document.getElementById('success-message').style.display = 'block';
    } else {
      alert('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  } catch (error) {
    console.error(error);
    alert('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.');
  }
});