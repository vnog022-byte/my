/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas S=pele/brilho. ---- */
PAL.pango = { K: '#3a1a08', A: '#c8701c', S: '#fcc890' };
const PG_ARMOR = [
  '................',
  '........KKKK....',
  '......KKSSAAKK..',
  '.....KSSAAAAAAK.',
  '....KSAAAKAAAAAK',
  '....KAAAKAKAAAKK',
  '...KAKKKAAAKKKAK',
  '...KAAASSAAAASSK',
  '...KAASAAAAASAAK',
  '...KAAKAAAAAKAAK',
  '...KAKAKAAAKAKAK',
  '...KKAAAKKKAAAKK',
  '....KSAAAASSAAAK',
  '....KAAAASAAAAAK',
  '.....KAAAKAAAAAK',
  '.....KAAKAKAAAKK',
  '.....KKKAAAKKKAK',
  '......KSSAAAASK.',
  '.......KKKKKKK..',
];
const PG_HEAD = ['....KKK.', '..KKSSSK', '.KSSKSSK', 'KSSSKSSK', '.KKKSSSK', '....KSK.'];
const PG_BELLY = ['...KSSK', '..KSSSK', '.KSKSSK', '..KKSSK', '...KSSK', '....KSK', '....KKK'];
const PG_TAIL = ['KAAK', 'KSAK', '.KAK', '.KSK', '.KAK', '..KK'];
const PG_LEGS = {
  a: ['....KSSKKAAK....', '...KSSK.KAAK....', '..KSSK..KAAK....', '.KSSSK.KAAAK....', '.KKKKK.KKKKK....'],
  b: ['....KAAKKSSK....', '...KAAK.KSSK....', '.KAAAK.KSSSK....', '.KKKKK.KKKKK....'],
};
const pgWalk = (legs, dy) => compose(16, 24, [[PG_TAIL, 12, 17 + dy], [PG_ARMOR, 0, dy], [PG_HEAD, 0, 7 + dy], [PG_BELLY, 0, 12 + dy], [legs, 0, 24 - legs.length]]);
ROWS.pango_a = pgWalk(PG_LEGS.a, 0);
ROWS.pango_b = pgWalk(PG_LEGS.b, 1);
ROWS.pango_c = ROWS.pango_a;

/* bola (casco): placas separadas por linhas, brilho fixo no alto a esquerda; os 4 quadros de giro
   giram so o desenho das placas (rot90) e reaplicam a luz. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAAAAKK...',
  '..KAAAAAAAAAAK..',
  '.KAKAAAAKAAAAKK.',
  '.KAAKAAKAKAAKAK.',
  'KAAAAKKAAAKKAAAK',
  'KAAAAASSAAAASSAK',
  'KAAAAKSAAAKSAAAK',
  'KKAAKAKAAKAKAAKK',
  'KAKKAAAKKAAAKKAK',
  'KAAASSAAAASSAAAK',
  '.KAKSAAAKSAAAKK.',
  '.KAAKAAKAKAAKAK.',
  '..KAAKKAAAKKAK..',
  '...KKAAAAAAKK...',
  '.....KKKKKK.....',
];
const PG_LIGHT = ['', '.....SSS', '...SS', '..S', '..S', '.S', '.S', '.S'];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && (PG_LIGHT[y] || '')[x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
const PG_PEEK = ['.KKKK.', 'KSSKSK', 'KSSSSK', '.KKKKK'];
const PG_FEET = ['KSSK', 'KKKK'];
ROWS.ball_peek = compose(16, 16, [[ROWS.ball0], [PG_PEEK, 0, 8], [PG_FEET, 2, 14], [PG_FEET, 10, 14]]);
ROWS.ball_peek2 = compose(16, 16, [[ROWS.ball0], [PG_PEEK, 0, 7], [PG_FEET, 3, 14], [PG_FEET, 9, 14]]);
ROWS.pango_x = compose(16, 24, [[ROWS.pango_a], [['S', 'S'], 4, 9], [['KK'], 3, 10]]);
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_x' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: Math.floor(e.anim / 12) % 2 ? 'pango_b' : 'pango_a', pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150;
  return { id: t > 105 ? (Math.floor(t / 4) % 2 ? 'ball_peek2' : 'ball_peek') : 'ball0', pal: 'pango', flip: px > e.x };
}
