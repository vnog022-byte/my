/* ---- Efeitos: moeda girando, bola de fogo, pedaco de tijolo e particulas (poeira, brilho, gotas, impacto, estouro) ---- */
/* moeda 8x14: face, 3/4, perfil, 3/4 do outro lado (3 cores: contorno, ouro, brilho), todas no mesmo eixo 3.5 */
ROWS.coin0 = ['..KKKK..', '.KWYYYK.', 'KWYYYYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KYYYYYYK', '.KYYYYK.', '..KKKK..'];
ROWS.coin1 = ['...KK...', '..KWYK..', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KWYYKK.', '.KYYYKK.', '..KYYK..', '...KK...'];
ROWS.coin2 = ['...KK...', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '...KK...'];
ROWS.coin3 = ['...KK...', '..KWYK..', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKWYYK.', '.KKYYYK.', '..KYYK..', '...KK...'];
PAL.coin = { K: '#503000', Y: '#f8b800', W: '#fce0a8' };
/* bola de fogo 8x8: disco centrado em 3.5,3.5 + lingua de chama na quina (so ela gira) */
const FB = ['......RR', '..RROOR.', '.ROOOOO.', '.ROYYOO.', '.ROYYOO.', '.RROOOR.', '..RRRR..', '........'];
ROWS.fire0 = FB; ROWS.fire1 = rot90(FB); ROWS.fire2 = rot90(ROWS.fire1); ROWS.fire3 = rot90(ROWS.fire2);
PAL.fire = { R: '#d82800', O: '#fca044', Y: '#fce0a8' };
/* explosao da bola de fogo (3 ticks cada): clarao -> estouro com pontas -> 8 tufos -> 8 fiapos */
ROWS.boom0 = ['..R.R..', '.ROROR.', 'ROYYYOR', '.OYYYO.', 'ROYYYOR', '.ROROR.', '..R.R..'];
ROWS.boom1 = [
  '....R.R....', '....ROR....', '.R..ROR..R.', '..RROOORR..', '..ROOYOOR..', 'RROOYYYOORR',
  '..ROOYOOR..', '..RROOORR..', '.R..ROR..R.', '....ROR....', '....R.R....'];
ROWS.boom2 = [
  '.....RRR.....', '.....ROR.....', '..RR.....RR..', '..RO.....OR..', '.............', 'RR.........RR', 'RO.........OR',
  'RR.........RR', '.............', '..RO.....OR..', '..RR.....RR..', '.....ROR.....', '.....RRR.....'];
ROWS.boom3 = [
  '.......R.......', '.R.....R.....R.', '..R....O....R..', '...O.......O...', '...............', '...............', '...............', 'RRO.........ORR', '...............', '...............', '...............', '...O.......O...', '..R....O....R..', '.R.....R.....R.', '.......R.......'];
/* pedaco de tijolo 8x8: lasca com friso claro, junta de argamassa (K) e friso de baixo (L) */
const DEB = ['KKKKKKK.', 'KLLLLLK.', 'KBBBBBBK', 'KKKKBBBK', '.KLLBBBK', '..KBBBBK', '...KKBBK', '.....KK.'];
ROWS.deb0 = DEB; ROWS.deb1 = rot90(DEB); ROWS.deb2 = rot90(ROWS.deb1); ROWS.deb3 = rot90(ROWS.deb2);
PAL.deb = { K: '#000000', B: '#c84c0c', L: '#fcbcb0' };
/* poeira: sopro pequeno -> nuvem cheia -> se parte -> dois fiapos (ancorada pela base) */
ROWS.dust0 = ['.WW.', 'WWWL', '.LL.'];
ROWS.dust1 = ['..WW..', '.WWWWL', 'WWWWWL', 'LWWLLD', '.LLDD.'];
ROWS.dust2 = ['.LL..L.', 'LLLD.LL', 'LLDD.LD', '.DD..D.'];
ROWS.dust3 = ['LL....', '......', '....LL'];
PAL.dust = { W: '#fcfcfc', L: '#bcbcbc', D: '#7c7c7c' };
/* brilho: ponto -> cruz -> estrela de 4 pontas -> cruz -> X pequeno (centro W sempre o mais claro) */
ROWS.spark0 = ['W'];
ROWS.spark1 = ['.C.', 'CWC', '.C.'];
ROWS.spark2 = ['...C...', '...C...', '..CWC..', 'CCWWWCC', '..CWC..', '...C...', '...C...'];
ROWS.spark3 = ['C.C', '.W.', 'C.C'];
/* impacto ao pisar: estrela compacta -> 8 raios continuos -> so as pontas dos raios */
ROWS.pow0 = ['W.W.W', '.WYW.', 'WYYYW', '.WYW.', 'W.W.W'];
ROWS.pow1 = [
  '.....W.....', '.W...W...W.', '..W..W..W..', '...W.W.W...', '....YYY....', 'WWWWYWYWWWW',
  '....YYY....', '...W.W.W...', '..W..W..W..', '.W...W...W.', '.....W.....'];
ROWS.pow2 = [
  '.....Y.....', '.Y...Y...Y.', '..Y.....Y..', '...........', '...........', 'YY.......YY',
  '...........', '...........', '..Y.....Y..', '.Y...Y...Y.', '.....Y.....'];
PAL.pow = { W: '#fcfcfc', Y: '#f8d878' };
/* gota de gosma 2x3: redonda subindo, esticada caindo, splat 3x1 no chao */
ROWS.goo_up = ['HC', 'CD'];
ROWS.goo_fall = ['.C', 'HC', 'CD'];
ROWS.goo_splat = ['CCC'];
ROWS.goo_dot = ['D'];
const coinSprite = t => 'coin' + Math.floor(t / 2) % 4;
const fireSprite = f => 'fire' + (f.vx < 0 ? 3 - Math.floor(f.t / 3) % 4 : Math.floor(f.t / 3) % 4);
/* 4 quadros de 3 ticks: os pedacos nascem com t defasado (0,3,6,9) e os da esquerda sao espelhados (giro inverso) */
const debSprite = d => 'deb' + Math.floor(d.t / 3) % 4;
function pixDisc(c, x, y, r) { for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); c.fillRect(x - w, y + dy, w * 2 + 1, 1); } }
const fxPal = col => {
  const k = 'spk' + (col || '');
  if (!PAL[k]) PAL[k] = !col || col === '#fcfcfc' ? { C: '#fce0a8', W: '#fcfcfc' } : { C: col, W: '#fcfcfc' };
  return k;
};
/* cores da gosma alinhadas ao PAL.blob: gota escura com brilho L; gota clara com contorno de baixo escuro */
const gooPal = col => {
  const k = 'goo' + col; if (PAL[k]) return k;
  const B = (PAL.blob && PAL.blob.B) || '#a048d8', L = (PAL.blob && PAL.blob.L) || '#f8d8f8';
  PAL[k] = col === B || col === '#a048d8' ? { C: col, H: L, D: col } : { C: col, H: col, D: B };
  return k;
};
function fxBlit(c, id, pal, x, y, bottom) {
  const im = spr(id, pal); c.drawImage(im, x - (im.width >> 1), bottom ? y + 1 - im.height : y - (im.height >> 1));
}
function drawGoo(c, q, x, y) {
  /* q.gy = topo do chao gravado pelo jogo; fallback: reconstroi pela fisica (y += vy; vy += g) */
  if (q.gy === undefined) { const g = q.g || 0, t = q.t, vy0 = q.vy - g * t; q.gy = Math.round(q.y - t * vy0 - g * t * (t - 1) / 2) + 3; }
  const gy = Math.round(q.gy), pal = gooPal(q.col);
  if (y >= gy - 1) { fxBlit(c, q.t >= q.life - 3 ? 'goo_dot' : 'goo_splat', pal, x, gy - 1, true); return; }
  fxBlit(c, q.vy > 0.6 ? 'goo_fall' : 'goo_up', pal, x, y, true);
}
function drawPart(c, q, ox) {
  const x = Math.round(q.x - ox), y = Math.round(q.y), k = q.t / q.life;
  if (q.k === 'dust') fxBlit(c, 'dust' + (k < 0.18 ? 0 : k < 0.5 ? 1 : k < 0.8 ? 2 : 3), 'dust', x, y, true);
  else if (q.k === 'spark') fxBlit(c, 'spark' + [0, 1, 2, 2, 1, 3, 3, 0][Math.floor(k * 8)], fxPal(q.col), x, y);
  else if (q.k === 'goo') drawGoo(c, q, x, y);
  else if (q.k === 'burst') fxBlit(c, 'pow' + (k < 0.3 ? 0 : k < 0.75 ? 1 : 2), 'pow', x, y);
  else if (q.k === 'ring') fxBlit(c, 'boom' + Math.min(3, Math.floor(k * 4)), 'fire', x, y);
}
