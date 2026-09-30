// @ts-check
/* ==========================================================
   modules/images.js — Skeleton enquanto a imagem carrega
   Uso: <div class="skeleton"><img loading="lazy" ...></div>
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        VEA.utils.$$('.skeleton img').forEach((node) => {
            const img = /** @type {HTMLImageElement} */ (node);
            const done = () => img.closest('.skeleton')?.classList.remove('skeleton');
            if (img.complete && img.naturalWidth > 0) return done();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
        });
    };

    VEA.images = { init };
})(/** @type {any} */ (window).VEA);
