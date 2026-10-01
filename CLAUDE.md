# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site institucional estático da ONG "Vidas em Ação": HTML, CSS e JavaScript puros, **sem etapa de build**. O código-fonte é o próprio artefacto publicado (GitHub Pages, raiz da branch `main`). Todo o conteúdo, comentários e mensagens estão em português.

## Comandos

```bash
npm install && npx playwright install chromium   # 1.ª vez (Node >= 18)
npm start                    # serve . na porta 4173 → http://localhost:4173/
npm test                     # Playwright, projetos "desktop" e "mobile" (arranca o servidor sozinho)
npx playwright test -g "filtra fotos"            # um teste pelo nome
npx playwright test --project=mobile             # só um projeto
npm run test:ui              # modo interativo
```

Não há linter nem compilador. Os ficheiros JS têm `// @ts-check` + JSDoc: a verificação de tipos é feita pelo editor, por isso mantenha as anotações JSDoc (incluindo os casts `/** @type {…} */ (…)`) ao editar.

## Arquitetura

### JavaScript: scripts clássicos + namespace global `VEA`
- **Não usar ES Modules** (`import`/`export`): o site tem de funcionar também via `file://`. Cada ficheiro é uma IIFE `(function (VEA) { … })(window.VEA)` que regista `VEA.<nome> = { init, … }`.
- `js/core/utils.js` cria `window.VEA` e `VEA.utils` (`$`, `$$`, `rafThrottle`, `afterAnimation`, `prefersReducedMotion`, `wait`) — tem de ser carregado primeiro.
- `js/scripts.js` é o bootstrap: percorre a lista `MODULES` e chama `init()` de cada um dentro de `try/catch`. Um módulo só atua se encontrar os seus `data-*` na página.
- **Adicionar um módulo exige três passos:** criar `js/modules/<nome>.js`, acrescentar o `<script defer>` antes de `scripts.js` em **todas** as páginas `*.html` da raiz (a lista é idêntica em todas) e adicionar o nome em `MODULES` no `scripts.js` (a ordem importa).
- Módulos comunicam através do namespace (ex.: `lightbox` usa `VEA.dialog.close`, e respeita itens escondidos pelo `filter` via `[hidden]`/`[data-leaving]`).
- `js/services/contact-service.js` isola o envio do formulário; por omissão é simulado. Para um backend real, define-se `ENDPOINT` nesse ficheiro sem tocar na UI.

### CSS: camadas `@layer`
- `css/estilos.css` é o único ponto de entrada; declara `@layer tokens, base, layout, components, pages, utilities` e importa cada ficheiro na sua camada. Novos ficheiros CSS têm de ser registados aí.
- A precedência vem da ordem das camadas, não da especificidade — evitar `!important` e seletores longos. Atenção: uma regra em `layout` perde para `components` (foi a causa de um bug corrigido na 0.5.2).
- Design tokens em `css/base/tokens.css`; o tema escuro só redefine os tokens semânticos `--color-*` sob `[data-theme="dark"]`. Nomenclatura estilo BEM (`.card__icon`, `.btn--primary`).

### Páginas HTML
- As páginas ficam na **raiz** (`index.html`, `projetos.html`, `galeria.html`, `contato.html`) e usam caminhos relativos (`css/…`, `js/…`, `imagens/…`). `html/*.html` são apenas redirecionamentos dos endereços antigos — não editar conteúdo aí.
- As páginas partilham cabeçalho, rodapé, modal "Quero ajudar" e lista de scripts **duplicados em cada ficheiro** (não há templates) — alterações comuns têm de ser replicadas nas quatro.
- Cada `<head>` tem meta tags Open Graph com URLs **absolutas** do GitHub Pages (`og:url`, `og:image`, `canonical`) — atualizar se o domínio mudar. Tem também um script inline que aplica o tema (`localStorage` chave `vea-theme`) e a classe `js` antes da pintura, para evitar flash; `theme.js` assume isso.
- O comportamento é ligado por atributos `data-*` (`data-reveal`, `data-count`, `data-dialog-open`, `data-filter`/`data-filter-item`, `data-lightbox-item`, `data-theme-toggle`…); a tabela completa está no README. Sem JS, todo o conteúdo tem de continuar visível e os links funcionais.
- Acessibilidade é requisito testado: `aria-current` no menu, `aria-expanded`/focus trap no menu móvel, `<dialog>` nativo com devolução de foco, `aria-invalid`/`aria-describedby` no formulário, regiões `aria-live`, `prefers-reduced-motion`. Animações só com `transform`/`opacity`.

## Testes

Toda a suite está em `tests/e2e/site.spec.js`. Cada página deve ter um único `h1` e exatamente um `.nav__link[aria-current="page"]`, e carregar sem erros de JS. Testes só de mobile usam `test.skip(!isMobile, …)`.

## Convenções

- Conventional Commits (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`…) e SemVer com tags `vX.Y.Z`; registar alterações em `CHANGELOG.md` (Keep a Changelog, secção `[Unreleased]`).
- Branches a partir de `main` (`feat/…`, `fix/…`, `docs/…`); `npm test` deve passar antes do PR.
- `node_modules/`, relatórios do Playwright (`test-results/`, `playwright-report/`) e `.DS_Store` estão no `.gitignore` e não devem ser versionados.
