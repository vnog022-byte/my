/* ---- Gosma (16x16, olhando para a esquerda; flip quando anda para a direita).
   Paleta NES de 3 cores: K=contorno/pupila ($0F) B=corpo ($13) L=claro ($34: olho, presa, pe, brilho).
   O corpo e gerado por mascara (blobMask): o contorno K sai sozinho de toda borda, 1 px, sem degrau duplo.
   Caminhada de perfil: 8 quadros, 1 a cada 4 ticks (= 2 px a 0,5 px/tick). O pe apoiado recua 2 px por
   quadro (nao patina) e o outro volta erguido 1 px. Pe perto = claro, pe longe = roxo, ambos com contorno.
   Squash/stretch simetrico em torno do centro (x 7,5): contato 16x10, meio 14x11, passagem 12x12; o rosto
   sobe e desce com o topo; a ponta atrasa 1 quadro (encolhe quando o corpo sobe, tomba para tras quando desce). ---- */
const blobMask = (on, extra) => {
  const g = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => on(x, y)));
  const at = (x, y) => x >= 0 && y >= 0 && x < 16 && y < 16 && g[y][x];
  return g.map((r, y) => r.map((v, x) => !v ? '.' : at(x - 1, y) && at(x + 1, y) && at(x, y - 1) && at(x, y + 1) ? 'B' : 'K').join(''));
};
/* formas (lx..rx, top..bot, recuo por linha): base sempre na linha 12, pes com 3 linhas visiveis */
const BLOB_SHAPE = {
  c: { lx: 0, rx: 15, top: 3, ins: [4, 2, 1, 0, 0, 0, 0, 0, 0, 1] },
  m: { lx: 1, rx: 14, top: 2, ins: [4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1] },
  p: { lx: 2, rx: 13, top: 1, ins: [3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] } };
const BLOB_CYCLE = ['c', 'm', 'p', 'm', 'c', 'm', 'p', 'm'];
const blobBody = (i, ko) => {
  const s = BLOB_SHAPE[BLOB_CYCLE[i % 8]], prev = BLOB_SHAPE[BLOB_CYCLE[(i + 7) % 8]];
  const tipLen = ko ? 2 : Math.max(1, Math.min(2, 2 + s.top - prev.top)), lean = !ko && s.top > prev.top ? 1 : 0, tipX = 8;
  return blobMask((x, y) => {
    if (y >= s.top && y <= 12) { const ins = s.ins[y - s.top]; return x >= s.lx + ins && x <= s.rx - ins; }
    const k = s.top - y;                                                 // ponta: escada de 1 px
    if (k < 1 || k > tipLen) return false;
    if (k === 1 && tipLen > 1) return x >= tipX - 1 && x <= tipX + 1;
    return x === tipX + (k >= 2 ? lean : 0);
  });
};
/* rosto (a partir da linha top+2, simetrico em x 4..11): sobrancelhas em V que se encontram no centro,
   palpebra cortando o olho na diagonal, pupila de 1 px com L dos dois lados, boca com cantos para baixo e
   2 presas grudadas nela */
const BLOB_FACE = [
  '....KK....KK....',
  '....LLKKKKLL....',
  '....LKL..LKL....',
  '................',
  '......KKKK......',
  '.....KL..LK.....'];
const BLOB_FACE_BLINK = [
  BLOB_FACE[0],
  '....BBKKKKBB....',
  '....KKK..KKK....',
  '', BLOB_FACE[4], BLOB_FACE[5]];
const BLOB_FACE_KO = [
  '...K..K..K..K...',
  '....KK....KK....',
  '....KK....KK....',
  '...K..K..K..K...',
  '................',
  '.......KK.......',
  '......KLLK......'];
const BLOB_NEAR = ['.KKK.', 'KLLLK', 'KLLBK', '.KKK.'], BLOB_FAR = ['.KKK.', 'KBBBK', 'KBBBK', '.KKK.'];
const BLOB_PX = [2, 4, 6, 8, 9, 7, 5, 3], BLOB_LIFT = [0, 0, 0, 0, 1, 1, 1, 1];
const blobWalk = (i, face) => {
  const a = i % 8, b = (i + 4) % 8, s = BLOB_SHAPE[BLOB_CYCLE[a]];
  return compose(16, 16, [
    [BLOB_FAR, BLOB_PX[b], 12 - BLOB_LIFT[b]],
    [BLOB_NEAR, BLOB_PX[a], 12 - BLOB_LIFT[a]],
    [blobBody(a)],
    [face, 0, s.top + 2],
    [['LL'], s.lx + s.ins[1] + 1, s.top + 1]]);
};
for (let i = 0; i < 8; i++) { ROWS['blob_w' + i] = blobWalk(i, BLOB_FACE); ROWS['blob_w' + i + '_b'] = blobWalk(i, BLOB_FACE_BLINK); }
ROWS.blob_n = ROWS.blob_w0; ROWS.blob_sq = ROWS.blob_w2; ROWS.blob_st = ROWS.blob_w6;
ROWS.blob_n_b = ROWS.blob_w0_b; ROWS.blob_sq_b = ROWS.blob_w2_b; ROWS.blob_st_b = ROWS.blob_w6_b;
/* esmagada: poca fechada, olhos fechados (um traco cada) numa linha limpa e respingos grudados na borda */
ROWS.blob_flat = compose(16, 16, [
  [blobMask((x, y) => (y === 11 && x >= 4 && x <= 11) || (y === 12 && x >= 2 && x <= 13) || (y === 13 && x >= 1 && x <= 14) || y >= 14
    || (y === 12 && (x === 0 || x === 15)) || (y === 13 && (x === 0 || x === 15)) || (y === 11 && (x === 1 || x === 14)))],
  [['KK....KK'], 4, 13], [['LL'], 6, 12]]);
/* derrubada (casco/bloco/fogo): olhos em X cheio, boca aberta, pes juntos na base — virada com vflip */
ROWS.blob_ko = compose(16, 16, [[BLOB_FAR, 8, 12], [BLOB_NEAR, 3, 12], [blobBody(1, true)], [BLOB_FACE_KO, 0, 4], [['LL'], 4, 3]]);
PAL.blob = { K: '#000000', B: '#8000f0', L: '#fcc4fc' };
const BLOB_WALK = ['blob_w0', 'blob_w1', 'blob_w2', 'blob_w3', 'blob_w4', 'blob_w5', 'blob_w6', 'blob_w7'], BLOB_STEP = 4;
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_ko', pal: 'blob', flip: e.dir > 0, vflip: true };
  const k = BLOB_WALK[Math.floor(e.anim / BLOB_STEP) % BLOB_WALK.length];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
