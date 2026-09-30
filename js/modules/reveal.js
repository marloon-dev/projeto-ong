// @ts-check
/* ==========================================================
   modules/reveal.js — Entrada suave de elementos na viewport
   IntersectionObserver (zero custo no scroll) + stagger por grupo.
   Uso: data-reveal="" | "left" | "right" | "scale"
        data-reveal-group no contentor para escalonar os filhos.
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $$, prefersReducedMotion } = VEA.utils;

        // Escalonamento automático dentro de grupos
        $$('[data-reveal-group]').forEach((group) => {
            $$('[data-reveal]', group).forEach((el, i) => {
                /** @type {HTMLElement} */ (el).style.setProperty('--i', String(i));
            });
        });

        const items = $$('[data-reveal]');
        if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // anima uma única vez
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        items.forEach((el) => io.observe(el));
    };

    VEA.reveal = { init };
})(/** @type {any} */ (window).VEA);
