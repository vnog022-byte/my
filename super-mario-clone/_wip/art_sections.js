/* ART-BEGIN */
/* ----------------------------- ARTE -----------------------------
   Personagens originais desenhados em texto: cada letra e uma cor da paleta.
   compose() monta um quadro a partir de pedacos (cabeca, tronco, pernas, bracos).
   Cada secao (SEC:nome ... END:nome) guarda os desenhos e a escolha de quadro de um elemento. */
const compose = (w, h, parts) => {
  const g = Array.from({ length: h }, () => new Array(w).fill('.'));
  for (const [rows, dx = 0, dy = 0] of parts) rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) { const ch = r[x], X = x + dx, Y = y + dy; if (ch !== '.' && Y >= 0 && Y < h && X >= 0 && X < w) g[Y][X] = ch; }
  });
  return g.map(r => r.join(''));
};
const mirror = rows => rows.map(r => [...r].reverse().join(''));
const rot90 = rows => [...rows[0]].map((_, x) => rows.map(r => r[x]).reverse().join(''));
const recolor = (rows, m) => rows.map(r => r.replace(/./g, ch => m[ch] || ch));
const shade = rows => recolor(rows, { C: 'M', S: 'T' });
const swapLegs = rows => recolor(rows, { P: 'Q', Q: 'P', O: 'N', N: 'O' });
const ROWS = {}, PAL = {};
const sprCache = new Map();
function spr(id, pal, flip, vflip) {
  const key = id + '|' + pal + '|' + (flip ? 1 : 0) + (vflip ? 1 : 0);
  let c = sprCache.get(key); if (c) return c;
  const rows = ROWS[id], P = PAL[pal], w = rows[0].length, h = rows.length;
  c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  for (let r = 0; r < h; r++) for (let q = 0; q < w; q++) {
    const ch = rows[r][q]; if (ch === '.' || !P[ch]) continue;
    x.fillStyle = P[ch]; x.fillRect(flip ? w - 1 - q : q, vflip ? h - 1 - r : r, 1, 1);
  }
  sprCache.set(key, c); return c;
}

/* SEC:hero */
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
/* END:hero */

/* SEC:herobig */
/* ---- Heroi grande (16x32): cabeca HH (12x7, em x=2) e paletas da secao hero; tronco 13 linhas
   (termina no quadril), pernas 12. Mesmas letras de cor do heroi pequeno. ---- */
const BT = ['....KCCCCCCK....', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KCCLLLLCCK...',
            '...KCCLCCLCCK...', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KCCCCCCCCK...', '...KLLLLLLLLK...',
            '....KPPPPPPK....'];
const ARM = {
  down:  ['.KK.', 'KCCK', 'KCCK', 'KCCK', 'KCCK', 'KCCK', 'KSSK', 'KSSK', '.KK.'],
  fwd:   ['.KK...', 'KCCK..', 'KCCCK.', '.KCCCK', '..KCSS', '...KSS', '....KK'],
  back:  ['...KK.', '..KCCK', '.KCCCK', 'KCCCK.', 'SSCK..', 'SSK...', 'KK....'],
  up:    ['....KK', '...KSS', '..KCSS', '.KCCK.', 'KCCK..', 'KCK...'],
  throw: ['.KK......', 'KCCKKKK..', 'KCCCCCCSS', '.KKKKKKSS', '.......KK'],
};
const BL = {
  stand: ['....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '....QQQ..PPP....', '.....QQ..PP.....', '.....QQ..PP.....',
          '.....QQ..PP.....', '.....QQ..PP.....', '.....QQ..PP.....', '.....QQ..PP.....', '....NNNN.OOOO...', '....KKKK.KKKK...'],
  cA:    ['....QQQ..PPP....', '...QQQ....PPP...', '...QQQ....PPP...', '..QQQ......PPP..', '..QQ.......PPP..', '.QQ.........PP..',
          '.QQ.........PP..', 'QQ...........PP.', 'QQ...........PP.', 'NNN.........OOOO', 'KKK.........KKKK'],
  pA:    ['.....QQPPP......', '.....QQPPP......', '....QQ.PPP......', '....QQ.PPP......', '...QQ..PPP......', '...QQ...PP......',
          '..QQ....PP......', '.NNNN...PP......', '.KKKK...PP......', '........PP......', '.......OOOO.....', '.......KKKK.....'],
  jump:  ['.....QQPPPP.....', '.....QQPPPPP....', '....QQQ...PPP...', '....QQ.....PP...', '...QQ......PP...', '...QQ.....OOOO..',
          '..QQ......KKKK..', '..QQ............', '.QQ.............', '.QQ.............', 'NNN.............', 'KKK.............'],
  fall:  ['....QQQ.PPP.....', '....QQQ.PPP.....', '....QQ...PP.....', '...QQ....PP.....', '...QQ.....PP....', '...QQ.....PP....',
          '...QQ.....PP....', '..NNNN....OOOO..', '..KKKK....KKKK..', '................', '................', '................'],
  skid:  ['......QQPPP.....', '.....QQ.PPP.....', '.....QQ.PP......', '....QQ.PP.......', '....QQ.PP.......', '...QQ.PP........',
          '...QQ.PP........', '..QQ.PP.........', '..QQ.PP.........', '.QQ.PP..........', 'NNNOOOO.........', 'KKKKKKK.........'],
  land:  ['...QQQ..PPP.....', '..QQQ....PPP....', '..QQ......PPP...', '..QQ.......PP...', '..QQ.......PP...', '...QQ.....PP....',
          '...QQ.....PP....', '..NNNN...OOOO...', '..NNNN...OOOO...', '..KKKK...KKKK...'],
  climb1:['.....QQPPPP.....', '.....QQPPPPPP...', '.....QQ...PPP...', '.....QQ....PP...', '.....QQ...OOOO..', '.....QQ...KKKK..',
          '.....QQ.........', '.....QQ.........', '....NNNN........', '....KKKK........', '................', '................'],
};
BL.cB = swapLegs(BL.cA); BL.pB = swapLegs(BL.pA); BL.climb2 = swapLegs(BL.climb1);
/* [pernas, braco da frente, braco de tras, desce (px), desloca (px)] */
const BIG_POSE = {
  stand: [BL.stand, [ARM.down, 11, 9], [shade(ARM.down), 1, 9]],
  w1: [BL.cA, [ARM.back, 1, 9], [shade(ARM.fwd), 9, 9], 1],
  w2: [BL.pA, [ARM.down, 11, 9], [shade(ARM.down), 1, 9]],
  w3: [BL.cB, [ARM.fwd, 10, 9], [shade(ARM.back), 0, 9], 1],
  w4: [BL.pB, [ARM.down, 11, 9], [shade(ARM.down), 1, 9]],
  jump: [BL.jump, [ARM.up, 10, 4], [shade(ARM.back), 0, 9]],
  fall: [BL.fall, [ARM.up, 10, 4], [shade(mirror(ARM.up)), 0, 4]],
  skid: [BL.skid, [ARM.fwd, 10, 8], [shade(ARM.back), 0, 9], 0, 1],
  land: [BL.land, [ARM.down, 11, 9], [shade(ARM.down), 1, 9], 2],
  climb1: [BL.climb1, [ARM.up, 9, 5], [shade(ARM.fwd), 9, 11]],
  climb2: [BL.climb2, [ARM.fwd, 9, 10], [shade(ARM.up), 9, 4]],
};
const big = (legs, near, far, dy = 0, dx = 0, head = HH) => compose(16, 32, [
  [far[0], far[1] + dx, far[2] + dy], [head, 2 + dx, dy], [BT, dx, 7 + dy], [legs, 0, 32 - legs.length], [near[0], near[1] + dx, near[2] + dy]]);
for (const k in BIG_POSE) {
  const [legs, near, far, dy, dx] = BIG_POSE[k];
  ROWS['H_' + k] = big(legs, near, far, dy, dx);
  if (!k.startsWith('climb')) ROWS['H_' + k + '_t'] = big(legs, [ARM.throw, 7, 11], k === 'fall' ? far : [shade(ARM.back), 0, 9], dy, dx);
}
ROWS.H_stand2 = big(BL.stand, [ARM.down, 11, 9], [shade(ARM.down), 1, 9], 0, 0, HH2);
const HERO_WALK_B = ['w1', 'w2', 'w3', 'w4'], HERO_STEP_B = 6;
/* END:herobig */

/* SEC:blob */
/* ---- Gosma (anda esticando e achatando): K=contorno B=corpo L=brilho M=sombra W=olho E=pupila V/U=broto ---- */
ROWS.blob_n = [
  '................', '................', '........VV......', '.......VUK......', '.....KKKKKK.....', '...KKBBBBBBKK...',
  '..KBBLLBBBBBBK..', '.KBBLLBBBBBBBBK.', '.KBLLBBBBBBBBBK.', '.KBEWWBBBEWWBBK.', '.KBEWWBBBEWWBBK.', '.KBBBBBBBBBBBBK.',
  '.KBBBBKKBBBBMBK.', '.KMBBBBBBBBBMMK.', '..KMMMMMMMMMMK..', '...KKKKKKKKKK...'];
ROWS.blob_sq = [
  '................', '................', '................', '................', '................', '.........VV.....',
  '........VUK.....', '....KKKKKKKK....', '..KKBBBBBBBBKK..', '.KBBLLLBBBBBBBK.', 'KBBLLBBBBBBBBBBK', 'KBEWWBBBBBEWWBBK',
  'KBEWWBBBBBEWWBBK', 'KBBBBBKKBBBBBMBK', '.KMMMMMMMMMMMMK.', '..KKKKKKKKKKKK..'];
ROWS.blob_st = [
  '........VV......', '.......VUK......', '......KKKK......', '.....KBBBBK.....', '....KBLLBBBK....', '...KBLLBBBBBK...',
  '...KBLBBBBBBK...', '...KEWWBBEWWK...', '...KEWWBBEWWK...', '...KBBBBBBBBK...', '...KBBBKKBBMK...', '...KBBBBBBBMK...',
  '...KMBBBBBBMK...', '...KMMBBBBMMK...', '....KMMMMMMK....', '.....KKKKKK.....'];
ROWS.blob_flat = [
  '................', '................', '................', '................', '................', '................',
  '................', '................', '................', '................', '................', '...KKKKKKKKKK...',
  '.KKBKBKBBKBKBKK.', 'KBBBBKBBBBKBBBBK', 'KBBBKBKBBKBKBBBK', '.KKKKKKKKKKKKKK.'];
const blink = rows => { let n = 0; return rows.map(r => r.includes('E') ? r.replace(/[EW]/g, n++ ? 'K' : 'B') : r); };
for (const k of ['blob_n', 'blob_sq', 'blob_st']) ROWS[k + '_b'] = blink(ROWS[k]);
PAL.blob = { K: '#3c1458', B: '#a048d8', L: '#d8a0f8', M: '#7028a8', W: '#fcfcfc', E: '#1c1828', V: '#48c838', U: '#208018' };
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_n', pal: 'blob', vflip: true };
  const k = ['blob_n', 'blob_sq', 'blob_n', 'blob_st'][Math.floor(e.anim / 8) % 4];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
/* END:blob */

/* SEC:pango */
/* ---- Pangolim (16x24, olha para a esquerda; vira bola quando pisado): A=escamas S=pele T=pele escura E=olho W=garra ---- */
const scales = rows => rows.map((r, y) => r.replace(/A/g, (m, x) => {
  const u = (x + (Math.floor(y / 3) % 2) * 2) % 4, v = y % 3;
  return v === 0 ? (u === 3 ? 'M' : 'H') : v === 1 ? (u === 3 ? 'M' : 'A') : (u === 0 ? 'A' : 'M');
}));
const PBODY = scales([
  '................', '................', '................', '.......KKKK.....', '.....KKSSAAK....', '...KKSSESAAAK...',
  'KKKSSSSSAAAAAK..', 'KSSSSSSAAAAAAAK.', '.KKKTSSAAAAAAAK.', '....KTSAAAAAAAAK', '....KSSAAAAAAAAK', '...KSSSAAAAAAAAK',
  '...KWSSAAAAAAAAK', '....KSSAAAAAAAAK', '....KTSAAAAAAAAK', '....KTTAAAAAAAAK', '.....KTAAAAAAAAK', '.....KTAAAAAAAAK',
  '......KAAAAAAAAK', '.......KKKKKKKKK']);
const PLEGS = {
  a: ['....KSSK.KTTK...', '...KSSK...KTTK..', '..KSSSK....KTTK.', '..KWKWK....KWKWK'],
  b: ['.....KSSKTTK....', '....KSSSKTTTK...', '....KWKWKWKWK...'],
  c: ['....KTTK.KSSK...', '...KTTK...KSSK..', '..KTTTK....KSSK.', '..KWKWK....KWKWK'],
};
ROWS.pango_a = compose(16, 24, [[PBODY], [PLEGS.a, 0, 20]]);
ROWS.pango_b = compose(16, 24, [[PBODY, 0, 1], [PLEGS.b, 0, 21]]);
ROWS.pango_c = compose(16, 24, [[PBODY], [PLEGS.c, 0, 20]]);
const ballRows = (spin, peek) => {
  const rows = [];
  for (let y = 0; y < 16; y++) {
    let r = '';
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5, dy = y - 7.5, d = Math.hypot(dx, dy);
      if (d > 7.7) { r += '.'; continue; }
      if (d > 6.6) { r += 'K'; continue; }
      const a = ((Math.atan2(dy, dx) + spin) % (Math.PI / 3) + Math.PI / 3) % (Math.PI / 3);
      let ch = d < 2.6 ? 'M' : a < 0.3 ? 'M' : a < 0.6 ? 'H' : 'A';
      if (dx + dy < -6.5 && ch === 'A') ch = 'H';
      if (dx + dy > 6 && ch !== 'M') ch = 'M';
      r += ch;
    }
    rows.push(r);
  }
  return peek ? compose(16, 16, [[rows], [['.KK', 'KSSK', 'SESK', 'KSSK', '.KK'], 0, 6]]) : rows;
};
for (let i = 0; i < 4; i++) ROWS['ball' + i] = ballRows(-i * Math.PI / 12);
ROWS.ball_peek = ballRows(0, true);
PAL.pango = { K: '#3a200c', A: '#c87830', H: '#f0b860', M: '#8c4c18', S: '#f8d0a8', T: '#d8a078', E: '#1c1828', W: '#fcfcfc' };
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_a' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: ['pango_a', 'pango_b', 'pango_c', 'pango_b'][Math.floor(e.anim / 8) % 4], pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  return { id: e.shellT % 150 > 105 ? 'ball_peek' : 'ball0', pal: 'pango', flip: px > e.x };
}
/* END:pango */

/* SEC:items */
/* ---- Itens: maca (crescer), pimenta (fogo), coracao (vida), estrela (invencivel) ---- */
ROWS.apple = [
  '................', '........KKK.....', '.......KVVVK....', '......KDKKK.....', '...KKKKDKKKK....', '..KRRRRKRRRRK...',
  '.KRWWRRRRRRRRK..', '.KRWRRRRRRRRRK..', 'KRRRRRRRRRRRRRK.', 'KRRRRRRRRRRRRRK.', 'KRRRRRRRRRRRDRK.', 'KRRRRRRRRRRRDRK.',
  '.KRRRRRRRRRDDK..', '.KRRRRRRRRRDDK..', '..KKRRRRRRDKK...', '....KKKKKKKK....'];
ROWS.chili = [
  '................', '...KK...........', '..KVVK..........', '..KVVVK.........', '...KVVVKK.......', '...KRRRRRK......',
  '...KRWRRRRK.....', '....KRWRRRRK....', '....KRRRRRRRK...', '.....KRRRRRRRK..', '......KRRRRRRK..', '.......KRRRRRK..',
  '........KRRRRK..', '.........KRRK...', '..........KRK...', '...........K....'];
ROWS.heart = [
  '................', '................', '................', '...KKK...KKK....', '..KRRRK.KRRRK...', '.KRWWRRKRRRRRK..',
  '.KRWRRRRRRRRRK..', '.KRRRRRRRRRRRK..', '.KRRRRRRRRRRDK..', '..KRRRRRRRRDK...', '...KRRRRRRDK....', '....KRRRRDK.....',
  '.....KRRDK......', '......KRK.......', '.......K........', '................'];
ROWS.heart2 = compose(16, 16, [[[
  '..KK..KK..', '.KRRKKRRK.', 'KRWRRRRRRK', 'KRRRRRRRDK', '.KRRRRRDK.', '..KRRRDK..', '...KRDK...', '....KK....'], 3, 6]]);
ROWS.star = [
  '.......KK.......', '......KYYK......', '......KYYK......', '.....KYWYYK.....', 'KKKKKYWYYYYKKKKK', 'KYYYYYYYYYYYYYYK',
  '.KYYYYYYYYYYYYK.', '..KYYYYYYYYYYK..', '...KYYYYYYYYK...', '...KYYYYYYYYK...', '..KYYYYYYYYYYK..', '..KYYYYKKYYYYK..',
  '.KYYYYK..KYYYYK.', '.KYYYK....KYYYK.', 'KYYKK......KKYYK', 'KKK..........KKK'];
PAL.apple = { K: '#3c0c08', R: '#e02818', W: '#fcd0c0', D: '#981008', V: '#48c838' };
PAL.chili0 = { K: '#3c0c08', R: '#e82810', W: '#fcd860', V: '#48c838' };
PAL.chili1 = { ...PAL.chili0, R: '#f86818', W: '#fcfc90' };
PAL.chili2 = { ...PAL.chili0, R: '#f8a020', W: '#fcfcfc' };
PAL.heart = { K: '#3c0c20', R: '#f83878', W: '#fcd0e0', D: '#a8105c' };
PAL.star0 = { K: '#5c3800', Y: '#f8d838', W: '#fcfcfc' };
PAL.star1 = { K: '#5c3800', Y: '#fcfc90', W: '#fcfcfc' };
PAL.star2 = { K: '#5c3800', Y: '#f89820', W: '#fcfc90' };
function itemSprite(it, tick) {
  if (it.type === 'grow') return { id: 'apple', pal: 'apple' };
  if (it.type === 'fire') return { id: 'chili', pal: 'chili' + [0, 1, 2, 1][Math.floor(tick / 4) % 4] };
  if (it.type === 'life') return { id: Math.floor(tick / 12) % 2 ? 'heart2' : 'heart', pal: 'heart' };
  return { id: 'star', pal: 'star' + [0, 1, 0, 2][Math.floor(tick / 3) % 4] };
}
/* END:items */

/* SEC:fx */
/* ---- Efeitos: moeda girando, bola de fogo, pedaco de tijolo e particulas (poeira, brilho, gotas, impacto, estouro) ---- */
ROWS.coin0 = ['..KKKK..', '.KYYYYK.', 'KYWYYYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYYYOK', 'KYYYYYOK', '.KOOOOK.', '..KKKK..'];
ROWS.coin1 = ['..KKKK..', '.KYYYOK.', '.KWYYOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYYOK.', '.KYYYOK.', '..KOOK..', '..KKKK..'];
ROWS.coin2 = ['...KK...', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '...KK...'];
ROWS.coin3 = mirror(recolor(ROWS.coin1, { W: 'O', O: 'W' }));
PAL.coin = { K: '#6c4800', Y: '#f8d838', O: '#d89000', W: '#fcfce0' };
const FB = ['..KKKK..', '.KRROOK.', 'KRROYYOK', 'KROYWWYK', 'KROYWWYK', 'KRROYYOK', '.KRRROK.', '..KKKK..'];
ROWS.fire0 = FB; ROWS.fire1 = rot90(FB); ROWS.fire2 = rot90(ROWS.fire1); ROWS.fire3 = rot90(ROWS.fire2);
PAL.fire = { K: '#781000', R: '#e83010', O: '#f88818', Y: '#fcd848', W: '#fcfcfc' };
const DEB = ['KKKKKK..', 'KBBBBBK.', 'KBLBBBK.', 'KBBBBBBK', 'KKKKBBBK', '...KBBBK', '...KBBK.', '....KK..'];
ROWS.deb0 = DEB; ROWS.deb1 = rot90(DEB); ROWS.deb2 = rot90(ROWS.deb1); ROWS.deb3 = rot90(ROWS.deb2);
PAL.deb = { K: '#000000', B: '#c84c0c', L: '#fcbcb0' };
const coinSprite = t => 'coin' + Math.floor(t / 2) % 4;
const fireSprite = f => 'fire' + (f.vx < 0 ? 3 - Math.floor(f.t / 3) % 4 : Math.floor(f.t / 3) % 4);
const debSprite = d => 'deb' + Math.floor(d.t / 4) % 4;
function pixDisc(c, x, y, r) { for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); c.fillRect(x - w, y + dy, w * 2 + 1, 1); } }
function drawPart(c, q, ox) {
  const x = Math.round(q.x - ox), y = Math.round(q.y), k = q.t / q.life;
  if (q.k === 'dust') { c.fillStyle = k < 0.45 ? '#fcfcfc' : '#d8d0c8'; pixDisc(c, x, y, [1, 2, 2, 2, 1, 1, 0][Math.floor(k * 7)]); }
  else if (q.k === 'spark') { const s = [0, 1, 2, 1, 0][Math.floor(k * 5)]; c.fillStyle = q.col || '#fcfcfc'; c.fillRect(x - s, y, s * 2 + 1, 1); c.fillRect(x, y - s, 1, s * 2 + 1); }
  else if (q.k === 'goo') { const s = k < 0.7 ? 2 : 1; c.fillStyle = q.col; c.fillRect(x, y, s, s); }
  else if (q.k === 'burst') {
    const d = 3 + Math.floor(k * 6); c.fillStyle = '#fcfcfc';
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) c.fillRect(x + sx * d - 1, y + sy * Math.round(d * 0.6), 2, 1);
    c.fillRect(x - 1, y - d - 1, 2, 2);
  }
  else if (q.k === 'ring') {
    const r = 1 + Math.floor(k * 5); c.fillStyle = k < 0.5 ? q.col : '#c8c8c8';
    for (let a = 0; a < 12; a++) c.fillRect(x + Math.round(Math.cos(a * Math.PI / 6) * r), y + Math.round(Math.sin(a * Math.PI / 6) * r), 1, 1);
  }
}
/* END:fx */

const enemySprite = (e, tick, px) => e.type === 'blob' ? blobSprite(e, tick) : pangoSprite(e, tick, px);
/* ART-END */
