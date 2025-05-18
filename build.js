// Load environment variables (fallback to .env.example if .env missing)
const dotenv = require('dotenv');
const path = require('path');
const envResult = dotenv.config();
if (envResult.error || !process.env.CONTACT_EMAIL) {
  dotenv.config({ path: path.join(__dirname, '.env.example') });
}
const ejs = require('ejs');
const fs = require('fs').promises;

// Page metadata
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

async function build() {
  const root = __dirname;
  const viewsDir = path.join(root, 'views');

  // Clean previous outputs
  await Promise.all([
    fs.rm(path.join(root, 'index.html'), { force: true }),
    fs.rm(path.join(root, '404.html'), { force: true }),
    fs.rm(path.join(root, 'about'), { recursive: true, force: true }),
    fs.rm(path.join(root, 'contact'), { recursive: true, force: true })
  ]);

  // Pages to render
  const pages = [
    { route: '/', template: 'index.ejs', output: 'index.html' },
    { route: '/about', template: 'about.ejs', output: path.join('about', 'index.html') },
    { route: '/contact', template: 'contact.ejs', output: path.join('contact', 'index.html') }
  ];

  // Render pages
  for (const page of pages) {
    const data = { ...pageData[page.route] };
    if (page.route === '/contact') {
      data.success = false;
      data.staticForm = true;
      // Use specified email address for contact form
      data.contactEmail = 'dfrguiii45@hotmail.com';
    }
    const html = await ejs.renderFile(path.join(viewsDir, page.template), data, { root: viewsDir });
    const outPath = path.join(root, page.output);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf8');
  }

  // 404 page
  const html404 = await ejs.renderFile(
    path.join(viewsDir, '404.ejs'),
    { title: '404 - Sayfa Bulunamadı', description: '', keywords: '', headerTitle: 'Hata' },
    { root: viewsDir }
  );
  await fs.writeFile(path.join(root, '404.html'), html404, 'utf8');

  // Copy static assets (css, js, CNAME)
  const staticDir = path.join(root, 'public');
  const assets = await fs.readdir(staticDir);
  for (const file of assets) {
    const src = path.join(staticDir, file);
    const dest = path.join(root, file);
    const stat = await fs.stat(src);
    if (stat.isFile()) {
      await fs.copyFile(src, dest);
    }
  }
} // end build

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});