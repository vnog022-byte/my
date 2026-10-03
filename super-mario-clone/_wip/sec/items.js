/* ---- Itens: maca (crescer), pimenta (fogo), coracao (vida), estrela (invencivel).
   Cores: K (contorno) + 3 cores no corpo de cada sprite (luz W, base, sombra D/O na borda de baixo/direita).
   Folha da maca e calice da pimenta usam um verde fixo como sub-paleta separada (como um tile NES de outra paleta).
   Animacao: brilho de 4 pontas na maca, reflexo/contorno "em brasa" na pimenta (pico curto),
   coracao tum-tum (contrai -> estoura -> volta), ciclo amarelo->creme->branco->creme->amarelo->laranja na estrela. ---- */
ROWS.apple = [
  '...........KKK..',
  '........K.KGGGK.',
  '........KKGGGK..',
  '........K.KKK...',
  '...KKKK.KKKKK...',
  '..KRRRRKKRRRRK..',
  '.KRWWRRRRRRRRRK.',
  'KRWWRRRRRRRRRRDK',
  'KRWRRRRRRRRRRRDK',
  'KRRRRRRRRRRRRRDK',
  'KRRRRRRRRRRRRRDK',
  'KRRRRRRRRRRRRDDK',
  '.KRRRRRRRRRRRDK.',
  '.KRRRRRRRRRRDDK.',
  '..KDDDDDDDDDDK..',
  '...KKKKKKKKKK...'];
/* quadro de brilho: cintilacao alongada (vertical 5px, horizontal 3px) cruzando o contorno do ombro direito */
ROWS.apple2 = compose(16, 16, [[ROWS.apple], [['.S.', '.S.', 'SSS', '.S.', '.S.'], 13, 4]]);
ROWS.chili = [
  '..KK............',
  '.KGGK...........',
  '..KGK...........',
  '..KGGKK.........',
  '.KGGGGGK........',
  '..KGGGGGK.......',
  '.KGRRRRRGK......',
  '..KRRRRRRWK.....',
  '...KRRRRRRWK....',
  '....KRRRRRRWK...',
  '.....KDRRRRRRK..',
  '......KDRRRRRK..',
  '.......KDRRRK...',
  '........KDRRK...',
  '........KDRK....',
  '........KKK.....'];
/* coracao: normal (13 de largura), contraido (11) e estouro (15), todos com a ponta no chao */
ROWS.heart = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '...KKK...KKK....',
  '..KRRRK.KRRRK...',
  '.KRWWRRKRRRRDK..',
  '.KRRRRRKRRRRDK..',
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
  '................',
  '................',
  '................',
  '...KKK...KKK....',
  '..KRRRK.KRRRK...',
  '..KRWRRKRRRDK...',
  '..KRRRRKRRRDK...',
  '...KRRRRRRDK....',
  '....KRRRRDK.....',
  '.....KRRDK......',
  '......KDK.......',
  '.......K........'];
ROWS.heart3 = [
  '................',
  '................',
  '................',
  '..KKKK...KKKK...',
  '.KRRRRK.KRRRRK..',
  'KRWWRRRKRRRRRDK.',
  'KRWRRRRKRRRRRDK.',
  'KRRRRRRRRRRRRDK.',
  'KRRRRRRRRRRRDDK.',
  '.KRRRRRRRRRRDK..',
  '..KRRRRRRRRDK...',
  '...KRRRRRRDK....',
  '....KRRRRDK.....',
  '.....KRRDK......',
  '......KDK.......',
  '.......K........'];
ROWS.star = [
  '.......KK.......',
  '......KYYK......',
  '......KYYK......',
  '.....KYYYYK.....',
  '.KKKKYYYYYYKKKK.',
  'KYYYYYYYYYYYYYOK',
  '.KYYYYKYYKYYYOK.',
  '..KYYYKYYKYYOK..',
  '...KYYKYYKYOK...',
  '...KYYYYYYYOK...',
  '..KYYYYYYYYYOK..',
  '..KYYYYKKYYYOK..',
  '.KYYYKK..KKYYOK.',
  '.KYYK......KYOK.',
  'KYKK........KKOK',
  'KK............KK'];
PAL.apple = { K: '#2c0c04', R: '#e02818', W: '#fcd8c8', D: '#a01008', G: '#48c838', S: '#fcfcfc' };
/* pimenta "em brasa": corpo, sombra e verde fixos; so o reflexo W e o contorno K esquentam */
const CHILI = { K: '#3c0c08', R: '#d82010', W: '#fc9c80', D: '#881008', G: '#48c838' };
PAL.chili0 = CHILI;
PAL.chili1 = { ...CHILI, K: '#7c1404', W: '#fcd860' };
PAL.chili2 = { ...CHILI, K: '#c83800', W: '#fcfcfc' };
PAL.heart = { K: '#3c0c20', R: '#f83878', W: '#fcd0e0', D: '#a8105c' };
PAL.star0 = { K: '#5c3800', Y: '#f8d838', O: '#d88000' };
PAL.star1 = { K: '#5c3800', Y: '#fcf0a0', O: '#f8c838' };
PAL.star2 = { K: '#683000', Y: '#f8a830', O: '#c86410' };
PAL.star3 = { K: '#5c3800', Y: '#fcfcf0', O: '#f8e070' };
const CHILI_PULSE = [0, 0, 1, 2, 1, 0, 0, 0];
/* tum-tum: contrai (2) -> estoura (3) -> volta (1), duas vezes, depois descanso */
const HEART_BEAT = [2, 3, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const STAR_CYCLE = [0, 1, 3, 1, 0, 2];
function itemSprite(it, tick) {
  if (it.type === 'grow') return { id: tick % 64 < 6 ? 'apple2' : 'apple', pal: 'apple' };
  if (it.type === 'fire') return { id: 'chili', pal: 'chili' + CHILI_PULSE[Math.floor(tick / 3) % 8] };
  if (it.type === 'life') { const b = HEART_BEAT[Math.floor(tick / 3) % 14]; return { id: b === 1 ? 'heart' : 'heart' + b, pal: 'heart' }; }
  return { id: 'star', pal: 'star' + STAR_CYCLE[Math.floor(tick / 3) % 6] };
}
