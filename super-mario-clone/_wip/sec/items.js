/* ---- Itens: maca (crescer), pimenta (fogo), coracao (vida), estrela (invencivel) ---- */
ROWS.apple = [
  '................', '........KKK.....', '.......KVVVK....', '......KDKKK.....', '...KKKKDKKKK....', '..KRRRRKRRRRK...',
  '.KRWWRRRRRRRRK..', '.KRWRRRRRRRRRK..', 'KRRRRRRRRRRRRRK.', 'KRRRRRRRRRRRRRK.', 'KRRRRRRRRRRRDRK.', 'KRRRRRRRRRRRDRK.',
  '.KRRRRRRRRRDDK..', '.KRRRRRRRRRDDK..', '..KKRRRRRRDKK...', '....KKKKKKKK....'];
ROWS.chili = [
  '................', '...KK...........', '..KVVK..........', '..KVVVK.........', '...KVVVKK.......', '...KRRRRRK......',
  '...KRWRRRRK.....', '....KRWRRRRK....', '....KRRRRRRRK...', '.....KRRRRRRRK..', '......KRRRRRRK..', '.......KRRRRRK..',
  '........KRRRRK..', '.........KRRK...', '..........KRK...', '...........K....'];
ROWS.heart = [
  '................', '................', '................', '...KKK...KKK....', '..KRRRK.KRRRK...', '.KRWWRRKRRRRRK..',
  '.KRWRRRRRRRRRK..', '.KRRRRRRRRRRRK..', '.KRRRRRRRRRRDK..', '..KRRRRRRRRDK...', '...KRRRRRRDK....', '....KRRRRDK.....',
  '.....KRRDK......', '......KRK.......', '.......K........', '................'];
ROWS.heart2 = compose(16, 16, [[[
  '..KK..KK..', '.KRRKKRRK.', 'KRWRRRRRRK', 'KRRRRRRRDK', '.KRRRRRDK.', '..KRRRDK..', '...KRDK...', '....KK....'], 3, 6]]);
ROWS.star = [
  '.......KK.......', '......KYYK......', '......KYYK......', '.....KYWYYK.....', 'KKKKKYWYYYYKKKKK', 'KYYYYYYYYYYYYYYK',
  '.KYYYYYYYYYYYYK.', '..KYYYYYYYYYYK..', '...KYYYYYYYYK...', '...KYYYYYYYYK...', '..KYYYYYYYYYYK..', '..KYYYYKKYYYYK..',
  '.KYYYYK..KYYYYK.', '.KYYYK....KYYYK.', 'KYYKK......KKYYK', 'KKK..........KKK'];
PAL.apple = { K: '#3c0c08', R: '#e02818', W: '#fcd0c0', D: '#981008', V: '#48c838' };
PAL.chili0 = { K: '#3c0c08', R: '#e82810', W: '#fcd860', V: '#48c838' };
PAL.chili1 = { ...PAL.chili0, R: '#f86818', W: '#fcfc90' };
PAL.chili2 = { ...PAL.chili0, R: '#f8a020', W: '#fcfcfc' };
PAL.heart = { K: '#3c0c20', R: '#f83878', W: '#fcd0e0', D: '#a8105c' };
PAL.star0 = { K: '#5c3800', Y: '#f8d838', W: '#fcfcfc' };
PAL.star1 = { K: '#5c3800', Y: '#fcfc90', W: '#fcfcfc' };
PAL.star2 = { K: '#5c3800', Y: '#f89820', W: '#fcfc90' };
function itemSprite(it, tick) {
  if (it.type === 'grow') return { id: 'apple', pal: 'apple' };
  if (it.type === 'fire') return { id: 'chili', pal: 'chili' + [0, 1, 2, 1][Math.floor(tick / 4) % 4] };
  if (it.type === 'life') return { id: Math.floor(tick / 12) % 2 ? 'heart2' : 'heart', pal: 'heart' };
  return { id: 'star', pal: 'star' + [0, 1, 0, 2][Math.floor(tick / 3) % 4] };
}
