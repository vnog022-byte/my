/* ---- Heroi grande TICO (16x32): cabeca HH/HH2 (12x7, em x=2) e paletas da secao hero.
   Tronco de frente em 3/4 (linhas 7-16, calca 17-18) com os bracos nas laterais, como no heroi pequeno:
   o braco que vai para tras aparece a esquerda, o que vai para frente a direita (o de longe sombreado).
   Pernas de perfil: P/O = perna e tenis de perto, Q/N = de longe; K embaixo do tenis = sola.
   Caminhada de 8 quadros: o pe de apoio recua 2-3 px por quadro (HERO_STEP_B = 2,5 px), assim nao patina. ---- */
/* tronco (sem bracos), linhas 7-16; quadril da calca nas 17-18 */
const HB_TORSO = [
  '...KCCLCCLCCK...',
  '....KCCCCCCK....',
  '....KCCCCCCK....',
  '....KCCCCCCK....',
  '....KCCCCCMK....',
  '....KCCCCCMK....',
  '....KCCCCCMK....',
  '....KCCCCCMK....',
  '....KCCCCCMK....',
  '....KLLLLLLK....'];
const HB_PELVIS = ['....KPPPPPPK....', '.....PPPPPP.....'];
/* bracos: [linhas, x, y relativo ao topo do tronco]. L* = lado esquerdo (para tras), R* = lado direito (para frente) */
const HB_AL = {
  down:  [['..KC', '.KCC', '.KCC', '.KCC', '.KCC', '.KCC', '.KLL', '.KSS', '.KST', '..KK'], 0, 0],
  back1: [['..KC', '.KCC', '.KCC', '.KCC', 'KCCK', 'KCCK', 'KLLK', 'KSSK', 'KTSK', '.KK.'], 0, 0],
  back2: [['..KC', '.KCC', '.KCC', 'KCCK', 'KCCK', 'KLLK', 'SSK.', 'TSK.', 'KK..'], 0, 0],
};
const HB_AR = {
  down:  [mirror(HB_AL.down[0]), 12, 0],
  fwd1:  [['.CK..', '.CCK.', '.CCK.', '.CCK.', '.KCCK', '.KCCK', '.KLLK', '.KSSK', '.KSTK', '..KK.'], 11, 0],
  fwd2:  [['.CK..', '.CCK.', '.CCK.', '.KCCK', '.KCCK', '.KLLK', '..KSS', '..KST', '...KK'], 11, 0],
  throw: [['.CK..', '.CCKK', '.CLSS', '.CLSS', '.KKKK'], 11, 1],
  up:    [['...SS', '...SS', '..KLK', '.KCCK', '.CCK.', '.CK..'], 11, -4],
};
const HB_dark = a => [recolor(a[0], { C: 'M', L: 'C', S: 'T' }), a[1], a[2]];
/* pernas: 8 fases de UMA perna (desenhada como a de perto); 12 linhas quando o corpo desce 1 px, 13 quando nao.
   Pe de apoio (calcanhar): 11, 9, 6, 4, ponta em 5 -> recua 2,5 px por quadro */
const HB_LEG = [
  // 0 contato: perna esticada a frente, pe chato
  ['.......PPPP.....', '.......PPPP.....', '........PPPP....', '........PPPP....', '.........PPP....', '.........PPP....',
   '..........PPP...', '..........PPP...', '..........PPP...', '...........OOOO.', '...........OOOOO', '...........KKKKK'],
  // 1 carga: o joelho cede para frente
  ['.......PPPP.....', '.......PPPP.....', '........PPPP....', '........PPPP....', '.........PPPP...', '..........PPP...',
   '.........PPP....', '.........PPP....', '.........PPP....', '.........OOOO...', '.........OOOOO..', '.........KKKKK..'],
  // 2 passagem: perna de apoio embaixo do quadril
  ['......PPPP......', '......PPPP......', '......PPPP......', '......PPPP......', '.......PPP......', '.......PPP......',
   '......PPP.......', '......PPP.......', '......PPP.......', '......PPP.......', '......OOOO......', '......OOOOO.....', '......KKKKK.....'],
  // 3 impulso: perna inclinada para tras, pe ainda chato
  ['......PPPP......', '......PPPP......', '.....PPPP.......', '.....PPPP.......', '.....PPP........', '.....PPP........',
   '....PPP.........', '....PPP.........', '....PPP.........', '....PPP.........', '....OOOO........', '....OOOOO.......', '....KKKKK.......'],
  // 4 saida: so a ponta do pe no chao, calcanhar levantado
  ['......PPPP......', '......PPPP......', '.....PPPP.......', '.....PPP........', '....PPP.........', '....PPP.........',
   '...PPP..........', '...PPP..........', '..PPP...........', '.OOOO...........', 'KOOOOO..........', '..KKKK..........'],
  // 5 balanco: o pe sai do chao e passa por baixo do corpo, ponta para baixo
  ['......PPPP......', '......PPPP......', '......PPPP......', '.......PPP......', '......PPP.......', '.....PPP........',
   '....OOOO........', '....KOOOO.......', '.....KKKK.......', '................', '................', '................'],
  // 6 passagem (balanco): joelho sobe a frente, pe pendurado na frente do pe de apoio
  ['.......PPPP.....', '........PPPP....', '.........PPPP...', '.........PPPP...', '..........PPP...', '..........PPP...',
   '.........PPP....', '.........OOOO...', '.........OOOOO..', '.........KKKKK..', '................', '................', '................'],
  // 7 alcance: perna se estica a frente, pe 1 px acima do chao
  ['.......PPPP.....', '........PPPP....', '........PPPP....', '.........PPPP...', '.........PPPP...', '..........PPP...',
   '..........PPP...', '..........PPP...', '..........PPP...', '..........OOOO..', '..........OOOOO.', '..........KKKKK.', '................'],
];
const HB_far = rows => recolor(rows, { P: 'Q', O: 'N' });
const HB_BOB = [1, 1, 0, 0];
/* monta um quadro: pernas (longe, perto), quadril, tronco, cabeca, bracos */
const HB_frame = (near, far, aL, aR, dy = 0, o = {}) => {
  const dx = o.dx || 0, head = o.head || HH, ty = 7 + dy;
  return compose(16, 32, [
    [HB_far(far), 0, 32 - far.length],
    [near, 0, 32 - near.length],
    [HB_PELVIS, dx, ty + 10],
    [HB_TORSO, dx, ty],
    [head, 2 + dx, dy],
    [aL[0], aL[1] + dx, ty + aL[2]],
    [aR[0], aR[1] + dx, ty + aR[2]],
  ]);
};
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'], HERO_STEP_B = 2.5;
/* bracos por quadro: [esquerdo, direito, qual e o de perto: 'L' ou 'R'] */
const HB_WARMS = [['back2', 'fwd2', 'L'], ['back1', 'fwd1', 'L'], ['down', 'down', ''], ['back1', 'fwd1', 'R'],
  ['back2', 'fwd2', 'R'], ['back1', 'fwd1', 'R'], ['down', 'down', ''], ['back1', 'fwd1', 'L']];
for (let f = 0; f < 8; f++) {
  const near = HB_LEG[f], far = HB_LEG[(f + 4) % 8], dy = HB_BOB[f % 4];
  const [l, r, n] = HB_WARMS[f];
  const aL = n === 'R' ? HB_dark(HB_AL[l]) : HB_AL[l], aR = n === 'L' ? HB_dark(HB_AR[r]) : HB_AR[r];
  ROWS['H_' + HERO_WALK_B[f]] = HB_frame(near, far, aL, aR, dy);
  ROWS['H_' + HERO_WALK_B[f] + '_t'] = HB_frame(near, far, aL, HB_AR.throw, dy);
}
/* parado: pernas de frente, separadas */
const HB_STAND = ['....QQQQPPPP....', '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....',
  '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '...NNNN..OOOO...', '...NNNNN.OOOOO..', '...KKKKK.KKKKK..'];
ROWS.H_stand = HB_frame(HB_STAND, [], HB_AL.down, HB_AR.down);
ROWS.H_stand2 = HB_frame(HB_STAND, [], HB_AL.down, HB_AR.down, 0, { head: HH2 });
ROWS.H_stand_t = HB_frame(HB_STAND, [], HB_AL.down, HB_AR.throw);
ROWS.H_stand2_t = HB_frame(HB_STAND, [], HB_AL.down, HB_AR.throw, 0, { head: HH2 });
/* pulo: joelho de perto encolhido a frente, perna de longe esticada para tras */
const HB_JUMP_N = ['.......PPPP.....', '........PPPPP...', '.........PPPPP..', '..........PPPP..', '..........PPP...', '..........PPP...',
  '..........OOOO..', '..........OOOOO.', '..........KKKKK.', '................', '................', '................', '................'];
const HB_JUMP_F = HB_LEG[4].concat(['................']);
ROWS.H_jump = HB_frame(HB_JUMP_N, HB_JUMP_F, HB_dark(HB_AL.back2), HB_AR.up);
ROWS.H_jump_t = HB_frame(HB_JUMP_N, HB_JUMP_F, HB_dark(HB_AL.back2), HB_AR.throw);
ROWS.H_fall = HB_frame(HB_LEG[7], HB_LEG[5].concat(['................']).slice(-13), HB_dark(HB_AL.back1), HB_AR.up);
ROWS.H_fall_t = HB_frame(HB_LEG[7], HB_LEG[5].concat(['................']).slice(-13), HB_dark(HB_AL.back1), HB_AR.throw);
/* derrapagem: desliza para tras, pernas fincadas a esquerda, corpo inclinado para frente */
const HB_SKID_N = ['.......PPP......', '.......PPP......', '......PPP.......', '......PPP.......', '.....PPP........', '.....PP.........',
  '....PP..........', '....PP..........', '...PP...........', '...PP...........', '..OOO...........', '..OOOOO.........', '..KKKKK.........'];
const HB_SKID_F = ['......PPP.......', '.....PPP........', '.....PPP........', '....PPP.........', '....PP..........', '...PP...........',
  '...PP...........', '..PP............', '..PP............', '.PP.............', 'OOO.............', 'OOOOO...........', 'KKKKK...........'];
ROWS.H_skid = HB_frame(HB_SKID_N, HB_SKID_F, HB_dark(HB_AL.back1), HB_AR.fwd2, 0, { dx: 1 });
ROWS.H_skid_t = HB_frame(HB_SKID_N, HB_SKID_F, HB_dark(HB_AL.back1), HB_AR.throw, 0, { dx: 1 });
/* aterrissagem: agachado, corpo 2 px abaixo, joelhos para fora */
const HB_LAND = ['....QQQ..PPP....', '...QQQ....PPP...', '...QQ......PP...', '...QQ......PP...', '....QQ....PP....', '....QQ....PP....',
  '....QQ....PP....', '....QQ....PP....', '...NNN....OOO...', '...NNNN...OOOO..', '...KKKK...KKKK..'];
ROWS.H_land = HB_frame(HB_LAND, [], HB_AL.down, HB_AR.down, 2);
ROWS.H_land_t = HB_frame(HB_LAND, [], HB_AL.down, HB_AR.throw, 2);
/* mastro (o mastro fica nas colunas 12-13): maos alternam no mastro, joelho de perto abraca o mastro */
HB_AR.grip = [['.KK..', 'KSSK.', 'KSTK.', 'KLLK.', 'KCCK.', 'KCCK.', 'CCK..'], 11, -2];
const HB_CLIMB_N = ['.......PPPP.....', '........PPPPP...', '.........PPPPP..', '..........PPPP..', '..........PPP...', '..........PPP...',
  '..........OOOO..', '..........OOOOO.', '..........KKKKK.', '................', '................', '................', '................'];
const HB_CLIMB_F = ['......PPPP......', '......PPPP......', '......PPPP......', '.......PPP......', '.......PPP......', '.......PPP......',
  '.......PPP......', '........PPP.....', '........PPP.....', '........OOOO....', '........OOOOO...', '........KKKKK...', '................'];
ROWS.H_climb1 = HB_frame(HB_CLIMB_N, HB_CLIMB_F, HB_dark(HB_AL.down), HB_AR.grip);
ROWS.H_climb2 = HB_frame(HB_CLIMB_N, HB_CLIMB_F, HB_dark(HB_AL.down), HB_AR.fwd1, 1);
/* agachado (reserva: o jogo ainda nao usa): corpo 7 px abaixo, joelhos para fora */
const HB_DUCK = ['...QQQQ.PPPP....', '..QQQ.....PPP...', '..QQ.......PP...', '..NNNN....OOOO..', '..NNNNN...OOOOO.', '..KKKKK...KKKKK.'];
ROWS.H_duck = HB_frame(HB_DUCK, [], HB_AL.down, HB_AR.down, 7);
ROWS.H_duck_t = HB_frame(HB_DUCK, [], HB_AL.down, HB_AR.throw, 7);
