/* ---- Heroi grande TICO (16x32): cabeca HH/HH2 (12x7, em x=2) e paletas da secao hero.
   Corpo em 3/4 de perfil: moletom com 11 linhas (7-17), pernas com 14 (18-31).
   As partes sao desenhadas so com o preenchimento; o contorno e gerado sozinho
   ('k' = contorno preto; 's' = contorno suave, que vira M quando cai sobre o moletom). ---- */
const HB_paint = parts => {
  const g = Array.from({ length: 32 }, () => new Array(16).fill('.'));
  const put = (X, Y, ch) => { if (X >= 0 && X < 16 && Y >= 0 && Y < 32) g[Y][X] = ch; };
  for (const [rows, dx = 0, dy = 0, ol = ''] of parts) {
    const h = rows.length, w = rows[0].length;
    const on = (x, y) => y >= 0 && y < h && x >= 0 && x < w && rows[y][x] !== '.';
    if (ol) for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
      if (on(x, y) || !(on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1))) continue;
      const X = x + dx, Y = y + dy;
      if (X >= 0 && X < 16 && Y >= 0 && Y < 32) put(X, Y, ol === 's' && 'CLM'.includes(g[Y][X]) ? 'M' : 'K');
    }
    rows.forEach((r, y) => { for (let x = 0; x < w; x++) if (r[x] !== '.') put(x + dx, y + dy, r[x]); });
  }
  return g.map(r => r.join(''));
};
/* moletom (linhas 7-17) */
const HB_TORSO = [
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCCK..',
  '...KCCCCCCCCCK..',
  '...KCCCCCCCCMK..',
  '...KCCCCCCCCMK..',
  '...KCCCCCCCCMK..',
  '...KCCCCCCCMK...',
  '...KCCCCCCCMK...',
  '...KMMMMMMMMK...',
  '....KLLLLLLK....'];
/* bracos (so preenchimento; [linhas, x, y]) */
const HB_ARM = {
  B2: [['...LC', '..CCC', '..CCC', '.CCC.', '.CC..', 'CC...', 'LL...', 'SS...', 'ST...'], 3, 8],
  B1: [['..LC', '.CCC', '.CCC', '.CC.', '.CC.', 'CC..', 'LL..', 'SS..', 'ST..'], 4, 8],
  D:  [['LC.', 'CCC', 'CCC', 'CC.', 'CC.', 'CC.', '.CC', '.LL', '.SS', '.ST'], 6, 8],
  F1: [['LC..', 'CCC.', 'CCC.', '.CC.', '.CC.', '.CCC', '..LL', '..SS', '..ST'], 6, 8],
  F2: [['LC....', 'CCC...', '.CCC..', '..CC..', '..CCC.', '...CCL', '....LS', '....SS'], 6, 8],
  T:  [['LC.......', 'CCCCC....', 'CCCCCCLSS', '...CCCLST'], 6, 8],
};
/* pernas: 8 fases de uma perna (desenhada como a perna de perto, P/O), linhas 18-30; a 31 e a sola (contorno) */
const HB_LEG = [
  // 0 contato: calcanhar em 12, ponta do pe levantada
  ['.....PPP........', '.....PPP........', '......PPP.......', '......PPP.......', '.......PPP......', '.......PPP......',
   '........PP......', '.........PP.....', '.........PP.....', '..........PP....', '..........PP....', '...........OOOO.', '...........OO...'],
  // 1 carga: pe chato (calcanhar 9), joelho um pouco dobrado
  ['.....PPP........', '.....PPP........', '......PPP.......', '......PPP.......', '......PPP.......', '.......PPP......',
   '.......PP.......', '........PP......', '........PP......', '........PP......', '.........PP.....', '.........OOO....', '.........OOOO...'],
  // 2 passagem (apoio): perna reta embaixo do quadril (calcanhar 6)
  ['.....PPP........', '.....PPP........', '.....PPP........', '.....PPP........', '......PP........', '......PP........',
   '......PP........', '.....PPP........', '.....PPP........', '......PP........', '......PP........', '......OOO.......', '......OOOO......'],
  // 3 impulso: calcanhar subindo, ponta em 4-6
  ['.....PPP........', '.....PPP........', '....PPP.........', '....PPP.........', '....PP..........', '....PP..........',
   '...PP...........', '...PPP..........', '...PP...........', '...PP...........', '...OO...........', '...OOO..........', '....OOO.........'],
  // 4 saida: so a ponta (3) no chao
  ['.....PPP........', '.....PPP........', '....PPP.........', '....PPP.........', '...PPP..........', '...PP...........',
   '..PP............', '..PP............', '.PP.............', '.PP.............', '.OO.............', '.OOO............', '..OO............'],
  // 5 balanco: pe solto atras, joelho dobrando
  ['.....PPP........', '.....PPP........', '.....PPP........', '.....PPP........', '.....PP.........', '.....PP.........',
   '....PP..........', '...PP...........', '..PP............', '.PP.............', '.OOO............', '..OOO...........', '................'],
  // 6 passagem (balanco): joelho para frente, pe levantado
  ['.....PPP........', '.....PPP........', '......PPP.......', '......PPP.......', '.......PPP......', '........PP......',
   '.......PP.......', '......PP........', '.....PP.........', '....OOOO........', '.....OOO........', '................', '................'],
  // 7 alcance: perna se estica para frente, pe um pouco acima do chao
  ['.....PPP........', '.....PPP........', '......PPP.......', '......PPP.......', '.......PPP......', '.......PPP......',
   '........PP......', '........PP......', '.........PP.....', '.........PP.....', '..........OOO...', '..........OOOO..', '................'],
];
const HB_far = rows => recolor(rows, { P: 'Q', O: 'N' });
const HB_BOB = [1, 1, 0, 0];
const HB_ARMSEQ = ['B2', 'B1', 'D', 'F1', 'F2', 'F1', 'D', 'B1'];
const HB_shade = rows => recolor(rows, { C: 'M', L: 'M', S: 'T' });
/* monta um quadro: braco de longe, pernas (de longe, de perto), tronco, cabeca, braco de perto */
const HB_frame = (near, far, armN, armF, dy, head = HH) => HB_paint([
  [HB_shade(armF[0]), armF[1] + 2, armF[2] + dy, 'k'],
  [HB_far(far), 0, 18, 'k'],
  [near, 0, 18, 'k'],
  [HB_TORSO, 0, 7 + dy],
  [head, 2, dy],
  [armN[0], armN[1], armN[2] + dy, 'k'],
]);
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'], HERO_STEP_B = 3;
for (let f = 0; f < 8; f++) {
  const near = HB_LEG[f], far = HB_LEG[(f + 4) % 8], dy = HB_BOB[f % 4];
  const aN = HB_ARM[HB_ARMSEQ[f]], aF = HB_ARM[HB_ARMSEQ[(f + 4) % 8]];
  ROWS['H_' + HERO_WALK_B[f]] = HB_frame(near, far, aN, aF, dy);
  ROWS['H_' + HERO_WALK_B[f] + '_t'] = HB_frame(near, far, HB_ARM.T, aF, dy);
}
/* parado */
const HB_STAND_N = ['......PPP.......', '......PPP.......', '......PPP.......', '......PPP.......', '.......PP.......', '.......PP.......',
  '.......PP.......', '......PPP.......', '......PPP.......', '.......PP.......', '.......PP.......', '.......OOO......', '.......OOOO.....'];
const HB_STAND_F = ['....PPP.........', '....PPP.........', '....PPP.........', '....PPP.........', '....PP..........', '....PP..........',
  '....PP..........', '...PPP..........', '...PPP..........', '....PP..........', '....PP..........', '....OOO.........', '....OOOO........'];
ROWS.H_stand = HB_frame(HB_STAND_N, HB_STAND_F, HB_ARM.D, HB_ARM.D, 0);
ROWS.H_stand2 = HB_frame(HB_STAND_N, HB_STAND_F, HB_ARM.D, HB_ARM.D, 0, HH2);
ROWS.H_stand_t = HB_frame(HB_STAND_N, HB_STAND_F, HB_ARM.T, HB_ARM.D, 0);
ROWS.H_stand2_t = HB_frame(HB_STAND_N, HB_STAND_F, HB_ARM.T, HB_ARM.D, 0, HH2);
/* acoes (provisorio) */
for (const k of ['jump', 'fall', 'skid', 'land', 'climb1', 'climb2']) {
  ROWS['H_' + k] = HB_frame(HB_LEG[k === 'jump' ? 6 : 1], HB_LEG[k === 'jump' ? 3 : 5], HB_ARM.F2, HB_ARM.B2, 0);
  if (!k.startsWith('climb')) ROWS['H_' + k + '_t'] = HB_frame(HB_LEG[1], HB_LEG[5], HB_ARM.T, HB_ARM.B2, 0);
}
