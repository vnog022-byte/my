/* ---- Heroi pequeno (16x16), cabeca e paletas compartilhadas, e escolha de quadro do heroi.
   K=contorno C=moletom L=borda M=moletom escuro S=pele T=pele escura B=bochecha E=olho P/Q=calca O/N=tenis
   Caminhada classica: contato (pernas em V, corpo 1 px abaixo) e passagem (perna de apoio reta, a outra
   passando com o pe levantado), alternando as pernas. Pernas sem contorno interno. ---- */
const HH = [
  '.K......K...', 'KCK....KCK..', 'KCCKKKKKCCK.', 'KCCCLLLLLCCK',
  'KCCLSSSSESLK', 'KCCLSSSBESSK', '.KCCLLLLLLK.'];
const HH2 = ['.K..........', 'KCK.....KKK.', 'KCCKKKKKCCCK'].concat(HH.slice(3));
const HF = [
  '...K........K...', '..KCK......KCK..', '..KCCKKKKKKCCK..', '.KCCLLLLLLLLCCK.',
  '.KCLSESSSSESLCK.', '.KCLSSSKKSSSLCK.', '..KCLLLLLLLLCK..'];
const ST = {
  stand: ['...KCCCCCCCCK...', '...SKCCCCCCKS...', '....KLLLLLLK....'],
  plain: ['...KCCCCCCCCK...', '...KCCCCCCCCK...', '....KLLLLLLK....'],
  swA:   ['...KCCCCCCCCK...', '..SKCCCCCCCCKT..', '....KLLLLLLK....'],
  swB:   ['...KCCCCCCCCK...', '..TKCCCCCCCCKS..', '....KLLLLLLK....'],
  jump:  ['...KCCCCCCCCK...', '..TKCCCCCCCCK...', '....KLLLLLLK....'],
  skid:  ['....KCCCCCCCCK..', '...TKCCCCCCCCKS.', '.....KLLLLLLK...'],
  climb1:['...KCCCCCCCCKS..', '...KCCCCCCCCK...', '....KLLLLLLKS...'],
  climb2:['...KCCCCCCCCK...', '...KCCCCCCCCKS..', '....KLLLLLLK.S..'],
  die:   ['S..KCCCCCCCCK..S', '.SKCCCCCCCCCCKS.', '...KLLLLLLLLK...'],
};
/* quadril + pernas + tenis (6 linhas na altura normal, 5 quando o corpo desce 1 px) */
const SL = {
  stand: ['....KPPPPPPK....', '.....QQ..PP.....', '.....QQ..PP.....', '.....QQ..PP.....', '.....QQ..PP.....', '.....NNN.OOO....'],
  cA:    ['....KPPPPPPK....', '.....QQ..PP.....', '....QQ....PP....', '...QQ......PP...', '..NNN......OOO..'],
  pA:    ['....KPPPPPPK....', '......QQPP......', '......QQPP......', '.....QQ.PP......', '....NNN.PP......', '........OOO.....'],
  jump:  ['....KPPPPPPK....', '.....QQPPPP.....', '.....QQ...PP....', '....QQ....PP....', '....QQ....OOO...', '...NNN..........'],
  fall:  ['....KPPPPPPK....', '.....QQ..PP.....', '.....QQ..PP.....', '....QQ....PP....', '....QQ....PP....', '...NNN....OOO...'],
  skid:  ['.....KPPPPPPK...', '.....QQ.PP......', '....QQ.PP.......', '...QQ.PP........', '..QQ.PP.........', '.NNNOOO.........'],
  land:  ['...KPPPPPPPPK...', '...QQ......PP...', '..QQ........PP..', '..NNN......OOO..'],
  climb1:['....KPPPPPPK....', '.....QQPPPP.....', '.....QQ...PP....', '.....QQ...OOOO..', '.....QQ.........', '....NNN.........'],
  die:   ['....KPPPPPPK....', '.....PP..PP.....', '.....PP..PP.....', '.....PP..PP.....', '.....PP..PP.....', '....OOO..OOO....'],
};
SL.cB = swapLegs(SL.cA); SL.pB = swapLegs(SL.pA); SL.climb2 = swapLegs(SL.climb1);
const ARM_UP_R = [['..S', '..S', '.CK', 'C..'], 12, 4], ARM_UP_L = [['S...', 'S...', '.C..', '..CC'], 0, 4];
const small = (head, hx, torso, legs, dy = 0, extra = []) => compose(16, 16, [[head, hx, dy], [torso, 0, 7 + dy], [legs, 0, 16 - legs.length], ...extra]);
ROWS.h_stand = small(HH, 2, ST.stand, SL.stand);
ROWS.h_stand2 = small(HH2, 2, ST.stand, SL.stand);
ROWS.h_w1 = small(HH, 2, ST.swA, SL.cA, 1);
ROWS.h_w2 = small(HH, 2, ST.stand, SL.pA);
ROWS.h_w3 = small(HH, 2, ST.swB, SL.cB, 1);
ROWS.h_w4 = small(HH, 2, ST.stand, SL.pB);
ROWS.h_jump = small(HH, 2, ST.jump, SL.jump, 0, [ARM_UP_R]);
ROWS.h_fall = small(HH, 2, ST.plain, SL.fall, 0, [ARM_UP_L, ARM_UP_R]);
ROWS.h_skid = small(HH, 3, ST.skid, SL.skid);
ROWS.h_land = small(HH, 2, ST.stand, SL.land, 2);
ROWS.h_climb1 = small(HH, 2, ST.climb1, SL.climb1);
ROWS.h_climb2 = small(HH, 2, ST.climb2, SL.climb2);
ROWS.h_die1 = compose(16, 16, [[HF], [ST.die, 0, 7], [SL.die, 0, 10]]);
ROWS.h_die2 = compose(16, 16, [[HF], [['S..............S', 'S..............S', 'C..............C', '.C............C.', '..CC........CC..'], 0, 3], [ST.plain, 0, 7], [SL.die, 0, 10]]);

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
