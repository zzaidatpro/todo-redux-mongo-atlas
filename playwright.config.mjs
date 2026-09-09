import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  /* Exécution en parallèle des tests */
  fullyParallel: true,
  /* Empêche d'oublier des test.only sur le serveur CI */
  forbidOnly: !!process.env.CI,
  /* Nombre de tentatives en cas d'échec */
  retries: process.env.CI ? 2 : 0,
  /* Nombre de threads de test */
  workers: process.env.CI ? 1 : undefined,
  /* Rapport de test généré au format HTML */
  reporter: 'html',

  use: {
    baseURL: 'http://127.0.0.1:5173',
    /* Traces d'exécution pour le débogage */
    trace: 'on-first-retry',
  },

  /* Configuration des navigateurs cibles */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Serveur web de développement Vite */
  webServer: {
    command: 'npx vite --host 0.0.0.0 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});