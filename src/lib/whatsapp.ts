import { site } from '../content/site';

/** Link `https://wa.me/<número>?text=<mensagem>`. Todos os links de WhatsApp do site passam por aqui. */
export function whatsappLink(mensagem: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem para agendar um serviço específico. */
export function mensagemServico(nome: string): string {
  return site.mensagens.servico.replace('{servico}', nome);
}
