# ONG Vidas em Ação — Site institucional

HTML + CSS + JavaScript puros, sem build: abre `html/index.html` diretamente no browser
(ou com a extensão Live Server do VS Code para ativar as transições entre páginas).

## Estrutura

```
projeto-ong/
├── html/                    Páginas (HTML semântico, acessível)
│   ├── index.html
│   ├── projetos.html
│   └── contato.html
├── css/
│   ├── estilos.css          Ponto de entrada — @layer + @import
│   ├── base/                tokens.css (design system), reset.css, typography.css
│   ├── layout/              layout.css (container, grid, split), header.css, footer.css
│   ├── components/          button, hero, card, form, overlay (modal + toast)
│   ├── pages/               pages.css (composições específicas)
│   └── utilities/           animations.css (keyframes, reveal, view transitions)
├── js/
│   ├── core/utils.js        Helpers partilhados ($, $$, rafThrottle…)
│   ├── services/            contact-service.js (camada de dados / API)
│   ├── modules/             theme, header, nav, reveal, counter, card-glow,
│   │                        images, toast, dialog, filter, form
│   └── scripts.js           Bootstrap: inicia cada módulo isoladamente
└── imagens/                 logo.svg + ilustrações SVG (substituíveis por fotos)
```

## Como funciona

- **Design tokens** (`css/base/tokens.css`): cores, tipografia fluida (`clamp`), espaçamento,
  raios, sombras e curvas de movimento. O tema escuro só redefine as variáveis semânticas.
- **Camadas CSS** (`@layer tokens, base, layout, components, pages, utilities`): a ordem
  define a precedência, por isso não é preciso `!important` nem seletores longos.
- **Módulos JS**: cada um regista-se em `window.VEA` e só atua se encontrar os seus
  `data-*` na página. Escolhemos scripts clássicos com `defer` (em vez de ES Modules)
  para que o site funcione também aberto via `file://`.
- **Tipagem**: `// @ts-check` + JSDoc — o VS Code valida os tipos sem precisar de compilar TypeScript.

## Data-attributes disponíveis

| Atributo | Efeito |
|---|---|
| `data-reveal` / `="left"` / `="right"` / `="scale"` | Entrada animada ao entrar na viewport |
| `data-reveal-group` | Escalona (stagger) os `data-reveal` filhos |
| `data-count="300" data-prefix="+"` | Contador animado |
| `data-dialog-open="id"` / `data-dialog-close` | Abre/fecha um `<dialog class="modal">` |
| `data-filter` + `data-filter-value` / `data-filter-item data-category` | Filtro com animação |
| `data-theme-toggle` | Botão claro/escuro |
| `class="card--glow"` | Borda luminosa que segue o cursor |
| `class="skeleton"` | Shimmer enquanto a imagem carrega |

## Ligar o formulário a um backend

Em `js/services/contact-service.js`, define `ENDPOINT` (ex.: Formspree). Enquanto for `null`,
o envio é simulado.

## Acessibilidade e performance

- Skip link, `aria-current`, foco visível, menu móvel com focus trap e Esc, `<dialog>` nativo,
  erros de formulário com `aria-invalid` + `aria-describedby`, toasts em `aria-live`.
- Todas as animações usam `transform`/`opacity`; scroll e pointer com `requestAnimationFrame`;
  reveal com `IntersectionObserver`. `prefers-reduced-motion` desliga o movimento não essencial.
- Sem JavaScript, todo o conteúdo continua visível (o reveal só esconde com a classe `.js`).
