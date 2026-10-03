/* folha da secao items: maca (crescer), pimenta (fogo), coracao (vida) e estrela (invencivel), todos 16x16 */
const SPEC_types = [['grow', 'maca (crescer)'], ['fire', 'pimenta (fogo)'], ['life', 'coracao (vida extra)'], ['star', 'estrela (invencivel)']];
const SPEC_ids = () => { const s = new Set(); for (const [t] of SPEC_types) for (let k = 0; k < 64; k++) s.add(itemSprite({ type: t }, k).id); return [...s]; };
var SPEC = {
  title: 'Itens (16x16) — secao items',
  sizes: SPEC_ids().map(k => [k, 16, 16]),
  grounded: SPEC_ids(),
  groups: [
    { title: 'Itens (10x)', scale: 10, items: SPEC_types.map(([t]) => { const f = itemSprite({ type: t }, 0); return [f.id, f.pal]; }) },
    { title: 'Todos os quadros e paletas usados na animacao (6x)', scale: 6, items: (() => { const seen = new Set(), out = []; for (const [t] of SPEC_types) for (let k = 0; k < 64; k++) { const f = itemSprite({ type: t }, k), key = f.id + '|' + f.pal; if (!seen.has(key)) { seen.add(key); out.push([f.id, f.pal]); } } return out; })() },
  ],
  strips: SPEC_types.map(([t, name]) => ({ title: name + ' — um quadro por tick (3x)', n: 18, cw: 20, ch: 22, scale: 3,
    frame: i => { const f = itemSprite({ type: t }, i); return Object.assign(f, { label: f.id + ' · ' + f.pal }); } })),
  context: SPEC_types.map(([t]) => { const f = itemSprite({ type: t }, 0); return [f.id, f.pal]; }).concat([['h_stand', 'hero'], ['H_stand', 'hero']]),
};
