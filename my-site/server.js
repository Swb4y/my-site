require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

const siteName = process.env.SITE_NAME || 'Benim Sitem';
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const defaultDescription = process.env.DEFAULT_DESCRIPTION || 'Custom domain ve ücretsiz SSL desteğiyle modern statik web sitesi şablonu';
const defaultOgImage = process.env.DEFAULT_OG_IMAGE || `${baseUrl}/banner.jpg`;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: siteName,
    description: defaultDescription,
    canonicalUrl: baseUrl + req.originalUrl,
    ogImage: defaultOgImage,
    siteName
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: `Hakkımızda - ${siteName}`,
    description: 'Biz, abantari.com bünyesinde sizin için modern, hızlı ve şık çözümler üreten dinamik bir ekibiz.',
    canonicalUrl: baseUrl + req.originalUrl,
    ogImage: defaultOgImage,
    siteName
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: `İletişim - ${siteName}`,
    description: 'Bizimle iletişime geçin, görüşleriniz bizim için değerli!',
    canonicalUrl: baseUrl + req.originalUrl,
    ogImage: defaultOgImage,
    siteName,
    success: false,
    formData: {}
  });
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Yeni İletişim Formu Mesajı - ${siteName}`,
      text: message,
      html: `<p><strong>Ad:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mesaj:</strong></p><p>${message}</p>`
    });

    res.render('contact', {
      title: `İletişim - ${siteName}`,
      description: 'Bizimle iletişime geçin, görüşleriniz bizim için değerli!',
      canonicalUrl: baseUrl + req.originalUrl,
      ogImage: defaultOgImage,
      siteName,
      success: true,
      formData: { name, email, message }
    });
  } catch (error) {
    logger.error(error);
    res.render('contact', {
      title: `İletişim - ${siteName}`,
      description: 'Bizimle iletişime geçin, görüşleriniz bizim için değerli!',
      canonicalUrl: baseUrl + req.originalUrl,
      ogImage: defaultOgImage,
      siteName,
      error: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.',
      success: false,
      formData: { name, email, message }
    });
  }
});

// Redirect old static routes
app.get('/index.html', (req, res) => res.redirect(301, '/'));
app.get('/about.html', (req, res) => res.redirect(301, '/about'));
app.get('/contact.html', (req, res) => res.redirect(301, '/contact'));

app.use((req, res) => {
  res.status(404).render('404', {
    title: `404 - Sayfa Bulunamadı - ${siteName}`,
    description: 'Aradığınız sayfa bulunamadı.',
    canonicalUrl: baseUrl + req.originalUrl,
    ogImage: defaultOgImage,
    siteName
  });
});

app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(500).render('500', {
    title: `500 - Sunucu Hatası - ${siteName}`,
    description: 'Sunucuda beklenmeyen bir hata oluştu.',
    canonicalUrl: baseUrl + req.originalUrl,
    ogImage: defaultOgImage,
    siteName
  });
});

app.listen(PORT, () => logger.info(`Sunucu port ${PORT} üzerinde çalışıyor`));