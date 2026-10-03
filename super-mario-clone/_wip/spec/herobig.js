/* folha da secao herobig: heroi grande (16x32). Usa a cabeca e as paletas da secao hero. */
const SPEC_mock = o => Object.assign({ state: 'play', ground: true, vx: 0, vy: 0, anim: 0, landT: 0, skid: false, throwT: 0, idle: 0, power: 1, star: 0, t: 0, walkF: 0, walkD: 0 }, o);
const SPEC_walk = (vx, n, title, pal = 'hero', thr = 0) => {
  let m;
  return { title, n, cw: 24, ch: 38, scale: 3, reset: () => { m = SPEC_mock({ vx }); },
    frame: () => { stepWalk(m, true); m.throwT = thr; return { id: heroSprite(m, true), pal, label: heroPose(m, true) + (thr ? '_t' : '') }; } };
};
const SPEC_track = (vx, n, title) => {
  let m, X;
  return { title, n, scale: 2, w: 104, h: 32, reset: () => { m = SPEC_mock({ vx }); X = 6; },
    frame: () => { X += m.vx; stepWalk(m, true); return { id: heroSprite(m, true), pal: 'hero', x: X - 2, label: heroPose(m, true) }; } };
};
/* trilha dos pes: cada tick desenha so as 6 ultimas linhas do sprite, na posicao real (o pe de apoio deve formar colunas retas) */
const SPEC_feet = (title) => {
  const trace = (vx, n, w) => ({ extra: (x2, X, Y, s) => {
    const m = SPEC_mock({ vx }); let px = 3;
    x2.fillStyle = 'rgba(255,255,255,0.25)'; for (let gx = 0; gx < w; gx += 4) x2.fillRect(X + gx * s, Y, 1, n * 5 * s);
    for (let i = 0; i < n; i++) {
      px += m.vx; stepWalk(m, true);
      x2.drawImage(spr(heroSprite(m, true), 'hero'), 0, 28, 16, 4, X + Math.round(px - 2) * s, Y + i * 5 * s, 16 * s, 4 * s);
      x2.fillStyle = '#000'; x2.fillRect(X, Y + (i * 5 + 4) * s, w * s, 1);
    }
  }, label: (vx === 1.5 ? 'andando' : 'correndo') + ' ' + n + ' ticks' });
  const L = [trace(1.5, 26, 60), trace(2.5, 20, 72)];
  return { title, n: 2, cw: 72, ch: 26 * 5 + 3, scale: 3, frame: i => L[i] };
};
const SPEC_jump = () => {
  let m, Y;
  return {
    title: 'Pulo segurando o botao, queda e aterrissagem (a cada 5 ticks, altura real, 2x)', n: 14, cw: 24, ch: 110, scale: 2,
    reset: () => { m = SPEC_mock({ vx: 1.2, ground: false, vy: -4.3 }); Y = 0; },
    frame: i => {
      for (let k = 0; k < (i ? 5 : 0); k++) {
        if (!m.ground) { m.vy = Math.min(m.vy + (m.vy < 0 ? 0.125 : 0.36), 4.6); Y += m.vy; if (Y >= 0) { Y = 0; m.ground = true; m.vy = 0; m.landT = 5; } }
        else if (m.landT > 0) m.landT--;
        stepWalk(m, true);
      }
      return { id: heroSprite(m, true), pal: 'hero', dy: Math.round(Y), label: heroPose(m, true) };
    },
  };
};
/* mastro do heroi grande: o mastro verde fica nas colunas 12-13 do sprite */
const SPEC_pole = () => ({
  title: 'Mastro (grande), derrapagem e aterrissagem (3x)', n: 8, cw: 24, ch: 38, scale: 3,
  frame: i => {
    if (i < 4) {
      const m = SPEC_mock({ state: 'flag', anim: i });
      return { id: heroSprite(m, true), pal: 'hero', dy: -2, label: heroPose(m, true),
        under: (x2, X, Y, s) => { x2.fillStyle = '#80d010'; x2.fillRect(X + (4 + 12) * s, Y, 2 * s, 35 * s); } };
    }
    const m = SPEC_mock(i < 6 ? { vx: -1.2, skid: true } : { landT: 3 });
    if (i % 2) m.throwT = 5;
    return { id: heroSprite(m, true), pal: i % 2 ? 'heroF' : 'hero', label: heroSprite(m, true).slice(2) };
  },
});
var SPEC = {
  title: 'Heroi grande (16x32) — secao herobig',
  sizes: Object.keys(ROWS).filter(k => k.startsWith('H_')).map(k => [k, 16, 32]),
  grounded: ['stand', 'stand2', 'skid', 'land'].concat(HERO_WALK_B).map(k => 'H_' + k)
    .concat(['stand', 'skid', 'land'].concat(HERO_WALK_B).map(k => 'H_' + k + '_t')),
  groups: [
    { title: 'Locomocao (7x) — parado, orelha e ciclo de caminhada', scale: 7, items: ['stand', 'stand2'].concat(HERO_WALK_B).map(k => ['H_' + k, 'hero']) },
    { title: 'Acoes (6x)', scale: 6, items: ['jump', 'fall', 'skid', 'land', 'duck', 'climb1', 'climb2'].map(k => ['H_' + k, 'hero']) },
    { title: 'Arremessando bola de fogo (paleta de fogo, 5x)', scale: 5, items: ['stand'].concat(HERO_WALK_B, ['jump', 'fall', 'skid', 'land']).map(k => ['H_' + k + '_t', 'heroF']) },
    { title: 'Paletas: normal, fogo e as 3 da estrela (4x)', scale: 4, items: ['hero', 'heroF', 'heroS1', 'heroS2', 'heroS3'].map(p => ['H_' + HERO_WALK_B[0], p]) },
    { title: 'Tamanho real 2x: parado, ciclo, acoes', scale: 2, items: ['stand'].concat(HERO_WALK_B, ['jump', 'fall', 'skid', 'land', 'climb1', 'climb2', 'stand_t']).map(k => ['H_' + k, 'hero']) },
    { title: 'Tamanho real 1x', scale: 1, items: ['stand'].concat(HERO_WALK_B, ['jump', 'fall', 'skid', 'land', 'climb1', 'climb2', 'stand_t']).map(k => ['H_' + k, 'hero']) },
  ],
  strips: [
    SPEC_walk(1.5, 16, 'Andando a 1,5 px/tick — um quadro por tick (3x)'),
    SPEC_walk(2.5, 16, 'Correndo a 2,5 px/tick — um quadro por tick (3x)'),
    SPEC_jump(),
    SPEC_pole(),
    SPEC_feet('Trilha dos pes (2x): uma faixa por tick, so as 6 ultimas linhas, na posicao real; grade a cada 4 px'),
  ],
  tracks: [
    SPEC_track(1.5, 9, 'Trilha andando: 1 linha = 1 tick na posicao real (2x). O pe de apoio deve ficar parado no chao (grade a cada 8 px)'),
    SPEC_track(2.5, 6, 'Trilha correndo: 1 linha = 1 tick (2x)'),
  ],
  context: [['H_stand', 'hero'], ['H_' + HERO_WALK_B[0], 'hero'], ['H_' + HERO_WALK_B[2], 'hero'], ['H_' + HERO_WALK_B[4], 'hero'], ['H_jump', 'hero'], ['H_stand_t', 'heroF'], ['h_stand', 'hero']],
};
