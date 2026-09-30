// @ts-check
/* ==========================================================
   modules/counter.js — Contadores animados (ease-out)
   Uso: <span data-count="300" data-prefix="+" data-suffix="">300</span>
   O valor final já está no HTML (acessível sem JS / leitores de ecrã).
   ========================================================== */

(function (VEA) {
    'use strict';

    const fmt = new Intl.NumberFormat('pt-BR');
    /** @param {number} t */
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    /** @param {HTMLElement} el */
    const animate = (el) => {
        const target = Number(el.dataset.count || 0);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        /** @param {number} now */
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = prefix + fmt.format(Math.round(target * easeOutExpo(p))) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const init = () => {
        const { $$, prefersReducedMotion } = VEA.utils;
        const counters = /** @type {HTMLElement[]} */ ($$('[data-count]'));
        if (!counters.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                animate(/** @type {HTMLElement} */ (e.target));
                obs.unobserve(e.target);
            });
        }, { threshold: 0.6 });

        counters.forEach((el) => io.observe(el));
    };

    VEA.counter = { init };
})(/** @type {any} */ (window).VEA);
