/* ---- Heroi grande TICO (16x32): cabeca propria HB_HEAD/HB_HEAD2 (16x14, em x=0, proporcao chibi como a do pequeno); paletas da secao hero.
   Corpo em 3/4 de perfil, virado para a direita: braco de perto na frente do tronco, o de longe atras.
   Mesmas cores do heroi pequeno: K contorno, C/L moletom, S pele, P/Q calca (perto/longe), O/N tenis.
   Tudo e pintado em camadas por HB_paint; pernas, tenis, bracos e tronco ganham contorno K automatico
   (a sola K e o contato com o chao), entao as pernas se separam pela forma, pelo ceu e pelo contorno.
   O braco de perto, sobre o moletom, ganha so uma linha M na borda de tras (a da frente fica sem contorno).
   Tronco longo com giro e pernas curtas e retas (sem joelho). Caminhada de 6 fases (uma perna desenhada; a outra
   e a mesma 3 fases depois): o calcanhar de apoio recua 11 > 7 > 3, 4 px por quadro = HERO_STEP_B, entao o pe
   de apoio nao patina. ---- */
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
      if (ol === 's' && 'PQ'.includes(under)) continue; // nao morde a calca
      put(X, Y, 'K');
    }
    rows.forEach((r, j) => { for (let i = 0; i < w; i++) if (r[i] !== '.') put(i + x, j + y, r[i]); });
  }
  return g.map(r => r.join(''));
};
/* cabeca propria do heroi grande (16x14, em x=0, ~44% da altura como no heroi pequeno): mesmo personagem da HH
   (capuz com orelhas, borda clara, olho com brilho L), redesenhada grande. Cantos de cima arredondados e a aba do
   capuz cobrindo a testa (linha 6); testa recuada (x=13) para o focinho (linha 10) se destacar; borda clara L
   acompanhando o rosto e curvando no queixo; domo do capuz iluminado em C/L e volume M so atras, embaixo.
   Olho 2x4 no terco de cima do rosto com brilho L. T = sombra da aba (coluna ao lado da borda) e bochecha; boca K.
   (Na paleta final T e igual a S; as letras T ficam prontas caso o tom de sombra da pele seja ligado.) */
const HB_HEAD = [
  '..K......K......',
  '.KLK....KLK.....',
  '.KLCK...KLCK....',
  '.KLCCK..KLCCK...',
  '.KCLCCKKCCCCCK..',
  'KCLLCCCCCCCCCCK.',
  'KCCCCLLLLLLLLK..',
  'KCCCCLTSSSSSSK..',
  'KCCCCLTSSSELSK..',
  'KMCCCLTSSSEESSK.',
  'KMCCCLTSSSEESSSK',
  'KMCCCCLTSSEESSK.',
  '.KMCCCCLSSTTKSK.',
  '..KMMCCLSSSSSK..'];
/* orelha mexendo (equivale a HH2): a orelha da frente dobra para a frente */
const HB_HEAD2 = ['..K.............', '.KLK.....KKK....', '.KLCK...KLLCK...', '.KLCCK..KLCCCK..'].concat(HB_HEAD.slice(4));
/* ---- corpo: tronco longo (linhas 14-22) com giro, quadril (23-24) e pernas curtas e retas, sem joelho (25-30).
   O giro (tw = -1/0/+1) desloca ombros, peito e cordoes do capuz 1 px em relacao ao bolso e ao quadril, sempre
   oposto a perna da frente: com a perna de perto a frente, o ombro de perto vai para tras (tw -1), e vice-versa.
   Como as pernas nao tem joelho, e esse giro (com o balanco dos bracos) que da a naturalidade da caminhada. ---- */
const HB_TY = 14, HB_HY = 23, HB_LY = 25;
const HB_TORSO_BASE = [
  '....CCCCCCCC....', // 14 gola
  '...CCCCCCCCCC...', // 15 ombros
  '...CCCCCCCCCC...',
  '...CCCCCCCCCC...',
  '....CCCCCCCCC...',
  '....CCCCCCCC....', // 19
  '....CMMMMMMC....', // 20 boca do bolso canguru
  '....CCCCCCCC....',
  '....LLLLLLLL....']; // 22 barra clara
const HB_shift = (r, d) => d > 0 ? '.'.repeat(d) + r.slice(0, 16 - d) : d < 0 ? r.slice(-d) + '.'.repeat(-d) : r;
/* tronco com giro: ombros e peito (linhas 14-18) deslocam tw; cordoes L sob a gola acompanham o peito */
const HB_torso = tw => HB_TORSO_BASE.map((r, i) => {
  if (i > 4) return r;
  let row = HB_shift(r, tw);
  if (i >= 1 && i <= 3) { const a = 8 + tw, b = 10 + tw; row = row.slice(0, a) + 'L' + row.slice(a + 1, b) + (i < 3 ? 'L' : 'C') + row.slice(b + 1); }
  return row;
});
const HB_HIP = ['.....PPPPPP.....', '.....PPPPPP.....'];
/* bracos (preenchimento a partir da linha 15, o ombro; x=7-8). b = para tras, f = para frente; maos acima da barra */
const HB_ARM = {
  dn: ['.......CC.......', '.......CC.......', '.......CC.......', '........CC......', '........CC......', '........SS......'],
  b1: ['.......CC.......', '.......CC.......', '......CC........', '......CC........', '.....CC.........', '.....SS.........', '.....SS.........'],
  b2: ['.......CC.......', '......CC........', '.....CC.........', '....CC..........', '...CC...........', '..SS............', '..SS............'],
  f1: ['.......CC.......', '.......CC.......', '........CC......', '........CC......', '.........CC.....', '.........SS.....', '.........SS.....'],
  f2: ['.......CC.......', '........CC......', '.........CC.....', '..........CC....', '...........CC...', '............SS..', '............SS..'],
  thr: ['.......CCCCLSS..', '.......CCCCLSS..'],
  // pulo: punho KSSK acima da orelha; o resto do braco passa por tras da cabeca (use com aU, y absoluto)
  up: ['............SS..', '............SS..', '............LL..', '.............CC.', '..............CC', '..............CC',
    '..............CC', '.............CC.'],
  sideF: ['.......CCCCCLSS.', '.......CCCCCLSS.'],
  sideB: ['.SSKCCCC........', '.SSKCCCC........'],
  brk: ['.....CC.........', '......CCC.......', '........CCLSS...', '..........KSS...'],
  grip: ['.......CCCCLSS..', '.......CCCCLSS..'],
};
const HB_ARMY = { up: 0 };
/* deslocamento do braco de longe (fica atras do tronco; so aparece o que sai da silhueta) */
const HB_FARX = { b1: -2, b2: -1, f1: 2, f2: 1, dn: 0, grip: 2, thr: 2, sideB: 0 };
/* perna reta (2 px, sem joelho) do quadril (linha 25, x=hx) ate o tenis em (fx, fy); linhas 25-30 do quadro.
   tilt: pe de saida, calcanhar no alto e ponta no chao */
const HB_leg = (hx, fx, fy, tilt) => {
  const g = Array.from({ length: 6 }, () => new Array(16).fill('.'));
  const put = (x, y, c) => { if (y >= HB_LY && y <= 30 && x >= 0 && x < 16) g[y - HB_LY][x] = c; };
  const n = fy - HB_LY;
  for (let y = HB_LY; y < fy; y++) { const x = Math.round(hx + (fx - hx) * (n > 1 ? (y - HB_LY) / (n - 1) : 1)); put(x, y, 'P'); put(x + 1, y, 'P'); }
  const shoe = tilt ? [[0, 0, 1], [1, 1, 3], [2, 2, 3]] : [[0, 0, 2], [1, 0, 3]];
  for (const [dy, a, b] of shoe) for (let x = a; x <= b; x++) put(fx + x, fy + dy, 'O');
  return g.map(r => r.join(''));
};
/* ciclo de 6 fases da perna de perto (a de longe e a mesma 3 fases depois): calcanhar de apoio 11 > 7 > 3 */
const HB_LEG = [
  HB_leg(8, 11, 29),        // 0 contato: perna a frente
  HB_leg(7, 7, 29),         // 1 passagem (apoio): reta embaixo do quadril
  HB_leg(6, 3, 29),         // 2 impulso: inclinada para tras
  HB_leg(6, 1, 28, true),   // 3 saida: calcanhar no alto, ponta no chao
  HB_leg(8, 9, 26),         // 4 passagem (livre): pe erguido embaixo do corpo
  HB_leg(8, 11, 28),        // 5 alcance: pe a frente, 1 px acima do chao
];
const HB_far = rows => recolor(rows, { P: 'Q', O: 'N' });
const HB_BOB = [1, 0, 0];
/* monta um quadro. o: { near, far (pernas), dy (corpo desce), dx (tronco/quadril), tw (giro do tronco),
   aN/aF (bracos de perto/longe: nome em HB_ARM ou [nome, desce, avanca]), aU (braco por tras da cabeca), head, hx } */
const HB_frame = o => {
  const dy = o.dy || 0, dx = o.dx || 0, tw = o.tw || 0, hy = HB_HY + dy, parts = [];
  const arm = (a, far) => {
    const [k, oy = 0, ox = 0] = [].concat(a);
    return { rows: HB_ARM[k], x: dx + ox + (far ? (HB_FARX[k] || 0) - tw : tw), y: (k in HB_ARMY ? HB_ARMY[k] : HB_TY + 1) + dy + oy,
      ol: far ? true : 's', y1: HB_TY + dy };
  };
  if (o.aF) parts.push(arm(o.aF, true));
  parts.push({ rows: HB_HIP, x: dx > 0 ? 0 : dx, y: hy, ol: true, y1: hy });
  if (o.far) parts.push({ rows: HB_far(o.far), y: HB_LY, ol: true, y1: hy + 2 });
  if (o.near) parts.push({ rows: o.near, y: HB_LY, ol: true, y1: hy + 2 });
  parts.push({ rows: HB_torso(tw), x: dx, y: HB_TY + dy, ol: true, y2: HB_TY + 8 + dy });
  if (o.aU) parts.push({ ...arm(o.aU, false), ol: true, y1: -99 });
  parts.push({ rows: o.head || HB_HEAD, x: o.hx || 0, y: dy });
  if (o.aN) parts.push(arm(o.aN, false));
  const g = HB_paint(parts), r = hy + 2;
  // sem no KK/KKK na virilha: o contorno de baixo do quadril entre as pernas vira ceu
  const k = g[r].search(/\.KK/);
  if (k >= 0 && g[r - 1][k + 1] === 'P') g[r] = g[r].slice(0, k + 1) + '.' + g[r].slice(k + 2);
  const m = g[r].search(/[PQ]KKK[PQ]/);
  if (m >= 0 && g[r - 1][m + 2] === 'P') g[r] = g[r].slice(0, m + 2) + '.' + g[r].slice(m + 3);
  return g;
};
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], HERO_STEP_B = 4;
/* braco de perto oposto a perna de perto: [perto, longe] por fase; o giro acompanha o braco de perto */
const HB_WARMS = [['b2', 'f2'], ['dn', 'dn'], ['f1', 'b1'], ['f2', 'b2'], ['dn', 'dn'], ['b1', 'f1']];
const HB_TW = [-1, 0, 1, 1, 0, -1];
for (let f = 0; f < 6; f++) {
  const base = { near: HB_LEG[f], far: HB_LEG[(f + 3) % 6], dy: HB_BOB[f % 3], tw: HB_TW[f], aN: HB_WARMS[f][0], aF: HB_WARMS[f][1] };
  ROWS['H_' + HERO_WALK_B[f]] = HB_frame(base);
  ROWS['H_' + HERO_WALK_B[f] + '_t'] = HB_frame({ ...base, aN: 'thr', aF: 'b1' });
}
/* parado: "A" suave, perna de perto a frente, tenis separados */
const HB_STAND = { near: HB_leg(8, 9, 29), far: HB_leg(6, 4, 29), aN: 'dn' };
ROWS.H_stand = HB_frame(HB_STAND);
ROWS.H_stand2 = HB_frame({ ...HB_STAND, head: HB_HEAD2 });
ROWS.H_stand_t = HB_frame({ ...HB_STAND, aN: 'thr' });
ROWS.H_stand2_t = HB_frame({ ...HB_STAND, aN: 'thr', head: HB_HEAD2 });
/* pulo: tronco 1 px para tras e girado, punho acima da cabeca; pe da frente encolhido, o de tras esticado na ponta */
const HB_JUMP_N = HB_leg(8, 10, 26), HB_JUMP_F = HB_leg(6, 1, 28, true);
ROWS.H_jump = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: -1, tw: 1, aU: ['up', 0, 1] });
ROWS.H_jump_t = HB_frame({ near: HB_JUMP_N, far: HB_JUMP_F, dx: -1, aN: ['thr', 0, 1] });
/* queda: bracos abertos em T, pernas penduradas e abertas */
const HB_FALL_N = HB_leg(8, 10, 28), HB_FALL_F = HB_leg(6, 4, 28);
ROWS.H_fall = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, aN: 'sideF', aF: ['sideB', 1] });
ROWS.H_fall_t = HB_frame({ near: HB_FALL_N, far: HB_FALL_F, aN: ['thr', 1], aF: ['sideB', 1] });
/* derrapagem: tronco 2 px para tras e girado contra o movimento, perna da frente fincada, braco a frente */
const HB_SKID_N = HB_leg(8, 11, 29), HB_SKID_F = HB_leg(5, 5, 29);
ROWS.H_skid = HB_frame({ near: HB_SKID_N, far: HB_SKID_F, dx: -2, tw: -1, aN: ['brk', 0, 2] });
ROWS.H_skid_t = HB_frame({ near: HB_SKID_N, far: HB_SKID_F, dx: -2, tw: -1, aN: ['thr', 1, 1] });
/* aterrissagem: corpo 2 px abaixo, pernas abertas, bracos abrindo */
const HB_LAND_N = HB_leg(9, 11, 29), HB_LAND_F = HB_leg(5, 3, 29);
ROWS.H_land = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 2, aN: 'f2', aF: 'b2' });
ROWS.H_land_t = HB_frame({ near: HB_LAND_N, far: HB_LAND_F, dy: 2, aN: 'thr', aF: 'b2' });
/* agachado (reserva: o jogo ainda nao usa a acao) */
const HB_DUCK = { near: HB_leg(9, 9, 29), far: HB_leg(5, 5, 29), dy: 5 };
ROWS.H_duck = HB_frame({ ...HB_DUCK, aN: 'dn', aF: 'b1' });
ROWS.H_duck_t = HB_frame({ ...HB_DUCK, aN: 'thr', aF: 'b1' });
/* mastro (colunas 12-13): corpo 1 px para tras, maos e pes alternam */
const HB_CLIMB_UP = HB_leg(8, 10, 26), HB_CLIMB_DN = HB_leg(6, 6, 29);
ROWS.H_climb1 = HB_frame({ near: HB_CLIMB_UP, far: HB_CLIMB_DN, dx: -1, aN: ['grip', -1], aF: ['grip', 2] });
ROWS.H_climb2 = HB_frame({ near: HB_CLIMB_DN, far: HB_CLIMB_UP, dx: -1, aN: ['grip', 1], aF: ['grip', -1] });
