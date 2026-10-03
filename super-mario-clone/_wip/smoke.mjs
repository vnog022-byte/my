// Abre index.html e sprite-demo.html, joga alguns segundos e lista erros de JS.
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/node-tools/node_modules/playwright'); }
const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const b = await pw.chromium.launch(); let bad = 0;
for (const f of ['index.html', 'sprite-demo.html']) {
  const pg = await b.newPage({ viewport: { width: 1000, height: 900 } }); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto('file://' + path.join(root, f));
  await pg.waitForTimeout(800);
  if (f === 'index.html') {
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
    await pg.keyboard.down('ArrowRight'); await pg.keyboard.down('ShiftLeft');
    for (let i = 0; i < 8; i++) { await pg.keyboard.press('Space'); await pg.waitForTimeout(400); }
    await pg.keyboard.up('ArrowRight'); await pg.keyboard.up('ShiftLeft');
  }
  await pg.screenshot({ path: path.join(root, '_wip/out', f.replace('.html', '-smoke.png')) });
  console.log(f + ': ' + (errs.length ? 'ERROS\n  ' + errs.join('\n  ') : 'ok')); bad += errs.length;
}
await b.close(); process.exit(bad ? 1 : 0);
