// @ts-check
/* ==========================================================
   scripts.js — Ponto de entrada (bootstrap)
   ONG Vidas em Ação

   Cada módulo é independente e só atua se encontrar os seus
   elementos na página (data-attributes). Um erro num módulo
   não impede os restantes de arrancar.
   ========================================================== */

(function (VEA) {
    'use strict';

    const MODULES = ['theme', 'header', 'nav', 'reveal', 'counter', 'cardGlow', 'images', 'filter', 'dialog', 'form'];

    const boot = () => {
        MODULES.forEach((name) => {
            try {
                VEA[name]?.init();
            } catch (err) {
                console.error(`[VEA] Falha ao iniciar o módulo "${name}":`, err);
            }
        });
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})(/** @type {any} */ (window).VEA);
