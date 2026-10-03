/* ---- Efeitos: moeda girando, bola de fogo, pedaco de tijolo e particulas (poeira, brilho, gotas, impacto, estouro) ---- */
/* moeda 8x14: face, 3/4, perfil, 3/4 do outro lado (3 cores: contorno, ouro, brilho) */
ROWS.coin0 = ['..KKKK..', '.KWYYYK.', 'KWYYYYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KWYWKYYK', 'KYYYYYYK', '.KYYYYK.', '..KKKK..'];
ROWS.coin1 = ['..KKK...', '.KWYYK..', '.KWYYYK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KWYWKK.', '.KYYYYK.', '..KYYK..', '...KK...'];
ROWS.coin2 = ['...KK...', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '..KWYK..', '...KK...'];
ROWS.coin3 = mirror(recolor(ROWS.coin1, { W: 'Y', Y: 'W' }));
PAL.coin = { K: '#6c4000', Y: '#f8b818', W: '#fcf0a0' };
/* bola de fogo 8x8: nucleo claro com uma lingua de chama que gira (4 quadros por rotacao) */
const FB = ['.....RR.', '..RRROYR', '.ROOOOOR', '.ROYYYOR', '.ROYYYOR', '.ROOYOOR', '..ROOOR.', '...RRR..'];
ROWS.fire0 = FB; ROWS.fire1 = rot90(FB); ROWS.fire2 = rot90(ROWS.fire1); ROWS.fire3 = rot90(ROWS.fire2);
PAL.fire = { R: '#c82000', O: '#fc8c18', Y: '#fcfcb0' };
/* explosao da bola de fogo: clarao -> estouro com pontas -> anel quebrado -> fumaca */
ROWS.boom0 = ['..R.R..', '.ROROR.', 'ROYYYOR', '.OYYYO.', 'ROYYYOR', '.ROROR.', '..R.R..'];
ROWS.boom1 = [
  '....R.R....', '....ROR....', '.R..ROR..R.', '..RROOORR..', '..ROOYOOR..', 'RROOY.YOORR',
  '..ROOYOOR..', '..RROOORR..', '.R..ROR..R.', '....ROR....', '....R.R....'];
ROWS.boom2 = [
  '.....RR......', '....ROOR.....', '.RR..RR...RR.', 'ROOR.....ROR.', '.RR.......R..', '.............',
  'RR.........RR', 'OR.........RO', '.............', '..R.......RR.', '.ROR.....ROOR', '..RR..RR..RR.', '.....ROOR....', '......RR.....'];
ROWS.boom3 = [
  '.....R.......', '.............', '.R.........R.', '.............', '.............', '.............',
  'R...........R', '.............', '.............', '.............', '.R.........R.', '.............', '.......R.....'];
/* pedaco de tijolo 8x8: lasca com friso claro e junta de argamassa */
const DEB = ['KKKKKKK.', 'KLLLLLK.', 'KLBBBBBK', 'KBBBBBBK', 'KKKBBBBK', '..KKBBBK', '....KBBK', '.....KK.'];
ROWS.deb0 = DEB; ROWS.deb1 = rot90(DEB); ROWS.deb2 = rot90(ROWS.deb1); ROWS.deb3 = rot90(ROWS.deb2);
PAL.deb = { K: '#000000', B: '#c84c0c', L: '#fcbcb0' };
/* poeira: sopro pequeno -> nuvem cheia -> se parte -> fiapos (ancorada pela base) */
ROWS.dust0 = ['.WW.', 'WWWL', '.LL.'];
ROWS.dust1 = ['..WW..', '.WWWWL', 'WWWWWL', 'LWWLLD', '.LLDD.'];
ROWS.dust2 = ['.LL..L.', 'LLLD.LL', 'LLDD.LD', '.DD..D.'];
ROWS.dust3 = ['L....', '.....', 'D...D'];
PAL.dust = { W: '#fcfcfc', L: '#d0ccc8', D: '#9c9894' };
/* brilho: ponto -> cruz -> estrela de 4 pontas -> cruz -> X que some */
ROWS.spark0 = ['C'];
ROWS.spark1 = ['.C.', 'CWC', '.C.'];
ROWS.spark2 = ['...C...', '...C...', '..CWC..', 'CCWWWCC', '..CWC..', '...C...', '...C...'];
ROWS.spark3 = ['C...C', '.....', '..W..', '.....', 'C...C'];
/* impacto ao pisar: estrela compacta -> raios soltos -> pontas que somem */
ROWS.pow0 = ['W..W..W', '.W.W.W.', '..WYW..', 'WWYYYWW', '..WYW..', '.W.W.W.', 'W..W..W'];
ROWS.pow1 = [
  'W....W....W', '.W.......W.', '...........', '.....Y.....', '...........', 'WW.Y...Y.WW',
  '...........', '.....Y.....', '...........', '.W.......W.', 'W....W....W'];
ROWS.pow2 = [
  '.....Y.....', '...........', '.Y.......Y.', '...........', '...........', 'Y.........Y',
  '...........', '...........', '.Y.......Y.', '...........', '.....Y.....'];
PAL.pow = { W: '#fcfcfc', Y: '#fcd848' };
const coinSprite = t => 'coin' + Math.floor(t / 2) % 4;
const fireSprite = f => 'fire' + (f.vx < 0 ? 3 - Math.floor(f.t / 3) % 4 : Math.floor(f.t / 3) % 4);
const debSprite = d => 'deb' + Math.floor(d.t / 4) % 4;
function pixDisc(c, x, y, r) { for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); c.fillRect(x - w, y + dy, w * 2 + 1, 1); } }
const fxPal = col => { const k = 'spk' + (col || '#fcfcfc'); if (!PAL[k]) PAL[k] = { C: col || '#fcfcfc', W: col && col !== '#fcfcfc' ? '#fcfcfc' : '#fcf0a0' }; return k; };
function fxBlit(c, id, pal, x, y, bottom) {
  const im = spr(id, pal); c.drawImage(im, x - (im.width >> 1), bottom ? y + 1 - im.height : y - (im.height >> 1));
}
function drawPart(c, q, ox) {
  const x = Math.round(q.x - ox), y = Math.round(q.y), k = q.t / q.life;
  if (q.k === 'dust') fxBlit(c, 'dust' + (k < 0.18 ? 0 : k < 0.5 ? 1 : k < 0.78 ? 2 : 3), 'dust', x, y, true);
  else if (q.k === 'spark') fxBlit(c, 'spark' + [0, 1, 2, 2, 1, 3, 3, 0][Math.floor(k * 8)], fxPal(q.col), x, y);
  else if (q.k === 'goo') { const s = k < 0.65 ? 2 : 1; c.fillStyle = q.col; c.fillRect(x, y, s, s); }
  else if (q.k === 'burst') fxBlit(c, 'pow' + (k < 0.3 ? 0 : k < 0.65 ? 1 : 2), 'pow', x, y);
  else if (q.k === 'ring') fxBlit(c, 'boom' + Math.min(3, Math.floor(k * 4)), 'fire', x, y);
}
