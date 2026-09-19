import { test, expect } from '@playwright/test';

test('recusa sem requisições externas, preferência persistente, foco e revogação do mapa', async ({
  page,
}) => {
  const externos: string[] = [];
  const erros: string[] = [];
  page.on('pageerror', (error) => erros.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /content security policy|refused to/i.test(message.text()))
      erros.push(message.text());
  });
  await page.route(
    /https:\/\/(www\.)?(google|googletagmanager|google-analytics|facebook|connect\.facebook)/,
    async (route) => {
      externos.push(route.request().url());
      await route.fulfill({
        contentType: 'text/html',
        body: '<html><title>Mapa simulado</title></html>',
      });
    },
  );
  await page.goto('/');
  await expect(page.locator('#cookie-banner')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-cookie-banner', 'visible');
  await page.getByRole('button', { name: 'Recusar não essenciais' }).click();
  await expect(page.locator('#cookie-banner')).toBeHidden();
  await page.reload();
  await expect(page.locator('#cookie-banner')).toBeHidden();
  expect(externos).toEqual([]);
  await page.getByRole('button', { name: 'Carregar mapa' }).click();
  await expect(page.locator('#cookie-preferences')).toBeVisible();
  await expect(page.locator('#consent-form input[name="analiticos"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Carregar mapa' })).toBeFocused();
  expect(externos).toEqual([]);
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.locator('input[name="terceiros"]').check();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Carregar mapa' }).click();
  await expect(page.locator('iframe')).toHaveCount(1);
  await expect.poll(() => externos.length).toBe(1);
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.locator('input[name="terceiros"]').uncheck();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(erros).toEqual([]);
});

test('GA4 configurado: padrão denied, nenhum carregamento antes do aceite e URL sem query', async ({
  page,
}) => {
  const scripts: string[] = [];
  await page.route('http://127.0.0.1:4322/?teste=privado', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        'data-measurement-id hidden',
        'data-measurement-id="G-TEST123" hidden',
      ),
    });
  });
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    scripts.push(route.request().url());
    await route.fulfill({
      contentType: 'text/javascript',
      body: '/* Simulação: sem chamadas de medição. */',
    });
  });
  await page.goto('/?teste=privado');
  await page.getByRole('button', { name: 'Recusar não essenciais' }).click();
  expect(scripts).toHaveLength(0);
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.locator('input[name="analiticos"]').check();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await expect.poll(() => scripts.length).toBe(1);
  const queue = await page.evaluate(() =>
    Array.from((window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [], (args) =>
      Array.from(args),
    ),
  );
  expect(queue[0]).toEqual([
    'consent',
    'default',
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  ]);
  expect(JSON.stringify(queue)).not.toContain('teste=privado');
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.locator('input[name="analiticos"]').uncheck();
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: 'Salvar preferências' }).click(),
  ]);
  expect(scripts).toHaveLength(1);
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('versão antiga e armazenamento bloqueado mantêm categorias opcionais negadas', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'consent_v1',
      JSON.stringify({
        categorias: { necessarios: true, analiticos: true, marketing: true, terceiros: true },
        dataHora: new Date().toISOString(),
        versaoPolitica: 'antiga',
      }),
    ),
  );
  await page.goto('/');
  await expect(page.locator('#cookie-banner')).toBeVisible();
  await page.getByRole('button', { name: 'Personalizar', exact: true }).click();
  await expect(page.locator('input[name="analiticos"]')).not.toBeChecked();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await page.getByRole('button', { name: 'Recusar não essenciais' }).click();
  await expect(page.locator('#consent-status')).toContainText('não permitiu salvar');
});

test('documentos, cabeçalhos, links externos seguros e 404 noindex', async ({ page, request }) => {
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(
    response.headers()['content-security-policy']?.split('script-src')[1]?.split(';')[0],
  ).not.toContain('unsafe-inline');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  await page.goto('/');
  await page.getByRole('button', { name: 'Recusar não essenciais' }).click();
  const links = await page
    .locator('a[href^="http"]')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('rel')));
  for (const rel of links) {
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  }
  for (const slug of ['politica-de-privacidade', 'termos-de-uso', 'politica-de-cookies']) {
    await page.goto('/' + slug);
    await expect(page.getByText('[CONFIRMAR — revisão jurídica]', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Direitos do titular e solicitações' }),
    ).toBeVisible();
  }
  const missing = await page.goto('/pagina-inexistente');
  expect(missing?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});
