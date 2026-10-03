/* ---- Itens: maca (crescer), pimenta (fogo), coracao (vida), estrela (invencivel).
   Cada paleta: contorno K + 3 cores (estilo NES). Animacao: brilho na maca, ciclo de cor "chama" na pimenta,
   batida dupla (tum-tum) no coracao, ciclo rapido de paleta na estrela. ---- */
ROWS.apple = [
  '...........KKK..',
  '........K.KGGGK.',
  '........KKGGGK..',
  '........K.KKK...',
  '...KKKK.KKKKK...',
  '..KRRRRKKRRRRK..',
  '.KRWWRRRRRRRRRK.',
  'KRWWRRRRRRRRRRRK',
  'KRWRRRRRRRRRRRRK',
  'KRRRRRRRRRRRRRRK',
  'KRRRRRRRRRRRRRRK',
  'KRRRRRRRRRRRRRRK',
  '.KRRRRRRRRRRRRK.',
  '.KRRRRRRRRRRRRK.',
  '..KRRRRKKRRRRK..',
  '...KKKK..KKKK...'];
/* quadro de brilho: o reflexo vira uma estrelinha por alguns ticks */
ROWS.apple2 = compose(16, 16, [[ROWS.apple], [['.W.', 'WWW', '.W.'], 3, 6], [['W'], 5, 6]]);
ROWS.chili = [
  '..KK............',
  '.KGGK...........',
  '..KGK...........',
  '..KGGKK.........',
  '.KGGGGGK........',
  '.KRGGGRRK.......',
  '.KRWKKRRRK......',
  '.KRWWRRRRRK.....',
  '..KRWWRRRRRK....',
  '...KRWRRRRRRK...',
  '....KRRRRRRRK...',
  '.....KKRRRRRRK..',
  '.......KRRRRRK..',
  '........KRRRRK..',
  '.........KRRK...',
  '.........KRK....'];
ROWS.heart = [
  '................',
  '................',
  '................',
  '..KKKK...KKKK...',
  '.KRRRRK.KRRRRK..',
  'KRWWRRRKRRRRRDK.',
  'KRWRRRRRRRRRRDK.',
  'KRRRRRRRRRRRRDK.',
  'KRRRRRRRRRRRDDK.',
  '.KRRRRRRRRRRDK..',
  '..KRRRRRRRRDK...',
  '...KRRRRRRDK....',
  '....KRRRRDK.....',
  '.....KRRDK......',
  '......KDK.......',
  '.......K........'];
ROWS.heart2 = [
  '................',
  '................',
  '................',
  '................',
  '...KKK...KKK....',
  '..KRRRK.KRRRK...',
  '.KRWWRRKRRRRDK..',
  '.KRWRRRRRRRRDK..',
  '.KRRRRRRRRRRDK..',
  '..KRRRRRRRRDK...',
  '...KRRRRRRDK....',
  '....KRRRRDK.....',
  '.....KRRDK......',
  '......KDK.......',
  '.......K........',
  '................'];
ROWS.heart2 = ['................'].concat(ROWS.heart2.slice(0, 15));
ROWS.star = [
  '.......KK.......',
  '......KYYK......',
  '......KWYK......',
  '.....KYWYYK.....',
  '.KKKKKYYYYKKKKK.',
  'KYYYYYYYYYYYYYOK',
  '.KYYYYKYYKYYYOK.',
  '..KYYYKYYKYYOK..',
  '...KYYKYYKYOK...',
  '...KYYYYYYYOK...',
  '..KYYYYYYYYYOK..',
  '..KYYYYKKYYYOK..',
  '.KYYYYK..KYYYOK.',
  '.KYYYK....KYYOK.',
  'KYYKK......KKYOK',
  'KKK..........KKK'];
PAL.apple = { K: '#2c0c04', R: '#e02818', W: '#fcd8c8', G: '#48c838' };
/* pimenta "em brasa": corpo sempre vermelho, contorno e reflexo pulsam como chama */
PAL.chili0 = { K: '#3c0c08', R: '#d82010', W: '#fcd860', G: '#48c838' };
PAL.chili1 = { K: '#881400', R: '#f83800', W: '#fcfcfc', G: '#80d010' };
PAL.chili2 = { K: '#a81000', R: '#f87000', W: '#fcfcfc', G: '#b8f818' };
PAL.chili3 = { K: '#881400', R: '#f83800', W: '#fca044', G: '#80d010' };
PAL.heart = { K: '#3c0c20', R: '#f83878', W: '#fcd0e0', D: '#a8105c' };
PAL.star0 = { K: '#5c3800', Y: '#f8d838', O: '#d88000', W: '#fcfcfc' };
PAL.star1 = { K: '#5c3800', Y: '#fcfcb0', O: '#f8d838', W: '#fcfcfc' };
PAL.star2 = { K: '#682000', Y: '#f89820', O: '#c84c0c', W: '#fcfc90' };
PAL.star3 = { K: '#004800', Y: '#b8f818', O: '#58a800', W: '#fcfcfc' };
const HEART_BEAT = [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function itemSprite(it, tick) {
  if (it.type === 'grow') return { id: tick % 64 < 6 ? 'apple2' : 'apple', pal: 'apple' };
  if (it.type === 'fire') return { id: 'chili', pal: 'chili' + Math.floor(tick / 4) % 4 };
  if (it.type === 'life') return { id: HEART_BEAT[Math.floor(tick / 3) % 16] ? 'heart2' : 'heart', pal: 'heart' };
  return { id: 'star', pal: 'star' + Math.floor(tick / 3) % 4 };
}
