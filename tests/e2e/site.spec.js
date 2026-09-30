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
        ['galeria.html', /Galeria/],
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

test.describe('Galeria', () => {
    test('está no menu principal de todas as páginas', async ({ page }) => {
        for (const path of ['index.html', 'projetos.html', 'contato.html']) {
            await page.goto(`/html/${path}`);
            await expect(page.locator('#menu-principal a[href="galeria.html"]')).toHaveCount(1);
        }
    });

    test('filtra fotos e vídeos', async ({ page }) => {
        await page.goto('/html/galeria.html');
        await page.getByRole('button', { name: 'Vídeos', exact: true }).click();
        await expect(page.locator('[data-filter-item]:visible')).toHaveCount(3);
        await expect(page.locator('[data-filter-status]')).toHaveText('3 itens encontrados');
        await page.getByRole('button', { name: 'Fotos', exact: true }).click();
        await expect(page.locator('[data-filter-item]:visible')).toHaveCount(6);
    });

    test('abre o visualizador, navega com as setas e devolve o foco ao fechar', async ({ page }) => {
        await page.goto('/html/galeria.html');
        const primeiro = page.locator('[data-lightbox-item]').first();
        await primeiro.click();
        const lightbox = page.locator('[data-lightbox]');
        await expect(lightbox).toBeVisible();
        await expect(page.locator('[data-lightbox-count]')).toHaveText('1 de 9');
        await expect(page.locator('[data-lightbox-title]')).toHaveText('Festa comunitária de fim de ano');
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('[data-lightbox-count]')).toHaveText('2 de 9');
        await expect(lightbox.getByText('Vídeo disponível em breve')).toBeVisible();
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('[data-lightbox-count]')).toHaveText('9 de 9');
        await page.keyboard.press('Escape');
        await expect(lightbox).toBeHidden();
        await expect(primeiro).toBeFocused();
    });

    test('o visualizador percorre apenas os itens filtrados', async ({ page }) => {
        await page.goto('/html/galeria.html');
        await page.getByRole('button', { name: 'Fotos', exact: true }).click();
        await page.locator('[data-lightbox-item]:visible').first().click();
        await expect(page.locator('[data-lightbox-count]')).toHaveText('1 de 6');
    });
});

test('menu móvel tem o botão "Quero ajudar" e fecha ao abri-lo', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Apenas em mobile');
    await page.goto('/html/index.html');
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await page.locator('.nav__cta button').click();
    await expect(page.getByRole('dialog', { name: 'Como quer ajudar?' })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('links da gaveta móvel são clicáveis', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Apenas em mobile');
    await page.goto('/html/index.html');
    await page.locator('[data-nav-toggle]').click();
    await page.locator('#menu-principal a[href="galeria.html"]').click();
    await expect(page).toHaveURL(/galeria\.html$/);
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
