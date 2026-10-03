/* ---- Heroi pequeno (16x16), cabeca e paletas compartilhadas, e escolha de quadro do heroi.
   K=contorno C=moletom L=borda M=moletom escuro S=pele T=pele escura B=bochecha E=olho P/Q=calca O/N=tenis
   Cada quadro = cabeca HH (12x7, em x=2, desce 1 px nos quadros de contato) + bloco de baixo escrito inteiro
   (tronco, quadril, pernas e tenis), para controlar cada pixel das pernas.
   Caminhada em 4 quadros: contato A (pernas em V), passagem A (perna de apoio reta embaixo do corpo,
   a outra dobrada passando com o pe no ar), contato B e passagem B (pernas trocadas).
   O pe de apoio anda 4-5 px para tras por quadro = HERO_STEP_S, entao nao patina. ---- */
const HH = [
  '.K......K...',
  'KLK....KLK..',
  'KCLKKKKKCLK.',
  'KCCCLLLLLLCK',
  'KCCLSSSSESSK',
  'KCCLSSSSESSK',
  '.KCLSSSBSSK.'];
const HH2 = ['.K..........', 'KCK.....KKK.', 'KCCKKKKKCCCK'].concat(HH.slice(3));
const HF = [
  '...K........K...',
  '..KCK......KCK..',
  '..KCCKKKKKKCCK..',
  '.KCCLLLLLLLLCCK.',
  '.KCLSESSSSESLCK.',
  '.KCLBSSKKSSBLCK.',
  '..KCLLLLLLLLCK..'];
/* blocos de baixo: comecam na linha 7+dy da cabeca e vao ate a linha 15 */
const LO = {
  stand: [ // dy=1
    '...KCCCCCCCCK...',
    '...SKCCCCCCKS...',
    '....KLLLLLLK....',
    '....KPPPPPPK....',
    '.....QQ..PP.....',
    '.....QQ..PP.....',
    '.....NN..OO.....',
    '.....NNN.OOOO...'],
  cA: [ // contato: perna de perto (P) na frente, de longe (Q) atras; corpo 1 px abaixo
    '...KCCCCCCCCK...',
    '..SKCCCCCCCCKT..',
    '....KLLLLLLK....',
    '....KPPPPPPK....',
    '....QQ....PP....',
    '...QQ......PP...',
    '..NN.......OO...',
    '...NNN.....OOOO.'],
  pA: [ // passagem: P reta embaixo do corpo, Q dobrada com o pe no ar
    '...KCCCCCCCCK...',
    '...SKCCCCCCKT...',
    '....KLLLLLLK....',
    '....KPPPPPPK....',
    '......PPQQ......',
    '......PP.QQ.....',
    '......PP.NNN....',
    '......OO........',
    '......OOOO......'],
  jump: [
    '...KCCCCCCCCK...',
    '..TKCCCCCCCCK...',
    '....KLLLLLLK....',
    '....KPPPPPPK....',
    '....QQ..PPPP....',
    '...QQ.....PP....',
    '...QQ.....OOOO..',
    '..NN............',
    '..NNN...........'],
  fall: [
    '...KCCCCCCCCK...',
    '...KCCCCCCCCK...',
    '....KLLLLLLK....',
    '....KPPPPPPK....',
    '....QQ...PP.....',
    '...QQ.....PP....',
    '...QQ.....PP....',
    '...NN.....OO....',
    '..NNN.....OOO...'],
  skid: [
    '....KCCCCCCCCK..',
    '...TKCCCCCCCCKS.',
    '.....KLLLLLLK...',
    '.....KPPPPPPK...',
    '.....PP..QQ.....',
    '....PP..QQ......',
    '...PP...QQ......',
    '..OO....NN......',
    '.OOOO...NNNN....'],
  land: [ // dy=2
    '...KCCCCCCCCK...',
    '..SKCCCCCCCCKS..',
    '....KLLLLLLK....',
    '...KPPPPPPPPK...',
    '...QQ.....PP....',
    '..NN.......OO...',
    '..NNN......OOOO.'],
  climb1: [
    '...KCCCCCCCCKS..',
    '...KCCCCCCCCK...',
    '....KLLLLLLKS...',
    '....KPPPPPPK....',
    '.....QQPPPPP....',
    '.....QQ....PP...',
    '.....QQ....OOO..',
    '.....NN.........',
    '.....NNN........'],
  climb2: [
    '...KCCCCCCCCK...',
    '...KCCCCCCCCKS..',
    '....KLLLLLLK.S..',
    '....KPPPPPPK....',
    '.....PPQQQQQ....',
    '.....PP....QQ...',
    '.....PP....NNN..',
    '.....OO.........',
    '.....OOO........'],
  die: [
    'S..KCCCCCCCCK..S',
    '.SKCCCCCCCCCCKS.',
    '...KLLLLLLLLK...',
    '....KPPPPPPK....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....OO..OO.....',
    '....OOO..OOO....'],
};
const swapArms = rows => recolor(rows, { S: 'T', T: 'S' });
LO.cB = swapArms(swapLegs(LO.cA)); LO.pB = swapArms(swapLegs(LO.pA));
const ARM_UP_R = [['..S', '..S', '.CK', 'C..'], 12, 4], ARM_UP_L = [['S...', 'S...', '.C..', '..CC'], 0, 4];
const small = (head, hx, lo, dy = 0, extra = []) => compose(16, 16, [[head, hx, dy], [lo, 0, 7 + dy], ...extra]);
ROWS.h_stand = small(HH, 2, LO.stand, 1);
ROWS.h_stand2 = small(HH2, 2, LO.stand, 1);
ROWS.h_w1 = small(HH, 2, LO.cA, 1);
ROWS.h_w2 = small(HH, 2, LO.pA);
ROWS.h_w3 = small(HH, 2, LO.cB, 1);
ROWS.h_w4 = small(HH, 2, LO.pB);
ROWS.h_jump = small(HH, 2, LO.jump, 0, [ARM_UP_R]);
ROWS.h_fall = small(HH, 2, LO.fall, 0, [ARM_UP_L, ARM_UP_R]);
ROWS.h_skid = small(HH, 3, LO.skid);
ROWS.h_land = small(HH, 2, LO.land, 2);
ROWS.h_climb1 = small(HH, 2, LO.climb1);
ROWS.h_climb2 = small(HH, 2, LO.climb2);
ROWS.h_die1 = compose(16, 16, [[HF], [LO.die, 0, 7]]);
ROWS.h_die2 = compose(16, 16, [[HF], [['S..............S', 'S..............S', 'C..............C', '.C............C.', '..CC........CC..'], 0, 3], [LO.die.slice(0, 1).map(() => '...KCCCCCCCCK...').concat(LO.die.slice(1).map((r, i) => i === 0 ? '...KCCCCCCCCK...' : r)), 0, 7]]);
for (const k in ROWS) if (k.startsWith('h_') && (ROWS[k].length !== 16 || ROWS[k].some(r => r.length !== 16))) throw new Error('tamanho errado ' + k);

const HERO = { K: '#1c1828', C: '#20a08c', L: '#9cf0d8', M: '#127060', S: '#fcc8a0', T: '#d89878', B: '#f87860', E: '#1c1828', P: '#3c4ca8', Q: '#283070', O: '#f87818', N: '#b84808' };
PAL.hero = HERO;
PAL.heroF = { ...HERO, C: '#e8401c', L: '#fcd860', M: '#981c10', O: '#fcd860', N: '#c89820' };
PAL.heroS1 = { ...HERO, C: '#f8b800', L: '#fcf0a0', M: '#b07000', P: '#e84010', Q: '#a02008' };
PAL.heroS2 = { ...HERO, C: '#f83890', L: '#fcc0e0', M: '#a01858' };
PAL.heroS3 = { ...HERO, C: '#38c8f8', L: '#d0f8fc', M: '#1870b0', P: '#fcfcfc', Q: '#a8a8b8' };

/* escolha do quadro: a caminhada avanca pela distancia percorrida (um quadro a cada HERO_STEP px),
   assim o pe de apoio nao patina. HERO_WALK_B e HERO_STEP_B ficam na secao herobig. */
const HERO_WALK_S = ['w1', 'w2', 'w3', 'w4'], HERO_STEP_S = 4.5, STAR_PALS = ['heroS1', 'heroS2', 'heroS3', 'hero'];
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
