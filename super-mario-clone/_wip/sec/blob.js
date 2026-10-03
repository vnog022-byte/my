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
/* formas (lx..rx, top, recuo por linha; base na linha 12): fx = x do olho da frente, a = linha de cima do
   olho da frente, drip = colunas onde a gosma cede 1 px abaixo da base (desligado: comia os pes) */
const BLOB_SHAPE = {
  c: { lx: 0, rx: 15, top: 3, ins: [2, 1, 0, 0, 0, 0, 0, 0, 0, 1], fx: 3, a: 4, drip: [] },
  m: { lx: 1, rx: 14, top: 2, ins: [3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], fx: 3, a: 4, drip: [] },
  p: { lx: 1, rx: 14, top: 1, ins: [3, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1], fx: 4, a: 3, drip: [] } };
const BLOB_CYCLE = ['c', 'm', 'p', 'm', 'c', 'm', 'p', 'm'];
const blobBody = (i, ko) => {
  const s = BLOB_SHAPE[BLOB_CYCLE[i % 8]], prev = BLOB_SHAPE[BLOB_CYCLE[(i + 7) % 8]];
  const tipLen = ko ? 2 : Math.max(1, Math.min(2, 2 + s.top - prev.top)), lean = !ko && s.top > prev.top ? 1 : 0, tipX = 8;
  return blobMask((x, y) => {
    if (y >= s.top && y <= 12) { const ins = s.ins[y - s.top]; return x >= s.lx + ins && x <= s.rx - ins; }
    if (y === 13) return !ko && s.drip.includes(x);                      // gosma cedendo entre os pes
    const k = s.top - y;                                                 // ponta: escada de 1 px
    if (k < 1 || k > tipLen) return false;
    if (k === 1 && tipLen > 1) return x >= tipX - 1 && x <= tipX + 1;
    return x === tipX + (k >= 2 ? lean : 0);
  });
};
/* rosto em 3/4 (deslocado para a frente). Olhos 3x4; em cada um a
   palpebra e um traco diagonal que corta o canto de dentro, descendo para o centro do rosto; a pupila fica
   na linha de baixo, separada da palpebra por uma linha de L (olhar bravo, de baixo). Boca aberta de 2 linhas
   com lingua. Brilho molhado de 2 px no alto da cupula, longe dos olhos. Piscar = traco diagonal. */
const BLOB_EYES = {
  open: [['LK.', 'LLK', 'LLL', 'LKL'], ['.KL', 'KLL', 'LLL', 'LKL']],
  blink: [['...', 'K..', '.KK', '...'], ['...', '..K', 'KK.', '...']],
  ko: [['K..K', '.KK.', '.KK.', 'K..K'], ['K..K', '.KK.', '.KK.', 'K..K']] };
const blobFace = (s, kind) => {
  const E = BLOB_EYES[kind], parts = [[['LL'], 6, s.top + 1]];
  if (kind === 'ko') parts.push([E[0], s.fx, s.a + 1], [E[1], 9, s.a + 1], [['KLLK'], 6, s.a + 6]);
  else parts.push([E[0], s.fx, s.a], [E[1], 9, s.a], [['KKKK', 'KLLK'], s.fx + 3, s.a + 5]);
  return parts;
};
const BLOB_NEAR = ['.KKK.', 'KLLLK', 'KLLLK', '.KKK.'], BLOB_FAR = ['.KKK.', 'KBBBK', 'KBBBK', '.KKK.'];
/* pe: apoiado nos quadros 0-4 (2,4,6,8,10 = recua 2 px por quadro), volta erguido 1 px nos quadros 5-7 */
const BLOB_PX = [2, 4, 6, 8, 10, 7, 5, 3], BLOB_LIFT = [0, 0, 0, 0, 0, 1, 1, 1];
const blobWalk = (i, kind) => {
  const a = i % 8, b = (i + 4) % 8, s = BLOB_SHAPE[BLOB_CYCLE[a]];
  const near = [BLOB_NEAR, BLOB_PX[a], 12 - BLOB_LIFT[a]], far = [BLOB_FAR, BLOB_PX[b], 12 - BLOB_LIFT[b]];
  return compose(16, 16, [...(BLOB_LIFT[a] ? [near, far] : [far, near]), [blobBody(a)], ...blobFace(s, kind)]);
};
for (let i = 0; i < 8; i++) { ROWS['blob_w' + i] = blobWalk(i, 'open'); ROWS['blob_w' + i + '_b'] = blobWalk(i, 'blink'); }
ROWS.blob_n = ROWS.blob_w0; ROWS.blob_sq = ROWS.blob_w2; ROWS.blob_st = ROWS.blob_w6;
ROWS.blob_n_b = ROWS.blob_w0_b; ROWS.blob_sq_b = ROWS.blob_w2_b; ROWS.blob_st_b = ROWS.blob_w6_b;
/* esmagada: poca que se espalha para os lados, olhos fechados (um traco cada) e lingua de fora */
ROWS.blob_flat = compose(16, 16, [
  [blobMask((x, y) => (y === 10 && x >= 5 && x <= 10) || (y === 11 && x >= 3 && x <= 12) || (y === 12 && x >= 2 && x <= 13)
    || (y === 13 && x >= 1 && x <= 14) || y >= 14)],
  [['LL'], 6, 11], [['KK....KK'], 4, 12], [['KK'], 7, 13], [['LL'], 7, 14]]);
/* derrubada (casco/bloco/fogo): olhos em X cheio, boca aberta, pes juntos na base — virada com vflip */
ROWS.blob_ko = compose(16, 16, [[BLOB_FAR, 8, 12], [BLOB_NEAR, 3, 12], [blobBody(1, true)], ...blobFace(BLOB_SHAPE.m, 'ko')]);
PAL.blob = { K: '#000000', B: '#8000f0', L: '#fcc4fc' };
const BLOB_WALK = ['blob_w0', 'blob_w1', 'blob_w2', 'blob_w3', 'blob_w4', 'blob_w5', 'blob_w6', 'blob_w7'], BLOB_STEP = 4;
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_ko', pal: 'blob', flip: e.dir > 0, vflip: true };
  const k = BLOB_WALK[Math.floor(e.anim / BLOB_STEP) % BLOB_WALK.length];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
