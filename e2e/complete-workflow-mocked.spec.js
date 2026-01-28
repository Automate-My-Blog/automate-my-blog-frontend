/**
 * Complete workflow E2E test with mocked backend.
 * Runs the full journey: website analysis → audience selection → topic generation →
 * content generation → editor → export, without a real API.
 *
 * Run: npm run test:e2e:complete-mocked
 * Or:  npx playwright test e2e/complete-workflow-mocked.spec.js
 */

const { test, expect } = require('@playwright/test');
const { installWorkflowMocks, injectLoggedInUser, MOCK_TOPICS } = require('./mocks/workflow-api-mocks');

async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

test.describe('Complete workflow (mocked backend)', () => {
  test.beforeEach(async ({ page }) => {
    await installWorkflowMocks(page);
    await page.goto('/');
    await clearStorage(page);
    await injectLoggedInUser(page);
    await page.reload();
    await page.waitForLoadState('load');
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
    // Hide webpack dev-server overlay so it doesn't block clicks (compile warnings)
    await page.evaluate(() => {
      const el = document.getElementById('webpack-dev-server-client-overlay');
      if (el) el.remove();
    });
  });

  test('smoke: analyze → audience → strategy → posts section with generate', async ({ page }) => {
    test.setTimeout(60000);
    const createBtn = page.locator('button:has-text("Create New Post")').first();
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    await createBtn.click();
    await page.waitForTimeout(800);

    const websiteInput = page.locator('input[placeholder*="website" i], input[placeholder*="url" i]').first();
    await expect(websiteInput).toBeVisible({ timeout: 10000 });
    await websiteInput.fill('https://example.com');
    await page.locator('button:has-text("Analyze")').first().click();
    await page.waitForSelector('.ant-spin-spinning', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);

    await page.evaluate(() => document.getElementById('webpack-dev-server-client-overlay')?.remove());
    await page.locator('button:has-text("Continue to Audience")').first().click({ force: true });
    await page.waitForTimeout(800);

    await page.locator('#audience-segments').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const strategyCard = page.locator('#audience-segments .ant-card').filter({ hasText: /Strategy 1|Developers searching/ }).first();
    await expect(strategyCard).toBeVisible({ timeout: 10000 });
    await strategyCard.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('#posts')).toBeVisible({ timeout: 10000 });
    const genBtn = page.locator('button:has-text("Generate post")').first();
    await expect(genBtn).toBeVisible({ timeout: 10000 });
    expect(await genBtn.textContent()).not.toContain('Buy more');
  });

  test('full workflow: analyze → audience → topics → generate → editor → export', async ({ page }) => {
    test.setTimeout(90000);

    // --- 1. Enter project mode ---
    const createBtn = page.locator('button:has-text("Create New Post")').first();
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    await createBtn.click();
    await page.waitForTimeout(800);

    // --- 2. Website analysis ---
    const websiteInput = page.locator('input[placeholder*="website" i], input[placeholder*="url" i]').first();
    await expect(websiteInput).toBeVisible({ timeout: 10000 });
    await websiteInput.fill('https://example.com');

    const analyzeBtn = page.locator('button:has-text("Analyze")').first();
    await expect(analyzeBtn).toBeVisible({ timeout: 5000 });
    await analyzeBtn.click();

    // Wait for analysis to complete (4 mocked API calls)
    await page.waitForSelector('.ant-spin-spinning', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // --- 3. Continue to audience ---
    await page.evaluate(() => {
      document.getElementById('webpack-dev-server-client-overlay')?.remove();
    });
    const continueBtn = page.locator('button:has-text("Next Step"), button:has-text("Continue to Audience")').first();
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click({ force: true });
    await page.waitForTimeout(800);

    // --- 4. Select audience strategy ---
    await page.locator('#audience-segments').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const strategyCard = page.locator('#audience-segments .ant-card').filter({ hasText: /Strategy 1|Developers searching/ }).first();
    await expect(strategyCard).toBeVisible({ timeout: 10000 });
    await strategyCard.click();
    await page.waitForTimeout(2000);

    // --- 5. Wait for posts section (mounts when customerStrategy is set), then scroll to it ---
    await expect(page.locator('#posts')).toBeVisible({ timeout: 10000 });
    await page.locator('#posts').first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(800);

    // --- 6. Generate topics ---
    const generateTopicsBtn = page.locator('button:has-text("Generate post"), button:has-text("Buy more posts")').first();
    await expect(generateTopicsBtn).toBeVisible({ timeout: 12000 });
    if ((await generateTopicsBtn.textContent())?.includes('Buy more')) {
      throw new Error('Credits mock failed: UI shows "Buy more posts" (0 credits). Check /api/v1/user/credits mock.');
    }
    await generateTopicsBtn.click();

    await page.waitForSelector('button:has-text("Generating Topics")', { state: 'hidden', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // --- 7. Select first topic (triggers content generation) ---
    await expect(page.locator(`text=${MOCK_TOPICS[0].title}`).first()).toBeVisible({ timeout: 12000 });
    const createPostBtn = page.getByRole('button', { name: /Create Post|Generate post/i }).first();
    if (await createPostBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createPostBtn.click();
      await page.waitForSelector('.ant-spin-spinning', { state: 'hidden', timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    // If no topic button, we may already be in editor (e.g. single-topic auto-advance)

    // --- 8. Editor visible ---
    const editor = page.locator('.tiptap, [contenteditable="true"]').first();
    await expect(editor).toBeVisible({ timeout: 15000 });
    const editorContent = await editor.textContent();
    expect(editorContent).toContain('mock');
    expect(editorContent.length).toBeGreaterThan(50);

    // --- 9. Export ---
    const exportBtn = page.locator('button:has-text("Export")').first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
    await exportBtn.click();
    await page.waitForTimeout(500);

    const exportModal = page.locator('.ant-modal').filter({ hasText: /Export|Markdown|HTML|Download/ });
    await expect(exportModal.first()).toBeVisible({ timeout: 8000 });
  });
});
