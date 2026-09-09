import { test, expect } from '@playwright/test';

test.describe('E2E - Application Todo Redux', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock de l'API GET (récupération initiale vide)
    await page.route('http://localhost:5000/api/todos', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // Tableau vide au départ
        });
      } 
      // 2. Mock de l'API POST (ajout d'une tâche)
      else if (route.request().method() === 'POST') {
        const postData = JSON.parse(route.request().postData());
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            _id: 'mock-id-' + Date.now(),
            title: postData.title,
            status: 'en cours',
          }),
        });
      }
    });

    // 3. Mock des routes individuelles (PUT et DELETE pour les tâches)
    await page.route('http://localhost:5000/api/todos/*', async (route) => {
      const method = route.request().method();
      if (method === 'PUT') {
        const putData = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _id: route.request().url().split('/').pop(),
            title: 'Tâche modifiée',
            status: putData.status || 'terminée',
          }),
        });
      } else if (method === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // Navigation vers l'application
    await page.goto('/');
  });
  // 1. CHARGEMENT
  test('1. Doit afficher l\'interface initiale et les filtres', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');  // ciblage avec <input .. placeholder="Nouvelle tâche..." dans AddTask.js
    await expect(input).toBeVisible(); // exclure d'autres input
    // exclure les boutons Toutes Terminées En cours
    await expect(page.getByRole('button', { name: 'Toutes', exact: true })).toBeVisible(); 
    await expect(page.getByRole('button', { name: 'Terminées', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'En cours', exact: true })).toBeVisible();
  });

  // 2. AJOUT
  test('2. Doit ajouter une tâche et réinitialiser l\'input', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter', exact: true });

    await input.fill('Test Integration - Unitaire - E2E');
    await addButton.click();

    await expect(page.getByText('Test Integration - Unitaire - E2E')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('3. Ne doit pas ajouter de tâche vide', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('   ');
    
    const addButton = page.getByRole('button', { name: 'Ajouter', exact: true });
    await addButton.click();

    // S'assure que le message d'état vide est affiché et qu'aucune tâche n'a été insérée
    await expect(page.getByText('Aucune tâche trouvée !')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  });

  // 3. MODIFICATION ET STATUT
  test('4. Doit marquer une tâche comme terminée', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche à cocher');
    await input.press('Enter');

    const checkbox = page.getByRole('checkbox').first();
    await checkbox.click();

    await expect(checkbox).toBeChecked();
  });

  test('5. Doit éditer le texte d\'une tâche existante', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Ancien texte');
    await input.press('Enter');

    const taskCard = page.locator('div').filter({ hasText: /^Ancien texte/ }).first();
    await expect(taskCard).toBeVisible();

    await taskCard.getByRole('button', { name: 'Modifier', exact: true }).click();

    const editInput = page.locator('input[type="text"]').last();
    await editInput.fill('Texte mis à jour');
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    await expect(page.getByText('Texte mis à jour')).toBeVisible();
    await expect(page.getByText('Ancien texte')).not.toBeVisible();
  });

  // 4. SUPPRESSION
  test('6. Doit supprimer une tâche spécifique', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche à supprimer');
    await input.press('Enter');

    const taskCard = page.locator('div').filter({ hasText: /^Tâche à supprimer/ }).first();
    await taskCard.getByRole('button', { name: 'Supprimer', exact: true }).click();

    await expect(page.getByText('Tâche à supprimer')).not.toBeVisible();
  });

  // 5. FILTRES D'AFFICHAGE
  test('7. Doit filtrer les tâches (Toutes / Terminées / En cours)', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');

    await input.fill('Tâche A (En cours)');
    await input.press('Enter');
    await input.fill('Tâche B (Terminée)');
    await input.press('Enter');

    const taskB = page.locator('div').filter({ hasText: /^Tâche B \(Terminée\)/ }).first();
    await taskB.getByRole('checkbox').click();

    // Filtre : En cours
    await page.getByRole('button', { name: 'En cours', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).not.toBeVisible();

    // Filtre : Terminées
    await page.getByRole('button', { name: 'Terminées', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).not.toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).toBeVisible();

    // Filtre : Toutes
    await page.getByRole('button', { name: 'Toutes', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).toBeVisible();
  });

  // 6. PERSISTANCE LOCALSTORAGE
  

  // 7. ACTIONS GLOBALES
  test('9. Doit supprimer toutes les tâches via le bouton d\'action globale', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche 1');
    await input.press('Enter');
    await input.fill('Tâche 2');
    await input.press('Enter');

    // Mettez à jour le sélecteur selon le vrai texte ou rôle du bouton de suppression globale dans votre UI
    await page.getByRole('button', { name: /supprimer tout|tout effacer/i }).click();

    await expect(page.getByText('Aucune tâche trouvée !')).toBeVisible();
  });

  test('8. Doit conserver les tâches après rechargement de page (F5)', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche persistante');
    await input.press('Enter');

    await expect(page.getByText('Tâche persistante')).toBeVisible();

    // Attendre que le state Redux se synchronise dans le localStorage
    await page.waitForFunction(() => {
      const storage = JSON.stringify(localStorage);
      return storage.includes('Tâche persistante');
    }, { timeout: 3000 }).catch(() => {});

    await page.reload();

    await expect(page.getByText('Tâche persistante')).toBeVisible();
  });

});

// use : npx playwright test e2e --ui  complete interface