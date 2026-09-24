import type { Depoimento, FaqItem, FotoGaleria, Profissional, Reel, Servico } from './types';
import servicosJson from './servicos.json';
import depoimentosJson from './depoimentos.json';
import faqJson from './faq.json';
import galeriaJson from './galeria.json';
import reelsJson from './reels.json';
import profissionaisJson from './profissionais.json';

export { site } from './site';
export type * from './types';

export const servicos = servicosJson as Servico[];
export const galeria = galeriaJson as FotoGaleria[];
export const reels = reelsJson as Reel[];
export const profissionais = profissionaisJson as Profissional[];
export const depoimentos: Depoimento[] = depoimentosJson as Depoimento[];
export const faq: FaqItem[] = faqJson as FaqItem[];
