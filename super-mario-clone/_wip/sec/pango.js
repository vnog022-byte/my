/* ---- Pango: pangolim de armadura (16x24 andando, olha para a esquerda; vira bola 16x16 quando pisado).
   Paleta NES de 3 cores: K=contorno A=escamas (caqui-oliva) S=pele/brilho. ---- */
PAL.pango = { K: '#181008', A: '#8c7838', S: '#f8dca0' };

/* armadura: corpo baixo e comprido (tatu/pangolim), alongado para tras por cima da cauda, preenchido com
   escamas em U fechadas (K nas laterais + arco embaixo), fileiras deslocadas meia escama, 1px de folga do
   contorno e brilho de 2px so nas escamas de cima/esquerda. O quadro continua 16x24 (a hitbox do pango tem
   24px e o sprite e desenhado a partir do topo dela), com o bicho na parte de baixo. */
const PG_DOME = [
  '................', '................', '................', '................', '................',
  '................', '................', '................',
  '........#####...',
  '......#########.',
  '.....##########.',
  '....############',
  '...#############',
  '...#############',
  '...#############',
  '...#############',
  '....############',
  '.....##########.',
  '.......######...',
];
const PG_TILE = ['ASSA', 'KAAK', 'KAAK', 'AKKA'];
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
const PG_ARMOR = pgScaled(PG_DOME, PG_TILE, 0, (x, y) => x + y < 22);
/* cauda: sai de baixo da traseira da armadura, 3px de miolo, desce em diagonal ate o chao */
const PG_TAIL = [
  'KKKKKK',
  'KAAASK',
  '.KAAAK',
  '.KKKAK',
  '.KSAAK',
  '..KAAK',
  '...KKK',
];
/* cabeca baixa na frente: focinho conico (1->2->3px) com nariz K, olho de 2px sob a palpebra de escamas */
const PG_HEAD = ['....KKKK', '...KAAAK', '.KKSSKSA', 'KSSSSKSA', '.KSSSSSA', '..KKKKK.'];
const PG_BELLY = ['.KSSSK', '..KKKK'];
/* pernas: interior A com contorno K. A da frente tem garras S; a de tras tem garras e sola escuras (sombra).
   Linhas: 0 = coxa (com linha K na juncao com a armadura), 1 = canela, 2..4 = pe. xs = coluna de cada linha. */
const pgLegRows = (front, hip, shin, foot, lift) => {
  const g = Array.from({ length: 5 }, () => Array(16).fill('.'));
  const put = (y, x, t) => [...t].forEach((ch, i) => { if (ch !== '.' && x + i >= 0 && x + i < 16 && y >= 0) g[y][x + i] = ch; });
  const c = front ? 'S' : 'K';
  const footRows = ['.KAAK', c + 'KAAK', c + 'KKKK'];   // garra de 2px
  put(0, hip, 'KAAK');
  if (lift) footRows.forEach((r, i) => put(1 + i, foot, r));
  else { put(1, shin, 'KAAK'); footRows.forEach((r, i) => put(2 + i, foot, r)); }
  return g.map(r => r.join(''));
};
/* ciclo de 4 quadros de 7 ticks (3,5px a 0,5px/tick): o pe de apoio vai de 0 (frente) a 4 (passagem) e 7 (tras).
   contato: tesoura com os pes bem afastados (ceu entre eles); passagem: pernas juntas, corpo +1px. */
const pgWalk = (body, head, back, front) => compose(16, 24, [[PG_TAIL, 10, 16 + body], [PG_ARMOR, 0, body],
  [PG_HEAD, 0, 13 + head], [PG_BELLY, 4, 17 + body], [back, 0, 19], [front, 0, 19]]);
const L = pgLegRows;
ROWS.pango_a = pgWalk(0, 0, L(false, 6, 7, 7), L(true, 3, 1, 0));               // contato: frente adiante
ROWS.pango_c = pgWalk(-1, -1, L(false, 6, 0, 6, true), L(true, 4, 4, 4));        // passagem: frente apoiada
ROWS.pango_b = pgWalk(0, 0, L(true, 6, 7, 7), L(false, 3, 1, 0));                // contato: tras adiante
ROWS.pango_d = pgWalk(-1, -1, L(true, 6, 0, 6, true), L(false, 4, 4, 4));        // passagem: tras apoiada
const PG_WALK = ['pango_a', 'pango_c', 'pango_b', 'pango_d'];

/* derrubado (de pe aqui; o jogo vira de ponta-cabeca): olho em X 3x3 cercado de S, boca aberta,
   barriga grande; uma pata dobrada junto a barriga e a outra esticada (assimetricas), garras S */
ROWS.pango_x = compose(16, 24, [[PG_TAIL, 10, 16], [PG_ARMOR],
  [['....KKKK', '..KKSSSK', '.KSKSKSK', 'KSSSKSSK', 'KKSKSKSK', '.KKSSSSK', '..KKKKK.'], 0, 12],
  [['..KSSSSK', '.KSSSSSK', '..KKKKK.'], 3, 17],
  [['.KKKK.', 'SKAAAK', '.KAAAK', 'SKKKK.'], 1, 19],
  [['KAAK....', '.KAAK...', '..KAAK..', '...KAAK.', '....KAAK', '....SKKS'], 8, 18]]);

/* bola: pangolim enrolado. Metade de cima com 2 fileiras de escamas em U fechadas (o mesmo motivo da
   armadura, 1px de folga do contorno); a cauda envolve meia volta por baixo como uma faixa de borda clara,
   com a ponta S e tampa K. Isso quebra a simetria e mostra o giro: rot90 = sentido horario = rolar para a
   direita. O brilho fixo do alto a esquerda e reaplicado em cada quadro. */
const PG_BALL = [
  '.....KKKKKK.....',
  '...KKAAAAAAKK...',
  '..KAAAAAAAAAAK..',
  '.KAKAAAKAAAKAAK.',
  '.KAKAAAKAAAKAAK.',
  'KAAAKKKAKKKAKAAK',
  'KAAAAKAAAKAAAKAK',
  'KAAAAKAAAKAAAKAK',
  'KKKKAAKKKAKKKKKK',
  'KSSKAAAAAAAAKASK',
  'KSAKAAAAAAAAKASK',
  '.KSAKAAAAAAKASK.',
  '.KSKAKKKKKKAKSK.',
  '..KSAAAAKAAASK..',
  '...KKSSSSSSKK...',
  '.....KKKKKK.....',
];
const PG_LIGHT = ['', '.....SSS', '...SSS', '..S', '..S', '.S'];
const pgLit = rows => rows.map((r, y) => r.replace(/./g, (ch, x) => ch === 'A' && (PG_LIGHT[y] || '')[x] === 'S' ? 'S' : ch));
let pgB = PG_BALL;
for (let i = 0; i < 4; i++) { ROWS['ball' + i] = pgLit(pgB); pgB = rot90(pgB); }
/* acordando: ball0 intacta; a cabeca (focinho 1->2->3px, nariz K, olho de 2px sob a palpebra) sai DE FATO
   para fora do contorno a esquerda (linhas 8-12) e uma pata com garra S sai do lado de tras, com ceu entre
   bola, focinho e pata. Quadros de 20px: ball_peek tem a bola na coluna 3, ball_peek2 na coluna 4 (tremor).
   Virado (cabeca a direita) o espelho poe a bola de ball_peek2 na coluna 0, a mesma de ball0. Sem virar,
   a bola fica 3px a direita no quadro: pangoSprite devolve ox: 3, que o drawEnemy subtrai. */
const PG_PEEK = ['...KKKK', '..KAAAK', '.KSSKSK', 'KSSSKSK', '.KKKKKK'];
const PG_PAW = ['.KKK', 'KAAK', 'KKKS'];
const pgPeek = dx => compose(20, 16, [[ROWS.ball0, dx], [PG_PEEK, dx - 3, 8], [PG_PAW, dx + 12, 13]]);
ROWS.ball_peek = pgPeek(3);
ROWS.ball_peek2 = pgPeek(4);
function pangoSprite(e, tick, px) {
  if (e.state === 'dead') return { id: e.shell ? 'ball0' : 'pango_x', pal: 'pango', flip: e.dir > 0, vflip: true };
  if (e.state === 'walk') return { id: PG_WALK[Math.floor(e.anim / 7) % 4], pal: 'pango', flip: e.dir > 0 };
  if (e.state === 'shellmove') return { id: 'ball' + (((Math.floor(e.roll / 6) % 4) + 4) % 4), pal: 'pango' };
  const t = e.shellT % 150, flip = px > e.x;
  if (t <= 105) return { id: 'ball0', pal: 'pango', flip };
  const shake = Math.floor(t / 3) % 2 === 1;                 // virado, ball_peek2 e o quadro "parado"
  return { id: shake !== flip ? 'ball_peek2' : 'ball_peek', pal: 'pango', flip, ox: flip ? 0 : 3 };
}
