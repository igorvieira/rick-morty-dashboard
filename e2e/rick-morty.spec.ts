import { test, expect } from '@playwright/test';

test.describe('Rick & Morty Characters App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Rick & Morty Characters');
    await expect(page.getByRole('heading', { name: 'Rick & Morty Characters' })).toBeVisible();
    await expect(page.getByText('Search and explore characters')).toBeVisible();
  });

  test('should display search input and load initial characters', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    await expect(searchInput).toBeVisible();
    
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const characterRows = page.locator('table tbody tr');
    const count = await characterRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for characters and display results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Rick');
    await page.waitForTimeout(600);
    
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const characterRows = page.locator('table tbody tr');
    const count = await characterRows.count();
    expect(count).toBeGreaterThan(0);
    
    const firstCharacterName = page.locator('table tbody tr:first-child td:first-child button');
    await expect(firstCharacterName).toContainText('Rick');
  });

  test('should clear search when clicking X button', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Rick');
    await page.waitForTimeout(500);
    
    const clearButton = page.locator('button').filter({ hasText: /^$/ }).and(page.locator('[class*="absolute"]'));
    await expect(clearButton).toBeVisible();
    
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
  });

  test('should update URL when searching', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Morty');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveURL(/search=Morty/);
  });

  test('should show chart button when searching and open modal', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Rick');
    await page.waitForTimeout(1000);
    
    const chartButton = page.getByRole('button', { name: 'View Chart' });
    await expect(chartButton).toBeVisible({ timeout: 10000 });
    
    await chartButton.click();
    await expect(page.getByText('Location Distribution')).toBeVisible();
    await page.waitForSelector('[class*="recharts"]', { timeout: 10000 });
  });

  test('should close modal when clicking X button', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Rick');
    await page.waitForTimeout(1000);
    
    const chartButton = page.getByRole('button', { name: 'View Chart' });
    await expect(chartButton).toBeVisible({ timeout: 10000 });
    await chartButton.click();
    await expect(page.getByText('Location Distribution')).toBeVisible();
    
    await page.getByLabel('Close modal').click();
    await expect(page.getByText('Location Distribution')).not.toBeVisible();
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('Rick');
    await page.waitForTimeout(1000);
    
    const chartButton = page.getByRole('button', { name: 'View Chart' });
    await expect(chartButton).toBeVisible({ timeout: 10000 });
    await chartButton.click();
    await expect(page.getByText('Location Distribution')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.getByText('Location Distribution')).not.toBeVisible();
  });

  test('should click on character name and search for that character', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const firstCharacterName = page.locator('table tbody tr:first-child td:first-child button');
    const characterNameText = await firstCharacterName.textContent();
    
    await firstCharacterName.click();
    
    const searchInput = page.getByPlaceholder('Search characters by name...');
    await expect(searchInput).toHaveValue(characterNameText || '');
  });

  test('should display character count correctly', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const countText = page.locator('p').filter({ hasText: /\d+ characters? found/ });
    await expect(countText).toBeVisible();
    await expect(countText).toContainText(/\d+ characters? found/);
  });

  test('should show scroll to top button when scrolling down', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    const scrollToTopButton = page.getByLabel('Scroll to top');
    await expect(scrollToTopButton).toBeVisible({ timeout: 10000 });
    
    await scrollToTopButton.click();
    await page.waitForTimeout(1000);
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBe(0);
  });

  test('should show no characters found message when search has no results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters by name...');
    
    await searchInput.fill('nonexistentcharacter123');
    await page.waitForTimeout(600);
    
    await expect(page.getByText('No characters found')).toBeVisible();
  });

  test('should load more characters on scroll (infinite scroll)', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const initialRowCount = await page.locator('table tbody tr').count();
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(2000);
    
    const newRowCount = await page.locator('table tbody tr').count();
    expect(newRowCount).toBeGreaterThan(initialRowCount);
  });

  test('should display character information in table correctly', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toContainText('Character');
    await expect(headers.nth(1)).toContainText('Status');
    await expect(headers.nth(2)).toContainText('Species');
    await expect(headers.nth(3)).toContainText('Gender');
    await expect(headers.nth(4)).toContainText('Origin');
    await expect(headers.nth(5)).toContainText('Location');
    
    const firstRow = page.locator('table tbody tr:first-child');
    await expect(firstRow.locator('td').nth(0).locator('img')).toBeVisible();
    await expect(firstRow.locator('td').nth(0).locator('button')).toBeVisible();
    await expect(firstRow.locator('td').nth(1).locator('span')).toBeVisible();
  });

  test('should handle responsive design on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByRole('heading', { name: 'Rick & Morty Characters' })).toBeVisible();
    await expect(page.getByPlaceholder('Search characters by name...')).toBeVisible();
    
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});