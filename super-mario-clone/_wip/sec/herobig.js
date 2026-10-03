/* ---- Heroi grande TICO (16x32): cabeca HH/HH2 (12x7, em x=2) e paletas da secao hero.
   Corpo em 3/4 de perfil, virado para a direita: braco de perto na frente do tronco, o de longe atras.
   Mesmas cores do heroi pequeno: K contorno, C/L moletom, S pele, P/Q calca (perto/longe), O/N tenis.
   Tudo e pintado em camadas por HB_paint; pernas, tenis, bracos e tronco ganham contorno K automatico
   (a sola K e o contato com o chao), entao as pernas se separam pela forma e pelo contorno, nao pela cor.
   Caminhada de 8 fases (uma perna desenhada; a outra e a mesma 4 fases depois):
   contato, carga (joelho em ">", quadril 1 px mais baixo), passagem (joelho livre a frente, pe erguido),
   impulso (tronco 1 px a frente) e o mesmo com as pernas trocadas. O calcanhar de apoio recua
   11 > 9 > 6 > 4 e a ponta sai em 5: 2,5 px por quadro = HERO_STEP_B, entao o pe nao patina. ---- */
const HB_paint = parts => {
  const g = Array.from({ length: 32 }, () => new Array(16).fill('.'));
  for (const { rows, x = 0, y = 0, ol = false, y1 = -99, y2 = 99 } of parts) {
    const h = rows.length, w = rows[0].length;
    const on = (i, j) => j >= 0 && j < h && i >= 0 && i < w && rows[j][i] !== '.';
    const put = (X, Y, ch) => { if (X >= 0 && X < 16 && Y >= 0 && Y < 32 && Y >= y1 && Y <= y2) g[Y][X] = ch; };
    if (ol) for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++)
      if (!on(i, j) && (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1))) put(i + x, j + y, 'K');
    rows.forEach((r, j) => { for (let i = 0; i < w; i++) if (r[i] !== '.') put(i + x, j + y, r[i]); });
  }
  return g.map(r => r.join(''));
};
/* tronco (preenchimento, linhas 7-16): costas a esquerda, peito a direita, barra clara */
const HB_TORSO = ['.....CCCCCC.....', '....CCCCCCC.....', '....CCCCCCCC....', '....CCCCCCCC....', '.....CCCCCCC....',
  '.....CCCCCCC....', '.....CCCCCC.....', '.....CCCCCC.....', '.....CCCCCC.....', '.....LLLLLL.....'];
const HB_HIP = ['.....PPPPPP.....', '.....PPPPPP.....'];
/* bracos (preenchimento a partir da linha 8; ombro em x=7-8). b = para tras, f = para frente */
const HB_ARM = {
  dn: ['.......CC.......', '.......CC.......', '.......CC.......', '.......CC.......', '.......CC.......', '.......LL.......', '.......SS.......', '.......SS.......'],
  b1: ['.......CC.......', '.......CC.......', '......CC........', '......CC........', '.....CC.........', '.....LL.........', '.....SS.........', '.....SS.........'],
  b2: ['.......CC.......', '......CC........', '.....CC.........', '....CC..........', '....LL..........', '...SS...........', '...SS...........'],
  f1: ['.......CC.......', '.......CC.......', '........CC......', '........CC......', '.........CC.....', '.........LL.....', '.........SS.....', '.........SS.....'],
  f2: ['.......CC.......', '........CC......', '.........CC.....', '..........CC....', '..........LL....', '...........SS...', '...........SS...'],
  thr: ['.......CC.......', '.......CCCCLSS..', '.......CCCCLSS..'],
  // pulo: punho acima da orelha (comeca na linha 0)
  up: ['.............SS.', '.............SS.', '.............LL.', '.............CC.', '.............CC.', '............CC..', '...........CC...',
    '..........CC....', '.........CC.....'],
  // queda: braco de perto aberto para cima/frente (comeca na linha 3), o de longe para cima/tras (linha 4)
  upF: ['............SS..', '............SS..', '............LL..', '...........CC...', '..........CC....', '.........CC.....'],
  upB: ['.SS.............', '.SS.............', '..LL............', '...CC...........', '....CC..........', '.....CC.........', '......CC........'],
  // mastro: braco reto ate o mastro (mao em x=13-14 antes do deslocamento de -1)
  grip: ['.......CCCCLSS..', '.......CCCCLSS..'],
};
const HB_ARMY = { up: 0, upF: 3, upB: 4, grip: 8 };
/* deslocamento do braco de longe (fica atras do tronco; so aparece o que sai da silhueta) */
const HB_FARX = { b1: -1, b2: -1, f1: 2, f2: 2, dn: 0, upB: 0, grip: 0, thr: 2 };
/* pernas: preenchimento das linhas 18-30 (o quadril cobre o topo; a linha 31 e a sola automatica) */
const HB_LEG = [
  // 0 contato: perna da frente esticada, calcanhar em 11
  ['........PP......', '........PP......', '.........PP.....', '.........PP.....', '.........PP.....', '..........PP....', '..........PP....',
   '..........PP....', '..........PP....', '...........PP...', '...........PP...', '...........OOO..', '...........OOOO.'],
  // 1 carga: joelho em ">" (2 px a frente), canela vertical, calcanhar em 9
  ['........PP......', '........PP......', '.........PP.....', '.........PP.....', '..........PP....', '...........PP...', '..........PP....',
   '.........PP.....', '.........PP.....', '.........PP.....', '.........PP.....', '.........OOO....', '.........OOOO...'],
  // 2 passagem (apoio): perna reta embaixo do quadril, calcanhar em 6
  ['.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '......PP........',
   '......PP........', '......PP........', '......PP........', '......PP........', '......OOO.......', '......OOOO......'],
  // 3 impulso: perna inclinada para tras, calcanhar em 4
  ['.......PP.......', '.......PP.......', '......PP........', '......PP........', '......PP........', '.....PP.........', '.....PP.........',
   '.....PP.........', '.....PP.........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'],
  // 4 saida: calcanhar 2 px acima do chao, sola na diagonal, ponta no chao em 5
  ['.......PP.......', '.......PP.......', '.......PP.......', '......PP........', '......PP........', '.....PP.........', '.....PP.........',
   '....PP..........', '....PP..........', '...PP...........', '..OOO...........', '...OOO..........', '....OO..........'],
  // 5 balanco: pe sobe atras, ponta para baixo
  ['.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '......PP........', '.....PP.........',
   '....PP..........', '...OOO..........', '....OOO.........', '.....OO.........', '................', '................'],
  // 6 passagem (livre): joelho a frente (x=11-12 na linha 23), canela descendo, pe erguido 3 px
  ['........PP......', '........PP......', '.........PP.....', '.........PP.....', '..........PP....', '...........PP...', '...........PP...',
   '...........PP...', '...........OOO..', '...........OOOO.', '................', '................', '................'],
  // 7 alcance: perna se estica a frente, pe 2 px acima do chao com a ponta para cima
  ['........PP......', '........PP......', '.........PP.....', '.........PP.....', '..........PP....', '..........PP....', '...........PP...',
   '...........PP...', '...........PP.O.', '...........OOOO.', '...........OOO..', '................', '................'],
];
const HB_far = rows => recolor(rows, { P: 'Q', O: 'N' });
const HB_BOB = [1, 2, 0, 0], HB_LEAN = [0, 0, 0, 1];
/* monta um quadro. o: { near, far (pernas, linhas 18-30), dy (corpo desce), dx (corpo a frente),
   aN/aF (bracos de perto/longe: nome em HB_ARM), head, hipDy } */
const HB_frame = o => {
  const dy = o.dy || 0, dx = o.dx || 0, hy = 17 + dy, parts = [];
  const arm = (a, far) => { const [k, oy = 0] = [].concat(a);
    return { rows: HB_ARM[k], x: dx + (far ? HB_FARX[k] || 0 : 0), y: (k in HB_ARMY ? HB_ARMY[k] : 8) + dy + oy, ol: true }; };
  if (o.aF) parts.push(arm(o.aF, true));
  parts.push({ rows: HB_HIP, x: dx > 0 ? 0 : dx, y: hy, ol: true, y1: hy });
  if (o.far) parts.push({ rows: HB_far(o.far), y: 18, ol: true, y1: hy + 2 });
  if (o.near) parts.push({ rows: o.near, y: 18, ol: true, y1: hy + 2 });
  parts.push({ rows: HB_TORSO, x: dx, y: 7 + dy, ol: true, y2: 16 + dy });
  parts.push({ rows: o.head || HH, x: 2 + dx, y: dy });
  if (o.aN) parts.push(arm(o.aN, false));
  return HB_paint(parts);
};
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'], HERO_STEP_B = 2.5;
/* braco de perto oposto a perna de perto: [perto, longe] por fase */
const HB_WARMS = [['b2', 'f2'], ['b1', 'f1'], ['dn', 'dn'], ['f1', 'b1'], ['f2', 'b2'], ['f1', 'b1'], ['dn', 'dn'], ['b1', 'f1']];
for (let f = 0; f < 8; f++) {
  const base = { near: HB_LEG[f], far: HB_LEG[(f + 4) % 8], dy: HB_BOB[f % 4], dx: HB_LEAN[f % 4], aN: HB_WARMS[f][0], aF: HB_WARMS[f][1] };
  ROWS['H_' + HERO_WALK_B[f]] = HB_frame(base);
  ROWS['H_' + HERO_WALK_B[f] + '_t'] = HB_frame({ ...base, aN: 'thr', aF: 'b1' });
}
/* parado: perna de perto em 3/4 (coxa larga, joelho, canela), a de tras parcialmente escondida */
const HB_STAND_N = ['.......PPP......', '.......PPP......', '.......PPP......', '.......PPP......', '.......PPP......', '.......PPP......', '........PP......',
  '........PP......', '........PP......', '........PP......', '........PP......', '........OOO.....', '........OOOO....'];
const HB_STAND_F = ['....PPP.........', '....PPP.........', '....PPP.........', '....PPP.........', '....PPP.........', '....PPP.........', '....PP..........',
  '....PP..........', '....PP..........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'];
const HB_STAND = { near: HB_STAND_N, far: HB_STAND_F, aN: 'dn', aF: 'b1' };
ROWS.H_stand = HB_frame(HB_STAND);
ROWS.H_stand2 = HB_frame({ ...HB_STAND, head: HH2 });
ROWS.H_stand_t = HB_frame({ ...HB_STAND, aN: 'thr' });
ROWS.H_stand2_t = HB_frame({ ...HB_STAND, aN: 'thr', head: HH2 });
/* pulo: perna da frente encolhida, a de tras esticada na diagonal com a ponta para baixo */
const HB_JUMP_N = ['........PP......', '........PP......', '.........PP.....', '..........PP....', '...........PP...', '...........PP...', '..........PP....',
  '..........PP....', '..........OOO...', '..........OOOO..', '................', '................', '................'];
const HB_JUMP_F = ['.......PP.......', '.......PP.......', '......PP........', '......PP........', '.....PP.........', '.....PP.........', '....PP..........',
  '....PP..........', '...PP...........', '..OOO...........', '.OOO............', '.OO.............', '................'];
ROWS.H_jump = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: 1, aN: 'up', aF: 'b2' });
ROWS.H_jump_t = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: 1, aN: 'thr', aF: 'b2' });
/* queda: bracos abertos para cima, perna de perto pendurada a frente, a de tras dobrada */
const HB_FALL_N = ['........PP......', '........PP......', '.........PP.....', '.........PP.....', '.........PP.....', '..........PP....', '..........PP....',
  '..........PP....', '..........PP....', '..........OOO...', '...........OOO..', '................', '................'];
const HB_FALL_F = ['.......PP.......', '.......PP.......', '......PP........', '......PP........', '.....PP.........', '.....PP.........', '....PP..........',
  '...PP...........', '..OOO...........', '...OOO..........', '....OO..........', '................', '................'];
ROWS.H_fall = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, aN: 'upF', aF: 'upB' });
ROWS.H_fall_t = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, aN: 'thr', aF: 'upB' });
/* derrapagem: pe da frente fincado (ponta para cima), o de tras dobrado, tronco e cabeca para tras, braco esticado */
const HB_SKID_N = ['.........PP.....', '.........PP.....', '.........PP.....', '..........PP....', '..........PP....', '..........PP....', '...........PP...',
  '...........PP...', '...........PP...', '...........PP...', '...........PP.O.', '...........OOOO.', '...........OOO..'];
const HB_SKID_F = ['.......PP.......', '.......PP.......', '......PP........', '......PP........', '.....PP.........', '.....PP.........', '....PP..........',
  '....PP..........', '....PP..........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'];
ROWS.H_skid = HB_frame({ near: HB_SKID_N, far: HB_SKID_F, dx: -1, aN: 'thr', aF: 'upB' });
ROWS.H_skid_t = ROWS.H_skid;
/* aterrissagem: corpo 3 px abaixo, joelhos para fora, bracos abrindo */
const HB_LAND_N = ['........PP......', '........PP......', '........PP......', '........PP......', '.........PP.....', '..........PP....', '...........PP...',
  '...........PP...', '..........PP....', '..........PP....', '..........PP....', '..........OOO...', '..........OOOO..'];
const HB_LAND_F = ['.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '......PP........', '.....PP.........', '....PP..........',
  '....PP..........', '.....PP.........', '.....PP.........', '.....PP.........', '.....OOO........', '.....OOOO.......'];
ROWS.H_land = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 3, aN: 'f2', aF: 'b2' });
ROWS.H_land_t = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 3, aN: 'thr', aF: 'b2' });
/* agachado (reserva: o jogo ainda nao usa a acao) */
const HB_DUCK_N = ['................', '................', '................', '................', '................', '................', '................',
  '................', '........PPPP....', '..........PP....', '.........PP.....', '.........OOO....', '.........OOOO...'];
const HB_DUCK_F = ['................', '................', '................', '................', '................', '................', '................',
  '................', '.....PPP........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'];
ROWS.H_duck = HB_frame({ near: HB_DUCK_N, far: HB_DUCK_F, dy: 7, aN: 'dn', aF: 'b1' });
ROWS.H_duck_t = HB_frame({ near: HB_DUCK_N, far: HB_DUCK_F, dy: 7, aN: 'thr', aF: 'b1' });
/* mastro (colunas 12-13): corpo 1 px para tras, maos e joelhos alternam */
const HB_CLIMB_UP = ['........PP......', '.........PP.....', '..........PP....', '...........PP...', '...........PP...', '..........PP....', '..........PP....',
  '..........OOO...', '..........OOOO..', '................', '................', '................', '................'];
const HB_CLIMB_DN = ['.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......', '.......PP.......',
  '.......PP.......', '........PP......', '........OOO.....', '........OOOO....', '................', '................'];
ROWS.H_climb1 = HB_frame({ near: HB_CLIMB_UP, far: HB_CLIMB_DN, dx: -1, aN: ['grip', -2], aF: ['grip', 3] });
ROWS.H_climb2 = HB_frame({ near: HB_CLIMB_DN, far: HB_CLIMB_UP, dx: -1, dy: 1, aN: ['grip', 3], aF: ['grip', -2] });
