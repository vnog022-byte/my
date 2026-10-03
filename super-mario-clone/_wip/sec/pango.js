/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas S=pele/brilho. ---- */
PAL.pango = { K: '#181008', A: '#8c7838', S: '#f8dca0' };
/* andando: armadura com 3 fileiras de escamas em U (fileiras deslocadas meia escama, K embaixo e
   brilho S no alto de cada escama, luz geral no alto a esquerda); por cima vao cabeca, barriga, cauda e
   patas. Perna da frente sempre clara (S), perna de tras sempre escura (A): so a posicao alterna. */
const PG_ARMOR = [
  '................',
  '................',
  '........KKKK....',
  '......KKSSAAKK..',
  '.....KSSAAAAAAK.',
  '....KSAAAAKAAAK.',
  '...KAKAAAKAKAAK.',
  '...KAAKKKAAAKKK.',
  '...KSAAASSAAAAK.',
  '...KAAAKSAAAAKK.',
  '...KAAKAKAAAKAK.',
  '...KKKAAAKKKAAK.',
  '...KASSAAAASSAK.',
  '...KKAAAAAKAAAK.',
  '...KAKAAAKAKAAK.',
  '....KAKKKAAAKKK.',
  '.....KSAAAAAAK..',
  '......KKAAAAK...',
  '........KKKK....',
];
/* cabeca baixa na frente do corcunda: bone de escamas que cai como palpebra pesada sobre o olho de 2px,
   focinho comprido para a frente/baixo com nariz escuro 2x2, queixo em K */
const PG_HEAD = ['....KKKK.', '...KAAAAK', '..KAAKAAK', '.KSSSKSSK', 'KKSSSSSSK', 'KKSSSSSK.', '.KKKKKK..'];
const PG_BELLY = ['..KSSK', '..KSSSK', '...KSSK'];
const PG_TAIL = ['...KK', '..KSK', '.KKAK', '.KSAK', '.KAAK', '.KKAK', '..KAK', '..KKK'];
const PG_FRONT = ['..KSSSK', '.KSSSK', '.KSSSK', 'KSSSSK', 'SKSKKK'];
const PG_BACK = ['.KAAAK', '.KAAAK', '.KAAAK', 'KAAAAK', 'SKSKKK'];
const pgWalk = (body, head, back, front) => compose(16, 24, [[PG_TAIL, 11, 15 + body], [PG_ARMOR, 0, body],
  [PG_BELLY, 0, 16 + body], [PG_HEAD, 0, 9 + head], back, front]);
/* A: pata clara adiante e escura atras; B: invertem, corpo desce 1px e a cabeca 2px (balanco defasado) */
ROWS.pango_a = pgWalk(0, 0, [PG_BACK, 6, 19], [PG_FRONT, 0, 19]);
ROWS.pango_b = pgWalk(1, 2, [PG_BACK.slice(1), 0, 20], [PG_FRONT.slice(1), 6, 20]);
ROWS.pango_c = ROWS.pango_a;
/* derrubado (de pe aqui; o jogo vira de ponta-cabeca): olho em X, boca aberta, barriga grande, patas duras */
ROWS.pango_x = compose(16, 24, [[PG_ARMOR], [PG_TAIL, 10, 11],
  [['..KSSSSK', '.KSSSSSK', 'KSSSSSSK', 'KSSSSSK.', '.KSSSK..', '..KKK...'], 0, 13],
  [['....KKKK.', '...KSSSSK', '..KSKSKSK', '.KSSSKSSK', 'KKSSKSKSK', 'KKKKSSSK.', '..KSKKK..'], 0, 7],
  [['.KAAK', '.KAAK', '.KAAK', '.KAAK', 'SKSKS'], 8, 19], [['.KSSK', '.KSSK', '.KSSK', '.KSSK', 'SKSKS'], 2, 19]]);

/* bola: pangolim enrolado. Contorno limpo, faixa externa de escamas (marcas a 1px da borda), anel interno
   e a ponta clara da cauda como marca assimetrica que da a volta nos 4 quadros (rot90 = sentido horario,
   o jogo avanca o quadro quando rola para a direita). A luz e reaplicada fixa no alto a esquerda. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAAAAKK...',
  '..KAAAAKAAAAAK..',
  '.KAAKAAKAAAKAAK.',
  '.KAAAKKKKKKAAAK.',
  'KAAAKAAAAAAKAAAK',
  'KAKKAAAAAAAAKKAK',
  'KAAKAAKKKKAAKAAK',
  'KAAKAKSSSAKAKAAK',
  'KAAKAKSKKAKAKAAK',
  'KKSKKAAAAAAKKAAK',
  'KSSSKKAAAAKKKAAK',
  '.KSKAAKKKKAAAKK.',
  '.KKAAKAAAAKAAAK.',
  '..KKKAAAAAAAKK..',
  '...KKKKKKKKKK...',
];
const PG_LIGHT = ['', '.....SSS', '...SS', '..S', '.S', '.S'];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && (PG_LIGHT[y] || '')[x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
/* acordando: focinho espiando sob meia palpebra, garras para fora, e a bola tremendo 1px */
const PG_PEEK = ['..KKKK', '.KKKKA', 'KSSKSA', 'KKSSSK', '.KKKK.'];
const PG_CLAW = ['KSK', 'SKS'];
const pgShift = rows => rows.map(r => '.' + r.slice(0, 15)).map((r, y) => y >= 5 && y <= 10 ? r.slice(0, 15) + 'K' : r);
ROWS.ball_peek = compose(16, 16, [[ROWS.ball0], [PG_PEEK, 0, 7], [PG_CLAW, 3, 14], [PG_CLAW, 10, 14]]);
ROWS.ball_peek2 = compose(16, 16, [[pgShift(ROWS.ball0)], [PG_PEEK, 0, 8], [PG_CLAW, 4, 14], [PG_CLAW, 11, 14]]);
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_x' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: Math.floor(e.anim / 8) % 2 ? 'pango_b' : 'pango_a', pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150;
  return { id: t > 105 ? (Math.floor(t / 3) % 2 ? 'ball_peek2' : 'ball_peek') : 'ball0', pal: 'pango', flip: px > e.x };
}
