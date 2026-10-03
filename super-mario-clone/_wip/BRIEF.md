# Brief para agentes de arte

Projeto: `/home/user/my/super-mario-clone/index.html` — plataforma 2D no estilo NES (Mundo 1-1), canvas 256x240.
Os personagens são ORIGINAIS (herói = criatura verde-água com orelhas, "blob" e "pango" = inimigos).
Não copie sprites de Nintendo pixel a pixel. Use sprites de NES (SMB1 e outros) só como REFERÊNCIA de
qualidade, leitura de silhueta, ciclo de caminhada, número de cores e clareza a 1x.

## Estrutura
- Toda a arte fica entre `/* ART-BEGIN */` e `/* ART-END */` no `index.html`, dividida em seções
  `/* SEC:<nome> */ ... /* END:<nome> */`: hero, herobig, blob, pango, items, fx.
- Cópia de trabalho de cada seção: `_wip/sec/<nome>.js` (é ESTE arquivo que você edita).
- `_wip/spec/<nome>.js` define o que a folha de prévia mostra (pode ajustar se precisar).
- Leia `_wip/art_sections.js` e o início do bloco ART no `index.html` para entender ROWS/PAL/spr/heroSprite/stepWalk.

## Prévia (OBRIGATÓRIO olhar as imagens a cada iteração)
    cd /home/user/my/super-mario-clone && node _wip/build.mjs <nome> <worker|critic>
Gera `_wip/out/<who>/<nome>-frames.png`, `-anim.png`, `-track.png`, `-game<N>.png`. Abra com a ferramenta Read.
"Failed to load resource: net::ERR_FAILED" é só a fonte do Google bloqueada — ignore. Qualquer outro erro é bug.

## Regras
- Não edite `index.html` diretamente (o líder integra). Não mexa em seções de outros agentes.
- Mantenha os nomes de quadros e a API (funções de escolha de quadro) que o jogo usa; pode adicionar quadros.
- Paleta limitada estilo NES (3 cores + transparente por paleta), contorno legível, sem pixels soltos/"ruído".
- Caminhada: pés NÃO podem patinar (veja a trilha -track), pernas com passada clara e contato com o chão,
  corpo com leve bob; leitura imediata a 1x (tamanho real) — confira sempre nas capturas -game.
