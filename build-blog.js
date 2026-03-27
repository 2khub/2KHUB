/**
 * ═══════════════════════════════════════════════════════════════
 *  2KHUB Static Site Generator — build-blog.js
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO USE:
 *    1. Add / edit articles in blog-data.json
 *    2. Run:  node build-blog.js
 *    3. Done. Each article becomes a real .html file in articles/
 *       and guides.html is automatically updated with fresh cards.
 *
 *  OUTPUT:
 *    articles/[slug].html  — one static page per article
 *    guides.html           — index page regenerated from JSON data
 *
 * ═══════════════════════════════════════════════════════════════
 */

const fs   = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────
const ROOT          = __dirname;
const DATA_FILE     = path.join(ROOT, 'blog-data.json');
const TEMPLATE_FILE = path.join(ROOT, '_templates', 'template.html');
const ARTICLES_DIR  = path.join(ROOT, 'articles');
const GUIDES_FILE   = path.join(ROOT, 'guides.html');
const INDEX_FILE    = path.join(ROOT, 'index.html');

// ── Badge styles per category ──────────────────────────────────
const CATEGORY_STYLES = {
  'Universe Mode': {
    badgeBg:     'rgba(225,6,0,0.2)',
    badgeBorder: 'rgba(225,6,0,0.5)',
    badgeColor:  '#ff6060',
  },
  'MyGM': {
    badgeBg:     'rgba(0,107,182,0.2)',
    badgeBorder: 'rgba(0,107,182,0.5)',
    badgeColor:  '#4da6ff',
  },
  'Game News': {
    badgeBg:     'rgba(255,215,0,0.15)',
    badgeBorder: 'rgba(255,215,0,0.45)',
    badgeColor:  '#ffd700',
  },
};

// ── Grid card thumb gradient per category ─────────────────────
const CATEGORY_THUMB = {
  'Universe Mode': { thumbClass: 'gt-red',   artTagClass: 'tag-universe', accentDefault: '#e10600' },
  'MyGM':          { thumbClass: 'gt-blue',  artTagClass: 'tag-mygm',    accentDefault: '#3399ff' },
  'Game News':     { thumbClass: 'gt-gold',  artTagClass: 'tag-sliders', accentDefault: '#ffd700' },
};

// ── Helpers ────────────────────────────────────────────────────
function isoDate(humanDate) {
  // Converts "March 2026" → "2026-03-01", falls back to today
  const months = { January:1, February:2, March:3, April:4, May:5, June:6,
                   July:7, August:8, September:9, October:10, November:11, December:12 };
  const parts = (humanDate || '').split(' ');
  if (parts.length === 2 && months[parts[0]] && !isNaN(parseInt(parts[1]))) {
    const m = String(months[parts[0]]).padStart(2, '0');
    return `${parts[1]}-${m}-01`;
  }
  return new Date().toISOString().split('T')[0];
}

function escapeJson(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// ── Step 1: Read inputs ────────────────────────────────────────
console.log('\n2KHUB SSG — Starting build...\n');

if (!fs.existsSync(DATA_FILE)) {
  console.error('ERROR: blog-data.json not found at', DATA_FILE);
  process.exit(1);
}
if (!fs.existsSync(TEMPLATE_FILE)) {
  console.error('ERROR: _templates/template.html not found at', TEMPLATE_FILE);
  process.exit(1);
}

const articles  = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const template  = fs.readFileSync(TEMPLATE_FILE, 'utf8');

// ── Step 2: Ensure articles/ directory exists ──────────────────
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  console.log('Created directory: articles/');
}

// ── Step 3: Build one .html file per article ──────────────────
articles.forEach(article => {
  const cat    = CATEGORY_STYLES[article.category] || CATEGORY_STYLES['Game News'];
  const thumb  = CATEGORY_THUMB[article.category]  || CATEGORY_THUMB['Game News'];
  const accent = article.accentColor || thumb.accentDefault;

  const heroContent = article.thumbnail_img
    ? `<img src="../${article.thumbnail_img}" alt="${article.title}" class="article-hero-img">`
    : `<span class="article-hero-icon">${article.thumbnail || '\uD83D\uDCC4'}</span>`;

  let html = template
    .replace(/\{\{TITLE\}\}/g,          article.title)
    .replace(/\{\{SLUG\}\}/g,           article.slug)
    .replace(/\{\{DESCRIPTION\}\}/g,    article.description || article.excerpt)
    .replace(/\{\{EXCERPT\}\}/g,        article.excerpt)
    .replace(/\{\{CONTENT\}\}/g,        article.content)
    .replace(/\{\{DATE\}\}/g,           article.date)
    .replace(/\{\{DATE_ISO\}\}/g,       isoDate(article.date))
    .replace(/\{\{READ_TIME\}\}/g,      article.readTime || '5 min read')
    .replace(/\{\{CATEGORY\}\}/g,       article.category)
    .replace(/\{\{HERO_CONTENT\}\}/g,   heroContent)
    .replace(/\{\{THUMBNAIL\}\}/g,      article.thumbnail || '\uD83D\uDCC4')
    .replace(/\{\{THUMB_GRADIENT\}\}/g, article.thumbGradient || 'rgba(255,255,255,0.05)')
    .replace(/\{\{ACCENT_COLOR\}\}/g,   accent)
    .replace(/\{\{BADGE_BG\}\}/g,       cat.badgeBg)
    .replace(/\{\{BADGE_BORDER\}\}/g,   cat.badgeBorder)
    .replace(/\{\{BADGE_COLOR\}\}/g,    cat.badgeColor);

  const outPath = path.join(ARTICLES_DIR, `${article.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  ✔  articles/${article.slug}.html`);
});

// ── Step 4: Regenerate guides.html article cards ───────────────
if (!fs.existsSync(GUIDES_FILE)) {
  console.warn('\nWARN: guides.html not found — skipping index regeneration.');
  console.log('\nBuild complete.\n');
  process.exit(0);
}

const INJECT_START = '<!-- GUIDES_GENERATED_START -->';
const INJECT_END   = '<!-- GUIDES_GENERATED_END -->';

let guidesHtml = fs.readFileSync(GUIDES_FILE, 'utf8');

if (!guidesHtml.includes(INJECT_START) || !guidesHtml.includes(INJECT_END)) {
  console.warn('\nWARN: Injection markers not found in guides.html — skipping index regeneration.');
  console.warn('  Add <!-- GUIDES_GENERATED_START --> and <!-- GUIDES_GENERATED_END --> to guides.html.\n');
  console.log('Build complete.\n');
  process.exit(0);
}

// Group articles by category
const byCategory = {};
articles.forEach(a => {
  if (!byCategory[a.category]) byCategory[a.category] = [];
  byCategory[a.category].push(a);
});

// Featured = first article overall
const featured = articles[0];

// Build featured banner HTML
const featuredBgStyle = featured.thumbnail_img
  ? `background-image: url('${featured.thumbnail_img}'); background-size: cover; background-position: center;`
  : '';
const featuredHtml = `
      <!-- ══ FEATURED BANNER ══ -->
      <a href="articles/${featured.slug}.html" class="featured-banner" style="${featuredBgStyle}">
        <h2 class="featured-title">${featured.title}</h2>
        <p class="featured-excerpt">${featured.excerpt}</p>
        <div class="featured-cta">Read Full Guide →</div>
      </a>`;

// Category display order and layout type
const CATEGORY_ORDER = [
  { name: 'Game News',     layout: 'grid' },
  { name: 'Universe Mode', layout: 'grid' },
  { name: 'MyGM',          layout: 'list' },
];

// Build grid card HTML
function buildGridCard(article) {
  const cat    = CATEGORY_THUMB[article.category] || CATEGORY_THUMB['Game News'];
  const accent = article.accentColor || cat.accentDefault;
  const thumbInner = article.thumbnail_img
    ? `<img src="${article.thumbnail_img}" alt="${article.title}" class="grid-thumb-img">`
    : (article.thumbnail || '\uD83D\uDCC4');
  return `
          <a href="articles/${article.slug}.html" class="grid-card" style="--card-accent:${accent};">
            <div class="grid-thumb ${article.thumbnail_img ? '' : cat.thumbClass}">
              ${thumbInner}
            </div>
            <div class="grid-body">
              <h3 class="grid-title">${article.title}</h3>
              <p class="grid-excerpt">${article.excerpt}</p>
              <span class="grid-read">Read →</span>
            </div>
          </a>`;
}

// Build list card HTML
function buildListCard(article) {
  const cat        = CATEGORY_THUMB[article.category] || CATEGORY_THUMB['Game News'];
  const thumbClass = { 'Universe Mode': 'lt-red', 'MyGM': 'lt-blue', 'Game News': 'lt-gold' };
  const ltClass    = thumbClass[article.category] || 'lt-blue';
  const thumbInner = article.thumbnail_img
    ? `<img src="${article.thumbnail_img}" alt="${article.title}" class="list-thumb-img">`
    : (article.thumbnail || '\uD83D\uDCC4');
  return `
        <a href="articles/${article.slug}.html" class="list-card">
          <div class="list-thumb ${article.thumbnail_img ? 'list-thumb-photo' : ltClass}">${thumbInner}</div>
          <div class="list-body">
            <h3 class="list-title">${article.title}</h3>
            <p class="list-excerpt">${article.excerpt}</p>
            <span class="list-read">Read Article →</span>
          </div>
        </a>`;
}

// Build index.html news card HTML
function buildNewsCard(article) {
  const cat      = CATEGORY_THUMB[article.category] || CATEGORY_THUMB['Game News'];
  const ntClass  = { 'Universe Mode': 'news-thumb-single', 'MyGM': 'news-thumb-multi', 'Game News': 'news-thumb-strat' };
  const bgClass  = ntClass[article.category] || 'news-thumb-strat';
  const thumbInner = article.thumbnail_img
    ? `<img src="${article.thumbnail_img}" alt="${article.title}" class="news-thumb-img">`
    : (article.thumbnail || '\uD83D\uDCC4');
  return `        <a href="articles/${article.slug}.html" class="news-card">
          <div class="news-thumb ${article.thumbnail_img ? '' : bgClass}">
            ${thumbInner}
          </div>
          <div class="news-body">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-excerpt">${article.excerpt}</p>
            <span class="news-read">Read Article \u2192</span>
          </div>
        </a>`;
}

// Build category sections
let sectionsHtml = '';
CATEGORY_ORDER.forEach(({ name, layout }) => {
  const catArticles = byCategory[name];
  if (!catArticles || catArticles.length === 0) return;

  const count = catArticles.length;

  if (layout === 'grid') {
    const cards = catArticles.map(buildGridCard).join('');
    sectionsHtml += `
      <!-- ══ SECTION: ${name.toUpperCase()} (GRID) ══ -->
      <section class="grid-section">
        <div class="section-head">
          <h2 class="section-head-title">${name}</h2>
          <span class="section-head-count">${count} Article${count !== 1 ? 's' : ''}</span>
          <div class="section-head-line"></div>
        </div>
        <div class="articles-grid">${cards}
        </div>
      </section>`;
  } else {
    const cards = catArticles.map(buildListCard).join('');
    sectionsHtml += `
      <!-- ══ SECTION: ${name.toUpperCase()} (LIST) ══ -->
      <section class="list-section">
        <div class="section-head">
          <h2 class="section-head-title">${name}</h2>
          <span class="section-head-count">${count} Article${count !== 1 ? 's' : ''}</span>
          <div class="section-head-line"></div>
        </div>${cards}
      </section>`;
  }
});

const injectedBlock =
  `${INJECT_START}${featuredHtml}\n${sectionsHtml}\n      ${INJECT_END}`;

guidesHtml = guidesHtml.replace(
  new RegExp(`${INJECT_START}[\\s\\S]*?${INJECT_END}`),
  injectedBlock
);

fs.writeFileSync(GUIDES_FILE, guidesHtml, 'utf8');
console.log('  ✔  guides.html (index regenerated)');

// ── Step 5: Regenerate index.html news section ────────────────
const INDEX_START = '<!-- INDEX_NEWS_START -->';
const INDEX_END   = '<!-- INDEX_NEWS_END -->';

if (!fs.existsSync(INDEX_FILE)) {
  console.warn('\nWARN: index.html not found — skipping news section update.');
} else {
  let indexHtml = fs.readFileSync(INDEX_FILE, 'utf8');
  if (!indexHtml.includes(INDEX_START) || !indexHtml.includes(INDEX_END)) {
    console.warn('\nWARN: INDEX_NEWS markers not found in index.html — skipping.');
  } else {
    const latestArticles = articles.slice(0, 3);
    const newsCards = latestArticles.map(buildNewsCard).join('\n');
    const indexBlock = `${INDEX_START}\n${newsCards}\n${INDEX_END}`;
    indexHtml = indexHtml.replace(
      new RegExp(`${INDEX_START}[\\s\\S]*?${INDEX_END}`),
      indexBlock
    );
    fs.writeFileSync(INDEX_FILE, indexHtml, 'utf8');
    console.log('  ✔  index.html (news section regenerated)');
  }
}

console.log(`\nBuild complete — ${articles.length} article(s) generated.\n`);
