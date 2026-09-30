// @ts-check
/* ==========================================================
   modules/filter.js — Filtro de projetos por categoria
   Botões com aria-pressed + região live a anunciar o resultado.
   Uso: [data-filter] > button[data-filter-value]
        [data-filter-item][data-category="educacao"]
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $, $$, wait, prefersReducedMotion } = VEA.utils;
        const bar = $('[data-filter]');
        if (!bar) return;

        const buttons = /** @type {HTMLButtonElement[]} */ ($$('[data-filter-value]', bar));
        const items = /** @type {HTMLElement[]} */ ($$('[data-filter-item]'));
        const status = $('[data-filter-status]');
        let busy = false;

        /** @param {string} value */
        const applyFilter = async (value) => {
            if (busy) return;
            busy = true;
            buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filterValue === value)));

            const match = (/** @type {HTMLElement} */ el) => value === 'todos' || el.dataset.category === value;
            const leaving = items.filter((el) => !el.hidden && !match(el));
            const entering = items.filter((el) => el.hidden && match(el));

            // 1) Sai: fade + scale
            leaving.forEach((el) => el.setAttribute('data-leaving', 'true'));
            if (leaving.length && !prefersReducedMotion()) await wait(260);
            leaving.forEach((el) => { el.hidden = true; el.removeAttribute('data-leaving'); });

            // 2) Entra: começa invisível e anima no frame seguinte
            entering.forEach((el) => { el.setAttribute('data-leaving', 'true'); el.hidden = false; el.classList.add('is-visible'); });
            requestAnimationFrame(() => requestAnimationFrame(() => entering.forEach((el) => el.removeAttribute('data-leaving'))));

            const count = items.filter(match).length;
            if (status) {
                const { singular = 'projeto encontrado', plural = 'projetos encontrados' } = /** @type {HTMLElement} */ (status).dataset;
                status.textContent = `${count} ${count === 1 ? singular : plural}`;
            }
            busy = false;
        };

        buttons.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filterValue || 'todos')));
    };

    VEA.filter = { init };
})(/** @type {any} */ (window).VEA);
