require('dotenv').config();
// app.js

// en üstte: 
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
app.use('/cart', cartRoutes);

// … mevcut middleware’ler (static, morgan, bodyParser vs.)…

app.use('/products', productRoutes);
// oturum & auth
const session  = require('express-session');
const paypalRoutes = require('./routes/paypal');
app.use('/paypal', paypalRoutes);
const paymentRoutes = require('./routes/payments');
app.use('/payments', paymentRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User     = require('./models/User');
const flash    = require('connect-flash');

app.use(session({
  secret: process.env.SESSION_SECRET || 'gizlikelime',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Local strateji
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Kullanıcı bulunamadı' });
    const ok = await user.comparePassword(password);
    if (!ok) return done(null, false, { message: 'Şifre yanlış' });
    return done(null, user);
  } catch (err) { return done(err); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// flash mesajları view’lara gönder
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next();
});


const express = require('express');
// app.js

require('dotenv').config();
const mongoose = require('mongoose');

// … Express, morgan, ejs vs. importları…

// ◀▶  MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB’ye bağlandı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// … geri kalan app konfigurasyonu …

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
  // Determine if SMTP is configured for dynamic email
  const SMTP_CONFIGURED = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_EMAIL;
  res.render('contact', {
    ...pageData['/contact'],
    success,
    // Fallback to static mailto form when SMTP not set
    staticForm: !SMTP_CONFIGURED,
    contactEmail: process.env.CONTACT_EMAIL || ''
  });
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

/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', {
    title: '500 - Sunucu Hatası',
    description: '',
    keywords: ''
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
