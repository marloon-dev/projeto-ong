// @ts-check
/* ==========================================================
   modules/header.js — Estado do cabeçalho ao fazer scroll
   e botão "voltar ao topo". Usa rAF para não bloquear o scroll.
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $, rafThrottle, prefersReducedMotion } = VEA.utils;
        const header = $('[data-header]');
        const backToTop = $('[data-back-to-top]');

        const update = () => {
            const y = window.scrollY;
            header?.setAttribute('data-scrolled', String(y > 8));
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
