/* ---- Gosma (16x16, olhando para a esquerda; flip quando anda para a direita).
   Paleta de 3 cores: K=contorno/pupila B=corpo L=claro (olho, pe, brilho).
   Caminhada de perfil: 8 quadros, 1 a cada 4 ticks (= 2 px a 0,5 px/tick). O pe apoiado recua 2 px por
   quadro (nao patina) enquanto o outro volta pelo ar; corpo sobe 1 px no meio do apoio. ---- */
const BLOB_BODY = [
  '.......K........',
  '......KBKK......',
  '....KKBBBBKK....',
  '..KKBLLBBBBBKK..',
  '.KBLLBBBBBBBBBK.',
  'KBKKBBBBBKKBBBBK',
  'KBLLKBBBKLLBBBBK',
  'KBKKLBBBKKLBBBBK',
  'KBKKLBBBKKLBBBBK',
  'KBLLLBBBLLLBBBBK',
  '.KBBBKKKKBBBBBK.',
  '..KBBBLBBBBBBK..',
  '...KKKKKKKKKK...'];
const BLOB_NEAR = ['.KKK.', 'KLLLK', 'KLLLK', 'KKKKK'], BLOB_FAR = ['.KKK.', 'KKKKK', 'KKKKK', 'KKKKK'];
const BLOB_PX = [1, 3, 5, 7, 8, 6, 4, 2], BLOB_LIFT = [0, 0, 0, 0, 1, 2, 2, 1];
const blobWalk = (i, eyes) => {
  const a = i % 8, b = (i + 4) % 8, bob = a % 4 === 0 ? 1 : 0;
  return compose(16, 16, [
    [BLOB_FAR, BLOB_PX[b], 12 - BLOB_LIFT[b]],
    [BLOB_NEAR, BLOB_PX[a], 12 - BLOB_LIFT[a]],
    [eyes || BLOB_BODY, 0, bob]]);
};
const BLOB_BLINK = BLOB_BODY.map((r, y) => y === 6 || y === 7 ? 'KBBBBBBBBBBBBBBK' : y === 8 ? 'KBKKKBBBKKKBBBBK' : y === 9 ? 'KBBBBBBBBBBBBBBK' : r);
for (let i = 0; i < 8; i++) { ROWS['blob_w' + i] = blobWalk(i); ROWS['blob_w' + i + '_b'] = blobWalk(i, BLOB_BLINK); }
ROWS.blob_n = ROWS.blob_w0; ROWS.blob_sq = ROWS.blob_w2; ROWS.blob_st = ROWS.blob_w6;
ROWS.blob_n_b = ROWS.blob_w0_b; ROWS.blob_sq_b = ROWS.blob_w2_b; ROWS.blob_st_b = ROWS.blob_w6_b;
/* esmagada: achatada, olhos espremidos (fechados em X) */
ROWS.blob_flat = [
  '................', '................', '................', '................', '................', '................',
  '................', '................', '................', '................', '................',
  '....KKKKKKKK....',
  '..KKBLLBBBBBKK..',
  '.KBKLKBBKLKBBBK.',
  'KBBBBBBBBBBBBBBK',
  '.KKKKKKKKKKKKKK.'];
/* derrubada (casco/bloco/fogo): olhos em X, pes para cima — desenhada de pe e virada com vflip */
ROWS.blob_ko = compose(16, 16, [
  [BLOB_FAR, 9, 13], [BLOB_BODY.map((r, y) => y === 8 ? 'KBKLKBBBKLKBBBBK' : y === 9 ? 'KBLKLBBBLKLBBBBK' : y === 7 ? 'KBBBBBBBBBBBBBK.' : r), 0, 1], [BLOB_NEAR, 3, 13]]);
PAL.blob = { K: '#2c1040', B: '#a048d8', L: '#f8d8f8' };
const BLOB_WALK = ['blob_w0', 'blob_w1', 'blob_w2', 'blob_w3', 'blob_w4', 'blob_w5', 'blob_w6', 'blob_w7'], BLOB_STEP = 4;
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_ko', pal: 'blob', flip: e.dir > 0, vflip: true };
  const k = BLOB_WALK[Math.floor(e.anim / BLOB_STEP) % BLOB_WALK.length];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
