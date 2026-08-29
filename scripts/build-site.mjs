import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dist = path.join(root, 'dist');
const excluded = new Set(['.git', 'dist', '.vercel', 'node_modules']);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  const src = path.join(root, entry.name);
  const dst = path.join(dist, entry.name);
  fs.cpSync(src, dst, { recursive: true });
}

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const assetsDir = path.join(dist, 'assets', 'home');
fs.mkdirSync(assetsDir, { recursive: true });

const imagePattern = /<img\b[^>]*?src="data:image\/(webp|png|jpeg|jpg);base64,([^"]+)"[^>]*?>/gis;
const seen = new Map();
const manifest = [];
let unique = 0;
let sourceOrder = 0;

html = html.replace(imagePattern, (tag, inputFmt, b64) => {
  sourceOrder += 1;
  const fmt = inputFmt.toLowerCase() === 'jpeg' ? 'jpg' : inputFmt.toLowerCase();
  const bytes = Buffer.from(b64, 'base64');
  const sha = crypto.createHash('sha256').update(bytes).digest('hex');
  const alt = (tag.match(/alt="([^"]*)"/i) || [,''])[1];
  let file = seen.get(sha);
  let duplicateOf = null;

  if (!file) {
    unique += 1;
    file = `photo-${String(unique).padStart(2, '0')}.${fmt}`;
    fs.writeFileSync(path.join(assetsDir, file), bytes);
    seen.set(sha, file);
  } else {
    duplicateOf = file;
  }

  manifest.push({ source_order: sourceOrder, file, alt, bytes: bytes.length, sha256: sha, duplicate_of: duplicateOf });
  return tag.replace(/src="data:image\/(?:webp|png|jpeg|jpg);base64,[^"]+"/is, `src="/assets/home/${file}"`);
});

// Use the current diary name and clean route on the homepage.
html = html
  .replaceAll('href="/app.html">Попробовать творческий дневник</a>', 'href="/diary">Попробовать эмоциональный дневник</a>')
  .replaceAll('href="/app.html">Творческий дневник</a>', 'href="/diary">Эмоциональный дневник</a>');

fs.writeFileSync(indexPath, html, 'utf8');
fs.writeFileSync(path.join(assetsDir, 'photo-manifest.json'), JSON.stringify({
  embedded_img_tags_found: sourceOrder,
  unique_files_written: unique,
  images: manifest
}, null, 2));

console.log(`Homepage optimized: ${sourceOrder} embedded image tags -> ${unique} unique files.`);
