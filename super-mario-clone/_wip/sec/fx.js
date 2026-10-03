/* ---- Efeitos: moeda girando, bola de fogo, pedaco de tijolo e particulas (poeira, brilho, gotas, impacto, estouro) ---- */
ROWS.coin0 = ['..KKKK..', '.KYYYYK.', 'KYWYYYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYOYOK', 'KYWYYYOK', 'KYYYYYOK', '.KOOOOK.', '..KKKK..'];
ROWS.coin1 = ['..KKKK..', '.KYYYOK.', '.KWYYOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYOOK.', '.KWYYOK.', '.KYYYOK.', '..KOOK..', '..KKKK..'];
ROWS.coin2 = ['...KK...', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '..KWOK..', '...KK...'];
ROWS.coin3 = mirror(recolor(ROWS.coin1, { W: 'O', O: 'W' }));
PAL.coin = { K: '#6c4800', Y: '#f8d838', O: '#d89000', W: '#fcfce0' };
const FB = ['..KKKK..', '.KRROOK.', 'KRROYYOK', 'KROYWWYK', 'KROYWWYK', 'KRROYYOK', '.KRRROK.', '..KKKK..'];
ROWS.fire0 = FB; ROWS.fire1 = rot90(FB); ROWS.fire2 = rot90(ROWS.fire1); ROWS.fire3 = rot90(ROWS.fire2);
PAL.fire = { K: '#781000', R: '#e83010', O: '#f88818', Y: '#fcd848', W: '#fcfcfc' };
const DEB = ['KKKKKK..', 'KBBBBBK.', 'KBLBBBK.', 'KBBBBBBK', 'KKKKBBBK', '...KBBBK', '...KBBK.', '....KK..'];
ROWS.deb0 = DEB; ROWS.deb1 = rot90(DEB); ROWS.deb2 = rot90(ROWS.deb1); ROWS.deb3 = rot90(ROWS.deb2);
PAL.deb = { K: '#000000', B: '#c84c0c', L: '#fcbcb0' };
const coinSprite = t => 'coin' + Math.floor(t / 2) % 4;
const fireSprite = f => 'fire' + (f.vx < 0 ? 3 - Math.floor(f.t / 3) % 4 : Math.floor(f.t / 3) % 4);
const debSprite = d => 'deb' + Math.floor(d.t / 4) % 4;
function pixDisc(c, x, y, r) { for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); c.fillRect(x - w, y + dy, w * 2 + 1, 1); } }
function drawPart(c, q, ox) {
  const x = Math.round(q.x - ox), y = Math.round(q.y), k = q.t / q.life;
  if (q.k === 'dust') { c.fillStyle = k < 0.45 ? '#fcfcfc' : '#d8d0c8'; pixDisc(c, x, y, [1, 2, 2, 2, 1, 1, 0][Math.floor(k * 7)]); }
  else if (q.k === 'spark') { const s = [0, 1, 2, 1, 0][Math.floor(k * 5)]; c.fillStyle = q.col || '#fcfcfc'; c.fillRect(x - s, y, s * 2 + 1, 1); c.fillRect(x, y - s, 1, s * 2 + 1); }
  else if (q.k === 'goo') { const s = k < 0.7 ? 2 : 1; c.fillStyle = q.col; c.fillRect(x, y, s, s); }
  else if (q.k === 'burst') {
    const d = 3 + Math.floor(k * 6); c.fillStyle = '#fcfcfc';
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) c.fillRect(x + sx * d - 1, y + sy * Math.round(d * 0.6), 2, 1);
    c.fillRect(x - 1, y - d - 1, 2, 2);
  }
  else if (q.k === 'ring') {
    const r = 1 + Math.floor(k * 5); c.fillStyle = k < 0.5 ? q.col : '#c8c8c8';
    for (let a = 0; a < 12; a++) c.fillRect(x + Math.round(Math.cos(a * Math.PI / 6) * r), y + Math.round(Math.sin(a * Math.PI / 6) * r), 1, 1);
  }
}
