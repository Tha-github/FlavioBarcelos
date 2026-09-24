import { site } from './site';

interface SecaoLegal {
  titulo: string;
  paragrafos: string[];
}
const controlador: SecaoLegal = {
  titulo: 'Responsável e canal de privacidade',
  paragrafos: [
    `Este documento se aplica ao site do ${site.nome}. Controlador: ${site.empresa.nomeCivil} (${site.empresa.tipo}); CNPJ: ${site.empresa.cnpj}. Endereço: ${site.endereco.rua}, ${site.endereco.numero}, ${site.endereco.sala}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}, CEP ${site.endereco.cep}.`,
    `Canal de privacidade e pedidos sobre dados pessoais: ${site.privacidade.responsavel}, pelo WhatsApp ${site.telefone}. O estúdio, como agente de tratamento de pequeno porte, está dispensado de indicar encarregado (Resolução CD/ANPD nº 2/2022), e mantém esse canal de comunicação com os titulares. Não envie documentos ou dados sensíveis por esse canal.`,
  ],
};
const direitos: SecaoLegal = {
  titulo: 'Direitos do titular e solicitações',
  paragrafos: [
    'Nos termos do art. 18 da LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários ou tratados irregularmente, portabilidade conforme regulamentação, informações sobre compartilhamento, eliminação dos dados tratados com consentimento e revogação do consentimento. Também pode conhecer as consequências de não consentir e apresentar petição à ANPD.',
    'Use o canal de privacidade acima. Poderemos pedir apenas a identificação necessária para proteger seus dados contra acesso indevido. Responderemos conforme os prazos legais aplicáveis; eventual impossibilidade de atender será explicada. A revogação não desfaz tratamentos anteriores lícitos nem afasta obrigações legais de conservação.',
  ],
};
const semColeta: SecaoLegal = {
  titulo: 'O site não coleta dados pessoais diretamente',
  paragrafos: [
    'Este site não possui formulário, cadastro, área de login nem outro campo em que você informe nome, telefone, e-mail ou mensagem. Não pedimos documentos pessoais, endereço residencial, dados de pagamento nem informações de saúde, e nada do que você faz no site é gravado em um banco de dados do estúdio.',
    'O agendamento e o contato acontecem fora do site, pelo WhatsApp (Meta), sob a política de privacidade desse serviço. Ao clicar nos links de WhatsApp, você sai deste site e os dados que informar passam a ser tratados por esse serviço.',
    'A infraestrutura de hospedagem pode processar dados técnicos de conexão (como endereço IP e informações do navegador) para entregar as páginas e proteger o serviço. Recursos opcionais de análise, marketing e conteúdo de terceiros dependem do seu consentimento, descrito na Política de Cookies.',
    'Fotos e depoimentos de clientes exibidos na galeria e nos reels são publicados mediante autorização de uso de imagem, concedida por escrito e revogável. Sem essa autorização, nada é publicado.',
  ],
};
const compartilhamento: SecaoLegal = {
  titulo: 'Serviços de terceiros e compartilhamento',
  paragrafos: [
    'A hospedagem prevista é a Vercel, que entrega as páginas. WhatsApp/Meta processa a conversa iniciada por você; Instagram/Meta recebe a navegação ao abrir o perfil do estúdio. O Google recebe dados ao abrir seus links e, no site, somente após autorização e acionamento do mapa ou ativação do Analytics. Não há Meta Pixel instalado.',
    '[CONFIRMAR] Provedores e suboperadores contratados, regiões de armazenamento, condições contratuais e mecanismos aplicáveis a transferências internacionais. Serviços externos possuem políticas próprias. Recusar recursos opcionais não impede a navegação nem o acesso aos links de agendamento.',
  ],
};
const bases: SecaoLegal = {
  titulo: 'Finalidades e bases legais',
  paragrafos: [
    'Como o site não coleta dados diretamente, o tratamento próprio se limita ao necessário para entregar as páginas e lembrar suas escolhas de privacidade neste navegador. Recursos opcionais de análise, marketing e conteúdo de terceiros dependem de consentimento específico, revogável e separado (art. 7º, I, da LGPD).',
  ],
};
const retencao: SecaoLegal = {
  titulo: 'Retenção e segurança',
  paragrafos: [
    'A escolha de cookies fica apenas no seu dispositivo, por até 180 dias, e é solicitada novamente quando expirar ou quando a versão desta política mudar. O site não mantém banco de dados de contatos. [CONFIRMAR] Prazos de logs de infraestrutura e retenção dos provedores contratados.',
    'Usamos HTTPS na hospedagem e cabeçalhos de segurança no navegador. Medidas técnicas reduzem riscos, mas não eliminam todas as possibilidades de incidentes. Eventuais incidentes relevantes serão avaliados e comunicados conforme a legislação aplicável.',
  ],
};
export const inventarioCookies = [
  {
    categoria: 'Necessários',
    nome: 'consent_v1 (localStorage)',
    finalidade: 'Guardar categorias escolhidas, data/hora e versão da política.',
    prazo: 'Até 180 dias, mudança de versão ou limpeza pelo usuário.',
  },
  {
    categoria: 'Analíticos',
    nome: 'Google Analytics 4: _ga e _ga_<ID>',
    finalidade:
      'Medição de visitas, se houver ID configurado e consentimento. [CONFIRMAR] Inventário final antes da ativação.',
    prazo: 'Configurado para até 180 dias; conferir configuração final do provedor.',
  },
  {
    categoria: 'Marketing',
    nome: 'Nenhum serviço instalado',
    finalidade:
      'Categoria reservada. Meta Pixel não está instalado. Futura inclusão exige revisão do inventário e da versão.',
    prazo: 'Não se aplica.',
  },
  {
    categoria: 'Conteúdo de terceiros',
    nome: 'Google Maps',
    finalidade:
      'Mapa interativo após permissão e clique. O provedor pode usar cookies e identificadores próprios. [CONFIRMAR] Nomes e duração no ambiente publicado.',
    prazo: '[CONFIRMAR] Conforme serviço e cookies utilizados pelo Google.',
  },
];
export const paginasLegais: { slug: string; titulo: string; secoes: SecaoLegal[] }[] = [
  {
    slug: 'politica-de-privacidade',
    titulo: 'Política de Privacidade',
    secoes: [
      controlador,
      semColeta,
      bases,
      compartilhamento,
      retencao,
      direitos,
      {
        titulo: 'Escolhas e atualização deste documento',
        paragrafos: [
          'O painel Preferências de cookies permite recusar ou revogar categorias opcionais a qualquer momento. A mudança interrompe novos carregamentos e remove o mapa ativo; não apaga informações já recebidas por provedores. Para essas informações, use o canal de privacidade e os mecanismos dos respectivos serviços.',
          'Alterações relevantes serão publicadas nesta página, com nova versão e data. Mudanças na política de cookies exigem nova escolha.',
        ],
      },
    ],
  },
  {
    slug: 'termos-de-uso',
    titulo: 'Termos de Uso',
    secoes: [
      controlador,
      {
        titulo: 'Uso do site e agendamento',
        paragrafos: [
          'O site apresenta o estúdio, seus serviços e canais de contato. Ele não realiza reservas: o agendamento e a conversa acontecem pelo WhatsApp. Disponibilidade, valores e condições do serviço devem ser confirmados diretamente com o estúdio. Informações marcadas [CONFIRMAR] são provisórias e não representam oferta definitiva.',
          '[CONFIRMAR] Política comercial de atrasos, remarcações, cancelamentos, pagamento e orçamento. Nenhuma multa, prazo de tolerância ou preço é estabelecido por este texto provisório. Os direitos assegurados pela legislação aplicável permanecem preservados.',
        ],
      },
      {
        titulo: 'Aceite',
        paragrafos: [
          'Ao usar o site, você declara ter lido estes Termos e a Política de Privacidade, disponíveis pelos links do banner de cookies e do rodapé. O aceite dos Termos não se estende a publicidade nem substitui o consentimento para cookies opcionais, que é pedido separadamente.',
        ],
      },
      semColeta,
      compartilhamento,
      direitos,
      {
        titulo: 'Conteúdo, disponibilidade e responsabilidade',
        paragrafos: [
          'Textos, imagens e identidade visual devem ser utilizados respeitando os direitos de seus titulares. Não é permitido explorar falhas, tentar acessar dados alheios ou interromper o serviço. Falhas podem ser comunicadas pelo canal de segurança publicado no site, quando confirmado.',
          'O site pode ficar indisponível para manutenção ou por falhas de infraestrutura. Serviços externos são prestados por seus respectivos responsáveis. Essas condições não afastam deveres legais do estúdio nem limitam direitos do consumidor. Não há garantia de resultado estético individual apenas pela consulta ao site.',
          'Atualizações serão identificadas pela versão e data desta página.',
        ],
      },
    ],
  },
  {
    slug: 'politica-de-cookies',
    titulo: 'Política de Cookies',
    secoes: [
      controlador,
      {
        titulo: 'O que utilizamos e como escolher',
        paragrafos: [
          'Cookies são pequenos registros mantidos pelo navegador. Também usamos localStorage, identificado no inventário abaixo. Na primeira visita, as categorias opcionais permanecem desativadas; aceitar, recusar ou personalizar tem o mesmo destaque visual. Navegar ou fechar o painel não equivale a aceitar.',
          'Necessários mantêm a sua escolha. Analíticos permitem medição pelo Google Analytics quando configurado. Marketing está reservado, sem pixel instalado. Conteúdo de terceiros permite o mapa do Google, que ainda exige um clique em Carregar mapa. Links para plataformas externas abrem serviços com políticas próprias.',
          'Google Consent Mode v2 está preparado em modo básico: o padrão é negado e a biblioteca do Analytics só carrega com autorização para Analíticos e ID válido. Não são enviados pings analíticos antes dessa autorização. A configuração de medição automática deve ser revisada antes de habilitar o serviço.',
        ],
      },
      bases,
      compartilhamento,
      retencao,
      direitos,
      {
        titulo: 'Reabrir, revogar e apagar',
        paragrafos: [
          'Use Preferências de cookies no rodapé para consultar e alterar suas escolhas. Ao revogar Conteúdo de terceiros, o mapa é removido. Ao revogar categorias já usadas pelo Analytics, a página recarrega para interromper a biblioteca; cookies próprios _ga acessíveis são apagados. Não é possível apagar diretamente cookies de domínios externos por esta página.',
          'Você também pode apagar cookies e dados locais nas configurações do navegador. Isso remove a preferência salva e faz o banner reaparecer. Se o navegador bloquear localStorage, a escolha vale apenas no documento atual. A preferência será pedida novamente em visitas futuras.',
          'O inventário abaixo descreve recursos implementados e integrações opcionais. [CONFIRMAR] Auditar nomes e prazos dos cookies de terceiros no ambiente de produção antes da ativação. Uma nova versão invalida a escolha anterior para nova avaliação.',
        ],
      },
    ],
  },
];
