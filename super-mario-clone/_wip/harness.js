/* harness: roda cenas reais do jogo com a secao em teste e monta um "filme" quadro a quadro (3x).
   Usado pelo _wip/build.ps1 com #item=<secao>&part=<n>. */
(function () {
  function run() {
    frame = () => {};                      // para o loop do jogo; o harness controla os ticks
    muted = true;
    const item = (location.hash.match(/item=(\w+)/) || [])[1] || 'hero';
    const part = +((location.hash.match(/part=(\d+)/) || [])[1] || 1);
    const rows = []; let cur = null;
    const row = t => { cur = { title: t, shots: [] }; rows.push(cur); };
    const grab = (label, wx, wy, w, h) => {
      render();
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(cv, Math.round(wx - camX), Math.round(wy), w, h, 0, 0, w, h);
      cur.shots.push({ c, label: String(label) });
    };
    const step = (n, down = []) => { for (let i = 0; i < n; i++) { for (const k of down) keys[k] = true; update(); } for (const k in keys) keys[k] = false; };
    const tap = k => { pressed[k] = true; };
    const realUP = updatePlayer;
    const begin = (heroOn = true) => {
      startGame(); G.timer = 0; update(); parts = [];
      updatePlayer = heroOn ? realUP : () => {};
      if (!heroOn) p.x = -200;
    };
    const park = () => { updatePlayer = () => {}; p.x = -200; p.vx = 0; };
    const R = 'ArrowRight', L = 'ArrowLeft', RUN = 'ShiftLeft', JMP = 'Space';
    const box = big => [p.x - 14, p.y + p.h - (big ? 36 : 20), 40, big ? 38 : 22];
    const hs = () => heroSprite(p, p.h === 32);
    const eachChange = (n, down, big) => {
      for (let t = 0, k = 0, last = p.walkF; k < n && t < 300; t++) {
        step(1, down);
        if (p.walkF !== last) { last = p.walkF; grab(hs(), ...box(big)); k++; }
      }
    };
    const stompOn = e => { p.x = e.x + 1; p.y = e.y - 14; p.vy = 2; p.ground = false; p.prevBottom = e.y; step(1); };
    const firstOf = type => { const e = enemies.find(o => o.type === type); enemies = [e]; e.active = true; camX = e.x - 120; return e; };

    const SCN = {
      hero(pt) {
        const big = pt === 2;
        if (pt === 1 || pt === 2) {
          const tag = big ? 'grande' : 'pequeno';
          const start = () => { begin(); enemies = []; p.x = 3 * T; if (big) { grow(1); step(46); } };
          row(tag + ' andando a 1,5 px/tick (um quadro a cada troca)'); start(); step(40, [R]); eachChange(8, [R], big);
          row(tag + ' correndo a 2,5 px/tick (um quadro a cada troca)'); start(); step(70, [R, RUN]); eachChange(8, [R, RUN], big);
          row(tag + ' pulando segurando o botao (a cada 4 ticks)'); start(); step(2); tap(JMP);
          for (let i = 0; i < 12; i++) { step(i ? 4 : 1, [R, JMP]); grab(hs(), p.x - 14, p.y + p.h - (big ? 40 : 26), 40, big ? 44 : 30); }
          row(tag + ': derrapagem (correndo e virando) e aterrissagem de queda alta'); start(); step(60, [R, RUN]);
          for (let i = 0; i < 3; i++) { step(i ? 3 : 1, [L]); grab(hs(), ...box(big)); }
          p.vx = 0; p.y = 13 * T - p.h - 64; p.vy = 0; p.ground = false; step(1);
          for (let t = 0; t < 80 && !(p.landT > 0); t++) step(1);
          grab('aterrissou: ' + hs(), ...box(big)); step(2); grab(hs(), ...box(big)); step(5); grab(hs(), ...box(big));
          row(tag + ' parado e mexendo a orelha'); start(); step(2); p.idle = 10; grab(hs(), ...box(big)); p.idle = 155; grab(hs(), ...box(big));
        } else {
          row('crescendo (a cada 5 ticks)'); begin(); enemies = []; p.x = 4 * T; step(2); grow(1);
          for (let i = 0; i < 9; i++) { grab('t=' + i * 5, p.x - 14, 13 * T - 36, 40, 38); step(5); }
          row('encolhendo ao levar dano (a cada 5 ticks)'); begin(); enemies = []; p.x = 4 * T; grow(1); step(46); p.inv = 0; hurt();
          for (let i = 0; i < 9; i++) { grab('t=' + i * 5, p.x - 14, 13 * T - 36, 40, 38); step(5); }
          row('fogo: arremessando (a cada 3 ticks)'); begin(); enemies = []; p.x = 4 * T; grow(1); step(46); grow(2); step(46); tap('KeyX'); step(1);
          for (let i = 0; i < 6; i++) { grab(hs(), p.x - 14, 13 * T - 36, 64, 38); step(3); }
          row('estrela: andando com a paleta trocando (a cada 3 ticks)'); begin(); enemies = []; p.x = 4 * T; step(2); p.star = 600;
          for (let i = 0; i < 8; i++) { step(3, [R]); grab(heroPal(p, G.tick), ...box(false)); }
          row('morte: susto e queda (a cada 8 ticks)'); begin(); enemies = []; p.x = 4 * T; step(2); die();
          for (let i = 0; i < 7; i++) { step(i ? 8 : 1); grab(hs(), p.x - 14, Math.min(p.y - 12, 13 * T - 36), 40, 40); }
          row('mastro: escorregando (a cada 6 ticks)'); begin(); enemies = []; camX = POLE - 140; p.x = POLE - 8; p.y = 100; p.vy = 0; p.ground = false; step(1);
          for (let i = 0; i < 6; i++) { step(i ? 6 : 1); grab(hs(), POLE - 14, p.y - 4, 40, 36); }
        }
      },
      herobig(pt) { SCN.hero(pt === 2 ? 3 : 2); },
      blob() {
        row('andando (a cada 3 ticks)'); begin(false); let e = firstOf('blob');
        for (let i = 0; i < 10; i++) { step(3); grab(blobSprite(e, G.tick).id, e.x - 13, e.y - 8, 42, 26); }
        row('piscando (um quadro por tick)'); e.anim = 140 - (e.seed % 140) - 3;
        for (let i = 0; i < 9; i++) { step(1); grab(blobSprite(e, G.tick).id, e.x - 13, e.y - 8, 42, 26); }
        row('pisada pelo heroi: impacto e gotas'); begin(); e = firstOf('blob'); stompOn(e);
        let tt = 0; for (const t of [0, 2, 4, 7, 11, 16, 22, 28]) { step(t - tt); tt = t; grab('t=' + t, e.x - 21, e.y - 30, 58, 48); }
        row('derrubada por bola de fogo (a cada 4 ticks)'); begin(false); e = firstOf('blob'); flipKill(e, 100);
        for (let i = 0; i < 7; i++) { step(i ? 4 : 1); grab('dead', e.x - 13, Math.min(e.y - 12, 13 * T - 32), 42, 36); }
        row('escala: ao lado do heroi pequeno e do grande'); begin(); e = firstOf('blob'); p.x = e.x - 30; step(1); grab('pequeno', e.x - 44, 13 * T - 38, 76, 40);
        grow(1); step(46); grab('grande', e.x - 44, 13 * T - 38, 76, 40);
      },
      pango() {
        row('andando (a cada 3 ticks)'); begin(false); let e = firstOf('pango');
        for (let i = 0; i < 10; i++) { step(3); grab(pangoSprite(e, G.tick, p.x).id, e.x - 13, e.y - 6, 42, 32); }
        row('pisado: vira bola e, parada, espia'); begin(); e = firstOf('pango'); stompOn(e); grab('pisado', e.x - 13, 13 * T - 36, 42, 38); park();
        for (const s of [30, 100, 108, 118, 128, 140]) { e.shellT = s; grab(pangoSprite(e, G.tick, p.x).id + ' t=' + s, e.x - 13, 13 * T - 36, 42, 38); }
        row('chutado: bola rolando (um quadro por tick)'); begin(); e = firstOf('pango'); stompOn(e); park(); updatePlayer = realUP;
        p.x = e.x - 9; p.y = 13 * T - 16; p.vy = 0; p.vx = 0; p.inv = 0; p.ground = true; step(1); park();
        for (let i = 0; i < 10; i++) { step(1); grab(pangoSprite(e, G.tick, p.x).id, e.x - 13, 13 * T - 20, 42, 22); }
        row('derrubado (a cada 4 ticks)'); begin(false); e = firstOf('pango'); flipKill(e, 100);
        for (let i = 0; i < 7; i++) { step(i ? 4 : 1); grab('dead', e.x - 13, Math.min(e.y - 12, 13 * T - 40), 42, 44); }
        row('escala: ao lado do heroi pequeno e do grande'); begin(); e = firstOf('pango'); p.x = e.x - 30; step(1); grab('pequeno', e.x - 44, 13 * T - 38, 76, 40);
        grow(1); step(46); grab('grande', e.x - 44, 13 * T - 38, 76, 40);
      },
      items() {
        const follow = (it, n, every, h = 30) => { for (let i = 0; i < n; i++) { step(i ? every : 1); if (!it || it.rm) { grab('sumiu', camX + 80, 9 * T - 20, 40, h); continue; } const f = itemSprite(it, G.tick); grab(f.id + ' ' + f.pal, it.x - 12, it.y - (h - 18), 40, h); } };
        row('maca saindo do bloco e deslizando (a cada 5 ticks)'); begin(false); enemies = []; camX = 21 * T - 100; hitBlock(21, 9); follow(items[items.length - 1], 10, 5);
        row('pimenta saindo do bloco e tremulando (a cada 3 ticks)'); begin(false); enemies = []; p.power = 1; camX = 21 * T - 100; hitBlock(21, 9); follow(items[items.length - 1], 10, 3);
        row('coracao saindo do bloco escondido e pulsando (a cada 4 ticks)'); begin(false); enemies = []; camX = 64 * T - 100; hitBlock(64, 9); follow(items[items.length - 1], 10, 4);
        row('estrela saindo e quicando (a cada 5 ticks)'); begin(false); enemies = []; camX = 100 * T - 100; hitBlock(100, 9); follow(items[items.length - 1], 10, 5, 50);
        row('heroi pegando a maca (brilhos e crescimento, a cada 4 ticks)'); begin(); enemies = []; p.x = 4 * T; step(2);
        items.push({ type: 'grow', x: p.x + 14, y: 13 * T - 16, w: 16, h: 16, vx: 0, vy: 0, dir: -1, emerge: 0, started: true });
        for (let i = 0; i < 8; i++) { step(i ? 4 : 1, [R]); grab('t=' + i * 4, p.x - 16, 13 * T - 40, 48, 42); }
      },
      fx() {
        row('moeda saltando do bloco (a cada 2 ticks)'); begin(false); enemies = []; camX = 16 * T - 100; hitBlock(16, 9);
        for (let i = 0; i < 14; i++) { step(i ? 2 : 1); grab(coinPops[0] ? coinSprite(coinPops[0].t) : 'fim', 16 * T - 12, 9 * T - 64, 40, 84); }
        row('tijolo quebrando (a cada 3 ticks)'); begin(false); enemies = []; p.power = 1; camX = 20 * T - 100; hitBlock(20, 9);
        for (let i = 0; i < 9; i++) { step(i ? 3 : 1); grab('t=' + i * 3, 20 * T - 32, 9 * T - 40, 80, 100); }
        row('bola de fogo quicando e estourando no cano (a cada 2 ticks)'); begin(); enemies = []; p.x = 24 * T; grow(1); step(46); grow(2); step(46); tap('KeyX'); step(1);
        let fx = p.x + 20;
        for (let i = 0; i < 12; i++) { step(i ? 2 : 1); const f = fireballs[0]; if (f) fx = f.x; grab(f ? fireSprite(f) : 'estouro', fx - 16, 13 * T - 40, 40, 42); }
        row('poeira, brilho e impacto no jogo (a cada 3 ticks)'); begin(); enemies = []; p.x = 4 * T; step(2);
        dust(p.x + 6, 13 * T - 1, 3); sparkle(p.x + 24, 13 * T - 22); burst(p.x + 36, 13 * T - 10); goo(p.x + 46, 13 * T - 4);
        for (let i = 0; i < 7; i++) { step(i ? 3 : 1); grab('t=' + i * 3, p.x - 10, 13 * T - 34, 74, 38); }
      },
    };
    try { (SCN[item] || SCN.hero)(part); } catch (e) { (window.__errs = window.__errs || []).push('harness: ' + e.message); }

    /* monta o filme */
    const S = 3, Wd = 1360;
    const out = document.createElement('canvas'); out.width = Wd; out.height = 1500;
    out.style.cssText = 'position:fixed;left:0;top:0;z-index:99;width:' + Wd + 'px;height:1500px;image-rendering:pixelated';
    document.body.appendChild(out);
    const x = out.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = '#1b1d24'; x.fillRect(0, 0, Wd, out.height);
    const text = (t, X, Y, col = '#e8eaf0', size = 13, bold) => { x.fillStyle = col; x.font = (bold ? 'bold ' : '') + size + 'px Segoe UI, Arial, sans-serif'; x.fillText(t, X, Y); };
    let y = 8;
    text('Cenas reais do jogo — secao ' + item + ', parte ' + part + ' (3x)', 8, y + 16, '#fcc43c', 18, true); y += 30;
    const errs = window.__errs || [];
    if (errs.length) { x.fillStyle = '#5a1010'; x.fillRect(8, y, Wd - 16, 18 * Math.min(errs.length, 10) + 10); errs.slice(0, 10).forEach((m, i) => text('PROBLEMA: ' + m, 16, y + 18 + i * 18, '#ffb0b0', 13, true)); y += 18 * Math.min(errs.length, 10) + 18; }
    for (const r of rows) {
      text(r.title, 8, y + 14, '#9aa1b2', 13, true); y += 20;
      let X = 8, rowH = 0;
      for (const s of r.shots) {
        const w = s.c.width * S, h = s.c.height * S;
        if (X + w > Wd - 8) { X = 8; y += rowH + 18; rowH = 0; }
        x.drawImage(s.c, X, y, w, h);
        text(s.label, X, y + h + 13, '#c8ccd8', 11);
        X += w + 8; rowH = Math.max(rowH, h);
      }
      y += rowH + 26;
    }
  }
  window.addEventListener('load', () => setTimeout(run, 80));
})();
