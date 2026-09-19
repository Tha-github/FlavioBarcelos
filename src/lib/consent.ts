import { politicas } from '../content/politicas';

export type Categoria = 'necessarios' | 'analiticos' | 'marketing' | 'terceiros';
export interface Consentimento {
  categorias: { necessarios: true; analiticos: boolean; marketing: boolean; terceiros: boolean };
  dataHora: string;
  versaoPolitica: string;
}
const CHAVE = 'consent_v1';
let atual: Consentimento | null = null;
let iniciado = false;
const callbacks = new Set<(escolha: Consentimento | null) => void>();

function objeto(valor: unknown): Record<string, unknown> | null {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
    ? (valor as Record<string, unknown>)
    : null;
}
function mesmasChaves(valor: Record<string, unknown>, chaves: string[]) {
  const atuais = Object.keys(valor);
  return atuais.length === chaves.length && chaves.every((chave) => chave in valor);
}

/** Valida estritamente o formato salvo: sem campos extras, tipos exatos e versão atual. */
function validar(valor: unknown): Consentimento | null {
  const raiz = objeto(valor);
  if (!raiz || !mesmasChaves(raiz, ['categorias', 'dataHora', 'versaoPolitica'])) return null;
  const categorias = objeto(raiz['categorias']);
  if (
    !categorias ||
    !mesmasChaves(categorias, ['necessarios', 'analiticos', 'marketing', 'terceiros']) ||
    categorias['necessarios'] !== true ||
    typeof categorias['analiticos'] !== 'boolean' ||
    typeof categorias['marketing'] !== 'boolean' ||
    typeof categorias['terceiros'] !== 'boolean'
  )
    return null;
  const dataHora = raiz['dataHora'];
  if (
    typeof dataHora !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(dataHora) ||
    Number.isNaN(Date.parse(dataHora))
  )
    return null;
  if (raiz['versaoPolitica'] !== politicas.versao) return null;
  return {
    categorias: {
      necessarios: true,
      analiticos: categorias['analiticos'],
      marketing: categorias['marketing'],
      terceiros: categorias['terceiros'],
    },
    dataHora,
    versaoPolitica: politicas.versao,
  };
}

export function lerConsentimento(valor: string | null, agora = Date.now()): Consentimento | null {
  try {
    const resultado = validar(JSON.parse(valor ?? 'null'));
    if (!resultado) return null;
    const idade = agora - Date.parse(resultado.dataHora);
    return idade >= 0 && idade < politicas.validadeConsentimentoDias * 86400000 ? resultado : null;
  } catch {
    return null;
  }
}

function emitir() {
  for (const callback of callbacks) callback(atual);
}
function iniciar() {
  if (iniciado || typeof window === 'undefined') return;
  iniciado = true;
  try {
    atual = lerConsentimento(window.localStorage.getItem(CHAVE));
  } catch {
    atual = null;
  }
  window.addEventListener('storage', (evento) => {
    if (evento.key === CHAVE || evento.key === null) {
      atual = lerConsentimento(evento.newValue);
      emitir();
    }
  });
}
export function getConsent() {
  iniciar();
  return atual;
}
export function hasConsent(categoria: Categoria): boolean {
  return categoria === 'necessarios' || getConsent()?.categorias[categoria] === true;
}
export function onConsentChange(callback: (escolha: Consentimento | null) => void) {
  iniciar();
  callbacks.add(callback);
  return () => {
    callbacks.delete(callback);
  };
}
export function saveConsent(categorias: Consentimento['categorias']): boolean {
  iniciar();
  atual = {
    categorias,
    dataHora: new Date().toISOString(),
    versaoPolitica: politicas.versao,
  };
  let persistido = true;
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(atual));
  } catch {
    persistido = false;
  }
  emitir();
  return persistido;
}
export function openPreferences() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('consent:preferences'));
}
