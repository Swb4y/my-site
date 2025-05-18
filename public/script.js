document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new URLSearchParams(new FormData(form));
  try {
    const response = await fetch('/contact', {
      method: 'POST',
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