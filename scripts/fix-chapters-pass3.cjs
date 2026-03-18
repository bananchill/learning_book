const fs = require('fs');
const path = require('path');
const glob = require('path');

let fixes = 0;

// Find all index.md files
const contentDir = path.join(__dirname, '..', 'content', 'ru');
const chapters = fs.readdirSync(contentDir).filter(d =>
  fs.statSync(path.join(contentDir, d)).isDirectory()
);

for (const ch of chapters) {
  const indexFile = path.join(contentDir, ch, 'index.md');
  if (!fs.existsSync(indexFile)) continue;

  let content = fs.readFileSync(indexFile, 'utf8');
  const original = content;

  // Remove self-closing CrossLink tags: <CrossLink chapter="..." title="..." />
  content = content.replace(/\s*<CrossLink[^>]*\/>\s*\n?/g, '\n');

  // Remove CrossLink from imports
  content = content.replace(/,\s*CrossLink/g, '');
  content = content.replace(/CrossLink,\s*/g, '');
  content = content.replace(/import\s*\{\s*CrossLink\s*\}\s*from\s*'@book\/ui'\n*/g, '');
  content = content.replace(/import\s*\{\s*\}\s*from\s*'@book\/ui'\n*/g, '');

  // Remove empty "Связанные темы" / "Пререквизиты" sections that now have no content
  content = content.replace(/\n## (?:Связанные темы|Пререквизиты|Связанные главы|Что стоит знать заранее)\s*\n(?:\s*\n)*(?=\n*## |\n*$)/g, '\n');

  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.trimEnd() + '\n';

  if (content !== original) {
    fs.writeFileSync(indexFile, content, 'utf8');
    fixes++;
    console.log(`✅ Fixed: ${ch}/index.md`);
  }
}

console.log(`\nВсего исправлений (pass 3): ${fixes}`);
