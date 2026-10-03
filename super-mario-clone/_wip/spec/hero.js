/* folha da secao hero: heroi pequeno (16x16), cabeca, paletas e escolha de quadro */
const SPEC_mock = o => Object.assign({ state: 'play', ground: true, vx: 0, vy: 0, anim: 0, landT: 0, skid: false, throwT: 0, idle: 0, power: 0, star: 0, t: 0, walkF: 0, walkD: 0 }, o);
const SPEC_jump = (big, sc, ch) => {
  let m, Y;
  return {
    title: 'Pulo segurando o botao, queda e aterrissagem (a cada 5 ticks, altura real)', n: 14, cw: 24, ch, scale: sc,
    reset: () => { m = SPEC_mock({ vx: 1.2, ground: false, vy: -4.3, power: big ? 1 : 0 }); Y = 0; },
    frame: i => {
      for (let k = 0; k < (i ? 5 : 0); k++) {
        if (!m.ground) { m.vy = Math.min(m.vy + (m.vy < 0 ? 0.125 : 0.36), 4.6); Y += m.vy; if (Y >= 0) { Y = 0; m.ground = true; m.vy = 0; m.landT = 5; } }
        else if (m.landT > 0) m.landT--;
        stepWalk(m, big);
      }
      return { id: heroSprite(m, big), pal: 'hero', dy: Math.round(Y), label: heroPose(m, big) };
    },
  };
};
const SPEC_walk = (big, vx, n, sc, ch, title) => {
  let m;
  return { title, n, cw: 24, ch, scale: sc, reset: () => { m = SPEC_mock({ vx, power: big ? 1 : 0 }); },
    frame: () => { stepWalk(m, big); return { id: heroSprite(m, big), pal: 'hero', label: heroPose(m, big) }; } };
};
const SPEC_track = (big, vx, n, title) => {
  let m, X;
  return { title, n, scale: big ? 3 : 4, w: big ? 96 : 72, h: big ? 32 : 16,
    reset: () => { m = SPEC_mock({ vx, power: big ? 1 : 0 }); X = 6; },
    frame: () => { X += m.vx; stepWalk(m, big); return { id: heroSprite(m, big), pal: 'hero', x: X - 2, label: heroPose(m, big) }; } };
};
const SPEC_misc = (big, sc, ch) => ({
  title: 'Derrapagem, susto (morte) e mastro (a mao fica na frente do mastro verde)', n: 12, cw: 24, ch, scale: sc,
  frame: i => {
    if (i < 3) { const m = SPEC_mock({ vx: -1.2, skid: true, power: big ? 1 : 0 }); return { id: heroSprite(m, big), pal: 'hero', label: 'skid' }; }
    if (i < 8) { const m = SPEC_mock({ state: 'die', t: (i - 3) * 8 }); return { id: heroSprite(m, big), pal: 'hero', dy: -[0, 4, 8, 6, 2][i - 3], label: heroPose(m, big) }; }
    const m = SPEC_mock({ state: 'flag', anim: i - 8, power: big ? 1 : 0 });
    return { id: heroSprite(m, big), pal: 'hero', dy: -8 + (i - 8) * 2, label: heroPose(m, big),
      under: (x2, X, Y, s) => { x2.fillStyle = '#80d010'; x2.fillRect(X + (4 + 12) * s, Y, 2 * s, (ch - 3) * s); } };
  },
});
var SPEC = {
  title: 'Heroi pequeno (16x16) — secao hero',
  sizes: ['stand', 'stand2', 'w1', 'w2', 'w3', 'w4', 'jump', 'fall', 'skid', 'land', 'climb1', 'climb2', 'die1', 'die2'].map(k => ['h_' + k, 16, 16]),
  grounded: ['h_stand', 'h_stand2', 'h_w1', 'h_w2', 'h_w3', 'h_w4', 'h_skid', 'h_land'],
  groups: [
    { title: 'Locomocao (10x) — parado, parado mexendo a orelha e o ciclo de caminhada', scale: 10, items: ['stand', 'stand2'].concat(HERO_WALK_S).map(k => ['h_' + k, 'hero']) },
    { title: 'Acoes (8x)', scale: 8, items: ['jump', 'fall', 'skid', 'land', 'climb1', 'climb2', 'die1', 'die2'].map(k => ['h_' + k, 'hero']) },
    { title: 'Paletas: normal, fogo e as 3 da estrela (6x)', scale: 6, items: ['hero', 'heroF', 'heroS1', 'heroS2', 'heroS3'].map(p => ['h_' + HERO_WALK_S[0], p]) },
  ],
  strips: [
    SPEC_walk(false, 1.5, 24, 3, 22, 'Andando a 1,5 px/tick — um quadro por tick (3x)'),
    SPEC_walk(false, 2.5, 16, 3, 22, 'Correndo a 2,5 px/tick — um quadro por tick (3x)'),
    SPEC_jump(false, 2, 90),
    SPEC_misc(false, 3, 28),
  ],
  tracks: [
    SPEC_track(false, 1.5, 14, 'Trilha andando: 1 linha = 1 tick na posicao real. O pe de apoio deve ficar parado no chao (grade a cada 8 px)'),
    SPEC_track(false, 2.5, 10, 'Trilha correndo: 1 linha = 1 tick'),
  ],
  context: [['h_stand', 'hero'], ['h_' + HERO_WALK_S[0], 'hero'], ['h_' + HERO_WALK_S[1], 'hero'], ['h_jump', 'hero'], ['h_skid', 'hero'], ['h_stand', 'heroF'], ['H_stand', 'hero']],
};
