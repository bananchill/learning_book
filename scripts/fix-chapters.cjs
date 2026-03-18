const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'apps', 'book', 'book.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

let fixes = 0;

// Build chapter→section/subsection map
const chapterMap = new Map();
for (const section of config.sections) {
  for (const sub of (section.subsections || [])) {
    for (const group of (sub.groups || [])) {
      for (const ch of (group.chapters || [])) {
        chapterMap.set(ch.id, {
          section: section.id,
          subsection: sub.id,
          group,
          chapter: ch,
        });
      }
    }
  }
}

// ──────────────────────────────────────────────
// FIX 1: Fix links in index.md
// ──────────────────────────────────────────────
for (const [chId, info] of chapterMap) {
  const dir = info.chapter.contentPath;
  const indexFile = path.join(dir, 'index.md');
  if (!fs.existsSync(indexFile)) continue;

  let content = fs.readFileSync(indexFile, 'utf8');
  const original = content;
  const prefix = `/${info.section}/${info.subsection}/${chId}`;

  // Fix relative links: (./01-something) → (/section/subsection/chapter/01-something)
  content = content.replace(/\]\(\.\/([\w-]+)\)/g, `](${prefix}/$1)`);

  // Fix short absolute links: (/chXX-topic/01-sub) → (/section/subsection/chXX-topic/01-sub)
  content = content.replace(/\]\(\/(ch[\w-]+)\/([\w-]+)\)/g, (match, chRef, sub) => {
    // Find section for the referenced chapter
    const refInfo = chapterMap.get(chRef);
    if (refInfo) {
      return `](/${refInfo.section}/${refInfo.subsection}/${chRef}/${sub})`;
    }
    // If same chapter
    return `](${prefix}/${sub})`;
  });

  // Fix short absolute links without subchapter: (/chXX-topic/tasks) etc.
  content = content.replace(/\]\(\/(ch[\w-]+)\/(tasks|playground)\)/g, (match, chRef, page) => {
    const refInfo = chapterMap.get(chRef);
    if (refInfo) {
      return `](/${refInfo.section}/${refInfo.subsection}/${chRef}/${page})`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(indexFile, content, 'utf8');
    fixes++;
    console.log(`✅ Fixed links: ${chId}/index.md`);
  }
}

// ──────────────────────────────────────────────
// FIX 2: Remove CrossLink from index.md
// ──────────────────────────────────────────────
for (const [chId, info] of chapterMap) {
  const indexFile = path.join(info.chapter.contentPath, 'index.md');
  if (!fs.existsSync(indexFile)) continue;

  let content = fs.readFileSync(indexFile, 'utf8');
  const original = content;

  // Remove <CrossLink ...>...</CrossLink> blocks (multiline)
  content = content.replace(/\n*<CrossLink[^>]*>[\s\S]*?<\/CrossLink>\n*/g, '\n');

  // Remove CrossLink from import statements
  content = content.replace(/,\s*CrossLink/g, '');
  content = content.replace(/CrossLink,\s*/g, '');
  // If CrossLink was the only import
  content = content.replace(/import\s*\{\s*CrossLink\s*\}\s*from\s*'@book\/ui'\n*/g, '');

  if (content !== original) {
    fs.writeFileSync(indexFile, content, 'utf8');
    fixes++;
    console.log(`✅ Removed CrossLink: ${chId}/index.md`);
  }
}

// ──────────────────────────────────────────────
// FIX 3: Remove task/sandbox sections from index.md
// ──────────────────────────────────────────────
for (const [chId, info] of chapterMap) {
  const indexFile = path.join(info.chapter.contentPath, 'index.md');
  if (!fs.existsSync(indexFile)) continue;

  let content = fs.readFileSync(indexFile, 'utf8');
  const original = content;

  // Remove "## Задания" or "## Задачи" section + link line
  content = content.replace(/\n+## Задани[ея]\n+\[.*?(?:tasks|задач).*?\]\(.*?\).*?\n*/gi, '\n');

  // Remove "## Песочница" section + link line
  content = content.replace(/\n+## Песочница\n+\[.*?(?:playground|песочниц).*?\]\(.*?\).*?\n*/gi, '\n');

  // Clean up trailing whitespace/newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.trimEnd() + '\n';

  if (content !== original) {
    fs.writeFileSync(indexFile, content, 'utf8');
    fixes++;
    console.log(`✅ Removed task/sandbox sections: ${chId}/index.md`);
  }
}

// ──────────────────────────────────────────────
// FIX 4: Fix .mdx → .md in _meta.json
// ──────────────────────────────────────────────
for (const [chId, info] of chapterMap) {
  const metaFile = path.join(info.chapter.contentPath, '_meta.json');
  if (!fs.existsSync(metaFile)) continue;

  let content = fs.readFileSync(metaFile, 'utf8');
  const original = content;

  content = content.replace(/\.mdx"/g, '.md"');

  if (content !== original) {
    fs.writeFileSync(metaFile, content, 'utf8');
    fixes++;
    console.log(`✅ Fixed .mdx→.md: ${chId}/_meta.json`);
  }
}

// ──────────────────────────────────────────────
// FIX 5: Add hasPlayground: false for chapters without playground.vue
// ──────────────────────────────────────────────
let configChanged = false;
function fixPlaygroundFlags(chapters) {
  for (const ch of chapters) {
    const playgroundFile = path.join(ch.contentPath, 'playground.vue');
    if (!fs.existsSync(playgroundFile) && ch.hasPlayground !== false) {
      ch.hasPlayground = false;
      configChanged = true;
      console.log(`✅ Set hasPlayground:false: ${ch.id}`);
      fixes++;
    }
  }
}

for (const section of config.sections) {
  for (const sub of (section.subsections || [])) {
    for (const group of (sub.groups || [])) {
      fixPlaygroundFlags(group.chapters || []);
    }
  }
}

if (configChanged) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated book.config.json`);
}

// ──────────────────────────────────────────────
// FIX 6: ch26-ts-advanced — rename file to match config
// ──────────────────────────────────────────────
const ch26Dir = 'content/ru/ch26-ts-advanced';
const wrongFile = path.join(ch26Dir, '03-template-literal-types.md');
const rightFile = path.join(ch26Dir, '03-template-literal.md');
if (fs.existsSync(wrongFile) && !fs.existsSync(rightFile)) {
  fs.renameSync(wrongFile, rightFile);
  fixes++;
  console.log(`✅ Renamed: ch26-ts-advanced/03-template-literal-types.md → 03-template-literal.md`);
}
// Fix _meta.json for ch26
const ch26Meta = path.join(ch26Dir, '_meta.json');
if (fs.existsSync(ch26Meta)) {
  let meta = fs.readFileSync(ch26Meta, 'utf8');
  const orig = meta;
  meta = meta.replace(/"03-template-literal-types"/g, '"03-template-literal"');
  if (meta !== orig) {
    fs.writeFileSync(ch26Meta, meta, 'utf8');
    fixes++;
    console.log(`✅ Fixed _meta.json subchapter ID: ch26-ts-advanced`);
  }
}

// ──────────────────────────────────────────────
// FIX 7: ch36-ts-classes — fix _meta.json
// ──────────────────────────────────────────────
const ch36Dir = 'content/ru/ch36-ts-classes';
const ch36Meta = path.join(ch36Dir, '_meta.json');
if (fs.existsSync(ch36Meta)) {
  const meta = JSON.parse(fs.readFileSync(ch36Meta, 'utf8'));
  const configCh = chapterMap.get('ch36-ts-classes');
  if (configCh) {
    const configSubs = configCh.chapter.subchapters;
    // Check if _meta.json subchapters are broken
    const metaIds = meta.subchapters.map(s => s.id).filter(Boolean);
    const configIds = configSubs.map(s => s.id);
    const needsFix = metaIds.length !== configIds.length || metaIds.some((id, i) => id !== configIds[i]);
    if (needsFix) {
      meta.subchapters = configSubs.map(s => ({
        id: s.id,
        title: s.title,
        file: s.id + '.md'
      }));
      fs.writeFileSync(ch36Meta, JSON.stringify(meta, null, 2) + '\n', 'utf8');
      fixes++;
      console.log(`✅ Fixed _meta.json subchapters: ch36-ts-classes`);
    }
  }
}

console.log(`\n═══════════════════════════════════════`);
console.log(`Всего исправлений: ${fixes}`);
