/* folha da secao pango: rascunhos */
var SPEC = {
  title: 'Pangolim — rascunhos',
  sizes: [],
  grounded: [],
  groups: [
    { title: 'Rascunhos (10x)', scale: 10, items: Object.keys(ROWS).filter(k => k.startsWith('pango_')).map(k => [k, 'pango']) },
    { title: 'Rascunhos (3x)', scale: 3, items: Object.keys(ROWS).filter(k => k.startsWith('pango_')).map(k => [k, 'pango']) },
    { title: 'Rascunhos (1x)', scale: 1, items: Object.keys(ROWS).filter(k => k.startsWith('pango_')).map(k => [k, 'pango']) },
  ],
  strips: [],
  tracks: [],
  context: [['pango_t0', 'pango'], ['h_stand', 'hero'], ['H_stand', 'hero']],
};
