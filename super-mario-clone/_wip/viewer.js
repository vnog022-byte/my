/* viewer: monta a folha de quadros da secao em teste (usado pelo _wip/build.ps1).
   Partes (#part=): frames = quadros ampliados com grade; anim = sequencias no ritmo do jogo;
   track = trilha (uma linha por tick, posicao real no chao) para ver se o pe patina + tamanho real. */
(function () {
  const part = (location.hash.match(/part=(\w+)/) || [])[1] || 'frames';
  const W = 1360, SKY = '#5c94fc', GROUND = '#c84c0c';
  const c = document.createElement('canvas'); c.width = W; c.height = 1500;
  document.body.appendChild(c);
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = '#1b1d24'; x.fillRect(0, 0, W, c.height);
  let y = 8;
  const text = (t, X, Y, col = '#e8eaf0', size = 13, bold) => { x.fillStyle = col; x.font = (bold ? 'bold ' : '') + size + 'px Segoe UI, Arial, sans-serif'; x.fillText(t, X, Y); };
  const problems = (window.__errs || []).slice();
  if (typeof ROWS === 'undefined' || typeof SPEC === 'undefined') {
    problems.push('O codigo da secao nao carregou (veja o erro acima).');
  } else {
    for (const k in ROWS) { const w0 = ROWS[k][0].length; ROWS[k].forEach((r, i) => { if (r.length !== w0) problems.push(k + ': linha ' + i + ' tem ' + r.length + ' colunas (esperado ' + w0 + ')'); }); }
    for (const id of SPEC.grounded || []) if (ROWS[id] && /^\.*$/.test(ROWS[id][ROWS[id].length - 1])) problems.push(id + ': ultima linha vazia (flutua acima do chao)');
    for (const [id, w, h] of SPEC.sizes || []) if (ROWS[id] && (ROWS[id][0].length !== w || ROWS[id].length !== h)) problems.push(id + ': tamanho ' + ROWS[id][0].length + 'x' + ROWS[id].length + ', esperado ' + w + 'x' + h);
  }
  const ok = (id, pal) => {
    if (!ROWS[id]) { problems.push('quadro inexistente: ' + id); return false; }
    if (!PAL[pal]) { problems.push('paleta inexistente: ' + pal); return false; }
    return true;
  };
  text((typeof SPEC !== 'undefined' ? SPEC.title : 'secao') + '  —  parte: ' + part, 8, y + 16, '#fcc43c', 18, true); y += 30;
  const errY = y; y += 6;

  try {
    if (part === 'frames') for (const g of SPEC.groups || []) {
      text(g.title, 8, y + 14, '#9aa1b2', 13, true); y += 22;
      let X = 8, rowH = 0;
      for (const f of g.items) {
        if (!ok(f[0], f[1])) continue;
        const im = spr(f[0], f[1], f[2], f[3]), w = im.width * g.scale, h = im.height * g.scale;
        if (X + w > W - 8) { X = 8; y += rowH + 20; rowH = 0; }
        x.fillStyle = SKY; x.fillRect(X, y, w, h);
        x.drawImage(im, X, y, w, h);
        if (g.grid !== false && g.scale >= 6) {
          x.fillStyle = 'rgba(0,0,0,0.10)';
          for (let i = 1; i < im.width; i++) x.fillRect(X + i * g.scale, y, 1, h);
          for (let j = 1; j < im.height; j++) x.fillRect(X, y + j * g.scale, w, 1);
        }
        text(f[0] + (f[1] !== g.items[0][1] ? ' · ' + f[1] : ''), X, y + h + 14, '#c8ccd8', 11);
        X += w + 12; rowH = Math.max(rowH, h);
      }
      y += rowH + 30;
    }

    if (part === 'anim') for (const s of SPEC.strips || []) {
      text(s.title, 8, y + 14, '#9aa1b2', 13, true); y += 22;
      const cw = s.cw * s.scale, ch = s.ch * s.scale; let X = 8;
      if (s.reset) s.reset();
      for (let i = 0; i < s.n; i++) {
        const f = s.frame(i);
        if (X + cw > W - 8) { X = 8; y += ch + 20; }
        x.fillStyle = SKY; x.fillRect(X, y, cw, ch);
        x.fillStyle = GROUND; x.fillRect(X, y + ch - 3 * s.scale, cw, 3 * s.scale);
        x.fillStyle = '#000'; x.fillRect(X, y + ch - 3 * s.scale, cw, Math.max(1, s.scale >> 1));
        if (f && f.under) f.under(x, X, y, s.scale);
        if (f && f.id && ok(f.id, f.pal)) {
          const im = spr(f.id, f.pal, f.flip, f.vflip), h = f.h || im.height;
          const dx = Math.round((s.cw - im.width) / 2 + (f.dx || 0)), dy = s.ch - 3 - h + (f.dy || 0);
          x.drawImage(im, X + dx * s.scale, y + dy * s.scale, im.width * s.scale, h * s.scale);
        }
        if (f && f.extra) f.extra(x, X, y, s.scale);
        text((f && f.label) || (f && f.id) || '', X, y + ch + 14, '#c8ccd8', 11);
        X += cw + 8;
      }
      y += ch + 32;
    }

    if (part === 'track') {
      for (const t of SPEC.tracks || []) {
        text(t.title, 8, y + 14, '#9aa1b2', 13, true); y += 22;
        const sc = t.scale, rowH = (t.h + 1) * sc, stageW = Math.min(W - 16, t.w * sc);
        if (t.reset) t.reset();
        for (let i = 0; i < t.n; i++) {
          const f = t.frame(i);
          x.fillStyle = SKY; x.fillRect(8, y, stageW, rowH);
          x.fillStyle = 'rgba(255,255,255,0.18)'; for (let gx = 0; gx < t.w; gx += 8) x.fillRect(8 + gx * sc, y, 1, rowH);
          x.fillStyle = GROUND; x.fillRect(8, y + t.h * sc, stageW, sc);
          if (f && ok(f.id, f.pal)) {
            const im = spr(f.id, f.pal, f.flip, f.vflip);
            x.drawImage(im, 8 + Math.round(f.x) * sc, y + (t.h - im.height) * sc, im.width * sc, im.height * sc);
          }
          text((f && f.label) || '', 8 + stageW + 6, y + rowH - 4, '#c8ccd8', 11);
          y += rowH + 1;
        }
        y += 20;
      }
      if (SPEC.context) {
        text('Tamanho real (1x, 2x e 3x), no ceu e no chao do jogo', 8, y + 14, '#9aa1b2', 13, true); y += 22;
        let X = 8;
        for (const s of [1, 2, 3]) {
          const list = SPEC.context.filter(f => ok(f[0], f[1]));
          const w = list.reduce((a, f) => a + (spr(f[0], f[1]).width + 6) * s, 6 * s), h = 40 * s;
          x.fillStyle = SKY; x.fillRect(X, y, w, h); x.fillStyle = GROUND; x.fillRect(X, y + h - 6 * s, w, 6 * s);
          let cx = X + 4 * s;
          for (const f of list) { const im = spr(f[0], f[1], f[2], f[3]); x.drawImage(im, cx, y + h - 6 * s - im.height * s, im.width * s, im.height * s); cx += (im.width + 6) * s; }
          X += w + 16;
        }
        y += 40 * 3 + 20;
      }
    }
  } catch (e) { problems.push('erro no viewer/spec: ' + e.message); }

  if (problems.length) {
    x.fillStyle = '#5a1010'; x.fillRect(8, errY - 4, W - 16, 18 * Math.min(problems.length, 12) + 10);
    problems.slice(0, 12).forEach((p, i) => text('PROBLEMA: ' + p, 16, errY + 12 + i * 18, '#ffb0b0', 13, true));
  }
})();
