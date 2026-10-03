/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas S=pele/brilho. ---- */
PAL.pango = { K: '#181008', A: '#8c7838', S: '#f8dca0' };
/* andando: desenhados inteiros. Armadura com 3 fileiras de escamas em U (meia escama de deslocamento),
   cabeca com bone de escamas (palpebra pesada), olho 2px, focinho com nariz escuro, queixo em K,
   barriga curta, cauda escamada atras e patas grossas com garras. Perna da frente sempre clara (S),
   perna de tras sempre escura (A); so a posicao alterna. */
ROWS.pango_a = [
  '................',
  '......KKKKK.....',
  '....KKSSSAAKK...',
  '...KSSAAAAAAAK..',
  '...KSAAAAAAAAK..',
  '...KAAAAKAAAAK..',
  '...KKAAKAKAAKK..',
  '...KKKKAAAKKAK..',
  '..KAAAKSSAAASK..',
  '.KSSKSKAAAAKAK..',
  '.KSSKSKAAAKAKKK.',
  'KKSSSSKKKKAAKSAK',
  'KKKKSSKSSAAAKAAK',
  '...KKKAAAAKAKKAK',
  '..KSSSKAAKAKKSAK',
  '.KSSSSKKKAAAKAAK',
  '..KSSSKAASAAKKAK',
  '...KKKKKKKKKKSAK',
  '....KSSKKAAK.KAK',
  '...KSSK.KAAK.KAK',
  '..KSSSK.KAAK..KK',
  '.KSSSSK.KAAAK...',
  '.KSSSSK.KAAAAK..',
  '.SKSKKK.SKSKKK..',
];
ROWS.pango_b = ROWS.pango_a;
ROWS.pango_c = ROWS.pango_a;
/* derrubado (desenhado de pe; o jogo vira de ponta-cabeca): olho em X, barriga grande, patas esticadas */
ROWS.pango_x = ROWS.pango_a;

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
