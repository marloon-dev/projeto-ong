# ONG Vidas em Ação — Site institucional

![versão](https://img.shields.io/badge/versão-1.0.0-0b8a51)
![stack](https://img.shields.io/badge/stack-HTML%20·%20CSS%20·%20JS-0e9f8e)
![testes](https://img.shields.io/badge/testes-Playwright-2ead33)

Site institucional da **ONG Vidas em Ação**, que atua há mais de dez anos com educação,
inclusão social e apoio a comunidades em situação de vulnerabilidade. O site apresenta a
organização, os projetos sociais em andamento e um canal de contato para dúvidas,
voluntariado, doações e parcerias.

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias](#tecnologias)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação](#instalação)
6. [Execução em desenvolvimento](#execução-em-desenvolvimento)
7. [Build e publicação](#build-e-publicação)
8. [Testes](#testes)
9. [Estrutura do projeto](#estrutura-do-projeto)
10. [Arquitetura](#arquitetura)
11. [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
12. [Configuração do formulário](#configuração-do-formulário)
13. [Versionamento e contribuição](#versionamento-e-contribuição)
14. [Autoria e licença](#autoria-e-licença)

---

## Visão geral

| Página | Conteúdo |
|---|---|
| `html/index.html` | Hero, números de impacto, Quem Somos (missão e valores), projetos em destaque, como ajudar, redes sociais |
| `html/projetos.html` | Lista de projetos com filtro por área (Educação, Assistência, Saúde), público-alvo e resultados |
| `html/contato.html` | Canais de atendimento e formulário de contato com validação acessível |

O projeto foi pensado para funcionar **sem etapa de build**: os ficheiros podem ser abertos
diretamente no browser ou servidos por qualquer servidor estático.

## Funcionalidades

- Tema **claro/escuro** que segue o sistema, com escolha guardada no browser e sem "flash" ao carregar.
- Cabeçalho fixo com **glassmorphism** e **menu móvel** acessível (focus trap, Esc, clique fora).
- Animações de **entrada ao fazer scroll**, **contadores** e **transições entre páginas** (View Transitions API).
- **Modal "Quero ajudar"** (`<dialog>` nativo) com atalhos para doação, voluntariado e parcerias.
- **Filtro animado** de projetos com anúncio do resultado para leitores de ecrã.
- **Formulário de contato** com validação inline, contador de caracteres, assunto pré-preenchido via URL e notificações (toasts).
- **Skeletons** enquanto as imagens carregam e botão **voltar ao topo**.

## Tecnologias

| Camada | Tecnologia | Utilização |
|---|---|---|
| Estrutura | **HTML5** semântico | `header`, `nav`, `main`, `section`, `article`, `aside`, `dialog`, `dl` |
| Estilos | **CSS moderno** | Custom properties (design tokens), `@layer`, `clamp()`, grid/flex, `backdrop-filter`, `@view-transition` |
| Comportamento | **JavaScript (ES2020+)** | Módulos em namespace `VEA`, `IntersectionObserver`, `requestAnimationFrame`, `localStorage` |
| Tipagem | **JSDoc + `// @ts-check`** | Verificação de tipos no VS Code sem compilar TypeScript |
| Tipografia | **Google Fonts** | Fraunces (títulos) e Inter (texto), com fallback de sistema |
| Imagens | **SVG** | Logótipo e ilustrações vetoriais leves |
| Testes | **Playwright** (`@playwright/test`) | Testes end-to-end em desktop e mobile |
| Servidor local | **serve** | Servidor estático para desenvolvimento e testes |

## Pré-requisitos

| Para… | Precisa de |
|---|---|
| Ver o site | Um browser moderno (Chrome, Edge, Firefox ou Safari atuais) |
| Servidor local e testes | [Node.js](https://nodejs.org/) **18 ou superior** e npm |
| Clonar o repositório | [Git](https://git-scm.com/) |

> As transições entre páginas só funcionam quando o site é servido por HTTP (e não via `file://`)
> e em browsers com suporte à View Transitions API. Nos restantes, as páginas carregam normalmente.

## Instalação

```bash
git clone https://github.com/marloon-dev/projeto-ong.git
cd projeto-ong
npm install                  # instala as dependências de desenvolvimento (serve, Playwright)
npx playwright install chromium   # descarrega o browser usado nos testes (apenas na 1.ª vez)
```

O site em si **não tem dependências de execução**: o `npm install` só é necessário para o
servidor local e para os testes.

## Execução em desenvolvimento

```bash
npm start
```

Abra <http://localhost:4173/html/index.html>.

Alternativas sem Node.js:

- abrir `html/index.html` diretamente no browser;
- usar a extensão **Live Server** do VS Code;
- `python3 -m http.server 4173` na raiz do projeto.

## Build e publicação

Não existe etapa de build: o código-fonte é o próprio artefacto publicado. Para publicar, basta
copiar a raiz do projeto (exceto `node_modules/`, `tests/` e os relatórios de testes) para
qualquer alojamento estático.

**GitHub Pages:** em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
O site fica disponível em `https://marloon-dev.github.io/projeto-ong/html/index.html`.

## Testes

```bash
npm test             # executa todos os testes (desktop + mobile) em modo headless
npm run test:ui      # abre a interface interativa do Playwright
npm run test:report  # abre o relatório HTML da última execução
```

O Playwright arranca automaticamente o servidor local (`npm start`) antes dos testes. A suite
em `tests/e2e/site.spec.js` cobre:

| Cenário | O que valida |
|---|---|
| Carregamento das 3 páginas | Título principal, link ativo no menu e ausência de erros de JavaScript |
| Tema | Alternância claro/escuro e persistência após recarregar |
| Menu móvel | Abertura, fecho com Esc e devolução do foco (apenas no projeto `mobile`) |
| Modal | Abertura e fecho do diálogo "Quero ajudar" |
| Filtro | Número de projetos visíveis e mensagem anunciada |
| Formulário | Erros com `aria-invalid`, foco no 1.º campo inválido, assunto via URL e envio com sucesso |

## Estrutura do projeto

```
projeto-ong/
├── html/                    Páginas (HTML semântico e acessível)
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
├── imagens/                 logo.svg + ilustrações SVG
├── tests/e2e/               Testes end-to-end (Playwright)
├── playwright.config.js     Configuração dos testes (desktop + mobile, servidor local)
├── serve.json               Configuração do servidor estático
├── package.json             Scripts npm e dependências de desenvolvimento
├── CHANGELOG.md             Histórico de versões
└── README.md
```

## Arquitetura

### CSS

- **Design tokens** (`css/base/tokens.css`): cores, tipografia fluida, espaçamento, raios, sombras e
  curvas de movimento. O tema escuro só redefine os tokens semânticos (`--color-*`).
- **Camadas** `@layer tokens, base, layout, components, pages, utilities`: a ordem define a precedência,
  por isso não é preciso `!important` nem seletores longos.
- Nomenclatura inspirada em **BEM** (`.card__icon`, `.btn--primary`).

### JavaScript

- Cada módulo regista-se em `window.VEA` e só atua se encontrar os seus `data-*` na página.
- Os scripts são clássicos com `defer` (e não ES Modules), para que o site funcione também via `file://`.
- `scripts.js` inicia os módulos dentro de `try/catch`: um erro num módulo não afeta os outros.
- A camada **services** isola o acesso a dados da interface.

### Atributos `data-*`

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

## Acessibilidade e desempenho

- Link "saltar para o conteúdo", `aria-current` no menu e foco visível em todos os elementos interativos.
- Menu móvel com `aria-expanded`, focus trap e Esc; modal com `<dialog>` nativo e retorno do foco.
- Erros de formulário com `aria-invalid` + `aria-describedby`; toasts e filtro em regiões `aria-live`.
- `prefers-reduced-motion` desliga o movimento não essencial; sem JavaScript, todo o conteúdo continua visível.
- As animações usam apenas `transform`/`opacity` (composição na GPU, 60 FPS). Scroll e pointer são
  tratados com `requestAnimationFrame` e o reveal com `IntersectionObserver`.
- O espaço das mensagens de erro fica reservado, para evitar saltos de layout (CLS).

## Configuração do formulário

Por omissão o envio é **simulado**. Para ligar a um backend real (ex.: Formspree ou uma API própria),
defina `ENDPOINT` em `js/services/contact-service.js`:

```js
const ENDPOINT = 'https://formspree.io/f/xxxxxxx';
```

Nenhum componente de interface precisa de ser alterado.

## Versionamento e contribuição

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
  (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`…).
- **Versões:** [Versionamento Semântico](https://semver.org/lang/pt-BR/) com tags anotadas `vX.Y.Z`:
  `feat` → MINOR, `fix` → PATCH, `feat!`/`BREAKING CHANGE` → MAJOR.
- **Histórico:** ver [`CHANGELOG.md`](CHANGELOG.md).
- **Fluxo de trabalho:**
  1. Abrir uma *issue* e associá-la à *milestone* da versão.
  2. Criar uma branch a partir de `main` (`feat/…`, `fix/…`, `docs/…`).
  3. Garantir que `npm test` passa.
  4. Abrir um *pull request* descritivo que referencie a issue (`Closes #n`) e fazer merge após revisão.

## Autoria e licença

Desenvolvido por **Marlon** ([@marloon-dev](https://github.com/marloon-dev)).
© 2026 ONG Vidas em Ação. Todos os direitos reservados.
