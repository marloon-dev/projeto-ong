// @ts-check
/* ==========================================================
   modules/lightbox.js — Visualizador de fotos e vídeos
   - Links normais no HTML (sem JS abrem a imagem / o vídeo).
   - Navega só entre os itens visíveis (respeita o filtro).
   - Setas do teclado, gesto de deslizar, Esc fecha, foco devolvido.
   - O vídeo só é carregado ao abrir e é parado ao fechar.
   Uso: <a href="foto.svg" data-lightbox-item data-type="image|video|youtube"
           data-title="…" data-meta="…" [data-video-id="…"]><img alt="…"></a>
        <dialog class="modal lightbox" data-lightbox>…</dialog>
   ========================================================== */

(function (VEA) {
    'use strict';

    /** @param {string} id */
    const youtubeEmbed = (id) =>
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;

    const init = () => {
        const { $, $$ } = VEA.utils;
        const dialog = /** @type {HTMLDialogElement | null} */ ($('[data-lightbox]'));
        const links = /** @type {HTMLAnchorElement[]} */ ($$('[data-lightbox-item]'));
        if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

        const media = /** @type {HTMLElement} */ ($('[data-lightbox-media]', dialog));
        const title = /** @type {HTMLElement} */ ($('[data-lightbox-title]', dialog));
        const meta = /** @type {HTMLElement} */ ($('[data-lightbox-meta]', dialog));
        const count = /** @type {HTMLElement} */ ($('[data-lightbox-count]', dialog));
        const prev = /** @type {HTMLButtonElement} */ ($('[data-lightbox-prev]', dialog));
        const next = /** @type {HTMLButtonElement} */ ($('[data-lightbox-next]', dialog));

        /** @type {HTMLAnchorElement[]} */
        let visible = [];
        let index = 0;
        /** @type {HTMLAnchorElement | null} */
        let opener = null;

        // Itens escondidos (ou a sair) pelo filtro ficam de fora da navegação
        const collect = () => links.filter((a) => !a.closest('[hidden], [data-leaving]'));

        /** @param {HTMLAnchorElement} link */
        const render = (link) => {
            const type = link.dataset.type || 'image';
            const img = /** @type {HTMLImageElement | null} */ (link.querySelector('img'));
            let node;

            if (type === 'youtube' && link.dataset.videoId) {
                const iframe = document.createElement('iframe');
                iframe.src = youtubeEmbed(link.dataset.videoId);
                iframe.title = link.dataset.title || 'Vídeo';
                iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                node = iframe;
            } else if (type === 'video' && link.dataset.src) {
                const video = document.createElement('video');
                video.src = link.dataset.src;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                if (img) video.poster = img.currentSrc || img.src;
                node = video;
            } else if (type === 'youtube' || type === 'video') {
                // Vídeo ainda sem endereço: mostra a capa com uma mensagem
                node = document.createElement('div');
                node.className = 'lightbox__placeholder';
                const poster = document.createElement('img');
                poster.src = img ? img.currentSrc || img.src : '';
                poster.alt = '';
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = 'Vídeo disponível em breve';
                p.append(strong, 'Acompanhe o nosso canal para ver as novidades.');
                node.append(poster, p);
            } else {
                const full = document.createElement('img');
                full.src = link.href;
                full.alt = img?.alt || '';
                node = full;
            }

            media.replaceChildren(node);
            title.textContent = link.dataset.title || '';
            meta.textContent = link.dataset.meta || '';
            count.textContent = `${index + 1} de ${visible.length}`;
            const single = visible.length < 2;
            prev.hidden = single;
            next.hidden = single;
        };

        /** @param {number} delta */
        const go = (delta) => {
            if (visible.length < 2) return;
            index = (index + delta + visible.length) % visible.length;
            render(visible[index]);
        };

        /** @param {HTMLAnchorElement} link */
        const open = (link) => {
            visible = collect();
            index = Math.max(0, visible.indexOf(link));
            opener = link;
            render(visible[index]);
            dialog.showModal();
        };

        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                // Ctrl/Cmd + clique continua a abrir num novo separador
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                open(link);
            });
        });

        prev.addEventListener('click', () => go(-1));
        next.addEventListener('click', () => go(1));

        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        });

        // Clique no fundo escuro (fora da mídia e dos controlos) fecha
        dialog.addEventListener('click', (e) => {
            const t = /** @type {HTMLElement} */ (e.target);
            if (t === dialog || t.matches('[data-lightbox-media], .lightbox__stage, .lightbox__inner')) VEA.dialog.close(dialog);
        });

        // Deslizar para os lados (toque)
        let startX = 0;
        let startY = 0;
        media.addEventListener('pointerdown', (e) => { startX = e.clientX; startY = e.clientY; });
        media.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'mouse') return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - startY)) go(dx < 0 ? 1 : -1);
        });

        dialog.addEventListener('close', () => {
            media.replaceChildren(); // para o vídeo
            opener?.focus();
        });
    };

    VEA.lightbox = { init };
})(/** @type {any} */ (window).VEA);
