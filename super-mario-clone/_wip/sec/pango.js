/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas (caqui-oliva) S=pele/brilho. ---- */
PAL.pango = { K: '#181008', A: '#8c7838', S: '#f8dca0' };

/* armadura: mascara de corcunda inclinada (frente em diagonal descendo ate a cabeca baixa) preenchida
   com escamas iguais em U: 4px de largura, arco K embaixo, 1px S no topo, fileiras deslocadas meia escama. */
const PG_DOME = [
  '................',
  '................',
  '.........####...',
  '.......#######..',
  '......#########.',
  '.....##########.',
  '....###########.',
  '...############.',
  '..#############.',
  '..#############.',
  '..#############.',
  '..#############.',
  '...############.',
  '...############.',
  '....###########.',
  '.....#########..',
  '......#######...',
];
const PG_TILE = ['ASSA', 'AAAA', 'KAAK', 'AKKA'];
const pgScaled = (mask, tile, y0, lit) => {
  const th = tile.length, at = (x, y) => (mask[y] || '')[x] === '#';
  const inner = (x, y) => at(x - 1, y) && at(x + 1, y) && at(x, y - 1) && at(x, y + 1);
  return mask.map((r, y) => [...r].map((c, x) => {
    if (!at(x, y)) return '.';
    if (!inner(x, y)) return 'K';
    const band = Math.floor((y + y0) / th);
    let ch = tile[(y + y0) % th][(x + band * 2) % 4];
    if (ch === 'K' && [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([a, b]) => !inner(x + a, y + b))) ch = 'A';   // 1px de folga
    if (ch === 'S' && !lit(x, y)) ch = 'A';                                                               // brilho so no alto/esquerda
    return ch;
  }).join(''));
};
const PG_ARMOR = pgScaled(PG_DOME, PG_TILE, 1, (x, y) => x + y < 17);
/* cauda: base larga sob a armadura afinando em diagonal ate a borda direita, ponta no chao, 2 escamas */
const PG_TAIL = [
  'KKKKKK..',
  'KAASAAK.',
  '.KAAAAAK',
  '..KKKAAK',
  '...KSAAK',
  '...KAAAK',
  '....KAAK',
  '....KSAK',
  '.....KKK',
];
/* cabeca baixa: focinho conico (1->2->3px) com nariz K de 2px, queixo subindo em diagonal,
   olho de 2px na vertical sob a palpebra pesada (as escamas do bone) */
const PG_HEAD = ['....KKKK', '...KAAAK', '.KKSSKSK', 'KSSSSKSK', '.KSSSSSK', '..KKKKK.'];
const PG_BELLY = ['..KSSK', '.KSSSK', '..KKKK'];
/* pe: sola K chapada e 2 garras S de 1px para a frente, separadas */
const pgFoot = c => ['SK' + c + c + 'K', 'K' + c + c + c + 'K', 'SKKKK'];
const pgLeg = (c, foot, top) => {               // perna = coxa (linha de cima) + canela + pe; foot = coluna da garra
  const rows = Array.from({ length: 6 }, () => '.'.repeat(16).split(''));
  const put = (y, x, s) => [...s].forEach((ch, i) => { if (ch !== '.' && x + i >= 0 && x + i < 16) rows[y][x + i] = ch; });
  put(0, top, 'K' + c + c + 'K');
  put(1, Math.round((top + foot + 1) / 2), 'K' + c + c + 'K');
  put(2, foot + 1, 'K' + c + c + 'K');
  pgFoot(c).forEach((r, i) => put(3 + i, foot, r));
  return rows.map(r => r.join(''));
};
const pgLift = (c, foot, top) => { const l = pgLeg(c, foot, top); return [l[0], l[3], l[4], l[5], '.'.repeat(16), '.'.repeat(16)]; };  // pe erguido 2px
/* ciclo de 4 quadros, 4 ticks cada (2px a 0,5px/tick): o pe de apoio recua 2px por quadro (1 -> 3 -> 5).
   contato: pernas em tesoura (frente estendida, tras empurrando); passagem: pernas juntas, corpo +1px.
   perna da frente sempre A, perna de tras sempre escura (K); garras S. A cabeca balanca em fase oposta ao corpo. */
const pgWalk = (body, head, legs) => compose(16, 24, [[PG_TAIL, 8, 15 + body], [PG_ARMOR, 0, body],
  [PG_HEAD, 0, 12 + head], [PG_BELLY, 5, 15 + body], ...legs.map(l => [l, 0, 18])]);
ROWS.pango_a = pgWalk(0, -1, [pgLeg('K', 5, 6), pgLeg('A', 1, 5)]);          // contato: perna da frente (A) adiante
ROWS.pango_c = pgWalk(-1, 0, [pgLift('K', 6, 6), pgLeg('A', 3, 5)]);         // passagem: A apoiada, escura passando
ROWS.pango_b = pgWalk(0, -1, [pgLeg('K', 1, 5), pgLeg('A', 5, 6)]);          // contato: perna de tras (escura) adiante
ROWS.pango_d = pgWalk(-1, 0, [pgLeg('K', 3, 5), pgLift('A', 6, 6)]);         // passagem: escura apoiada, A passando
const PG_WALK = ['pango_a', 'pango_c', 'pango_b', 'pango_d'];

/* derrubado (de pe aqui; o jogo vira de ponta-cabeca): olho em X 3x3 cercado de S, boca aberta,
   barriga grande e patas afastadas e dobradas */
ROWS.pango_x = compose(16, 24, [[PG_TAIL, 8, 15], [PG_ARMOR],
  [['..KSSSSK', '.KSSSSSK', '.KSSSSSK', '..KKKKK.'], 3, 16],
  [['....KKKKK.', '..KKSSSSSK', '.KSSKSKSSK', 'KSSSSKSSSK', 'KSSSKSKSSK', '.KKKKSSSSK', '.KSSSKKKK.', '..KKK.....'], 0, 9],
  [['...KSSK', '..KSSK.', '.KSSK..', 'SKKK...', '.S.....'], 2, 19],
  [['KAAK...', '.KAAK..', '..KAAK.', '...KKKS', '.....S.'], 9, 19]]);

/* bola: pangolim enrolado. Metade de cima com fileiras de escamas em U (o mesmo motivo da armadura,
   1px de folga do contorno); a cauda escamada envolve meia volta por baixo como uma faixa, com a ponta
   clara (S contra K) na borda. Isso quebra a simetria e mostra o giro: rot90 = sentido horario = rolar
   para a direita. O brilho fixo do alto a esquerda e reaplicado em cada quadro. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAAAAKK...',
  '..KAAAAAAAAAAK..',
  '.KAKKAAKKAAKKAK.',
  '.KAAAKKAAKKAAAK.',
  'KAAAAAAAAAAAAAAK',
  'KAAAAKKAAKKAAAAK',
  'KAKKKAAKKAAKKAAK',
  'KSSKAAAAAAAAKAAK',
  'KAAKAAAKKAAAKAAK',
  'KKAKAKKAAKKAKAAK',
  '.KAAKAAAAAAKAKK.',
  '.KAKAKKKKKKAAAK.',
  '..KAAAAAKAAAAK..',
  '...KKAAAAAAKK...',
  '.....KKKKKK.....',
];
const PG_LIGHT = ['', '.....SSS', '...SSS', '..S', '..S', '.S'];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && (PG_LIGHT[y] || '')[x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
/* acordando: a cabeca sai por uma fresta na borda de baixo/esquerda, com o focinho (1->2->3px) e o nariz
   fora do contorno e o olho meio fechado na borda; uma pata com garras fora do circulo, do outro lado.
   A bola treme 1px: quadros de 17px; ball_peek tem a bola na coluna 0 e ball_peek2 na coluna 1, e
   pangoSprite troca os dois quando o sprite vira, para a bola parada ficar sempre na coluna de ball0. */
const PG_PEEK = ['...KKKK', '..KKAAK', '.KSSKSK', 'KSSSKSK', '.KKSSSK', '...KKK.'];
const PG_PAW = ['..KK', '.KAAK', 'KKKKS'];
const pgPeek = dx => compose(17, 16, [[ROWS.ball0, dx], [PG_PEEK, dx, 10], [PG_PAW, dx + 12, 13]]);
ROWS.ball_peek = pgPeek(0);
ROWS.ball_peek2 = pgPeek(1);
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_x' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: PG_WALK[Math.floor(e.anim / 4) % 4], pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150, flip = px > e.x;
  if (t <= 105) return { id: 'ball0', pal: 'pango', flip };
  const shake = Math.floor(t / 3) % 2 === 1;                 // virado, ball_peek2 e o quadro "parado"
  return { id: shake !== flip ? 'ball_peek2' : 'ball_peek', pal: 'pango', flip };
}
