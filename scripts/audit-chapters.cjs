const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'apps', 'book', 'book.config.json'), 'utf8'));

const results = [];

function checkChapter(ch, sectionId, subsectionId) {
  const dir = ch.contentPath;
  const chIssues = [];

  // 1. Does directory exist?
  if (!fs.existsSync(dir)) {
    chIssues.push('КРИТИЧНО: директория контента не существует: ' + dir);
    results.push({ chapter: ch.id, title: ch.title, issues: chIssues, features: 'N/A' });
    return;
  }

  // 2. Does index.md exist?
  const indexFile = path.join(dir, 'index.md');
  if (!fs.existsSync(indexFile)) {
    chIssues.push('Нет index.md');
  } else {
    const content = fs.readFileSync(indexFile, 'utf8');

    // Check for relative links (./something)
    const relLinks = content.match(/\]\(\.\//g);
    if (relLinks) {
      chIssues.push('Ссылки в index.md используют относительные пути (./) — 404');
    }

    // Check for short absolute links (/chXX-...)
    const shortLinks = content.match(/\]\(\/ch\d+/g);
    if (shortLinks) {
      chIssues.push('Ссылки в index.md используют короткие пути (/chXX-...) — 404');
    }

    // Check for CrossLink components
    if (content.includes('CrossLink')) {
      chIssues.push('Содержит CrossLink — отображается как непонятная кнопка');
    }

    // Check for task/sandbox mentions in index
    if (/Задания|Перейти к заданиям|\/tasks\)/.test(content)) {
      chIssues.push('index.md упоминает задания/tasks');
    }
    if (/Песочница|\/playground\)/.test(content)) {
      chIssues.push('index.md упоминает песочницу');
    }
  }

  // 3. Check subchapter files
  const missingSubs = [];
  for (const sub of ch.subchapters) {
    const mdFile = path.join(dir, sub.id + '.md');
    const mdxFile = path.join(dir, sub.id + '.mdx');
    if (!fs.existsSync(mdFile) && !fs.existsSync(mdxFile)) {
      missingSubs.push(sub.id);
    }
  }
  if (missingSubs.length > 0) {
    chIssues.push('Подглавы без файлов: ' + missingSubs.join(', '));
  }

  // 4. Check _meta.json
  const metaFile = path.join(dir, '_meta.json');
  if (!fs.existsSync(metaFile)) {
    chIssues.push('Нет _meta.json');
  } else {
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    const metaStr = fs.readFileSync(metaFile, 'utf8');
    if (metaStr.includes('.mdx')) {
      chIssues.push('_meta.json ссылается на .mdx вместо .md');
    }
    if (meta.subchapters) {
      const metaIds = meta.subchapters.map(s => s.id);
      const configIds = ch.subchapters.map(s => s.id);
      const missing = configIds.filter(id => !metaIds.includes(id));
      const extra = metaIds.filter(id => !configIds.includes(id));
      if (missing.length > 0) chIssues.push('В _meta.json нет подглав: ' + missing.join(', '));
      if (extra.length > 0) chIssues.push('В _meta.json лишние подглавы: ' + extra.join(', '));
    }
  }

  // 5. Feature check
  const hasTaskFiles = fs.existsSync(path.join(dir, 'tasks')) &&
    fs.readdirSync(path.join(dir, 'tasks')).filter(f => !f.startsWith('_')).length > 0;
  const hasCR = fs.existsSync(path.join(dir, 'code-review')) &&
    fs.readdirSync(path.join(dir, 'code-review')).length > 0;
  const hasQuiz = fs.existsSync(path.join(dir, 'quiz.json'));
  const hasInterview = fs.existsSync(path.join(dir, 'interview.json'));
  const hasWalkthrough = fs.existsSync(path.join(dir, 'walkthrough.json'));
  const hasPlaygroundFile = fs.existsSync(path.join(dir, 'playground.vue'));
  const hasViz = fs.existsSync(path.join(dir, 'visualizations')) &&
    fs.readdirSync(path.join(dir, 'visualizations')).length > 0;
  const hasCheatsheet = fs.existsSync(path.join(dir, 'cheatsheet.md'));
  const hasResources = fs.existsSync(path.join(dir, 'resources.json'));

  // Config flags
  const tasksBtnVisible = ch.hasTasks !== false;
  const playBtnVisible = ch.hasPlayground !== false;
  const crBtnVisible = ch.hasCodeReview !== false;

  // Flag mismatches
  if (tasksBtnVisible && !hasTaskFiles) {
    chIssues.push('Кнопка «Задачи» видна, но tasks/ пуста или нет');
  }
  if (playBtnVisible && !hasPlaygroundFile) {
    chIssues.push('Кнопка «Песочница» видна, но playground.vue нет');
  }
  if (crBtnVisible && !hasCR) {
    chIssues.push('Кнопка «Code Review» видна, но code-review/ нет');
  }

  const f = (has, label) => (has ? '✅' : '❌') + label;
  const features = [
    f(hasTaskFiles, 'tasks'), f(hasQuiz, 'quiz'), f(hasInterview, 'interview'),
    f(hasWalkthrough, 'walk'), f(hasCR, 'cr'), f(hasPlaygroundFile, 'play'),
    f(hasViz, 'viz'), f(hasCheatsheet, 'cheat'), f(hasResources, 'res')
  ].join(' ');

  const flags = [];
  if (ch.hasTasks === false) flags.push('tasks:off');
  if (ch.hasPlayground === false) flags.push('play:off');
  if (ch.hasCodeReview === false) flags.push('cr:off');

  results.push({
    chapter: ch.id,
    title: ch.title,
    section: sectionId + '/' + subsectionId,
    subs: ch.subchapters.length,
    features,
    flags: flags.length > 0 ? flags.join(' ') : '—',
    issues: chIssues
  });
}

for (const section of config.sections) {
  for (const sub of (section.subsections || [])) {
    for (const group of (sub.groups || [])) {
      for (const ch of (group.chapters || [])) {
        checkChapter(ch, section.id, sub.id);
      }
    }
  }
}

// Output
for (const r of results) {
  const severity = r.issues.length === 0 ? '✅' : (r.issues.some(i => i.startsWith('КРИТИЧНО')) ? '🔴' : '🟡');
  console.log(`\n${severity} ${r.chapter} — ${r.title}`);
  console.log(`   Section: ${r.section} | Подглав: ${r.subs} | Flags: ${r.flags}`);
  console.log(`   ${r.features}`);
  if (r.issues.length > 0) {
    for (const issue of r.issues) {
      console.log(`   ⚠️  ${issue}`);
    }
  }
}

const total = results.length;
const withIssues = results.filter(r => r.issues.length > 0).length;
const missing = results.filter(r => r.issues.some(i => i.startsWith('КРИТИЧНО'))).length;
console.log(`\n═══════════════════════════════════════`);
console.log(`Всего глав: ${total} | С проблемами: ${withIssues} | Без контента: ${missing}`);
