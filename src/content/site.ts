import type { Site } from './types';

export const site: Site = {
  nome: 'Studio Flávio Barcelos',
  categoria: 'Salão de beleza, com foco principal em cabelos',
  descricao:
    'Salão no Centro do Rio de Janeiro desde 2020, especializado em loiras, cortes, coloração, mechas, tratamentos e alisamentos. Também oferece manicure, pedicure, depilação e massagem relaxante.',
  publico: ['adultos', 'crianças'],
  anoAbertura: 2020,

  endereco: {
    rua: 'Rua México',
    numero: '119',
    sala: 'Sala 201',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '20031-907',
  },

  // Segunda (1) a sábado (6), 09:00 às 20:00.
  horarios: [{ dias: [1, 2, 3, 4, 5, 6], abre: '09:00', fecha: '20:00' }],
  diasFechados: [0],

  pagamento: {
    cartoes: [
      'Visa',
      'Mastercard',
      'American Express',
      'Hipercard',
      'Elo (crédito e débito)',
      'Maestro',
      'Visa Electron',
    ],
    outros: ['PIX', 'Dinheiro', 'Transferência/DOC/TED'],
  },

  links: {
    instagram: 'https://www.instagram.com/studioflaviobarcelos/',
    instagramUsuario: '@studioflaviobarcelos',
    google: 'https://share.google/tSQAKlFFjTH7ANBKs',
  },

  // O agendamento e todo contato acontecem pelo WhatsApp. Só dígitos, com DDI (55) e DDD (21).
  whatsapp: '5521969261188',
  telefone: '(21) 96926-1188',
  mensagens: {
    agendar: 'Olá! Gostaria de agendar um horário no Studio Flávio Barcelos.',
    informacoes: 'Olá! Gostaria de mais informações sobre o Studio Flávio Barcelos.',
    // {servico} é trocado pelo nome do serviço.
    servico: 'Olá! Gostaria de agendar {servico} no Studio Flávio Barcelos.',
  },

  // MEI. A razão social completa contém números do CPF e não é publicada; o CPF nunca aparece no site.
  empresa: { nomeCivil: 'Flavio Barcelos da Silva', tipo: 'MEI', cnpj: '44.024.538/0001-01' },
  // Responsável pelo canal de privacidade (contato apenas pelo WhatsApp).
  privacidade: { responsavel: 'Flavio Barcelos' },

  // Vazio = analíticos desativado. O cliente configura o ID (G-XXXXXXXXXX) ao ativar o GA4.
  ga4MeasurementId: '',

  sobre: {
    nome: 'Flávio Barcelos',
    bio: '[CONFIRMAR] Esta mini-bio será preenchida com a trajetória de Flávio Barcelos, a partir de informações fornecidas e aprovadas por ele. O texto apresentará seu tempo de profissão, sua formação e as especialidades que orientam seu trabalho com cabelos. Também contará como ele conduz o atendimento e o que considera importante no cuidado com cada cliente. Antes da publicação, confirmar todos os dados e substituir este texto provisório por uma apresentação pessoal de sessenta a noventa palavras.',
    fatos: [
      '[CONFIRMAR] Anos de profissão e início da trajetória.',
      '[CONFIRMAR] Especialização e instituição de formação.',
      '[CONFIRMAR] Cursos realizados, instituições e datas.',
    ],
    citacao: '[CONFIRMAR] Inserir uma fala do próprio Flávio sobre como enxerga o cabelo.',
    // Texto alternativo do retrato (src/assets/sobre/retrato.*).
    retratoAlt: '[CONFIRMAR] Descrever o retrato de Flávio Barcelos.',
  },

  // Texto alternativo das 3 imagens de "Cabelo é o nosso foco" (src/assets/foco/foco-1.* a foco-3.*).
  focoAlts: [
    '[CONFIRMAR] Descrever a imagem 1 de Cabelo é o nosso foco.',
    '[CONFIRMAR] Descrever a imagem 2 de Cabelo é o nosso foco.',
    '[CONFIRMAR] Descrever a imagem 3 de Cabelo é o nosso foco.',
  ],

  // [CONFIRMAR] Nota média, total e data de atualização, com autorização.
  // avaliacoesGoogle permanece ausente até a confirmação desses dados.
};
