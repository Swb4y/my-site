require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined', { stream: require('fs').createWriteStream('access.log', { flags: 'a' }) }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pageData = {
  '/': {
    title: 'Benim Sitem',
    description: 'Modern ve esnek statik web şablonu',
    keywords: 'HTML, CSS, JavaScript, statik, şablon',
    headerTitle: 'Hoşgeldiniz!'
  },
  '/about': {
    title: 'Hakkımızda - Benim Sitem',
    description: 'Dinamik ekibimiz hakkında bilgi',
    keywords: 'about, team, hakkında',
    headerTitle: 'Hakkımızda'
  },
  '/contact': {
    title: 'İletişim - Benim Sitem',
    description: 'Bizimle iletişime geçin',
    keywords: 'contact, iletişim, form',
    headerTitle: 'İletişim'
  }
};

app.get('/', (req, res) => {
  res.render('index', pageData['/']);
});

app.get('/about', (req, res) => {
  res.render('about', pageData['/about']);
});

app.get('/contact', (req, res) => {
  const success = req.query.success === '1';
  res.render('contact', { ...pageData['/contact'], success });
});

app.post('/contact', async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'Yeni iletişim formu mesajı',
      text: `Ad: ${name}\nEmail: ${email}\nMesaj: ${message}`,
      html: `<p>Ad: ${name}</p><p>Email: ${email}</p><p>Mesaj: ${message}</p>`
    });
    res.redirect('/contact?success=1');
  } catch (err) {
    next(err);
  }
});

// Redirect legacy .html URLs to new dynamic routes
['index', 'about', 'contact'].forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const target = page === 'index' ? '/' : `/${page}`;
    res.redirect(301, target + qs);
  });
});

app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Sayfa Bulunamadı',
    description: '',
    keywords: ''
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', {
    title: '500 - Sunucu Hatası',
    description: '',
    keywords: ''
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));