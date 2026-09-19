import { test } from 'node:test';
import assert from 'node:assert/strict';
import { politicas } from '../src/content/politicas';
import { lerConsentimento } from '../src/lib/consent';

test('consentimento: rejeita JSON inválido, versão antiga, futuro, expiração e campos extras', () => {
  const now = Date.now();
  const valid = {
    categorias: { necessarios: true, analiticos: false, marketing: false, terceiros: true },
    dataHora: new Date(now).toISOString(),
    versaoPolitica: politicas.versao,
  };
  assert.ok(lerConsentimento(JSON.stringify(valid), now));
  for (const value of [
    '{',
    'null',
    JSON.stringify({ ...valid, versaoPolitica: 'antiga' }),
    JSON.stringify({ ...valid, outro: true }),
    JSON.stringify({ ...valid, categorias: { ...valid.categorias, extra: true } }),
    JSON.stringify({ ...valid, categorias: { ...valid.categorias, necessarios: false } }),
    JSON.stringify({ ...valid, categorias: { ...valid.categorias, marketing: 'sim' } }),
    JSON.stringify({ ...valid, dataHora: 'ontem' }),
    JSON.stringify({ ...valid, dataHora: new Date(now + 1).toISOString() }),
    JSON.stringify({ ...valid, dataHora: new Date(now - 181 * 86400000).toISOString() }),
  ])
    assert.equal(lerConsentimento(value, now), null);
});
