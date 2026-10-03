/* folha da secao fx: moeda (8x14), bola de fogo (8x8), pedaco de tijolo (8x8) e particulas */
const SPEC_cell = (list, label, w = 26, h = 24) => ({ label, extra: (x2, X, Y, sc) => {
  const o = document.createElement('canvas'); o.width = w; o.height = h; const oc = o.getContext('2d');
  for (const q of list) drawPart(oc, q, 0);
  x2.imageSmoothingEnabled = false; x2.drawImage(o, X, Y, w * sc, h * sc);
} });
const SPEC_part = (k, t, life, extra = {}) => Object.assign({ k, x: 13, y: 12, t, life, vx: 0, vy: 0 }, extra);
const SPEC_goo = t => {
  const out = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI + (i + 0.5) / 8 * Math.PI, vx = Math.cos(a) * (0.8 + (i % 3) * 0.3), vy0 = Math.sin(a) * (1.4 + (i % 2) * 0.8);
    let x = 13, y = 18, vy = vy0;
    for (let k = 0; k < t; k++) { x += vx; y += vy; vy += 0.2; }
    out.push({ k: 'goo', x, y, t, life: 26, vx, vy, g: 0.2, gy: 21, col: i % 2 ? '#a048d8' : '#d8a0f8' });
  }
  return out;
};
const SPEC_ids = pre => Object.keys(ROWS).filter(k => k.startsWith(pre));
var SPEC = {
  title: 'Efeitos — secao fx',
  sizes: SPEC_ids('coin').map(k => [k, 8, 14]).concat(SPEC_ids('fire').map(k => [k, 8, 8]), SPEC_ids('deb').map(k => [k, 8, 8])),
  groups: [
    { title: 'Moeda girando (10x)', scale: 10, items: SPEC_ids('coin').map(k => [k, 'coin']) },
    { title: 'Bola de fogo e pedaco de tijolo (10x)', scale: 10, items: SPEC_ids('fire').map(k => [k, 'fire']).concat(SPEC_ids('deb').map(k => [k, 'deb'])) },
    { title: 'Explosao da bola de fogo (8x)', scale: 8, items: SPEC_ids('boom').map(k => [k, 'fire']) },
    { title: 'Poeira, brilho e impacto (8x)', scale: 8, items: SPEC_ids('dust').map(k => [k, 'dust']).concat(SPEC_ids('spark').map(k => [k, fxPal('#fcd848')]), SPEC_ids('pow').map(k => [k, 'pow'])) },
  ],
  strips: [
    { title: 'Moeda saltando do bloco: um quadro por tick (3x)', n: 16, cw: 14, ch: 22, scale: 3, frame: i => ({ id: coinSprite(i), pal: 'coin', dy: -4, label: coinSprite(i) }) },
    { title: 'Bola de fogo indo para a direita: um quadro por tick (4x)', n: 12, cw: 14, ch: 14, scale: 4, frame: i => ({ id: fireSprite({ t: i, vx: 1 }), pal: 'fire', dy: -3, label: fireSprite({ t: i, vx: 1 }) }) },
    { title: 'Pedaco de tijolo girando: um quadro por tick (4x)', n: 12, cw: 14, ch: 14, scale: 4, frame: i => ({ id: debSprite({ t: i, vx: 1 }), pal: 'deb', dy: -3, label: debSprite({ t: i, vx: 1 }) }) },
    { title: 'Poeira (vida 16 ticks, subindo devagar): um quadro por tick', n: 16, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell([SPEC_part('dust', i, 16, { x: 13 + i * 0.3, y: 20 - i * 0.35 })], 'dust t=' + i) },
    { title: 'Brilho (vida 16 ticks): a cada 2 ticks', n: 8, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell([SPEC_part('spark', i * 2, 16, { col: '#fcd848' })], 'spark t=' + i * 2) },
    { title: 'Brilho padrao (sem cor) a cada 2 ticks', n: 8, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell([SPEC_part('spark', i * 2, 16)], 'spark t=' + i * 2) },
    { title: 'Tijolo: os 4 pedacos (esq. espelhados, t0 = 0,3,6,9), a cada 3 ticks (3x)', n: 8, cw: 44, ch: 16, scale: 3, frame: i => ({ label: 't=' + i * 3, extra: (x2, X, Y, sc) => { x2.imageSmoothingEnabled = false; [0, 3, 6, 9].forEach((t0, j) => { const d = { t: t0 + i * 3, vx: j % 2 ? 1 : -1 }; x2.drawImage(spr(debSprite(d), 'deb', d.vx < 0), X + (2 + j * 10) * sc, Y + 2 * sc, 8 * sc, 8 * sc); }); } }) },
    { title: 'Impacto ao pisar (vida 10 ticks)', n: 10, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell([SPEC_part('burst', i, 10)], 'burst t=' + i) },
    { title: 'Estouro da bola de fogo (vida 12 ticks)', n: 12, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell([SPEC_part('ring', i, 12, { col: '#f88818' })], 'ring t=' + i) },
    { title: 'Gotas da gosma pisada (vida 26 ticks): a cada 2 ticks', n: 13, cw: 26, ch: 24, scale: 3, frame: i => SPEC_cell(SPEC_goo(i * 2), 'goo t=' + i * 2) },
  ],
  context: [['coin0', 'coin'], ['fire0', 'fire'], ['deb0', 'deb'], ['h_stand', 'hero'], ['H_stand', 'hero']],
};
