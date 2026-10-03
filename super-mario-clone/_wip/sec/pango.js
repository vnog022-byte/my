/* ---- Pangolim (rascunho de silhueta) ---- */
PAL.pango = { K: '#2c1a12', D: '#5c2e16', M: '#96501e', A: '#d0882e', H: '#f4c464', S: '#f8d4bc', T: '#e0a490', U: '#b07068', E: '#1c1828', W: '#fcfcfc', C: '#f0e4c8', s: '#d0882e' };
const PANGO_BODY = [
  '................',
  '.......KKKK.....',
  '.....KKssssKK...',
  '....KssssssssK..',
  '...KSssssssssK..',
  '..KSSSsssssssK..',
  '.KSSWESssssssK..',
  'KSSSEESsssssssK.',
  'KTSSSSSsssssssK.',
  '.KKKTSSsssssssK.',
  '...KTSSssssssssK',
  '..KCKSSssssssssK',
  '.KCCTSSssssssssK',
  '..KKTSSssssssssK',
  '...KTSSssssssssK',
  '...KTSSsssssssK.',
  '....KTSsssssssK.',
  '....KTTsssssssK.',
  '.....KKsssssKK..',
  '.......KKKKK....',
];
const PANGO_TAIL = [
  '..KKK',
  '.KsssK',
  '.KssssK',
  'KsssssK',
  'KssssK',
  '.KsssK',
  '..KKK.',
];
const PANGO_LEGS = [
  '.....KTTK.KMMK..',
  '....KTTK...KMMK.',
  '...KCCCK...KCCCK',
];
ROWS.pango_t0 = compose(16, 24, [[PANGO_TAIL, 10, 15], [PANGO_BODY, 0, 1], [PANGO_LEGS, 0, 21]]);
function pangoSprite(e, tick, px) { return { id: 'pango_t0', pal: 'pango' }; }
