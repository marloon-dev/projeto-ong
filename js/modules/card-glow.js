// @ts-check
/* ==========================================================
   modules/card-glow.js — Borda luminosa que segue o cursor
   Apenas atualiza 2 variáveis CSS por frame (sem layout thrash).
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $$, rafThrottle, prefersReducedMotion } = VEA.utils;
        if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;

        $$('.card--glow').forEach((card) => {
            const el = /** @type {HTMLElement} */ (card);
            el.addEventListener('pointermove', rafThrottle((/** @type {PointerEvent} */ e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${e.clientX - r.left}px`);
                el.style.setProperty('--my', `${e.clientY - r.top}px`);
            }));
        });
    };

    VEA.cardGlow = { init };
})(/** @type {any} */ (window).VEA);
