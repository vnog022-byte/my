// Versao Node do integrate.ps1: leva secoes aprovadas de _wip/sec para o index.html e sincroniza o painel.
// Uso: node _wip/integrate.mjs hero blob ...
import fs from 'node:fs';
import path from 'node:path';
const wip = path.dirname(new URL(import.meta.url).pathname), root = path.dirname(wip);
const idxPath = path.join(root, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
for (const it of process.argv.slice(2)) {
  const s0 = idx.indexOf(`/* SEC:${it} */`), s1 = idx.indexOf(`/* END:${it} */`);
  if (s0 < 0 || s1 < 0) throw new Error('secao ' + it + ' nao encontrada no index.html');
  idx = idx.slice(0, s0) + `/* SEC:${it} */\n` + fs.readFileSync(path.join(wip, 'sec', it + '.js'), 'utf8').trim() + '\n' + idx.slice(s1);
  console.log('integrada: ' + it);
}
fs.writeFileSync(idxPath, idx);
const demoPath = path.join(root, 'sprite-demo.html');
let demo = fs.readFileSync(demoPath, 'utf8');
const cut = s => [s.indexOf('/* ART-BEGIN */'), s.indexOf('/* ART-END */') + '/* ART-END */'.length];
const [a0, a1] = cut(idx), [d0, d1] = cut(demo);
demo = demo.slice(0, d0) + idx.slice(a0, a1) + demo.slice(d1);
fs.writeFileSync(demoPath, demo);
console.log('painel sincronizado');
