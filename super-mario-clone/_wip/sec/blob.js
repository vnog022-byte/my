/* ---- Gosma (16x16, olhando para a esquerda; flip quando anda para a direita).
   Paleta NES de 3 cores: K=contorno/pupila ($0F) B=corpo ($13) L=claro ($34: olho, dente, brilho).
   O corpo e gerado por mascara (blobMask): o contorno K sai sozinho de toda borda, 1 px, sem degrau duplo.
   Caminhada de perfil: 8 quadros, 1 a cada 4 ticks (= 2 px a 0,5 px/tick). O pe apoiado recua 2 px por
   quadro (nao patina) e o outro volta erguido 1 px. Pe perto = roxo com brilho, pe longe = escuro.
   Squash/stretch: contato (pes abertos) largo e baixo, passagem alta e estreita; a ponta do topo atrasa
   1 quadro (estica quando o corpo desce, encolhe quando sobe) e uma gotinha escorre pela traseira. ---- */
const blobMask = (on, extra) => {
  const g = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => on(x, y)));
  const at = (x, y) => x >= 0 && y >= 0 && x < 16 && y < 16 && g[y][x];
  return g.map((r, y) => r.map((v, x) => !v ? '.' : at(x - 1, y) && at(x + 1, y) && at(x, y - 1) && at(x, y + 1) ? 'B' : 'K').join(''));
};
/* formas (lx..rx, top..bot): c=contato 15x11 (largo, baixo), m=meio 14x11, p=passagem 13x12 (alto, estreito) */
const BLOB_SHAPE = { c: { lx: 0, rx: 14, top: 3, bot: 13 }, m: { lx: 1, rx: 14, top: 2, bot: 12 }, p: { lx: 2, rx: 14, top: 1, bot: 12 } };
const BLOB_CYCLE = ['c', 'm', 'p', 'm', 'c', 'm', 'p', 'm'];
const BLOB_DRIP = [0, 1, 1, 2, 3, 4, 4, 5];
const blobBody = (i, ko) => {
  const s = BLOB_SHAPE[BLOB_CYCLE[i % 8]], prev = BLOB_SHAPE[BLOB_CYCLE[(i + 7) % 8]];
  const tipLen = Math.min(s.top, ko ? 2 : 2 + s.top - prev.top), tipX = Math.round((s.lx + s.rx) / 2);
  const dripY = ko ? -9 : Math.min(s.top + 3 + BLOB_DRIP[i % 8], s.bot - 2);
  return blobMask((x, y) => {
    if (y >= s.top && y <= s.bot) {
      const dy = y - s.top, ins = dy === 0 ? 3 : dy === 1 || y === s.bot ? 1 : 0;
      if (x >= s.lx + ins && x <= s.rx - ins) return true;
      return x === s.rx + 1 && (y === dripY || y === dripY + 1);           // gotinha na traseira
    }
    const k = s.top - y;                                                 // ponta: escada de 1 px
    if (k < 1 || k > tipLen) return false;
    if (k === 1 && tipLen > 1) return x >= tipX - 1 && x <= tipX + 1;
    return x === tipX + (k >= 3 ? 1 : 0);
  });
};
/* rosto (sobreposto a partir da linha top+3): sobrancelhas em V descendo para o centro, palpebra cortando
   o olho na diagonal, pupilas para a frente, boca afastada da base com 2 presas */
const BLOB_FACE = [
  '....KK.....KK...',
  '....LLKK.KKLL...',
  '....KKL...KKL...',
  '....LLL...LLL...',
  '......KKKK......',
  '......L..L......'];
const BLOB_FACE_BLINK = [
  BLOB_FACE[0],
  '....BBKK.KKBB...',
  '....KKKB.BKKK...',
  '....BBB...BBB...',
  BLOB_FACE[4], BLOB_FACE[5]];
const BLOB_FACE_KO = [
  '....K..K.K..K...',
  '.....KK...KK....',
  '.....KK...KK....',
  '....K..K.K..K...',
  '......KKKK......',
  '......KLLK......'];
const BLOB_NEAR = ['.KKK.', 'KLBBK', 'KBBBK', '.KKK.'], BLOB_FAR = ['.KKK.', 'KBKKK', 'KKKKK', '.KKK.'];
const BLOB_PX = [2, 4, 6, 8, 9, 7, 5, 3], BLOB_LIFT = [0, 0, 0, 0, 1, 1, 1, 1];
const blobWalk = (i, face) => {
  const a = i % 8, b = (i + 4) % 8, s = BLOB_SHAPE[BLOB_CYCLE[a]];
  return compose(16, 16, [
    [BLOB_FAR, BLOB_PX[b], 12 - BLOB_LIFT[b]],
    [BLOB_NEAR, BLOB_PX[a], 12 - BLOB_LIFT[a]],
    [blobBody(a)],
    [face, 0, s.top + 3],
    [['LL', 'L'], s.lx + 2, s.top + 1]]);
};
for (let i = 0; i < 8; i++) { ROWS['blob_w' + i] = blobWalk(i, BLOB_FACE); ROWS['blob_w' + i + '_b'] = blobWalk(i, BLOB_FACE_BLINK); }
ROWS.blob_n = ROWS.blob_w0; ROWS.blob_sq = ROWS.blob_w2; ROWS.blob_st = ROWS.blob_w6;
ROWS.blob_n_b = ROWS.blob_w0_b; ROWS.blob_sq_b = ROWS.blob_w2_b; ROWS.blob_st_b = ROWS.blob_w6_b;
/* esmagada: poca fechada com contorno, olhos "> <" e respingos dos dois lados */
ROWS.blob_flat = compose(16, 16, [
  [blobMask((x, y) => (y === 11 && x >= 5 && x <= 10) || (y === 12 && x >= 3 && x <= 12) || (y === 13 && x >= 1 && x <= 14) || y >= 14
    || (Math.abs(x - 1) + Math.abs(y - 9) <= 1) || (Math.abs(x - 14) + Math.abs(y - 8) <= 1))],
  [['K....K', '.K..K.', 'K....K'], 5, 12], [['LL'], 7, 12], [['L'], 3, 13]]);
/* derrubada (casco/bloco/fogo): olhos em X cheio, boca aberta, pes juntos na base — virada com vflip */
ROWS.blob_ko = compose(16, 16, [[BLOB_FAR, 8, 12], [BLOB_NEAR, 3, 12], [blobBody(1, true)], [BLOB_FACE_KO, 0, 5], [['LL', 'L'], 3, 3]]);
PAL.blob = { K: '#000000', B: '#8000f0', L: '#fcc4fc' };
const BLOB_WALK = ['blob_w0', 'blob_w1', 'blob_w2', 'blob_w3', 'blob_w4', 'blob_w5', 'blob_w6', 'blob_w7'], BLOB_STEP = 4;
function blobSprite(e, tick) {
  if (e.state === 'squish') return { id: 'blob_flat', pal: 'blob' };
  if (e.state === 'dead') return { id: 'blob_ko', pal: 'blob', flip: e.dir > 0, vflip: true };
  const k = BLOB_WALK[Math.floor(e.anim / BLOB_STEP) % BLOB_WALK.length];
  return { id: (e.anim + e.seed) % 140 < 7 ? k + '_b' : k, pal: 'blob', flip: e.dir > 0 };
}
