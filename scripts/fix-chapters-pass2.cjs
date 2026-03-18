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
          chapter: ch,
        });
      }
    }
  }
}

for (const [chId, info] of chapterMap) {
  const dir = info.chapter.contentPath;
  const indexFile = path.join(dir, 'index.md');
  if (!fs.existsSync(indexFile)) continue;

  let content = fs.readFileSync(indexFile, 'utf8');
  const original = content;
  const prefix = `/${info.section}/${info.subsection}/${chId}`;

  // FIX: Remove .md extensions from links: (./01-something.md) → (/full/path/01-something)
  content = content.replace(/\]\(\.\/([\w-]+)\.md\)/g, `](${prefix}/$1)`);

  // FIX: Remaining relative links without .md: (./01-something) → (/full/path/01-something)
  content = content.replace(/\]\(\.\/([\w-]+)\)/g, `](${prefix}/$1)`);

  // FIX: Relative cross-chapter links: (../ch13-prototypes/index.md) → (/section/subsection/ch13-prototypes)
  content = content.replace(/\]\(\.\.\/([a-z0-9-]+)\/index\.md\)/g, (match, refChapter) => {
    const refInfo = chapterMap.get(refChapter);
    if (refInfo) {
      return `](/${refInfo.section}/${refInfo.subsection}/${refChapter})`;
    }
    return match;
  });

  // FIX: Short absolute links without subchapter: (/ch34-ts-object-types) → full path
  content = content.replace(/\]\(\/(ch[\w-]+)\)/g, (match, chRef) => {
    const refInfo = chapterMap.get(chRef);
    if (refInfo) {
      return `](/${refInfo.section}/${refInfo.subsection}/${chRef})`;
    }
    return match;
  });

  // FIX: Short absolute links WITH subchapter: (/ch34-ts-object-types/01-something) → full path
  content = content.replace(/\]\(\/(ch[\w-]+)\/([\w-]+)\)/g, (match, chRef, sub) => {
    const refInfo = chapterMap.get(chRef);
    if (refInfo) {
      return `](/${refInfo.section}/${refInfo.subsection}/${chRef}/${sub})`;
    }
    return match;
  });

  // FIX: Remove "## Задания" section (various formats)
  // Pattern: ## Задания + newlines + link line + optional extra text + trailing newlines
  content = content.replace(/\n*## Задани[ея]\s*\n+[\s\S]*?(?=\n##|\n*$)/g, (match) => {
    // Only remove if the block is short (not accidentally eating a whole section)
    if (match.split('\n').length > 6) return match;
    return '';
  });

  // FIX: Remove "## Песочница" section
  content = content.replace(/\n*## Песочница\s*\n+[\s\S]*?(?=\n##|\n*$)/g, (match) => {
    if (match.split('\n').length > 6) return match;
    return '';
  });

  // FIX: Remove all <CrossLink> blocks
  content = content.replace(/\n*<CrossLink[^>]*>[\s\S]*?<\/CrossLink>\n*/g, '\n');

  // FIX: Remove CrossLink-style markdown sections (bullet lists linking to ../chXX)
  // These are "Связанные темы" or "Пререквизиты" with relative links to other chapters
  // Only remove the individual list items with ../ links, not the heading
  content = content.replace(/^- \[.*?\]\(\.\.\/.*?\).*$/gm, '');

  // Clean up: remove empty "## Связанные темы" or "## Пререквизиты" sections
  content = content.replace(/\n*## (?:Связанные темы|Пререквизиты|Что нужно знать)\s*\n+(?=\n##|\n*$)/g, '\n');

  // Remove CrossLink from imports if still there
  content = content.replace(/,\s*CrossLink/g, '');
  content = content.replace(/CrossLink,\s*/g, '');
  content = content.replace(/import\s*\{\s*CrossLink\s*\}\s*from\s*'@book\/ui'\n*/g, '');
  // Clean empty import
  content = content.replace(/import\s*\{\s*\}\s*from\s*'@book\/ui'\n*/g, '');

  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.trimEnd() + '\n';

  if (content !== original) {
    fs.writeFileSync(indexFile, content, 'utf8');
    fixes++;
    console.log(`✅ Fixed: ${chId}/index.md`);
  }
}

console.log(`\nВсего исправлений (pass 2): ${fixes}`);
