// @ts-check
/* ==========================================================
   modules/dialog.js — Modais com <dialog> nativo
   O <dialog> já trata foco, Esc e inert do resto da página.
   Aqui adicionamos: abertura por data-attribute, animação de
   saída, fecho ao clicar no backdrop e retorno do foco.
   Uso: <button data-dialog-open="ajudar"> + <dialog id="ajudar">
   ========================================================== */

(function (VEA) {
    'use strict';

    /** @param {HTMLDialogElement} dialog */
    const close = async (dialog) => {
        if (!dialog.open || dialog.hasAttribute('data-closing')) return;
        dialog.setAttribute('data-closing', '');
        await VEA.utils.afterAnimation(dialog, 320);
        dialog.removeAttribute('data-closing');
        dialog.close();
    };

    const init = () => {
        const { $$ } = VEA.utils;

        $$('[data-dialog-open]').forEach((trigger) => {
            const id = /** @type {HTMLElement} */ (trigger).dataset.dialogOpen;
            const dialog = /** @type {HTMLDialogElement | null} */ (id ? document.getElementById(id) : null);
            if (!dialog || typeof dialog.showModal !== 'function') return;

            trigger.addEventListener('click', () => {
                dialog.showModal();
                // devolve o foco ao botão que abriu
                dialog.addEventListener('close', () => /** @type {HTMLElement} */ (trigger).focus(), { once: true });
            });
        });

        $$('dialog.modal').forEach((node) => {
            const dialog = /** @type {HTMLDialogElement} */ (node);

            // Esc: anima a saída em vez de fechar de imediato
            dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(dialog); });

            // Clique no backdrop (fora da caixa)
            dialog.addEventListener('click', (e) => {
                const r = dialog.getBoundingClientRect();
                const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
                if (outside && e.target === dialog) close(dialog);
            });

            $$('[data-dialog-close]', dialog).forEach((btn) => btn.addEventListener('click', () => close(dialog)));
        });
    };

    VEA.dialog = { init, close };
})(/** @type {any} */ (window).VEA);
