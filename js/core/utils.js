// @ts-check
/* ==========================================================
   core/utils.js — Utilitários partilhados (sem dependências)
   Todos os módulos registam-se no namespace global `VEA`
   para funcionar mesmo abrindo os ficheiros via file://
   (ES Modules exigiriam um servidor local).
   ========================================================== */

(function (global) {
    'use strict';

    /** @type {any} */
    const VEA = (global.VEA = global.VEA || {});

    /**
     * Seleciona um elemento.
     * @template {Element} T
     * @param {string} selector
     * @param {ParentNode} [scope=document]
     * @returns {T | null}
     */
    const $ = (selector, scope = document) => scope.querySelector(selector);

    /**
     * Seleciona vários elementos como array.
     * @template {Element} T
     * @param {string} selector
     * @param {ParentNode} [scope=document]
     * @returns {T[]}
     */
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    /** @returns {boolean} */
    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Limita a execução a 1x por frame (ideal para scroll/pointermove).
     * @param {(...args: any[]) => void} fn
     */
    const rafThrottle = (fn) => {
        let queued = false;
        /** @param {...any} args */
        return (...args) => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => { queued = false; fn(...args); });
        };
    };

    /**
     * Espera pelo fim de uma animação CSS (com timeout de segurança).
     * @param {Element} el
     * @param {number} [fallbackMs=400]
     * @returns {Promise<void>}
     */
    const afterAnimation = (el, fallbackMs = 400) =>
        new Promise((resolve) => {
            if (prefersReducedMotion()) return resolve();
            const done = () => { clearTimeout(t); resolve(); };
            const t = setTimeout(done, fallbackMs);
            el.addEventListener('animationend', done, { once: true });
        });

    /** @param {number} ms */
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    VEA.utils = { $, $$, prefersReducedMotion, rafThrottle, afterAnimation, wait };
})(window);
