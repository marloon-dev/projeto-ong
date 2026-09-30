// @ts-check
/* ==========================================================
   modules/theme.js — Alternância Claro/Escuro
   - Respeita a preferência do sistema até o utilizador escolher.
   - Persiste a escolha em localStorage (com try/catch).
   - O script inline no <head> já aplicou o tema (sem "flash").
   ========================================================== */

(function (VEA) {
    'use strict';

    const STORAGE_KEY = 'vea-theme';
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    /** @returns {'light' | 'dark' | null} */
    const getStored = () => {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            return v === 'light' || v === 'dark' ? v : null;
        } catch { return null; }
    };

    /** @param {'light' | 'dark'} theme */
    const apply = (theme) => {
        root.dataset.theme = theme;
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#07110c' : '#f7faf8');
        VEA.utils.$$('[data-theme-toggle]').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(theme === 'dark'));
            btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
        });
    };

    const init = () => {
        apply(/** @type {'light'|'dark'} */ (root.dataset.theme) || (media.matches ? 'dark' : 'light'));

        VEA.utils.$$('[data-theme-toggle]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
                const run = () => apply(next);
                // Transição circular suave quando suportado
                // @ts-ignore — API ainda não tipada em todos os ambientes
                if (document.startViewTransition && !VEA.utils.prefersReducedMotion()) {
                    // @ts-ignore
                    document.startViewTransition(run);
                } else run();
                try { localStorage.setItem(STORAGE_KEY, next); } catch { /* armazenamento bloqueado */ }
            });
        });

        // Segue o sistema enquanto não houver escolha explícita
        media.addEventListener('change', (e) => {
            if (!getStored()) apply(e.matches ? 'dark' : 'light');
        });
    };

    VEA.theme = { init };
})(/** @type {any} */ (window).VEA);
