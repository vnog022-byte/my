/* folha da secao pango: pangolim 16x24 andando e bola 16x16 */
const SPEC_pg = o => Object.assign({ type: 'pango', state: 'walk', anim: 0, dir: -1, h: 24, x: 100, roll: 0, shellT: 0 }, o);
const SPEC_pgAll = ['pango_a', 'pango_b', 'pango_x', 'ball0', 'ball1', 'ball2', 'ball3', 'ball_peek', 'ball_peek2'];

/* LAB: padroes de escama sobre a mascara da armadura */
const PGM = ['................','........####....','......########..','.....##########.','....############','....############','...#############','...#############','...#############','...#############','...#############','...#############','....############','....############','.....###########','.....###########','.....###########','......#########.','.......#######..'];
const PGT = {
  t54: [['SSAAA', 'KAAAA', 'AKAAK', 'AAKKA'], 5, 2, 1],
  t65: [['ASSAAA', 'SAAAAA', 'KAAAAA', 'AKAAAK', 'AAKKKA'], 6, 3, 1],
  t65b: [['ASSAAA', 'SAAAAA', 'KAAAAA', 'AKAAAK', 'AAKKKA'], 6, 3, 3],
  t55: [['SSAAA', 'SAAAA', 'KAAAA', 'AKAAK', 'AAKKA'], 5, 2, 0],
  t64: [['SSAAAA', 'KAAAAA', 'AKAAAK', 'AAKKKA'], 6, 3, 1],
};
for (const k in PGT) {
  const [t, pw, off, y0] = PGT[k], th = t.length;
  const g = PGM.map((r, y) => [...r].map((c, x) => { if (c !== '#') return '.'; const band = Math.floor((y + y0) / th); return t[(y + y0) % th][((x + band * off) % pw + pw) % pw]; }));
  for (let y = 0; y < g.length; y++) for (let x = 0; x < 16; x++) if (PGM[y][x] === '#' && [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([a, b]) => !(PGM[y + b] || '')[x + a] || PGM[y + b][x + a] !== '#')) g[y][x] = 'K';
  const arm = g.map(r => r.join(''));
  ROWS['pgt_' + k] = compose(16, 24, [[PG_TAIL, 12, 17], [arm], [PG_HEAD, 0, 7], [PG_BELLY, 0, 12], [PG_LEGS.a, 0, 19]]);
}
var SPEC = {
  title: 'Pango (16x24 andando, bola 16x16) — secao pango',
  sizes: [['pango_a', 16, 24], ['pango_b', 16, 24], ['pango_c', 16, 24], ['pango_x', 16, 24], ['ball0', 16, 16], ['ball1', 16, 16], ['ball2', 16, 16], ['ball3', 16, 16], ['ball_peek', 16, 16], ['ball_peek2', 16, 16]],
  grounded: ['pango_a', 'pango_b', 'ball0', 'ball1', 'ball2', 'ball3', 'ball_peek', 'ball_peek2'],
  groups: [
    { title: 'LAB escamas', scale: 8, items: Object.keys(PGT).map(k => ['pgt_' + k, 'pango']) },
    { title: 'LAB 3x', scale: 3, items: Object.keys(PGT).map(k => ['pgt_' + k, 'pango']) },
    { title: 'LAB 1x', scale: 1, items: Object.keys(PGT).map(k => ['pgt_' + k, 'pango']) },
    { title: 'Andando A/B e derrubado (10x)', scale: 10, items: [['pango_a', 'pango'], ['pango_b', 'pango'], ['pango_x', 'pango', false, true]] },
    { title: 'Bola: parada, girando (4), acordando (2) (10x)', scale: 10, items: ['ball0', 'ball1', 'ball2', 'ball3', 'ball_peek', 'ball_peek2'].map(k => [k, 'pango']) },
    { title: 'Todos (3x)', scale: 3, items: SPEC_pgAll.map(k => [k, 'pango']).concat([['pango_a', 'pango', true]]) },
    { title: 'Todos (1x)', scale: 1, items: SPEC_pgAll.map(k => [k, 'pango']) },
  ],
  strips: (() => {
    let e;
    return [
      { title: 'Andando — a cada 4 ticks (3x)', n: 12, cw: 22, ch: 30, scale: 3, reset: () => { e = SPEC_pg(); },
        frame: () => { const f = pangoSprite(e, 0, 0); e.anim += 4; return Object.assign(f, { label: f.id }); } },
      { title: 'Bola parada e acordando — shellT de 96 a 140 a cada 4 ticks (3x)', n: 12, cw: 22, ch: 22, scale: 3, reset: () => { e = SPEC_pg({ state: 'shell', h: 16, shellT: 96 }); },
        frame: () => { const f = pangoSprite(e, 0, 0); e.shellT += 4; return Object.assign(f, { label: f.id }); } },
      { title: 'Bola rolando para a direita — um quadro por tick (3x)', n: 12, cw: 22, ch: 22, scale: 3, reset: () => { e = SPEC_pg({ state: 'shellmove', h: 16 }); },
        frame: () => { const f = pangoSprite(e, 0, 0); e.roll += 4.2; return Object.assign(f, { label: f.id }); } },
    ];
  })(),
  tracks: (() => {
    let e, X;
    return [{ title: 'Trilha andando a 0,5 px/tick: 1 linha = 2 ticks. O pe de apoio deve ficar parado (grade a cada 8 px)', n: 20, scale: 4, w: 48, h: 24,
      reset: () => { e = SPEC_pg(); X = 30; },
      frame: () => { const f = pangoSprite(e, 0, 0); const r = { id: f.id, pal: f.pal, flip: f.flip, x: Math.round(X) - 1, label: f.id + ' anim=' + e.anim }; e.anim += 2; X -= 1; return r; } }];
  })(),
  context: [['pango_a', 'pango'], ['pango_b', 'pango'], ['ball0', 'pango'], ['ball_peek', 'pango'], ['h_stand', 'hero'], ['H_stand', 'hero']],
};
