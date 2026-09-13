const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8088;
const BASE_DIR = __dirname;
const THEME_DIR = path.join(BASE_DIR, 'mente-lativa-theme');

function getCompiledHTML() {
  const headerPhp = fs.readFileSync(path.join(THEME_DIR, 'header.php'), 'utf8');
  const frontPhp = fs.readFileSync(path.join(THEME_DIR, 'front-page.php'), 'utf8');
  const footerPhp = fs.readFileSync(path.join(THEME_DIR, 'footer.php'), 'utf8');

  // Parse header
  let headContent = `
    <title>Mente Lativa | Identity-Led Storytelling Studio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/mente-lativa-theme/css/style.css">
  `;

  let headerHtml = headerPhp
    .replace(/<\?php language_attributes\(\);\s*\?>/g, 'lang="es"')
    .replace(/<\?php bloginfo\(\s*'charset'\s*\);\s*\?>/g, 'UTF-8')
    .replace(/<\?php wp_head\(\);\s*\?>/g, headContent)
    .replace(/<\?php body_class\(\);\s*\?>/g, 'class="home"')
    .replace(/<\?php wp_body_open\(\);\s*\?>/g, '')
    .replace(/<\?php echo esc_url\(\s*get_template_directory_uri\(\)\s*\.\s*'\/assets\/logos\/logo_mente_lativa\.png'\s*\);\s*\?>/g, '/mente-lativa-theme/assets/logos/logo_mente_lativa.png')
    .replace(/<\?php[\s\S]*?\?>/g, '');

  let frontHtml = frontPhp
    .replace(/<\?php[\s\S]*?get_header\(\);[\s\S]*?\?>/g, '')
    .replace(/<\?php echo esc_url\(\s*get_template_directory_uri\(\)\s*\.\s*'\/assets\/images\/baner_01\.png'\s*\);\s*\?>/g, '/mente-lativa-theme/assets/images/baner_01.png')
    .replace(/<\?php echo esc_url\(\s*get_template_directory_uri\(\)\s*\.\s*'\/assets\/images\/contacto_identidad\.png'\s*\);\s*\?>/g, '/mente-lativa-theme/assets/images/contacto_identidad.png')
    .replace(/<\?php echo esc_url\(\s*get_template_directory_uri\(\)\s*\.\s*'(.*?)'\s*\);\s*\?>/g, '/mente-lativa-theme$1')
    .replace(/<\?php[\s\S]*?\?>/g, '');

  let footerScripts = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.33/dist/lenis.min.js"></script>
    <script>
      window.menteLativaData = {
        themeUrl: '/mente-lativa-theme/'
      };
    </script>
    <script src="/mente-lativa-theme/js/main.js"></script>
  `;

  let footerHtml = footerPhp
    .replace(/<\?php wp_footer\(\);\s*\?>/g, footerScripts)
    .replace(/<\?php[\s\S]*?\?>/g, '');

  return headerHtml + frontHtml + footerHtml;
}

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  if (parsedUrl === '/' || parsedUrl === '/index.html') {
    try {
      const html = getCompiledHTML();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error compiling template: ' + e.message);
    }
    return;
  }

  // Resolve static files
  let safePath = path.normalize(decodeURIComponent(parsedUrl)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Try inside mente-lativa-theme
    filePath = path.join(THEME_DIR, safePath);
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found: ' + parsedUrl);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
