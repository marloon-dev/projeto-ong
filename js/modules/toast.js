// @ts-check
/* ==========================================================
   modules/toast.js — Notificações não intrusivas
   Região aria-live="polite": anunciadas por leitores de ecrã.
   API: VEA.toast.show({ title, message, type: 'success'|'error' })
   ========================================================== */

(function (VEA) {
    'use strict';

    const ICONS = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16.5v.01"/></svg>',
    };

    /** @type {HTMLElement | null} */
    let region = null;

    const getRegion = () => {
        if (region) return region;
        region = document.createElement('div');
        region.className = 'toast-region';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.append(region);
        return region;
    };

    /**
     * @param {{ title: string, message?: string, type?: 'success' | 'error', duration?: number }} opts
     */
    const show = ({ title, message = '', type = 'success', duration = 5000 }) => {
        const el = document.createElement('div');
        el.className = `toast toast--${type}`;
        el.innerHTML = ICONS[type];
        const body = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = title; // textContent: nunca injetar HTML do utilizador
        body.append(strong);
        if (message) body.append(document.createTextNode(message));
        el.append(body);
        getRegion().append(el);

        setTimeout(async () => {
            el.setAttribute('data-leaving', '');
            await VEA.utils.afterAnimation(el, 320);
            el.remove();
        }, duration);
    };

    VEA.toast = { show };
})(/** @type {any} */ (window).VEA);
