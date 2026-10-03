/* ---- Heroi pequeno (16x16), cabeca e paletas compartilhadas, e escolha de quadro do heroi.
   Sub-paletas: corpo K/C/L (contorno, moletom, claro), pele S + olho E(=K), pernas P/Q (calca vinho perto/longe).
   Tenis O = L (claro) e N = C; T, B fundidos em S (as letras continuam definidas para o heroi grande).
   Cada quadro e pintado em camadas por HS_paint: perna de longe, perna de perto e bracos (manga C + mao S)
   ganham contorno K automatico (sola K = contato com o chao); tronco e cabeca HH (12x7 em x=2).
   Caminhada em 4 quadros: contato (perna da frente quase vertical, pe de tras na ponta com o calcanhar
   erguido), passagem (perna de apoio reta, a livre dobrada com o pe erguido 2 px atras), e os mesmos com as
   pernas trocadas. A ponta do pe de apoio vai 14 -> 9 -> 4: 5 px por quadro = HERO_STEP_S. ---- */
const HH = [
  '.K.....K....',
  'KLK...KLK...',
  'KLCK..KLCK..',
  'KCCCKKCCCCK.',
  'KCCLSSSSESSK',
  'KCCLSSSSEESK',
  '.KCLSSSSSSK.'];
const HH2 = ['............', 'KK.....KKK..', 'KLK...KLLCK.'].concat(HH.slice(3));
/* rosto de frente (susto), 10 de largura em x=3: olhos 2x2 arregalados, boca aberta 2x2 */
const HF = [
  '.K......K.',
  'KLK....KLK',
  'KLCKKKKCLK',
  'KSEESSEESK',
  'KSEESSEESK',
  'KSSSKKSSSK',
  '.KSSKKSSK.'];
const HS_paint = parts => {
  const g = Array.from({ length: 16 }, () => new Array(16).fill('.'));
  for (const [rows, dx = 0, dy = 0, ol = false] of parts) {
    const h = rows.length, w = rows[0].length;
    const on = (x, y) => y >= 0 && y < h && x >= 0 && x < w && rows[y][x] !== '.';
    if (ol) for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
      if (on(x, y) || !(on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1))) continue;
      const X = x + dx, Y = y + dy; if (X >= 0 && X < 16 && Y >= 0 && Y < 16 && (ol !== 's' || g[Y][X] === '.')) g[Y][X] = 'K';
    }
    rows.forEach((r, y) => { for (let x = 0; x < w; x++) { const X = x + dx, Y = y + dy; if (r[x] !== '.' && X >= 0 && X < 16 && Y >= 0 && Y < 16) g[Y][X] = r[x]; } });
  }
  return g.map(r => r.join(''));
};
const HS_TORSO = ['...KCCCCCCCCK...', '...KCCCCCCCCK...', '....KLLLLLLK....'];
const hsKeep = (rows, set) => rows.map(r => r.replace(/./g, ch => set.includes(ch) ? ch : '.'));
/* pernas (preenchimento, 16 de largura), comecam na linha y0: Q/N = perna de longe, P/O = de perto */
const HS_LEG = {
  stand: [10,
    '.....QQQPPP.....',
    '.....QQ.PP......',
    '.....QQ.PP......',
    '....NNN.OOO.....',
    '....NNNNOOOO....'],
  cA: [11, // contato: perto na frente (quase vertical, degrau no joelho), longe atras na ponta do pe
    '......QQQPPP....',
    '....QQ.....PP...',
    '..NNN......OOO..',
    '...NN......OOOO.'],
  pA: [10, // passagem: perto reta embaixo do corpo, longe dobrada com o pe erguido 2 px atras
    '.....QQPPP......',
    '.....QQPP.......',
    '..NNQQ.PP.......',
    '......OOO.......',
    '......OOOO......'],
  jump: [10, // perto encolhida (coxa horizontal), longe esticada para baixo
    '.....QQ.PPPP....',
    '....QQ.....PP...',
    '....QQ.....OOO..',
    '...QQ...........',
    '..NNN...........'],
  fall: [10,
    '.....QQQPPP.....',
    '....QQ...PP.....',
    '....QQ....PP....',
    '...NNN....OOO...',
    '...NNNN...OOOO..'],
  skid: [10, // pes plantados para o lado do movimento: longe esticada, perto dobrada
    '.......QQPPPP...',
    '.....QQ..PP.....',
    '...QQ...PP......',
    '..NNN...OOO.....',
    '.NNNN...OOOO....'],
  land: [12,
    '....QQQ..PPP....',
    '...NNN....OOO...',
    '...NNNN...OOOO..'],
  climb1: [10, // joelho de perto alto com o pe no mastro, perna de longe enganchada embaixo
    '....QQPPPPP.....',
    '....QQ....PP....',
    '....QQ....OOO...',
    '.....QQ.........',
    '.....NNNN.......'],
  die: [10,
    '.....QQQPPP.....',
    '.....QQ..PP.....',
    '.....QQ..PP.....',
    '.....NN..OO.....',
    '....NNN..OOO....'],
};
HS_LEG.cB = [HS_LEG.cA[0], ...swapLegs(HS_LEG.cA.slice(1))]; HS_LEG.pB = [HS_LEG.pA[0], ...swapLegs(HS_LEG.pA.slice(1))];
HS_LEG.climb2 = [HS_LEG.climb1[0], ...swapLegs(HS_LEG.climb1.slice(1))];
/* bracos de 2 px (manga C + mao S), com contorno: [desenho, x, y] */
const HS_ARM = {
  dn: ['C', 'S'], bk: ['.C', 'S.'], fw: ['C.', '.S'],
  upR: ['..S', '.C.', 'C..'], upL: ['S..', '.C.', '..C'],
  side: ['SC', 'SC'], sideR: ['CS', 'CS'], grab: ['CS'], reach: ['.S', 'C.'], hi: ['S.', 'S.', 'C.', '.C'],
  /* desenhos prontos (ja com contorno), sem contorno automatico */
  jumpR: ['.............KK.', '............KSSK', '............KSSK', '.............KCK', '..............CK',
    '..............CK', '..............CK', '.............CCK', '.............KK.'],
  dieV: ['K..............K', 'SK............KS', 'SK............KS', 'KC............CK', 'KC............CK',
    '.KCK........KCK.', '.KC..........CK.', '..K..........K..'],
};
const hsFrame = ({ head = HH, hx = 2, hy = 0, tx = 0, leg, arms = [], torso = HS_TORSO }) => {
  const [y0, ...rows] = leg;
  return HS_paint([
    [hsKeep(rows, 'QN'), 0, y0, true],
    [hsKeep(rows, 'PO'), 0, y0, 's'],
    [torso, tx, 7 + hy],
    [head, hx, hy],
    ...arms.map(([a, x, y]) => [HS_ARM[a], x, y, HS_ARM[a][0].length < 16]),
  ]);
};
const ARMS_DN = [['dn', 3, 8], ['dn', 12, 8]];
ROWS.h_stand = hsFrame({ leg: HS_LEG.stand, arms: ARMS_DN });
ROWS.h_stand2 = hsFrame({ head: HH2, leg: HS_LEG.stand, arms: ARMS_DN });
/* caminhada: no contato so a mao da frente aparece (a de tras fica atras do tronco); na passagem, uma mao */
ROWS.h_w1 = hsFrame({ hy: 1, leg: HS_LEG.cA, arms: [['fw', 12, 9]] });
ROWS.h_w2 = hsFrame({ leg: HS_LEG.pA, arms: [['dn', 12, 7]] });
ROWS.h_w3 = hsFrame({ hy: 1, leg: HS_LEG.cB, arms: [['fw', 12, 9]] });
ROWS.h_w4 = hsFrame({ leg: HS_LEG.pB, arms: [['dn', 12, 7]] });
ROWS.h_jump = hsFrame({ hx: 1, leg: HS_LEG.jump, arms: [['bk', 2, 8], ['jumpR', 0, 0]] });
ROWS.h_fall = hsFrame({ leg: HS_LEG.fall, arms: [['upL', 0, 5], ['upR', 13, 5]] });
ROWS.h_skid = hsFrame({ hx: 4, tx: 2, leg: HS_LEG.skid, arms: [['hi', 3, 5], ['dn', 14, 8]] });
ROWS.h_land = hsFrame({ hy: 2, leg: HS_LEG.land, arms: [['bk', 2, 10], ['fw', 12, 10]] });
ROWS.h_climb1 = hsFrame({ hx: 1, tx: -1, leg: HS_LEG.climb1, arms: [['reach', 12, 6], ['grab', 12, 8]] });
ROWS.h_climb2 = hsFrame({ hx: 1, tx: -1, leg: HS_LEG.climb2, arms: [['grab', 12, 7], ['fw', 12, 8]] });
ROWS.h_die1 = hsFrame({ head: HF, hx: 3, leg: HS_LEG.die, arms: [['side', 1, 8], ['sideR', 13, 8]] });
ROWS.h_die2 = hsFrame({ head: HF, hx: 3, leg: HS_LEG.die, arms: [['dieV', 0, 1]] });
for (const k in ROWS) if (k.startsWith('h_') && (ROWS[k].length !== 16 || ROWS[k].some(r => r.length !== 16))) throw new Error('tamanho errado ' + k);

const HERO = { K: '#1c1828', C: '#20a08c', L: '#9cf0d8', M: '#127060', S: '#fcc8a0', T: '#fcc8a0', B: '#fcc8a0', E: '#1c1828',
  P: '#c0385c', Q: '#8c2450', O: '#9cf0d8', N: '#20a08c' };
PAL.hero = HERO;
PAL.heroF = { ...HERO, C: '#e8401c', L: '#fcd860', M: '#981c10', P: '#fcf4e0', Q: '#c8b48c', O: '#fcd860', N: '#e8401c' };
PAL.heroS1 = { ...HERO, C: '#f8b800', L: '#fcf0a0', M: '#b07000', P: '#e84010', Q: '#a02008', O: '#fcf0a0', N: '#f8b800' };
PAL.heroS2 = { ...HERO, C: '#f83890', L: '#fcc0e0', M: '#a01858', P: '#6c2c9c', Q: '#401868', O: '#fcc0e0', N: '#f83890' };
PAL.heroS3 = { ...HERO, C: '#38c8f8', L: '#d0f8fc', M: '#1870b0', P: '#d86818', Q: '#904008', O: '#d0f8fc', N: '#38c8f8' };

/* escolha do quadro: a caminhada avanca pela distancia percorrida (um quadro a cada HERO_STEP px),
   assim o pe de apoio nao patina. HERO_WALK_B e HERO_STEP_B ficam na secao herobig. */
const HERO_WALK_S = ['w1', 'w2', 'w3', 'w4'], HERO_STEP_S = 5, STAR_PALS = ['heroS1', 'heroS2', 'heroS3', 'hero'];
function stepWalk(p, big) {
  const s = Math.abs(p.vx), d = big ? HERO_STEP_B : HERO_STEP_S;
  if (p.ground && s > 0.15) { p.walkD += s; if (p.walkD >= d) { p.walkD -= d; p.walkF = (p.walkF + 1) % 840; } }
  else p.walkD = d;
}
function heroPose(p, big) {
  if (p.state === 'die') return (p.t >> 3) & 1 ? 'die2' : 'die1';
  if (p.state === 'flag') return Math.floor(p.anim) % 2 ? 'climb2' : 'climb1';
  if (!p.ground) return p.vy < 0 ? 'jump' : 'fall';
  if (p.landT > 0) return 'land';
  if (p.skid) return 'skid';
  if (Math.abs(p.vx) > 0.15) { const w = big ? HERO_WALK_B : HERO_WALK_S; return w[p.walkF % w.length]; }
  return p.idle % 160 > 148 ? 'stand2' : 'stand';
}
function heroSprite(p, big) {
  const pose = heroPose(p, big);
  if (!big || pose.startsWith('die')) return 'h_' + pose;
  return p.throwT > 0 && ROWS['H_' + pose + '_t'] ? 'H_' + pose + '_t' : 'H_' + pose;
}
const heroPal = (p, tick) => p.star > 0 ? STAR_PALS[Math.floor(tick / (p.star < 120 ? 6 : 3)) % 4] : p.power === 2 ? 'heroF' : 'hero';
const GROW_SEQ = [16, 24, 16, 24, 32, 24, 32, 24, 32];
