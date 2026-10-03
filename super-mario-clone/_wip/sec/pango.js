/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas S=pele/brilho. ---- */
PAL.pango = { K: '#3a1a08', A: '#c8701c', S: '#fcc890' };
const PG_BODY = [
  '................',
  '.......KKKKK....',
  '.....KKSSAKAKK..',
  '....KSSAAAKAAAK.',
  '....KSAAAAKAAAAK',
  '....KAAAAAKAAAAK',
  '....KKKKKKKAAAAK',
  '..KKSSSSKSSKKKAK',
  '.KSSSSKSSKAAKASK',
  'KSSSSSKSSKAAKAAK',
  'KKSSSSSSKAAAKAAK',
  '.KKKSSSKKKKAAAAK',
  '...KSSSKSSSKKKAK',
  '..KSSSSKAAAAAASK',
  '.KSKSSSKAAKAAAAK',
  '..KKSSSKKKKAAAAK',
  '...KSSSKSSSKKKAK',
  '....KSSKAAAAAAAK',
  '.....KKKKKKKAAAK',
];
const PG_TAIL = ['KAAK', '.KSK', '.KAK', '..K'];
const PG_LEGS = {
  a: ['....KSSKKAAK....', '...KSSK.KAAK....', '..KSSK..KAAK....', '.KSSSK.KAAAK....', '.KKKKK.KKKKK....'],
  b: ['....KAAKKSSK....', '...KAAK.KSSK....', '.KAAAK.KSSSK....', '.KKKKK.KKKKK....'],
};
ROWS.pango_a = compose(16, 24, [[PG_BODY], [PG_TAIL, 12, 19], [PG_LEGS.a, 0, 19]]);
ROWS.pango_b = compose(16, 24, [[PG_BODY, 0, 1], [PG_TAIL, 12, 20], [PG_LEGS.b, 0, 20]]);
ROWS.pango_c = ROWS.pango_a;

/* bola (casco): placas separadas por linhas, brilho fixo no alto a esquerda; os 4 quadros de giro
   giram so o desenho das placas (rot90) e reaplicam a luz. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAKAAAKK..',
  '..KAAAAAKAAAAK..',
  '.KAAAAAAKAAAAAK.',
  '.KAAAAKKKKAAAKK.',
  'KAKAAKAAAAKAKAAK',
  'KAAKKAAAAAAKAAAK',
  'KAAAKAAAAAAKAAAK',
  'KAAAKAAAAAAKAAAK',
  'KAAAKAAAAAAKAAAK',
  'KAAAAKAAAAKAKAAK',
  '.KAAKAKKKKAAAKK.',
  '.KAKAAAAAAAAAAK.',
  '..KAAAAAAAAAAK..',
  '...KKAAAAAAKK...',
  '.....KKKKKK.....',
];
const PG_LIGHT = [
  '................',
  '.....SSS.S......',
  '...SS...........',
  '..S.............',
  '..S.............',
  '.S....SS........',
  '.S...S..........',
  '.S...S..........',
  '.S..............',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && PG_LIGHT[y][x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
ROWS.ball_peek = compose(16, 16, [[ROWS.ball0], [['.KK', 'KSSK', 'KSKS', '.KSK', '..K'], 0, 6], [['KSK', 'KK'], 3, 14], [['KSK', '.KK'], 10, 14]]);
ROWS.ball_peek2 = compose(16, 16, [[ROWS.ball0], [['.KK', 'KSSK', 'KSKS', '.KSK', '..K'], 0, 7], [['KSK', '.KK'], 2, 14], [['KSK', 'KK'], 11, 14]]);
ROWS.pango_x = recolor(ROWS.pango_a, {});
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_x' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: Math.floor(e.anim / 12) % 2 ? 'pango_b' : 'pango_a', pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150;
  return { id: t > 105 ? (Math.floor(t / 4) % 2 ? 'ball_peek2' : 'ball_peek') : 'ball0', pal: 'pango', flip: px > e.x };
}
