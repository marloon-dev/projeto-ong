// @ts-check
/* ==========================================================
   modules/nav.js — Menu móvel acessível
   - aria-expanded sincronizado, Esc fecha, clique fora fecha.
   - Foco mantido dentro do menu enquanto aberto (focus trap).
   - Bloqueia o scroll do body enquanto aberto.
   ========================================================== */

(function (VEA) {
    'use strict';

    const init = () => {
        const { $, $$ } = VEA.utils;
        const nav = $('[data-nav]');
        const toggle = /** @type {HTMLButtonElement | null} */ ($('[data-nav-toggle]'));
        const list = $('[data-nav-list]');
        if (!nav || !toggle || !list) return;

        // Índice para o atraso escalonado (stagger) em CSS
        $$('li', list).forEach((li, i) => /** @type {HTMLElement} */ (li).style.setProperty('--i', String(i)));

        const scrim = document.createElement('div');
        scrim.className = 'nav-scrim';
        scrim.setAttribute('aria-hidden', 'true');
        document.body.append(scrim);

        const mq = window.matchMedia('(max-width: 60rem)');
        const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

        /** @param {boolean} open */
        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.querySelector('.sr-only')?.replaceChildren(open ? 'Fechar menu' : 'Abrir menu');
            nav.setAttribute('data-open', String(open));
            scrim.setAttribute('data-visible', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
            if (open) /** @type {HTMLElement | null} */ (list.querySelector('a'))?.focus();
        };

        toggle.addEventListener('click', () => setOpen(!isOpen()));
        // Escolher um destino (link ou "Quero ajudar") fecha a gaveta
        list.addEventListener('click', (e) => {
            if (isOpen() && /** @type {HTMLElement} */ (e.target).closest('a, button')) setOpen(false);
        });
        scrim.addEventListener('click', () => setOpen(false));

        document.addEventListener('keydown', (e) => {
            if (!isOpen()) return;
            if (e.key === 'Escape') { setOpen(false); toggle.focus(); return; }
            if (e.key === 'Tab') {
                const focusables = [toggle, ...$$('a, button', list)];
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); /** @type {HTMLElement} */ (last).focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });

        // Fecha ao passar para desktop
        mq.addEventListener('change', (e) => { if (!e.matches && isOpen()) setOpen(false); });
    };

    VEA.nav = { init };
})(/** @type {any} */ (window).VEA);
