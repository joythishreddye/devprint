import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { chromium, type FullConfig } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL ?? 'http://localhost:3000';
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    console.log(
      '[global-setup] E2E_TEST_EMAIL or E2E_TEST_PASSWORD not set — skipping auth state creation. Auth-dependent tests will be skipped.'
    );
    return;
  }

  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${baseURL}/sign-in`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseURL}/wizard`, { timeout: 15_000 });

    await page.context().storageState({ path: path.join(authDir, 'user.json') });
    console.log('[global-setup] Auth state saved to e2e/.auth/user.json');
  } catch (err) {
    console.error('[global-setup] Failed to authenticate test user:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
