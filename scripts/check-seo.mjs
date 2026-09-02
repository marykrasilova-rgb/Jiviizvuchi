import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const origin = "https://mariakrasilovacom.vercel.app";
const errors = [];

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory)) {
    if ([".git", "node_modules"].includes(entry)) continue;
    const absolute = join(directory, entry);
    const info = await stat(absolute);
    if (info.isDirectory()) paths.push(...await walk(absolute));
    else paths.push(absolute);
  }
  return paths;
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match?.[1] ?? "";
}

function report(condition, message) {
  if (!condition) errors.push(message);
}

function localTarget(fromFile, href, rewrites) {
  const clean = href.split(/[?#]/)[0];
  if (!clean) return null;
  let pathname;
  if (clean.startsWith("/")) pathname = clean;
  else pathname = `/${normalize(join(dirname(relative(root, fromFile)), clean)).replaceAll("\\", "/")}`;

  const rewritten = rewrites.get(pathname);
  if (rewritten) pathname = rewritten;
  if (pathname === "/") pathname = "/index.html";
  else if (pathname.endsWith("/")) pathname += "index.html";
  else if (!extname(pathname)) pathname += ".html";
  return join(root, pathname.slice(1));
}

const allFiles = await walk(root);
const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));
const existingFiles = new Set(allFiles.map((file) => resolve(file)));
const vercel = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
const rewrites = new Map((vercel.rewrites ?? []).map(({ source, destination }) => [source, destination]));
const indexableCanonicals = new Map();
const noindexCanonicals = new Set();

for (const file of htmlFiles) {
  const rel = relative(root, file);
  const html = await readFile(file, "utf8");
  const titleCount = matches(html, /<title\b[^>]*>[^<]+<\/title>/gi).length;
  const h1Count = matches(html, /<h1\b[^>]*>/gi).length;
  const descriptionTags = matches(html, /<meta\b[^>]*\bname=["']description["'][^>]*>/gi);
  const robotsTags = matches(html, /<meta\b[^>]*\bname=["']robots["'][^>]*>/gi);
  const canonicalTags = matches(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi);
  const canonical = canonicalTags[0] ? attr(canonicalTags[0][0], "href") : "";
  const noindex = robotsTags.some((tag) => /noindex/i.test(attr(tag[0], "content")));

  report(titleCount === 1, `${rel}: expected exactly one non-empty <title>, found ${titleCount}`);

  if (noindex) {
    if (canonical) noindexCanonicals.add(canonical);
  } else {
    report(h1Count === 1, `${rel}: expected exactly one <h1>, found ${h1Count}`);
    report(canonicalTags.length === 1, `${rel}: expected exactly one canonical, found ${canonicalTags.length}`);
    report(descriptionTags.length === 1 && attr(descriptionTags[0][0], "content").trim().length > 30,
      `${rel}: missing or short meta description`);
    report(canonical.startsWith(`${origin}/`), `${rel}: canonical must use ${origin}`);
    report(matches(html, /<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/gi).length === 1,
      `${rel}: missing og:title`);
    report(matches(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi).length > 0,
      `${rel}: missing JSON-LD`);
    if (canonical) {
      report(!indexableCanonicals.has(canonical),
        `${rel}: duplicate indexable canonical also used by ${indexableCanonicals.get(canonical)}`);
      indexableCanonicals.set(canonical, rel);
    }
  }

  for (const block of matches(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const tag of matches(html, /<(?:a|link)\b[^>]*\bhref=["'][^"']+["'][^>]*>/gi)) {
    const href = attr(tag[0], "href");
    if (/^(?:https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    const target = localTarget(file, href, rewrites);
    if (target) report(existingFiles.has(resolve(target)), `${rel}: broken local href ${href}`);
  }
  for (const tag of matches(html, /<(?:img|script|source)\b[^>]*\bsrc=["'][^"']+["'][^>]*>/gi)) {
    const src = attr(tag[0], "src");
    if (/^(?:https?:|data:|blob:)/i.test(src)) continue;
    const target = localTarget(file, src, rewrites);
    if (target) report(existingFiles.has(resolve(target)), `${rel}: broken local src ${src}`);
  }
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set(matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => match[1]));
for (const [canonical, rel] of indexableCanonicals) {
  report(sitemapUrls.has(canonical), `${rel}: indexable canonical missing from sitemap: ${canonical}`);
}
for (const url of sitemapUrls) {
  report(indexableCanonicals.has(url), `sitemap: URL is not an indexable canonical: ${url}`);
  report(!noindexCanonicals.has(url), `sitemap: noindex URL included: ${url}`);
}

if (errors.length) {
  console.error(`SEO check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO check passed: ${htmlFiles.length} HTML files, ${sitemapUrls.size} indexable URLs, valid JSON-LD and local links.`);
