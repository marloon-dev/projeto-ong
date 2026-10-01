# Changelog

Todas as alterações relevantes deste projeto são registadas neste ficheiro.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto
adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/). As mensagens de commit
seguem os [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/).

## [Unreleased]

### Adicionado
- Página Galeria (`galeria.html`) com fotos e vídeos, filtro por tipo e link no menu de todas as páginas.
- Visualizador (lightbox) com setas do teclado, gesto de deslizar, navegação só entre os itens filtrados e vídeos carregados apenas ao abrir.
- `.gitignore` para `node_modules/`, relatórios do Playwright e `.DS_Store`.
- Testes end-to-end com Playwright (desktop e mobile) e scripts `npm start`, `npm test`, `npm run test:ui`.
- README completo: pré-requisitos, instalação, execução, publicação, testes e fluxo de contribuição.

## [1.0.0] - 2026-09-30

### Adicionado
- `README.md` com a arquitetura, os atributos `data-*` e as instruções de uso.
- `CHANGELOG.md` com o histórico de versões.

### Estabilizado
- A API pública passa a ser considerada estável: estrutura de pastas, design tokens e atributos `data-*`.
  Mudanças incompatíveis passam a exigir uma versão MAJOR.

## [0.5.2] - 2026-09-30

### Corrigido
- O botão "Quero ajudar" do cabeçalho sobrepunha-se à marca em ecrãs estreitos
  (a regra de ocultação perdia para a camada `components`).
- O nome da marca já não quebra em várias linhas no mobile.
- Um único projeto filtrado já não ocupa a largura toda: as colunas têm largura estável e ficam centradas (`.grid--projects`).

## [0.5.1] - 2026-09-30

### Corrigido
- A validação no `blur` mostrava o erro entre o `mousedown` e o `mouseup` e empurrava o botão "Enviar", e o clique perdia-se.
  O espaço do erro fica agora reservado e o `blur` não valida quando o foco vai para o botão de envio.

## [0.5.0] - 2026-09-30

### Adicionado
- Validação acessível do formulário de contato (`aria-invalid`, `aria-describedby`, mensagens inline).
- Campo "Assunto", contador de caracteres e pré-seleção via `?assunto=`.
- Notificações (toasts) em região `aria-live`.
- Camada de serviço `contact-service.js`, que isola o envio da interface.

## [0.4.0] - 2026-09-30

### Adicionado
- Entrada de elementos ao fazer scroll (`IntersectionObserver`) com escalonamento (stagger).
- Contadores animados, modal "Quero ajudar" com `<dialog>` nativo e filtro animado de projetos.
- Transições entre páginas com a View Transitions API.
- Suporte a `prefers-reduced-motion`.

## [0.3.0] - 2026-09-30

### Adicionado
- Cabeçalho fixo com glassmorphism, menu móvel acessível (focus trap, Esc) e alternância de tema.
- Hero, faixa de estatísticas, cartões reutilizáveis, rodapé e ilustrações SVG.
- Núcleo JS modular (`core/utils.js` + `modules/*`) com bootstrap tolerante a falhas.

## [0.2.0] - 2026-09-30

### Adicionado
- Design system em `tokens.css`: cores, tipografia fluida, espaçamentos, raios, sombras e movimento.
- Tema claro/escuro por variáveis CSS.
- Arquitetura CSS em camadas (`@layer`), reset moderno e primitivas de layout.

## [0.1.0] - 2026-09-30

### Adicionado
- Estrutura inicial do site: páginas Início, Projetos Sociais e Contato em HTML semântico.

[Unreleased]: https://github.com/marloon-dev/projeto-ong/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/marloon-dev/projeto-ong/compare/v0.5.2...v1.0.0
[0.5.2]: https://github.com/marloon-dev/projeto-ong/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/marloon-dev/projeto-ong/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/marloon-dev/projeto-ong/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/marloon-dev/projeto-ong/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/marloon-dev/projeto-ong/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/marloon-dev/projeto-ong/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/marloon-dev/projeto-ong/releases/tag/v0.1.0
