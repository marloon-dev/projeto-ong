// @ts-check
/* ==========================================================
   modules/form.js — Formulário de contato
   - Validação inline acessível (aria-invalid + aria-describedby)
   - Valida ao sair do campo e revalida enquanto se corrige
   - Contador de caracteres, pré-seleção de assunto via ?assunto=
   - Estado de carregamento + toast de sucesso/erro
   ========================================================== */

(function (VEA) {
    'use strict';

    /** @type {Record<string, (v: string, el: HTMLInputElement) => string>} */
    const RULES = {
        nome: (v) => (v.trim().length < 2 ? 'Informe o seu nome (mínimo 2 caracteres).' : ''),
        email: (v) =>
            !v.trim() ? 'Informe o seu e-mail.'
            : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'E-mail inválido (ex.: nome@dominio.com).'
            : '',
        assunto: (v) => (!v ? 'Escolha um assunto.' : ''),
        mensagem: (v) => (v.trim().length < 10 ? 'Escreva uma mensagem com pelo menos 10 caracteres.' : ''),
    };

    const init = () => {
        const { $, $$ } = VEA.utils;
        const form = /** @type {HTMLFormElement | null} */ ($('[data-contact-form]'));
        if (!form) return;

        form.noValidate = true; // usamos mensagens próprias, mais claras

        const fields = /** @type {HTMLInputElement[]} */ ($$('[name]', form)).filter((f) => f.name in RULES);
        const submit = /** @type {HTMLButtonElement} */ ($('[type="submit"]', form));

        /** @param {HTMLInputElement} field */
        const validate = (field) => {
            const msg = RULES[field.name](field.value, field);
            const error = document.getElementById(`${field.id}-erro`);
            field.setAttribute('aria-invalid', String(Boolean(msg)));
            if (error && error.textContent !== msg) error.textContent = msg;
            return !msg;
        };

        fields.forEach((field) => {
            field.addEventListener('blur', (e) => {
                // Se o foco vai para o botão Enviar, o submit valida tudo.
                // Validar aqui mudaria o layout entre mousedown e mouseup e o clique "fugiria" do botão.
                if (/** @type {FocusEvent} */ (e).relatedTarget === submit) return;
                if (field.value) validate(field);
            });
            field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
            field.addEventListener('change', () => { if (field.tagName === 'SELECT') validate(field); });
        });

        // Contador de caracteres
        const textarea = /** @type {HTMLTextAreaElement | null} */ ($('textarea[maxlength]', form));
        const counter = $('[data-char-count]', form);
        if (textarea && counter) {
            const max = textarea.maxLength;
            const update = () => {
                const n = textarea.value.length;
                counter.textContent = `${n}/${max}`;
                counter.setAttribute('data-warn', String(n > max * 0.9));
            };
            textarea.addEventListener('input', update);
            update();
        }

        // Pré-seleção do assunto (links "Quero ajudar" → contato.html?assunto=voluntariado)
        const assunto = new URLSearchParams(location.search).get('assunto');
        const select = /** @type {HTMLSelectElement | null} */ (form.elements.namedItem('assunto'));
        if (assunto && select && [...select.options].some((o) => o.value === assunto)) select.value = assunto;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const results = fields.map(validate);
            const firstInvalid = fields[results.indexOf(false)];
            if (firstInvalid) {
                firstInvalid.focus();
                VEA.toast.show({ type: 'error', title: 'Verifique os campos assinalados.' });
                return;
            }

            submit.setAttribute('aria-busy', 'true');
            submit.disabled = true;
            try {
                const data = /** @type {any} */ (Object.fromEntries(new FormData(form)));
                await VEA.contactService.send(data);
                form.reset();
                fields.forEach((f) => f.removeAttribute('aria-invalid'));
                textarea?.dispatchEvent(new Event('input'));
                VEA.toast.show({ title: 'Mensagem enviada!', message: ' Obrigado pelo contato — responderemos em breve.' });
            } catch {
                VEA.toast.show({ type: 'error', title: 'Não foi possível enviar.', message: ' Tente novamente ou escreva para contato@vidasemacao.org.' });
            } finally {
                submit.removeAttribute('aria-busy');
                submit.disabled = false;
            }
        });
    };

    VEA.form = { init };
})(/** @type {any} */ (window).VEA);
