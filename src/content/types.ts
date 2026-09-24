export interface Endereco {
  rua: string;
  numero: string;
  sala: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Horario {
  /** Dias da semana, 0 = domingo. */
  dias: readonly number[];
  abre: string;
  fecha: string;
}

export interface Pagamento {
  cartoes: readonly string[];
  outros: readonly string[];
}

export interface Links {
  instagram: string;
  instagramUsuario: string;
  google: string;
}

export type Pendente = '[CONFIRMAR]';

export interface Site {
  nome: string;
  categoria: string;
  /** Descrição institucional (meta description e JSON-LD). */
  descricao: string;
  publico: readonly string[];
  /** Ano de abertura do estúdio (usado no JSON-LD como foundingDate). */
  anoAbertura: number;
  endereco: Endereco;
  /** Dias/horários em que o estúdio funciona; os demais dias ficam fechados. */
  horarios: readonly Horario[];
  diasFechados: readonly number[];
  pagamento: Pagamento;
  links: Links;
  /** Número do WhatsApp só com dígitos, com DDI e DDD (ex.: 5521969261188). */
  whatsapp: string;
  /** Telefone para exibição, ex.: (21) 96926-1188. */
  telefone: string;
  /** Mensagens pré-preenchidas do WhatsApp. */
  mensagens: { agendar: string; informacoes: string; servico: string };
  /** Dados do MEI. Não inclui razão social nem CPF. */
  empresa: { nomeCivil: string; tipo: string; cnpj: string };
  privacidade: { responsavel: string };
  /** Texto alternativo da foto do hero (src/assets/hero/flavio.png). */
  heroAlt: string;
  /** Vazio = analíticos desativado. */
  ga4MeasurementId: string;
  sobre: { nome: string; bio: string; fatos: string[]; citacao: string; retratoAlt: string };
  /** Texto alternativo das 2 imagens de "Cabelos by Flávio Barcelos". */
  focoAlts: readonly string[];
  /** Preencher somente com dados verificados e autorização de exibição. */
  avaliacoesGoogle?: { notaMedia: number; total: number; atualizadoEm: string };
}

/** Imagem servida de /public (ou URL), sempre com dimensões para evitar salto de layout. */
export interface ImagemRef {
  src: string;
  largura: number;
  altura: number;
}

export interface Servico {
  id: string;
  nome: string;
  /** 1 a 2 linhas, focadas no resultado. */
  descricao: string;
  /** Categoria: cabelo (só nos dados estruturados), outros (seção Outros Serviços) ou espaco (só nos dados estruturados). */
  categoria: 'cabelo' | 'espaco' | 'outros';
}

/** Foto da galeria. O arquivo fica em src/assets/galeria/ e só é exibido com autorizado: true. */
export interface FotoGaleria {
  arquivo: string;
  /** Descritivo e único em toda a galeria. */
  alt: string;
  /** Categoria usada nos filtros (ex.: Corte, Coloração, Mechas, Loiros). */
  servico: string;
  autorizado: boolean;
  /** true enquanto for placeholder ou dado a confirmar. */
  confirmar?: boolean;
}

/** Reel. O mp4 fica em public/reels/ e o poster em src/assets/reels/. */
export interface Reel {
  /** Caminho público do mp4 (ou URL de CDN de vídeo). */
  arquivo: string;
  /** Nome do arquivo em src/assets/reels/. */
  poster: string;
  titulo: string;
  /** Uma linha. */
  descricao: string;
  /** ISO 8601, ex.: PT0M25S. */
  duracao: string;
  /** ISO 8601, ex.: 2026-03-15. */
  dataPublicacao: string;
  /** Caminho público de um .vtt. Obrigatório se o vídeo tiver fala. */
  legendas: string | null;
  urlInstagram: string | null;
}

export interface Depoimento {
  nome: string;
  texto: string;
  /** Data ISO YYYY-MM-DD após confirmação. */
  data: string;
  fonte: 'Google';
  urlOrigem: string;
  /** Exibir somente com autorização registrada. */
  autorizado: boolean;
}

export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

/** Profissional do estúdio. A foto (4:5) fica em src/assets/profissionais/. */
export interface Profissional {
  id: string;
  nome: string;
  /** Área de atuação, exibida abaixo do nome. */
  area: string;
  /** Nome do arquivo em src/assets/profissionais/. */
  foto: string;
  alt: string;
  /** object-position do recorte 4:5 da foto (ex.: "top"). Padrão: centro. */
  posicao?: string;
  /** URL do Instagram do profissional (https://www.instagram.com/...). Sem ela, o botão "Saber mais" não aparece. */
  instagram?: string;
  /** true enquanto for placeholder ou dado a confirmar. */
  confirmar?: boolean;
}
