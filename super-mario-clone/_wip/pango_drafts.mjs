// Rascunhos de pango (4 conceitos) desenhados a mao, renderizados numa folha de comparacao.
// Uso: node _wip/pango_drafts.mjs  ->  _wip/out/pango-rascunhos.png
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pw = require('playwright');
const wip = path.dirname(new URL(import.meta.url).pathname);

/* Todos olham para a esquerda (o jogo espelha quando anda para a direita).
   K contorno, A corpo/escamas, D sombra das escamas, S barriga/rosto, E olho, N nariz */
const DRAFTS = [
  {
    name: 'A — Tatu de bandas',
    note: 'quadrúpede baixo, casco em domo com bandas, focinho comprido e rabo curto',
    pal: { K: '#181008', A: '#8c7838', D: '#5c4818', S: '#f8dca0', E: '#181008', N: '#c05038' },
    walk: [[
      '................',
      '................',
      '......KKKKKK....',
      '....KKSAKAAKKK..',
      '...KSAAKAAKAAK..',
      '..KAAAKAAKAAAKK.',
      '.KKAADKADKAADKAK',
      'KSSKKKKKKKKKKKAK',
      'KNSESKSSSSSKK.KK',
      '.KKSSKKKKKKK....',
      '...KSK...KSK....',
      '..KSSK..KSSK....',
      '..KKKK..KKKK....',
    ], [
      '................',
      '................',
      '................',
      '......KKKKKK....',
      '....KKSAKAAKKK..',
      '...KSAAKAAKAAK..',
      '..KAAAKAAKAAAKK.',
      '.KKAADKADKAADKAK',
      'KSSKKKKKKKKKKKAK',
      'KNSESKSSSSSKK.KK',
      '.KKSSKKKKKKK....',
      '....KSSK.KSSK...',
      '....KKKK.KKKK...',
    ]],
    ball: [
      '.....KKKKKK.....',
      '...KKSAKAAKKK...',
      '..KSAAKAAKAAAK..',
      '.KSAAKAAKAAKAAK.',
      '.KAAAKAAKAAKAAK.',
      'KAAADKADKADKAADK',
      'KAAAKAAKAAKAAAAK',
      'KAADKADKADKAADAK',
      'KAAAKAAKAAKAAAAK',
      'KAADKADKADKAADAK',
      '.KAAKAAKAAKAAAK.',
      '.KDAKADKADKADDK.',
      '..KDDKDDKDDDDK..',
      '...KKDDDDDDKK...',
      '.....KKKKKK.....',
      '................',
    ],
  },
  {
    name: 'B — Pangolim bípede fofo',
    note: 'em pé, cabeção redondo de focinho curto, capa de escamas nas costas e rabo grosso',
    pal: { K: '#181008', A: '#c08838', D: '#7c4c18', S: '#fce0b0', E: '#181008', N: '#e05850' },
    walk: [[
      '....KKKK........',
      '..KKSSSSKK......',
      '.KSSSSSSSKKKK...',
      'KNSESSSSSKAAAK..',
      'KSSESSSSKAADAAK.',
      '.KSSSSSKAADAADK.',
      '..KKSSKAADAADAK.',
      '...KSSKADAADAAK.',
      '..KSSSKAADAADAK.',
      '..KSSSSKADAADAKK',
      '...KSSSKAADAAKAK',
      '...KKSSKKKKKKKAK',
      '...KSSKKSSK..KK.',
      '..KSSK..KSSK....',
      '..KKKK...KKKK...',
    ], [
      '................',
      '....KKKK........',
      '..KKSSSSKK......',
      '.KSSSSSSSKKKK...',
      'KNSESSSSSKAAAK..',
      'KSSESSSSKAADAAK.',
      '.KSSSSSKAADAADK.',
      '..KKSSKAADAADAK.',
      '...KSSKADAADAAK.',
      '..KSSSKAADAADAKK',
      '...KSSSKADAADKAK',
      '...KKSSKKKKKKKAK',
      '....KSSKSSK..KK.',
      '...KSSKKSSK.....',
      '...KKKK.KKKK....',
    ]],
    ball: [
      '.....KKKKKK.....',
      '...KKAAKAAAKK...',
      '..KAADAAKADAAK..',
      '.KADAAKADAAKAAK.',
      '.KAAKADAAKADAAK.',
      'KAADAAKADAAKADAK',
      'KADAAKADAAKAAKAK',
      'KAAKADAAKADAADAK',
      'KADAAKADAAKAAKAK',
      'KAAKADAAKADAADAK',
      '.KAAKAAKADAAKAK.',
      '.KDAAKADAAKADAK.',
      '..KDDAKDDAKDDK..',
      '...KKDDDDDDKK...',
      '.....KKKKKK.....',
      '................',
    ],
  },
  {
    name: 'C — Pinha com patinhas',
    note: 'corpo redondo todo de escamas em leque (pinha), carinha pequena na frente e pezinhos',
    pal: { K: '#181008', A: '#a06030', D: '#603818', S: '#f8d8a8', E: '#181008', N: '#181008' },
    walk: [[
      '................',
      '.......KKKK.....',
      '.....KKADAAKK...',
      '....KAADAADAAK..',
      '...KADAKADAKDAK.',
      '..KSSKDAKDAKADAK',
      '.KSSSSKADAKADAK.',
      'KNSESSKDAKADAKAK',
      '.KSSSSKAKADAKDAK',
      '..KSSKADAKADAKK.',
      '...KKADAKADAKAK.',
      '....KKKKKKKKKK..',
      '....KSSK..KSSK..',
      '....KKKK..KKKK..',
    ], [
      '................',
      '................',
      '.......KKKK.....',
      '.....KKADAAKK...',
      '....KAADAADAAK..',
      '...KADAKADAKDAK.',
      '..KSSKDAKDAKADAK',
      '.KSSSSKADAKADAK.',
      'KNSESSKDAKADAKAK',
      '.KSSSSKAKADAKDAK',
      '..KSSKADAKADAKK.',
      '...KKKKKKKKKKK..',
      '...KSSK..KSSK...',
      '...KKKK..KKKK...',
    ]],
    ball: [
      '.....KKKKKK.....',
      '...KKADAADAKK...',
      '..KADAKADAKDAK..',
      '.KDAKADAKADAKAK.',
      '.KAKADAKADAKADK.',
      'KADAKADAKADAKDAK',
      'KAKADAKADAKADAKK',
      'KDAKADAKADAKDAKK',
      'KAKADAKADAKADAKK',
      'KADAKADAKADAKDAK',
      '.KAKADAKADAKADK.',
      '.KDAKADAKADAKAK.',
      '..KADAKADAKDAK..',
      '...KKADAADAKK...',
      '.....KKKKKK.....',
      '................',
    ],
  },
  {
    name: 'D — Pangolim-lagarto',
    note: 'comprido e rasteiro, escamas em telha cor de ferrugem, rabo grosso caído atrás',
    pal: { K: '#181008', A: '#c85020', D: '#802808', S: '#f8d098', E: '#181008', N: '#181008' },
    walk: [[
      '................',
      '................',
      '................',
      '................',
      '......KKKKKK....',
      '....KKADAADAKK..',
      '...KADAADAADAAK.',
      '..KDAADAADAADAAK',
      '.KKAADAADAADAKAK',
      'KNSSKKKKKKKKKKAK',
      '.KSESSSSSSSSK.KK',
      '..KKSKKKKSKKK...',
      '...KSK...KSK....',
      '..KSSK..KSSK....',
      '..KKKK..KKKK....',
    ], [
      '................',
      '................',
      '................',
      '................',
      '................',
      '......KKKKKK....',
      '....KKADAADAKK..',
      '...KADAADAADAAK.',
      '..KDAADAADAADAAK',
      '.KKAADAADAADAKAK',
      'KNSSKKKKKKKKKKAK',
      '.KSESSSSSSSSK.KK',
      '..KKSKKKKKSKK...',
      '...KSSK..KSSK...',
      '...KKKK..KKKK...',
    ]],
    ball: [
      '.....KKKKKK.....',
      '...KKADAADAKK...',
      '..KADAADAADAAK..',
      '.KDAADAADAADAAK.',
      '.KAADAADAADAADK.',
      'KADAADAKKKADAADK',
      'KAADAAKAADKAADAK',
      'KDAADAKADAKDAADK',
      'KAADAAKKKAKAADAK',
      'KADAADAADKADAADK',
      '.KAADAADAADAADK.',
      '.KDAADAADAADAAK.',
      '..KADAADAADAAK..',
      '...KKADAADAKK...',
      '.....KKKKKK.....',
      '................',
    ],
  },
];

// heroi pequeno (h_stand do jogo) para escala
const idx = fs.readFileSync(path.join(wip, '..', 'index.html'), 'utf8');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#1b1d24;color:#e8eaf0;font:14px Arial,sans-serif}
</style></head><body><canvas id="c"></canvas><script>
const D = ${JSON.stringify(DRAFTS)};
${idx.slice(idx.indexOf('/* ART-BEGIN */'), idx.indexOf('/* ART-END */'))}
const hero = spr('h_stand', 'hero', false);
const c = document.getElementById('c'), x = c.getContext('2d');
const COLW = 330, W = COLW * 4 + 20, H = 760; c.width = W; c.height = H;
x.fillStyle = '#1b1d24'; x.fillRect(0, 0, W, H); x.imageSmoothingEnabled = false;
const draw = (rows, pal, X, Y, s, flip) => {
  const w = Math.max(...rows.map(r => r.length));
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch === '.') continue;
    x.fillStyle = pal[ch] || '#f0f'; const px = flip ? w - 1 - i : i; x.fillRect(X + px * s, Y + j * s, s, s); } });
};
const pad = rows => { const h = rows.length; return Array(16 - Math.min(16, h)).fill('').concat(rows); };
D.forEach((d, k) => {
  const X0 = 10 + k * COLW;
  x.fillStyle = '#fcc43c'; x.font = 'bold 18px Arial'; x.fillText(d.name, X0, 28);
  x.fillStyle = '#9aa1b2'; x.font = '12px Arial';
  const words = d.note.split(' '); let line = '', ly = 48;
  for (const w of words) { if ((line + w).length > 48) { x.fillText(line, X0, ly); ly += 16; line = ''; } line += w + ' '; } x.fillText(line, X0, ly);
  // ampliado 8x: andando 1, andando 2
  let Y = 90;
  d.walk.forEach((f, i) => { const ff = pad(f); x.fillStyle = '#5c94fc'; x.fillRect(X0 + i * 150, Y, 136, 136); draw(ff, d.pal, X0 + i * 150 + 4, Y + 4, 8); });
  x.fillStyle = '#c8ccd8'; x.fillText('andando 1                          andando 2', X0, Y + 152);
  Y = 260;
  x.fillStyle = '#5c94fc'; x.fillRect(X0, Y, 136, 136); draw(d.ball, d.pal, X0 + 4, Y + 4, 8);
  x.fillStyle = '#c8ccd8'; x.fillText('bola (pisado)', X0, Y + 152);
  // no jogo, 3x: heroi pequeno + pango andando (alternando) + bola
  Y = 440;
  x.fillStyle = '#5c94fc'; x.fillRect(X0, Y, 310, 120);
  x.fillStyle = '#c84c0c'; x.fillRect(X0, Y + 120 - 18, 310, 18); x.fillStyle = '#000'; x.fillRect(X0, Y + 120 - 18, 310, 2);
  const gy = Y + 120 - 18;
  x.drawImage(hero, X0 + 12, gy - 48, 48, 48);
  draw(pad(d.walk[0]), d.pal, X0 + 100, gy - 48, 3);
  draw(pad(d.walk[1]), d.pal, X0 + 170, gy - 48, 3, true);
  draw(d.ball, d.pal, X0 + 240, gy - 48, 3);
  x.fillStyle = '#c8ccd8'; x.fillText('no jogo (3x): herói, andando ←, andando →, bola', X0, Y + 138);
  // tamanho real 1x
  Y = 600;
  x.fillStyle = '#5c94fc'; x.fillRect(X0, Y, 120, 40);
  x.drawImage(hero, X0 + 8, Y + 22, 16, 16);
  draw(pad(d.walk[0]), d.pal, X0 + 40, Y + 22, 1); draw(pad(d.walk[1]), d.pal, X0 + 64, Y + 22, 1, true); draw(d.ball, d.pal, X0 + 90, Y + 22, 1);
  x.fillStyle = '#c8ccd8'; x.fillText('tamanho real (1x)', X0, Y + 58);
});
</script></body></html>`;
const out = path.join(wip, 'out', 'pango-rascunhos.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
for (const d of DRAFTS) for (const f of [...d.walk, d.ball]) f.forEach((r, i) => { if (r.length !== 16) console.log(d.name, 'linha', i, 'tem', r.length); });
const b = await pw.chromium.launch(); const pg = await b.newPage({ viewport: { width: 1340, height: 760 } });
const errs = []; pg.on('pageerror', e => errs.push(e.message));
await pg.goto('file://' + out); await pg.waitForTimeout(500);
await pg.screenshot({ path: path.join(wip, 'out', 'pango-rascunhos.png') });
await b.close();
console.log(errs.length ? errs : 'ok');
