/* folha da secao blob: gosma (16x16) — LAB de desenho */
const SPEC_blob = o => Object.assign({ type: 'blob', state: 'walk', anim: 0, seed: 0, dir: -1, h: 16, x: 0 }, o);
const SPEC_lbl = f => Object.assign(f, { label: f.id + (f.flip ? ' (virada)' : '') + (f.vflip ? ' (de ponta-cabeca)' : '') });

PAL.blobLab = { K: '#2c1044', D: '#4c1c84', M: '#7030b0', B: '#a048d8', L: '#d8a0f8', H: '#fcf0fc', W: '#fcfcfc', E: '#1c1828',
  G: '#40b840', Y: '#a0ec60', V: '#1c7030', R: '#f05888', C: '#c070f0' };
const LAB_E = s => { const r = []; for (let i = 0; i < 16; i++) r.push('................'); for (const [y, row] of s) r[y] = row; return r; };
const LAB_bodies = {
  c: LAB_E([[6, '.....KKKKKK.....'], [7, '...KKHLLBBMKK...'], [8, '..KHHLBBBBBMMK..'], [9, '.KHLBBBBBBBBMMK.'], [10, '.KLBBBBBBBBBBMK.'],
    [11, '.KBBBBBBBBBBBMK.'], [12, '.KBBBBBBBBBBBMK.'], [13, '.KBBBBBBBBCCLMK.'], [14, '.KMBBBBCLLLLMDK.'], [15, '..KKKKKKKKKKKK..']]),
  f: LAB_E([[6, '.....KKKKKK.....'], [7, '...KKHLLBBMKK...'], [8, '..KHHLBBBBBMMK..'], [9, '.KHLBBBBBBBBMMK.'], [10, '.KLBBBBBBBBBBMK.'],
    [11, '.KBBBBBBBBBBBMK.'], [12, '.KBBBBBBBBBBBMK.'], [13, '.KBBBBBBBBCCLMK.'], [14, '.KMBBBBCLLLLLMK.'], [15, '.KKKKKKKKKKKKKK.']]),
  g: LAB_E([[6, '.....KKKKKK.....'], [7, '...KKHLLBBMKK...'], [8, '..KHHLBBBBBMMK..'], [9, '..KHLBBBBBBBMK..'], [10, '.KLBBBBBBBBBBMK.'],
    [11, '.KBBBBBBBBBBBMK.'], [12, '.KBBBBBBBBBBBMK.'], [13, 'KBBBBBBBBBBCCLMK'], [14, 'KMBBBBBCLLLLLMDK'], [15, '.KKKKKKKKKKKKKK.']]),
};
const LAB_faces = {
  b: LAB_E([[9, '...KK....KK.....'], [10, '...WWK..KWW.....'], [11, '...EEW..EEW.....'], [12, '...EEW..EEW.....'], [13, '......KK........'], [14, '......W.........']]),
  n: LAB_E([[10, '...WWK..KWW.....'], [11, '...EEW..EEW.....'], [12, '...EEW..EEW.....'], [13, '......KK........']]),
  s: LAB_E([[9, '...KK....KK.....'], [10, '...WWK..KWW.....'], [11, '...WEE..WEE.....'], [12, '...WEE..WEE.....'], [13, '......KK........'], [14, '......W.........']]),
  t: LAB_E([[9, '..KK.....KK.....'], [10, '..WWWK..KWWW....'], [11, '..EEWW..EEWW....'], [12, '..EEWW..EEWW....'], [13, '......KK........'], [14, '......W.........']]),
};
const LAB_sprouts = {
  v: LAB_E([[2, '.....YG.GY......'], [3, '.....GGVGG......'], [4, '......VVV.......'], [5, '.......V........']]),
  w: LAB_E([[2, '....YY...YG.....'], [3, '.....GGVGGV.....'], [4, '.......V........'], [5, '.......V........']]),
  a: LAB_E([[2, '.....YG.........'], [3, '....YGGV.G......'], [4, '......VVGY......'], [5, '.......V........']]),
};
const LAB_add = (id, b, f, s) => { ROWS['blob_lab' + id] = compose(16, 16, [[LAB_bodies[b]], [LAB_faces[f]], [LAB_sprouts[s]]]); };
for (const b of ['c', 'f', 'g']) LAB_add(b + 'bv', b, 'b', 'v');
for (const f of ['n', 's', 't']) LAB_add('f' + f + 'v', 'f', f, 'v');
for (const s of ['w', 'a']) LAB_add('fb' + s, 'f', 'b', s);
const LAB_ids = Object.keys(ROWS).filter(k => k.startsWith('blob_lab'));

var SPEC = {
  title: 'Gosma (16x16) — secao blob (LAB)',
  sizes: Object.keys(ROWS).filter(k => k.startsWith('blob_')).map(k => [k, 16, 16]),
  grounded: Object.keys(ROWS).filter(k => k.startsWith('blob_')),
  groups: [
    { title: 'LAB corpos (c=redondo f=base reta g=gota), rostos e brotos (10x)', scale: 10, items: LAB_ids.map(k => [k, 'blobLab']) },
    { title: 'LAB (3x)', scale: 3, items: LAB_ids.map(k => [k, 'blobLab']) },
  ],
  strips: [],
  tracks: [],
  context: LAB_ids.map(k => [k, 'blobLab']).concat([['h_stand', 'hero'], ['H_stand', 'hero']]),
};
