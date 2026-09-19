import { site } from '../content/site';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/** Atributos para links que abrem em nova aba. */
export const externo = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** "09:00" → "9h", "09:30" → "9h30". */
function hora(valor: string): string {
  const [h = '', m = ''] = valor.split(':');
  return `${Number(h)}h${m === '00' ? '' : m}`;
}

/** "Seg a sáb, 9h às 20h" (faixa contínua de dias) a partir de site.horarios. */
export function horarioResumo(): string {
  const bloco = site.horarios[0];
  if (!bloco) return '';
  const primeiro = DIAS[bloco.dias[0] ?? 0] ?? '';
  const ultimo = DIAS[bloco.dias[bloco.dias.length - 1] ?? 0] ?? '';
  const dias = bloco.dias.length > 1 ? `${primeiro} a ${ultimo}` : primeiro;
  return `${dias.charAt(0).toUpperCase()}${dias.slice(1)}, ${hora(bloco.abre)} às ${hora(bloco.fecha)}`;
}

/** "Rua México, 119 · Centro · Seg a sáb, 9h às 20h" */
export function linhaApoio(): string {
  return `${enderecoCompleto()} · ${horarioResumo()}`;
}

/** Mesma representação do endereço no NAP, rotas e textos de apoio. */
export function enderecoCompleto(): string {
  const e = site.endereco;
  return `${e.rua}, ${e.numero}, ${e.sala} — ${e.bairro}, ${e.cidade}/${e.uf} — CEP ${e.cep}`;
}

export function pagamentoResumo(): string {
  return [...site.pagamento.cartoes, ...site.pagamento.outros].join(', ');
}

export function rotasUrls() {
  const endereco = encodeURIComponent(enderecoCompleto());
  return {
    maps: `https://www.google.com/maps/search/?api=1&query=${endereco}`,
    waze: `https://waze.com/ul?q=${endereco}&navigate=yes`,
    embed: `https://www.google.com/maps?q=${endereco}&output=embed`,
  };
}
