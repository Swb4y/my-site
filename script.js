document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const action = form.getAttribute('action') || '/contact';
  const method = (form.getAttribute('method') || 'POST').toUpperCase();
  const data = new URLSearchParams(new FormData(form));
  try {
    const response = await fetch(action, {
      method,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: data,
      mode: 'cors'
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