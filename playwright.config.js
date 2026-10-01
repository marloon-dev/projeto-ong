// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Testes end-to-end: sobem um servidor estático local e percorrem
 * as páginas em desktop e mobile.
 */
module.exports = defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: 'npm start',
        url: 'http://localhost:4173/html/index.html',
        reuseExistingServer: !process.env.CI,
    },
});
