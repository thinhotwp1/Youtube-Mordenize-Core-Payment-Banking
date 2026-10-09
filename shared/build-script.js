// Episode script tool: counts words per slide in SCRIPT-FINAL.md, fills its time plan,
// writes TELEPROMPTER.txt (one sentence per line, UTF-8 with BOM), and sets the
// time pills in deck.html (time:'...' fields, in slide order).
// Usage: node shared/build-script.js <episode-folder>
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
if (!dir) { console.error('usage: node build-script.js <episode-folder>'); process.exit(1); }
const mdPath = path.join(dir, 'SCRIPT-FINAL.md');
const deckPath = path.join(dir, 'deck.html');
const WPM = 125, PAUSE = 6; // seconds per slide for transitions and pen drawing

let md = fs.readFileSync(mdPath, 'utf8');
const slides = [...md.matchAll(/<!-- slide:(\d+) -->\r?\n## (.+)\r?\n([\s\S]*?)<!-- \/slide -->/g)]
  .map(m => ({ n: +m[1], title: m[2].trim(), body: m[3].trim() }));

const clean = s => s.replace(/\*\*/g, '');
const spoken = s => clean(s).replace(/\[[^\]]+\]/g, ' ');
const words = s => spoken(s).split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;
const mmss = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

let t = 0, total = 0;
const rows = slides.map(s => {
  const w = words(s.body); total += w;
  const dur = Math.round((w / WPM * 60 + PAUSE) / 5) * 5;
  const r = { ...s, w, dur, start: t, end: t + dur };
  t += dur;
  return r;
});

const table = ['| Slide | Words | Length | Timestamp |', '|---|---|---|---|',
  ...rows.map(r => `| ${r.title.replace(/^Slide \d+ · /, `${r.n} · `)} | ${r.w} | ${mmss(r.dur)} | ${mmss(r.start)} – ${mmss(r.end)} |`),
  `| **Total** | **${total}** | **${mmss(t)}** | at ${WPM} words per minute, plus ${PAUSE} s per slide for drawing |`].join('\n');
md = md.replace(/<!-- TIMETABLE -->[\s\S]*?(?=\r?\n---)/, `<!-- TIMETABLE -->\n${table}\n`);
fs.writeFileSync(mdPath, md);

const tp = rows.map(r => {
  const paras = r.body.split(/\r?\n\s*\r?\n/).map(p => clean(p).trim()).filter(Boolean);
  const lines = paras.flatMap(p => {
    const m = p.match(/^\[([^\]]+)\]\s*/);
    const text = m ? p.slice(m[0].length) : p;
    return [...(m ? [`[${m[1]}]`] : []), ...text.split(/(?<=[.?!]["”]?)\s+(?=["“A-Z])/), ''];
  });
  return [`===== ${r.title}  (${mmss(r.start)} – ${mmss(r.end)}) =====`, '', ...lines].join('\n');
}).join('\n');
fs.writeFileSync(path.join(dir, 'TELEPROMPTER.txt'), '﻿' + tp + '\n');

let deck = fs.readFileSync(deckPath, 'utf8'), i = 0;
deck = deck.replace(/time:'[^']*'/g, m => (i < rows.length ? `time:'${mmss(rows[i].start)} – ${mmss(rows[i++].end)}'` : m));
fs.writeFileSync(deckPath, deck);

console.log(rows.map(r => `${r.n}  ${String(r.w).padStart(4)} words  ${mmss(r.dur)}  ${mmss(r.start)}–${mmss(r.end)}`).join('\n'));
console.log(`TOTAL ${total} words, ${mmss(t)}  (time pills set: ${i})`);
