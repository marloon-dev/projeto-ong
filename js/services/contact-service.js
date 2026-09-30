// @ts-check
/* ==========================================================
   services/contact-service.js — Camada de acesso a dados
   Isola o "como enviar" do "como mostrar". Para ligar a um
   backend real (Formspree, API própria, etc.) basta alterar
   ENDPOINT — nenhum componente de UI precisa de mudar.
   ========================================================== */

(function (VEA) {
    'use strict';

    /**
     * @typedef {Object} ContactMessage
     * @property {string} nome
     * @property {string} email
     * @property {string} assunto
     * @property {string} mensagem
     */

    /** @type {string | null} Ex.: 'https://formspree.io/f/xxxx' */
    const ENDPOINT = null;

    /**
     * @param {ContactMessage} data
     * @returns {Promise<{ ok: boolean }>}
     */
    const send = async (data) => {
        if (!ENDPOINT) {
            // Modo demonstração: simula latência de rede
            await VEA.utils.wait(1200);
            return { ok: true };
        }
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Falha no envio (${res.status})`);
        return { ok: true };
    };

    VEA.contactService = { send };
})(/** @type {any} */ (window).VEA);
