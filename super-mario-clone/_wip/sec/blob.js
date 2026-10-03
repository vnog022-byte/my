/* ---- Gosma (anda esticando e achatando): K=contorno B=corpo L=brilho M=sombra W=olho E=pupila V/U=broto ---- */
ROWS.blob_n = [
  '................', '................', '........VV......', '.......VUK......', '.....KKKKKK.....', '...KKBBBBBBKK...',
  '..KBBLLBBBBBBK..', '.KBBLLBBBBBBBBK.', '.KBLLBBBBBBBBBK.', '.KBEWWBBBEWWBBK.', '.KBEWWBBBEWWBBK.', '.KBBBBBBBBBBBBK.',
  '.KBBBBKKBBBBMBK.', '.KMBBBBBBBBBMMK.', '..KMMMMMMMMMMK..', '...KKKKKKKKKK...'];
ROWS.blob_sq = [
  '................', '................', '................', '................', '................', '.........VV.....',
  '........VUK.....', '....KKKKKKKK....', '..KKBBBBBBBBKK..', '.KBBLLLBBBBBBBK.', 'KBBLLBBBBBBBBBBK', 'KBEWWBBBBBEWWBBK',
  'KBEWWBBBBBEWWBBK', 'KBBBBBKKBBBBBMBK', '.KMMMMMMMMMMMMK.', '..KKKKKKKKKKKK..'];
ROWS.blob_st = [
  '........VV......', '.......VUK......', '......KKKK......', '.....KBBBBK.....', '....KBLLBBBK....', '...KBLLBBBBBK...',
  '...KBLBBBBBBK...', '...KEWWBBEWWK...', '...KEWWBBEWWK...', '...KBBBBBBBBK...', '...KBBBKKBBMK...', '...KBBBBBBBMK...',
  '...KMBBBBBBMK...', '...KMMBBBBMMK...', '....KMMMMMMK....', '.....KKKKKK.....'];
ROWS.blob_flat = [
  '................', '................', '................', '................', '................', '................',
  '................', '................', '................', '................', '................', '...KKKKKKKKKK...',
  '.KKBKBKBBKBKBKK.', 'KBBBBKBBBBKBBBBK', 'KBBBKBKBBKBKBBBK', '.KKKKKKKKKKKKKK.'];
const blink = rows => { let n = 0; return rows.map(r => r.includes('E') ? r.replace(/[EW]/g, n++ ? 'K' : 'B') : r); };
for (const k of ['blob_n', 'blob_sq', 'blob_st']) ROWS[k + '_b'] = blink(ROWS[k]);
PAL.blob = { K: '#3c1458', B: '#a048d8', L: '#d8a0f8', M: '#7028a8', W: '#fcfcfc', E: '#1c1828', V: '#48c838', U: '#208018' };
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_n', pal: 'blob', vflip: true };
  const k = ['blob_n', 'blob_sq', 'blob_n', 'blob_st'][Math.floor(e.anim / 8) % 4];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
