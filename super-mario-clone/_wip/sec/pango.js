/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas S=pele/brilho. ---- */
PAL.pango = { K: '#181008', A: '#a48c58', S: '#f4dca0' };
/* armadura: 3 fileiras de escamas em U, cada fileira deslocada meia escama; brilho so no topo de cada escama */
const PG_ARMOR = [
  '......KKKKK.....',
  '....KKSSSAAKK...',
  '...KSSAAAAAAAK..',
  '...KSAAAAAAAAK..',
  '...KAAAAKAAAAK..',
  '...KKAAKAKAAKK..',
  '...KAKKAAAKKAK..',
  '...KSAASSAAASK..',
  '...KAAKAAAAKAK..',
  '...KAKAKAAKAKK..',
  '...KKAAAKKAAAK..',
  '...KSSAAASSAAK..',
  '...KAAAAKAAAAK..',
  '...KKAAKAKAAKK..',
  '....KKKAAAKKAK..',
  '.....KAASAAAK...',
  '......KKKKKK....',
];
/* cabeca: bone de escamas (palpebra pesada), olho 2px, focinho comprido com nariz escuro, queixo em K */
const PG_HEAD = ['....KKKK', '...KAAAK', '..KSKKSK', '.KSSSKSK', 'KKSSSSSK', 'KKKKSSK.', '...KKK..'];
const PG_BELLY = ['..KSSSK', '.KSSSSK', '..KSSSK', '...KKK.'];
const PG_TAIL = ['..KK.', '.KSAK', 'KKAAK', 'KSAAK', '.KKAK', '.KSAK', '..KAK', '..KAK', '...KK'];
/* pernas: cada perna tem cor fixa (frente=S, tras=A); so a posicao alterna */
const PG_NEAR = { up: ['.KSSK', 'KSSK.', 'KSSSK', 'KSSSSK', 'SKSKKK'], short: ['KSSK.', 'KSSSK', 'KSSSSK', 'SKSKKK'] };
const PG_FAR = { up: ['.KAAK', 'KAAK.', 'KAAAK', 'KAAAAK', 'SKSKKK'], short: ['KAAK.', 'KAAAK', 'KAAAAK', 'SKSKKK'] };
const pgWalk = (body, head, legs) => compose(16, 24, [[PG_ARMOR, 0, 1 + body], [PG_TAIL, 11, 14 + body], [PG_BELLY, 0, 15 + body], [PG_HEAD, 0, 8 + head], ...legs]);
/* A: perna da frente (clara) adiante, de tras (escura) atras. B: inverte, corpo desce 1 e a cabeca 2 */
ROWS.pango_a = pgWalk(0, 0, [[PG_FAR.up, 6, 19], [PG_NEAR.up, 0, 19]]);
ROWS.pango_b = pgWalk(1, 2, [[PG_FAR.short, 0, 20], [PG_NEAR.short, 6, 20]]);
ROWS.pango_c = ROWS.pango_a;
/* derrubado (desenhado de pe; o jogo vira de ponta-cabeca): olho em X, barriga grande, patas esticadas */
ROWS.pango_x = compose(16, 24, [[PG_ARMOR, 0, 1], [PG_TAIL, 11, 14],
  [['....KKKK', '...KAAAK', '..KKSKSK', '.KSSKSSK', 'KKSKSKSK', 'KKKKSSK.', '..KSSSSK'], 0, 8],
  [['.KSSSSSK', 'KSSSSSSK', 'KSSSSSK.', '.KKKKK..'], 0, 14],
  [['.KAK', '.KAK', '.KAK', 'KAAK', 'SKSK'], 8, 18], [['.KSK', '.KSK', '.KSK', 'KSSK', 'SKSK'], 2, 18]]);

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
