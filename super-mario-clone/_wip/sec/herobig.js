/* ---- Heroi grande TICO (16x32): cabeca HH/HH2 (12x7, em x=2) e paletas da secao hero.
   Corpo em 3/4 de perfil, virado para a direita: braco de perto na frente do tronco, o de longe atras.
   Mesmas cores do heroi pequeno: K contorno, C/L moletom, S pele, P/Q calca (perto/longe), O/N tenis.
   Tudo e pintado em camadas por HB_paint; pernas, tenis, bracos e tronco ganham contorno K automatico
   (a sola K e o contato com o chao), entao as pernas se separam pela forma, pelo ceu e pelo contorno.
   O braco de perto, sobre o moletom, ganha so uma linha M na borda de tras (a da frente fica sem contorno).
   Caminhada de 6 fases (uma perna desenhada; a outra e a mesma 3 fases depois):
   contato (corpo 1 px abaixo), passagem (joelho livre a frente, pe erguido) e impulso, e o mesmo com as
   pernas trocadas. O calcanhar de apoio recua 11 > 7 > 3 e a ponta sai em 3: 4 px por quadro = HERO_STEP_B
   (~2,7 ticks por quadro andando), entao o pe de apoio nao patina. ---- */
const HB_paint = parts => {
  const g = Array.from({ length: 32 }, () => new Array(16).fill('.'));
  for (const { rows, x = 0, y = 0, ol = false, y1 = -99, y2 = 99 } of parts) {
    const h = rows.length, w = rows[0].length;
    const on = (i, j) => j >= 0 && j < h && i >= 0 && i < w && rows[j][i] !== '.';
    const put = (X, Y, ch) => { if (X >= 0 && X < 16 && Y >= 0 && Y < 32 && Y >= y1 && Y <= y2) g[Y][X] = ch; };
    if (ol) for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) {
      if (on(i, j) || !(on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1))) continue;
      const X = i + x, Y = j + y, under = X >= 0 && X < 16 && Y >= 0 && Y < 32 ? g[Y][X] : '.';
      // contorno suave: sobre o moletom, so a borda de tras do braco (pixel a esquerda dele) vira M
      if (ol === 's' && 'CLM'.includes(under)) { if (on(i + 1, j)) put(X, Y, 'M'); continue; }
      put(X, Y, 'K');
    }
    rows.forEach((r, j) => { for (let i = 0; i < w; i++) if (r[i] !== '.') put(i + x, j + y, r[i]); });
  }
  return g.map(r => r.join(''));
};
/* tronco (preenchimento, linhas 7-16): costas a esquerda, peito a direita, barra clara inteira */
const HB_TORSO = ['.....CCCCCC.....', '....CCCCCCC.....', '....CCCCCCCC....', '....CCCCCCCC....', '.....CCCCCCC....',
  '.....CCCCCCC....', '.....CCCCCC.....', '.....CCCCCC.....', '.....CCCCCC.....', '.....LLLLLL.....'];
const HB_HIP = ['.....PPPPPP.....', '.....PPPPPP.....'];
/* bracos (preenchimento a partir da linha 8; ombro em x=7-8). b = para tras, f = para frente; a mao acaba na linha 15 */
const HB_ARM = {
  // caido: a mao fica na borda do peito (x=8-9) e termina 1 px acima da barra
  dn: ['.......CC.......', '.......CC.......', '.......CC.......', '........CC......', '........CC......', '........SS......', '........SS......'],
  b1: ['.......CC.......', '.......CC.......', '......CC........', '......CC........', '.....CC.........', '.....LL.........', '.....SS.........', '.....SS.........'],
  b2: ['.......CC.......', '......CC........', '.....CC.........', '....CC..........', '....LL..........', '...SS...........', '...SS...........'],
  f1: ['.......CC.......', '.......CC.......', '........CC......', '........CC......', '.........CC.....', '.........LL.....', '.........SS.....', '.........SS.....'],
  f2: ['.......CC.......', '........CC......', '.........CC.....', '..........CC....', '..........LL....', '...........SS...', '...........SS...'],
  thr: ['.......CC.......', '.......CCCCLSS..', '.......CCCCLSS..'],
  // aberto para tras, quase na horizontal (derrapagem)
  bk: ['.......CC.......', '.....CCC........', '....LL..........', '...SS...........', '...SS...........'],
  // pulo: punho (S) e punho da manga (L) acima da orelha, longe da cabeca (comeca na linha 0)
  // pulo (coordenadas finais para o tronco 1 px atras; use com avanco +1): punho KSSK em x=13-14 acima da orelha,
  // antebraco fino (1 px, em escorco) com 1 px de ceu ate a cabeca, descendo ao ombro so abaixo dela
  up: ['.............SS.', '.............SS.', '.............LL.', '..............C.', '..............C.', '..............C.', '..............C.',
    '............CC..', '..........CCC...'],
  // queda: bracos abertos para os lados na altura do ombro (silhueta em T)
  sideF: ['.......CCCCCLSS.', '.......CCCCCLSS.'],
  sideB: ['.SSLCCCC........', '.SSLCCCC........'],
  // derrapagem (coordenadas finais para o tronco 2 px atras; use com avanco +2): braco esticado para a frente,
  // descendo do ombro ate a altura do peito, contra o movimento
  brk: ['.....CC.........', '......CCC.......', '........CCL.....', '..........SS....', '..........SS....'],
  // mastro: braco reto ate o mastro (mao em x=13-14 antes do deslocamento de -1)
  grip: ['.......CCCCLSS..', '.......CCCCLSS..'],
};
const HB_ARMY = { up: 0, grip: 8 };
/* deslocamento do braco de longe (fica atras do tronco; so aparece o que sai da silhueta) */
const HB_FARX = { b1: -3, b2: -1, f1: 3, f2: 2, dn: 0, grip: 1, thr: 2, bk: 0, sideB: 0 };
/* pernas: preenchimento das linhas 18-30 (o quadril cobre o topo; a linha 31 e a sola automatica).
   HB_leg([[ate_linha, x], ...], [[linha, x0, x1], ...]): perna de 2 px na coluna x ate a linha dada, depois o tenis. */
const HB_leg = (segs, shoe) => {
  const g = Array.from({ length: 13 }, () => new Array(16).fill('.'));
  let y = 18;
  for (const [to, x] of segs) for (; y <= to; y++) g[y - 18][x] = g[y - 18][x + 1] = 'P';
  for (const [yy, x0, x1] of shoe) for (let x = x0; x <= x1; x++) g[yy - 18][x] = 'O';
  return g.map(r => r.join(''));
};
const HB_LEG = [
  // 0 contato: perna da frente com o joelho levemente dobrado (">"), calcanhar em 11
  HB_leg([[20, 9], [22, 10], [28, 11]], [[29, 11, 13], [30, 11, 14]]),
  // 1 passagem (apoio): perna reta embaixo do quadril, calcanhar em 7
  HB_leg([[28, 7]], [[29, 7, 9], [30, 7, 10]]),
  // 2 impulso: perna inclinada para tras, calcanhar em 3
  HB_leg([[20, 7], [22, 6], [24, 5], [26, 4], [28, 3]], [[29, 3, 5], [30, 3, 6]]),
  // 3 saida (no contato da outra perna): calcanhar 2 px acima do chao, sola na diagonal, ponta no chao em x=3
  HB_leg([[20, 6], [22, 5], [24, 4], [26, 3], [27, 2]], [[28, 1, 2], [29, 1, 3], [30, 2, 3]]),
  // 4 passagem (livre): joelho a frente (x=11-12), canela descendo, pe erguido com a ponta para baixo e ceu ate a perna de apoio
  HB_leg([[20, 10], [22, 11], [25, 12]], [[26, 12, 14], [27, 13, 14]]),
  // 5 alcance (no impulso da outra perna): perna estica a frente, pe 2 px acima do chao, sola subindo ate a ponta
  HB_leg([[23, 10], [26, 11]], [[27, 11, 14], [28, 11, 13]]),
];
const HB_far = rows => recolor(rows, { P: 'Q', O: 'N' });
const HB_BOB = [1, 0, 0];
/* monta um quadro. o: { near, far (pernas, linhas 18-30), dy (corpo desce), dx (tronco/quadril),
   hx (cabeca alem do tronco), aN/aF (bracos de perto/longe: nome em HB_ARM ou [nome, desce, avanca]), head } */
const HB_frame = o => {
  const dy = o.dy || 0, dx = o.dx || 0, hy = 17 + dy, parts = [];
  const arm = (a, far) => {
    const [k, oy = 0, ox = 0] = [].concat(a);
    return { rows: HB_ARM[k], x: dx + ox + (far ? HB_FARX[k] || 0 : 0), y: (k in HB_ARMY ? HB_ARMY[k] : 8) + dy + oy, ol: far ? true : 's' };
  };
  if (o.aF) parts.push(arm(o.aF, true));
  parts.push({ rows: HB_HIP, x: dx > 0 ? 0 : dx, y: hy, ol: true, y1: hy });
  if (o.far) parts.push({ rows: HB_far(o.far), y: 18, ol: true, y1: hy + 2 });
  if (o.near) parts.push({ rows: o.near, y: 18, ol: true, y1: hy + 2 });
  parts.push({ rows: HB_TORSO, x: dx, y: 7 + dy, ol: true, y2: 16 + dy });
  parts.push({ rows: o.head || HH, x: 2 + dx + (o.hx || 0), y: dy });
  if (o.aN) parts.push(arm(o.aN, false));
  const g = HB_paint(parts), r = hy + 2;
  // sem no KK na virilha: o canto do quadril some quando a perna logo ao lado ja tem contorno
  const k = g[r].search(/\.KK/);
  if (k >= 0 && g[r - 1][k + 1] === 'P') g[r] = g[r].slice(0, k + 1) + '.' + g[r].slice(k + 2);
  return g;
};
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], HERO_STEP_B = 4;
/* braco de perto oposto a perna de perto: [perto, longe] por fase */
const HB_WARMS = [['b2', 'f2'], ['dn', 'dn'], ['f1', 'b1'], ['f2', 'b2'], ['dn', 'dn'], ['b1', 'f1']];
for (let f = 0; f < 6; f++) {
  const base = { near: HB_LEG[f], far: HB_LEG[(f + 3) % 6], dy: HB_BOB[f % 3], aN: HB_WARMS[f][0], aF: HB_WARMS[f][1] };
  ROWS['H_' + HERO_WALK_B[f]] = HB_frame(base);
  ROWS['H_' + HERO_WALK_B[f] + '_t'] = HB_frame({ ...base, aN: 'thr', aF: 'b1' });
}
/* parado: "A" suave, perna de perto a frente (coxa de 3 px, joelho, canela), a de tras parcialmente escondida;
   1 px de ceu entre os tenis */
const HB_STAND_N = ['........PPP.....', '........PPP.....', '........PPP.....', '........PPP.....', '........PPP.....', '.........PP.....', '.........PP.....',
  '.........PP.....', '..........PP....', '..........PP....', '..........PP....', '..........OOO...', '..........OOOO..'];
const HB_STAND_F = ['.....PPP........', '.....PPP........', '.....PPP........', '.....PPP........', '.....PPP........', '.....PP.........', '.....PP.........',
  '....PP..........', '....PP..........', '...PP...........', '...PP...........', '...OOO..........', '...OOOO.........'];
const HB_STAND = { near: HB_STAND_N, far: HB_STAND_F, aN: 'dn' };
ROWS.H_stand = HB_frame(HB_STAND);
ROWS.H_stand2 = HB_frame({ ...HB_STAND, head: HH2 });
ROWS.H_stand_t = HB_frame({ ...HB_STAND, aN: 'thr' });
ROWS.H_stand2_t = HB_frame({ ...HB_STAND, aN: 'thr', head: HH2 });
/* pulo: tronco 1 px para tras, cabeca mais 1, punho acima da orelha; joelho da frente bem encolhido,
   perna de tras esticada na diagonal com a ponta para baixo */
const HB_JUMP_N = ['........PP......', '.........PP.....', '..........PP....', '...........PP...', '...........PP...', '..........PP....', '..........PP....',
  '.........OOO....', '.........OOOO...', '................', '................', '................', '................'];
const HB_JUMP_F = HB_leg([[20, 6], [22, 5], [24, 4], [26, 3], [27, 2]], [[28, 1, 2], [29, 1, 3], [30, 2, 3]]);
ROWS.H_jump = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: -1, hx: -1, aN: ['up', 0, 1], aF: 'b2' });
ROWS.H_jump_t = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: -1, hx: -1, aN: ['thr', 0, 1], aF: 'b2' });
/* queda: braco da frente aberto para cima, o de tras inteiro atras do corpo; pernas bem abertas para baixo */
const HB_FALL_N = HB_leg([[23, 9], [28, 10]], [[29, 10, 12], [30, 11, 13]]);
const HB_FALL_F = HB_leg([[27, 6]], [[28, 6, 8], [29, 7, 9]]);
ROWS.H_fall = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, hx: -1, aN: 'sideF', aF: 'sideB' });
ROWS.H_fall_t = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, hx: -1, aN: ['thr', 1], aF: 'sideB' });
/* derrapagem: tronco e cabeca 2 px para tras, perna da frente esticada e fincada (ponta para cima),
   a de tras dobrada embaixo do corpo, bracos abertos (o da frente para cima) */
const HB_SKID_N = HB_leg([[19, 8], [21, 9], [24, 10], [28, 11]], [[29, 11, 14], [30, 11, 13]]);
const HB_SKID_F = HB_leg([[28, 5]], [[29, 5, 7], [30, 5, 8]]);
ROWS.H_skid = HB_frame({ near: HB_SKID_N, far: HB_SKID_F, dx: -2, aN: ['brk', 0, 2] });
ROWS.H_skid_t = HB_frame({ near: HB_SKID_N, far: HB_SKID_F, dx: -2, aN: ['thr', 1, 1] });
/* aterrissagem: corpo 3 px abaixo, joelhos 3 px para fora, tenis separados, bracos abrindo */
const HB_LAND_N = HB_leg([[22, 9], [23, 10], [24, 11], [26, 12], [28, 11]], [[29, 11, 13], [30, 11, 14]]);
const HB_LAND_F = HB_leg([[22, 6], [23, 5], [24, 4], [26, 3], [28, 3]], [[29, 3, 5], [30, 3, 6]]);
ROWS.H_land = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 3, aN: 'f2', aF: 'b2' });
ROWS.H_land_t = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 3, aN: 'thr', aF: 'b2' });
/* agachado (reserva: o jogo ainda nao usa a acao) */
const HB_DUCK_N = ['................', '................', '................', '................', '................', '................', '................',
  '................', '........PPPP....', '..........PP....', '..........PP....', '..........OOO...', '..........OOOO..'];
const HB_DUCK_F = ['................', '................', '................', '................', '................', '................', '................',
  '................', '.....PPP........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'];
ROWS.H_duck = HB_frame({ near: HB_DUCK_N, far: HB_DUCK_F, dy: 7, aN: 'dn', aF: 'b1' });
ROWS.H_duck_t = HB_frame({ near: HB_DUCK_N, far: HB_DUCK_F, dy: 7, aN: 'thr', aF: 'b1' });
/* mastro (colunas 12-13): corpo 1 px para tras, maos e joelhos alternam */
const HB_CLIMB_UP = ['........PP......', '.........PP.....', '..........PP....', '...........PP...', '...........PP...', '..........PP....', '..........PP....',
  '..........OOO...', '..........OOOO..', '................', '................', '................', '................'];
const HB_CLIMB_DN = ['......PP........', '......PP........', '......PP........', '......PP........', '......PP........', '......PP........', '......PP........',
  '......PP........', '......PP........', '......OOO.......', '......OOOO......', '................', '................'];
ROWS.H_climb1 = HB_frame({ near: HB_CLIMB_UP, far: HB_CLIMB_DN, dx: -1, aN: ['grip', 0], aF: ['grip', 4] });
ROWS.H_climb2 = HB_frame({ near: HB_CLIMB_DN, far: HB_CLIMB_UP, dx: -1, dy: 1, aN: ['grip', 3], aF: ['grip', -1] });
