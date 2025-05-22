// public/script.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* eslint-disable-next-line no-unused-vars */
function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  document.getElementById('cart-count').textContent = cart.length;
  alert('Ürün sepete eklendi!');
}

// Sayfa yüklendiğinde sepeti güncelle
document.addEventListener('DOMContentLoaded', () => {
  const cnt = cart.length;
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cnt;
});
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
