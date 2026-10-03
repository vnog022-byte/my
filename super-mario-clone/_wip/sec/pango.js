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
const PG_TILE = ['AASA', 'AAAA', 'KAAA', 'AKKK'];
const pgScaled = (mask, tile, y0) => {
  const th = tile.length, at = (x, y) => (mask[y] || '')[x] === '#';
  return mask.map((r, y) => [...r].map((c, x) => {
    if (!at(x, y)) return '.';
    if (!(at(x - 1, y) && at(x + 1, y) && at(x, y - 1) && at(x, y + 1))) return 'K';
    const band = Math.floor((y + y0) / th);
    return tile[(y + y0) % th][(x + band * 2) % 4];
  }).join(''));
};
const PG_ARMOR = pgScaled(PG_DOME, PG_TILE, 1);
/* cauda: base larga sob a armadura afinando em diagonal ate a borda direita, ponta no chao, 2 escamas */
const PG_TAIL = [
  'KKKKK...',
  'KAASAK..',
  '.KAAAAK.',
  '..KKKAK.',
  '...KSAAK',
  '....KAAK',
  '.....KKK',
  '......KK',
];
/* cabeca baixa: focinho conico (1->2->3px) com nariz K de 2px, queixo subindo em diagonal,
   olho de 2px na vertical sob a palpebra pesada (as escamas do bone) */
const PG_HEAD = ['.....KKKK.', '...KKAAAAK', '.KKSSAAAAK', 'KSSSSSKSSK', 'KKSSSSKSSK', '..KKSSSSK.', '....KKKK..'];
const PG_BELLY = ['.KSSK', 'KSSSK', '.KKK.'];
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
   perna da frente sempre S, perna de tras sempre A. A cabeca balanca em fase oposta ao corpo. */
const pgWalk = (body, head, legs) => compose(16, 24, [[PG_TAIL, 8, 15 + body], [PG_ARMOR, 0, body],
  [PG_BELLY, 5, 16 + body], [PG_HEAD, 0, 11 + head], ...legs.map(l => [l, 0, 18])]);
ROWS.pango_a = pgWalk(0, -1, [pgLeg('A', 5, 7), pgLeg('S', 1, 5)]);          // contato: frente S adiante
ROWS.pango_c = pgWalk(-1, 0, [pgLift('A', 4, 6), pgLeg('S', 3, 5)]);            // passagem: S apoiada, A passando
ROWS.pango_b = pgWalk(0, -1, [pgLeg('A', 1, 5), pgLeg('S', 5, 7)]);          // contato: tras A adiante
ROWS.pango_d = pgWalk(-1, 0, [pgLeg('A', 3, 5), pgLift('S', 4, 6)]);            // passagem: A apoiada, S passando
const PG_WALK = ['pango_a', 'pango_c', 'pango_b', 'pango_d'];

/* derrubado (de pe aqui; o jogo vira de ponta-cabeca): olho em X 3x3 cercado de S, boca aberta,
   barriga grande e patas afastadas e dobradas */
ROWS.pango_x = compose(16, 24, [[PG_TAIL, 8, 15], [PG_ARMOR],
  [['..KSSSK', '.KSSSSSK', '.KSSSSSK', '..KKKKK'], 3, 16],
  [['.....KKKK..', '...KKSSSSK.', '..KSKSKSSK.', 'KKSSKSSSSK.', 'KSSKSKSSK..', '.KKKKSSK...', '..KSSSK....', '...KKK.....'], 0, 10],
  [['KSSK.....', '.KSSK....', '..KSSK...'].reverse().map(r => r.padStart(9, '.')), 0, 19],
  [['SKSSK', '.KSSK', 'SKKK.'], 0, 21],
  [['KAAK', '.KAAK', '..KAAK', '...KAKS', '...KKK.', '....S..'], 9, 18]]);

/* bola: pangolim enrolado. Contorno limpo, 1px de folga, anel externo de 4 escamas em U e anel interno
   de 4 escamas deslocadas meia escama, nucleo com brilho. A ponta da cauda (S contra K, na borda) da a volta
   nos 4 quadros (rot90 = sentido horario = rolar para a direita); a luz do alto a esquerda e reaplicada. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAAAAKK...',
  '..KAAKKAAKKAAK..',
  '.KAKKSAKKASKKAK.',
  '.KAKAAKKKKAAKAK.',
  'KAKSAKAKKAKASKAK',
  'KAKAKAAAAAAKAKAK',
  'KAAKKKAASAAKKAAK',
  'KAAKKAAAAAKKKAAK',
  'KKKAKAAAAAAKAKAK',
  'KSKSAKAKKAKASKAK',
  '.KSKAAKKKKAAKAK.',
  '.KSKKSAKKASKKAK.',
  '..KSAKKAAKKAAK..',
  '...KKAAAAAAKK...',
  '.....KKKKKK.....',
];
const PG_LIGHT = ['', '.....SSS', '...SS', '..S', '..S'];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && (PG_LIGHT[y] || '')[x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
/* acordando: focinho espiando sob meia palpebra e 2 pezinhos com garra; a bola inteira treme 1px
   (quadros de 17px de largura para deslocar a bola com o contorno intacto) */
const PG_PEEK = ['...KKK', '.KKAAK', 'KSSKSK', 'KKSKSK', '..KKKK'];
const PG_PAW = ['.KKK', 'SKKK'];
const pgPeek = dx => compose(17, 16, [[ROWS.ball0, dx], [PG_PEEK, dx, 7], [PG_PAW, dx + 2, 14], [PG_PAW, dx + 10, 14]]);
ROWS.ball_peek = pgPeek(0);
ROWS.ball_peek2 = pgPeek(1);
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.h === 24 ? 'pango_x' : 'ball0', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: PG_WALK[Math.floor(e.anim / 4) % 4], pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150;
  return { id: t > 105 ? (Math.floor(t / 3) % 2 ? 'ball_peek2' : 'ball_peek') : 'ball0', pal: 'pango', flip: px > e.x };
}
