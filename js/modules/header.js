// @ts-check
/* ==========================================================
   modules/header.js — Estado do cabeçalho ao fazer scroll
   barra de progresso de leitura e botão "voltar ao topo".
   Usa rAF para não bloquear o scroll.
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $, rafThrottle, prefersReducedMotion } = VEA.utils;
        const header = $('[data-header]');
        const backToTop = $('[data-back-to-top]');

        // Barra de progresso (decorativa) criada aqui para não repetir HTML
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        progress.setAttribute('aria-hidden', 'true');
        header?.append(progress);

        const update = () => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            header?.setAttribute('data-scrolled', String(y > 8));
            progress.style.setProperty('--progress', String(max > 0 ? Math.min(y / max, 1) : 0));
            backToTop?.setAttribute('data-visible', String(y > window.innerHeight * 0.8));
        };

        window.addEventListener('scroll', rafThrottle(update), { passive: true });
        update();

        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            /** @type {HTMLElement | null} */ ($('#conteudo'))?.focus({ preventScroll: true });
        });
    };

    VEA.header = { init };
})(/** @type {any} */ (window).VEA);
