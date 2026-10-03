/* folha da secao blob: gosma (16x16) */
const SPEC_blob = o => Object.assign({ type: 'blob', state: 'walk', anim: 0, seed: 1, dir: -1, h: 16, x: 0 }, o);
const SPEC_bwalk = (n, sc, title, dir = -1) => {
  let e;
  return { title, n, cw: 24, ch: 22, scale: sc, reset: () => { e = SPEC_blob({ dir }); },
    frame: () => { const f = blobSprite(e, 0); e.anim += 2; return Object.assign({}, f, { label: f.id.replace('blob_', '') }); } };
};
const SPEC_btrack = (n, title) => {
  let e, X;
  return { title, n, scale: 4, w: 72, h: 16,
    reset: () => { e = SPEC_blob({}); X = 50; },
    frame: () => { const f = blobSprite(e, 0); const r = Object.assign({}, f, { x: Math.round(X) - 1, label: f.id.replace('blob_', '') + ' t=' + e.anim }); e.anim++; X -= 0.5; return r; } };
};
var SPEC = {
  title: 'Gosma (16x16) — secao blob',
  sizes: Object.keys(ROWS).filter(k => k.startsWith('blob_')).map(k => [k, 16, 16]),
  grounded: Object.keys(ROWS).filter(k => k.startsWith('blob_') && k !== 'blob_ko'),
  groups: [
    { title: 'Caminhada (10x) — 1 quadro a cada 4 ticks', scale: 10, items: BLOB_WALK.map(k => [k, 'blob']) },
    { title: 'Piscar, esmagada, derrubada (10x)', scale: 10, items: [['blob_w0_b', 'blob'], ['blob_flat', 'blob'], ['blob_ko', 'blob'], ['blob_ko', 'blob', false, true]] },
    { title: 'Tudo (3x)', scale: 3, items: BLOB_WALK.concat(['blob_w0_b', 'blob_flat', 'blob_ko']).map(k => [k, 'blob']) },
  ],
  strips: [
    SPEC_bwalk(16, 4, 'Andando para a esquerda — a cada 2 ticks (4x)'),
    SPEC_bwalk(16, 3, 'Andando para a direita — a cada 2 ticks (3x)', 1),
  ],
  tracks: [SPEC_btrack(34, 'Trilha: 1 linha = 1 tick, 0,5 px/tick para a esquerda. Pe apoiado deve ficar parado')],
  context: BLOB_WALK.slice(0, 4).map(k => [k, 'blob']).concat([['blob_flat', 'blob'], ['blob_ko', 'blob', false, true], ['h_stand', 'hero'], ['H_stand', 'hero']]),
};
