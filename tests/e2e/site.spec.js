// @ts-check
const { test, expect } = require('@playwright/test');

// Desliga o scroll suave para cliques estáveis nos testes
test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
            document.documentElement.style.scrollBehavior = 'auto';
        });
    });
});

test.describe('Navegação e estrutura', () => {
    for (const [path, titulo] of [
        ['index.html', /Transformando vidas/],
        ['projetos.html', /Projetos Sociais/],
        ['contato.html', /Nossa Equipe/],
    ]) {
        test(`${path} carrega sem erros de JavaScript`, async ({ page }) => {
            const erros = [];
            page.on('pageerror', (e) => erros.push(e.message));
            await page.goto(`/html/${path}`);
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
            await expect(page.locator('.nav__link[aria-current="page"]')).toHaveCount(1);
            expect(erros).toEqual([]);
        });
    }
});

test('alterna o tema e guarda a escolha', async ({ page }) => {
    await page.goto('/html/index.html');
    const html = page.locator('html');
    const inicial = await html.getAttribute('data-theme');
    await page.locator('[data-theme-toggle]').click();
    const novo = inicial === 'dark' ? 'light' : 'dark';
    await expect(html).toHaveAttribute('data-theme', novo);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', novo);
});

test('menu móvel abre, fecha com Esc e devolve o foco', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Apenas em mobile');
    await page.goto('/html/index.html');
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Contato' }).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
});

test('modal "Quero ajudar" abre e fecha', async ({ page }) => {
    await page.goto('/html/index.html');
    await page.locator('[data-dialog-open="dialogo-ajudar"]:visible').first().click();
    const dialog = page.getByRole('dialog', { name: 'Como quer ajudar?' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(dialog).toBeHidden();
});

test('filtro de projetos mostra apenas a categoria escolhida', async ({ page }) => {
    await page.goto('/html/projetos.html');
    await page.getByRole('button', { name: 'Saúde' }).click();
    await expect(page.locator('[data-filter-item]:visible')).toHaveCount(1);
    await expect(page.locator('[data-filter-status]')).toHaveText('1 projeto encontrado');
    await page.getByRole('button', { name: 'Todos' }).click();
    await expect(page.locator('[data-filter-item]:visible')).toHaveCount(3);
});

test.describe('Formulário de contato', () => {
    test('assinala campos inválidos de forma acessível', async ({ page }) => {
        await page.goto('/html/contato.html');
        await page.getByLabel('E-mail').fill('abc');
        await page.getByRole('button', { name: /Enviar mensagem/ }).click();
        await expect(page.getByLabel('Nome')).toHaveAttribute('aria-invalid', 'true');
        await expect(page.getByLabel('Nome')).toBeFocused();
        await expect(page.locator('#email-erro')).toContainText('E-mail inválido');
    });

    test('pré-seleciona o assunto pela URL e envia com sucesso', async ({ page }) => {
        await page.goto('/html/contato.html?assunto=voluntariado');
        await expect(page.locator('#assunto')).toHaveValue('voluntariado');
        await page.getByLabel('Nome').fill('Maria Silva');
        await page.getByLabel('E-mail').fill('maria@exemplo.com');
        await page.locator('#mensagem').fill('Quero ser voluntária nas oficinas.');
        await page.getByRole('button', { name: /Enviar mensagem/ }).click();
        await expect(page.getByRole('status').filter({ hasText: 'Mensagem enviada!' })).toBeVisible();
        await expect(page.getByLabel('Nome')).toHaveValue('');
    });
});
