// Versao Linux/Node do build.ps1 (Chromium via Playwright).
// Uso: node _wip/build.mjs <hero|herobig|blob|pango|items|fx> [worker|critic|lead]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/node-tools/node_modules/playwright'); }

const ITEMS = ['hero', 'herobig', 'blob', 'pango', 'items', 'fx'];
const [item, who = 'worker'] = process.argv.slice(2);
if (!ITEMS.includes(item)) { console.error('uso: node _wip/build.mjs <' + ITEMS.join('|') + '> [worker|critic|lead]'); process.exit(1); }
const wip = path.dirname(new URL(import.meta.url).pathname);
const root = path.dirname(wip);
const outDir = path.join(wip, 'out', who);
fs.mkdirSync(outDir, { recursive: true });
const rd = p => fs.readFileSync(p, 'utf8');

// 1) bloco de arte do index.html com a secao em teste trocada pela copia de trabalho
const idx = rd(path.join(root, 'index.html'));
const a0 = idx.indexOf('/* ART-BEGIN */'), a1 = idx.indexOf('/* ART-END */') + '/* ART-END */'.length;
if (a0 < 0 || a1 < 20) throw new Error('marcadores ART-BEGIN/ART-END nao encontrados');
let art = idx.slice(a0, a1);
const secFile = path.join(wip, 'sec', item + '.js');
if (fs.existsSync(secFile)) {
  const s0 = art.indexOf(`/* SEC:${item} */`), s1 = art.indexOf(`/* END:${item} */`);
  if (s0 < 0 || s1 < 0) throw new Error('marcadores da secao ' + item + ' nao encontrados');
  art = art.slice(0, s0) + `/* SEC:${item} */\n` + rd(secFile).trim() + '\n' + art.slice(s1);
}
const onerr = "<script>window.__errs=[];window.onerror=function(m,s,l,c){window.__errs.push(m+' (linha '+l+':'+c+')');};</script>";

// 2) paginas
const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#1b1d24}</style>${onerr}</head><body>\n<script>\n'use strict';\n${art}\n</script>\n<script>\n${rd(path.join(wip, 'spec', item + '.js'))}\n</script>\n<script>\n${rd(path.join(wip, 'viewer.js'))}\n</script>\n</body></html>`;
const sheetPath = path.join(outDir, item + '-sheet.html');
fs.writeFileSync(sheetPath, sheet);
let game = idx.slice(0, a0) + art + idx.slice(a1);
game = game.replace('<head>', '<head>\n' + onerr).replace('</body>', `<script>\n${rd(path.join(wip, 'harness.js'))}\n</script>\n</body>`);
const gamePath = path.join(outDir, item + '-game.html');
fs.writeFileSync(gamePath, game);

// 3) capturas, cortando o espaco vazio no fim
const browser = await pw.chromium.launch();
const logs = [], shots = [];
async function shot(page, hash, name) {
  const pg = await browser.newPage({ viewport: { width: 1360, height: 1500 } });
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${name}] ${m.text()}`); });
  pg.on('pageerror', e => logs.push(`[${name}] ${e.message}`));
  // a fonte do Google pode nao carregar; nao bloqueia
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto('file://' + page + '#' + hash);
  await pg.waitForTimeout(1500);
  const errs = await pg.evaluate(() => window.__errs || []);
  for (const e of errs) logs.push(`[${name}] ${e}`);
  const h = await pg.evaluate(() => {
    const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
    if (!c) return document.body.scrollHeight;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, w = c.width;
    const bg = [d[d.length - 4], d[d.length - 3], d[d.length - 2]];
    for (let y = c.height - 1; y >= 0; y--) for (let x = 0; x < w - 24; x++) {
      const i = (y * w + x) * 4;
      if (d[i] !== bg[0] || d[i + 1] !== bg[1] || d[i + 2] !== bg[2]) return c.getBoundingClientRect().top + Math.min(c.height, y + 14);
    }
    return 40;
  });
  await pg.setViewportSize({ width: 1360, height: Math.max(40, Math.ceil(h)) });
  const dest = path.join(outDir, `${item}-${name}.png`);
  await pg.screenshot({ path: dest, clip: { x: 0, y: 0, width: 1360, height: Math.max(40, Math.ceil(h)) } });
  await pg.close();
  shots.push(dest);
}
for (const p of ['frames', 'anim', 'track']) await shot(sheetPath, 'part=' + p, p);
const gameParts = { hero: [1, 3], herobig: [1, 2], blob: [1], pango: [1], items: [1], fx: [1] };
for (const n of gameParts[item]) await shot(gamePath, `item=${item}&part=${n}`, 'game' + n);
await browser.close();

console.log('Secao: ' + item + '  (copia de trabalho: ' + (fs.existsSync(secFile) ? secFile : 'nenhuma, usando o index.html') + ')');
console.log('Imagens geradas (abra com Read):'); for (const s of shots) console.log('  ' + s);
console.log(logs.length ? 'Mensagens do console:\n  ' + logs.slice(0, 25).join('\n  ') : 'Console: sem erros.');
