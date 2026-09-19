# T6 — Segurança, privacidade e aceite (estado atual)

Reescrito no Ajuste A3 para refletir o site como está hoje. O texto original da T6 (com formulário, Resend, Upstash, Turnstile e Trinks) está preservado na seção final **Histórico**.

## Como o site funciona hoje

- **Sem formulário, sem função serverless e sem coleta direta de dados pessoais.** O site é estático. Não há `api/`, e-mail, banco de dados nem variáveis privadas.
- **Agendamento e contato pelo WhatsApp (Meta)**, sob a política desse serviço. Todos os links de WhatsApp passam por `whatsappLink()` em `src/lib/whatsapp.ts`. Não há Trinks nem UTMs.
- **Nenhum e-mail e nenhum CPF** aparecem no site. A empresa é MEI; só o nome civil e o CNPJ são publicados (rodapé e páginas legais). A razão social completa não é publicada.

## Consentimento e terceiros

- `consent_v1` (localStorage) guarda apenas categorias, data/hora ISO e versão da política. A validação é manual (sem `zod`). Formato inválido, versão diferente ou escolha com mais de 180 dias faz o banner reaparecer com opcionais negados. Se o armazenamento estiver bloqueado, a escolha vale só para o documento atual.
- A versão atual da política é `2026-09-19.3` (em `src/content/politicas.ts`). Como a versão mudou, o banner pede o consentimento de novo.
- O banner não bloqueia a navegação. Aceitar, recusar e personalizar têm o mesmo destaque. O diálogo nativo gerencia foco, aceita Escape e devolve o foco. O botão flutuante do WhatsApp sobe conforme a altura real do banner.
- **Mapa do Google:** exige consentimento de terceiros **e** clique. Ao revogar, o iframe é removido.
- **GA4:** a estrutura (Consent Mode v2 básico, padrão negado, nenhum carregamento antes do aceite) está pronta, mas **sem ID** (`ga4MeasurementId: ''` em `site.ts`). O cliente configura o ID ao ativar. Os links de agendamento têm o atributo `data-secao` para os eventos que o cliente vai configurar.
- Meta Pixel não está instalado.

## Cabeçalhos e CSP

`scripts/security-headers.mjs` roda após cada build, calcula o SHA-256 dos scripts inline do HTML gerado e atualiza `vercel.json`, `public/_headers` e `dist/_headers`. Sem `unsafe-inline` nem `unsafe-eval` em `script-src`. A CSP libera apenas Google (mapa e Analytics) e a própria origem, com `media-src 'self'` para os reels e `form-action 'self'`. JSON-LD não entra nos hashes. Não há Cloudflare na CSP. Versionar o `vercel.json` gerado junto ao código; mudanças em scripts inline exigem novo build.

## Privacidade e termos

- **Controlador:** Flavio Barcelos da Silva (MEI), CNPJ 44.024.538/0001-01, com o endereço atualizado (Rua México, 119, Sala 201, CEP 20031-907).
- **Canal de privacidade:** Flavio Barcelos, pelo WhatsApp (21) 96926-1188.
- O estúdio, como agente de tratamento de pequeno porte, está dispensado de indicar encarregado (Resolução CD/ANPD nº 2/2022) e mantém o canal acima.
- Os textos mantêm o aviso **[CONFIRMAR — revisão jurídica]**: são bases para revisão, não certificação de conformidade.

## Validação

- `npm run test:security`: valida o formato do consentimento (JSON inválido, versão antiga, futuro, expiração e campos extras).
- `npm run test:e2e`: recusa sem requisições externas, persistência, foco/Escape, mapa, GA4 simulado com padrão negado e URL sem query, versão antiga e armazenamento bloqueado, documentos legais, links externos com `noopener noreferrer` e 404 com `noindex`.

## Pendências

1. **[CONFIRMAR — revisão jurídica]** Bases legais, retenção de logs e provedores, transferências internacionais e modelo do termo de autorização de imagem (em `src/content/paginasLegais.ts`).
2. **[CONFIRMAR]** Inventário final de cookies de terceiros (Google Maps e GA4) no ambiente publicado.
3. `SITE_ORIGIN` é obrigatória no deploy (URLs absolutas do JSON-LD). O domínio é configurado no deploy.
4. Verificar os cabeçalhos reais após publicar e medir a nota em securityheaders.com.

## Histórico

Texto original da T6, escrito quando o site tinha formulário, Trinks e e-mail. Mantido apenas como registro; o estado atual é o descrito acima.

## T6 — Segurança, privacidade e aceite

Implementação de 19/09/2026. Apenas T6; nenhum deploy ou e-mail real foi realizado.

### Decisões de implementação

- Hospedagem escolhida para a função: **Vercel**, endpoint `api/contato.ts`. O site continua estático. `public/_headers` oferece os mesmos cabeçalhos para hospedagem estática Netlify; não constitui uma função Netlify. `astro dev` e `astro preview` não executam a função Vercel: usar Vercel Dev para integração real ou os testes locais com provedores simulados.
- **Resend** entrega e-mail para um destinatário configurado no servidor. A chave, o remetente verificado e o destinatário são variáveis privadas. Nenhuma conta, credencial ou assinatura de serviço foi criada.
- **Upstash Redis REST** mantém o rate limit entre instâncias: janela deslizante de 10 minutos, no máximo 5 tentativas POST por IP, com script Lua atômico. O IP recebido do cabeçalho controlado pela Vercel vira HMAC antes de chegar ao Redis. Não há fallback de produção em memória; falha de configuração ou indisponibilidade bloqueia o envio. Tentativas inválidas também contam.
- Um GET sem dados pessoais em `/api/contato` emite desafio HMAC com início e nonce. O POST exige assinatura válida, pelo menos 3 segundos e no máximo 2 horas. Um nonce é consumido uma única vez. O horário do navegador não basta para contornar o tempo mínimo.
- Zod valida no cliente e servidor, com objetos estritos, limites, serviço conhecido, versão atual e aceite verdadeiro. O corpo é limitado a 16 KiB. Todo valor inserido no HTML do e-mail é escapado; assunto e cabeçalhos não vêm da mensagem do usuário.
- Honeypot preenchido devolve a mesma resposta de sucesso, sem e-mail. O servidor verifica origem, tipo de conteúdo e, se habilitado, token Turnstile, hostname e ação. Erros não expõem stack, payload ou resposta do provedor. A aplicação não grava dados pessoais em logs, analytics, query strings ou armazenamento do navegador.
- O formulário transmite por POST somente campos necessários, honeypot, desafio, token opcional e prova do aceite. Registra data/hora declarada pelo cliente, versão aceita e horário de recebimento do servidor no e-mail. Aceitar os documentos não autoriza marketing.

### Consentimento e terceiros

`consent_v1` armazena apenas categorias, data/hora ISO e versão da política. Leitura e escrita têm try/catch. Conteúdo inválido, versão diferente ou escolha com mais de 180 dias faz o banner reaparecer com opcionais negados. Se o armazenamento estiver bloqueado, a escolha vale para o documento atual. Mudanças em outra aba são propagadas.

O banner não bloqueia navegação. As três ações usam a mesma classe visual. O diálogo nativo gerencia foco, permite Escape e devolve foco ao acionador. O deslocamento do WhatsApp acompanha a altura real do banner via ResizeObserver.

O mapa exige consentimento de terceiros **e clique**. Autorizar uma categoria não carrega o mapa automaticamente. Ao revogar, o iframe é removido e a imagem local volta.

GA4 utiliza Consent Mode v2 **básico**: padrão denied para `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization`. A biblioteca não é solicitada antes de consentimento analítico e ID válido. `site.ga4MeasurementId` permanece `[CONFIRMAR]`; Meta Pixel não está instalado. A medição usa caminho permitido sem query, fragmento ou referenciador, não instrumenta o formulário e desativa sinais do Google. Ao revogar permissões de uma biblioteca já carregada, desabilita-se a medição e a página recarrega, removendo cookies próprios `_ga` acessíveis. Requisições que já ocorreram não podem ser desfeitas.

**Antes de ativar GA4:** desativar Medição otimizada, sobretudo interações de formulário, no painel da propriedade; validar inventário, retenção e consentimento no ambiente real. Não adicionar tags pela hospedagem sem integrá-las a esta mesma regra.

Turnstile fica desligado com ambas as chaves vazias. Quando habilitado, é carregado somente ao interagir com o formulário e após consentimento de terceiros. A recusa mantém disponível a alternativa de agendar pela Trinks. Nunca incluir a chave secreta em variável `PUBLIC_`.

### Cabeçalhos e CSP

`scripts/security-headers.mjs` roda após cada build, calcula SHA-256 dos scripts inline do HTML gerado e atualiza `vercel.json`, `public/_headers` e `dist/_headers`. A geração atual inclui três hashes (hidratação do Astro/Preact). Não há `unsafe-inline` em `script-src` nem `unsafe-eval`.

`style-src 'unsafe-inline'` foi mantido para estilos e variáveis de layout usados pelo Astro e pelo posicionamento do banner. `connect-src` inclui Cloudflare, necessário ao Turnstile opcional, além de Analytics e a própria origem. Resend e Upstash são acessados no servidor e não entram na CSP do navegador. Meta não consta na lista. HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options e COOP seguem o pedido.

**Antes de deploy Vercel:** executar `npm run build` com as mesmas versões do lockfile e versionar o `vercel.json` gerado junto ao código. A Vercel pode ler a configuração antes de executar o build; não depender de uma alteração tardia do arquivo na hospedagem. Mudanças em scripts inline exigem regenerar esses hashes. Verificar os cabeçalhos reais após publicar; a nota A/A+ em securityheaders.com ainda não foi medida. `preload` no cabeçalho não cadastra automaticamente o domínio na lista HSTS.

### Validação

Resultado final: build, tipagem e lint aprovados; 10/10 testes de segurança e 12/12 cenários de navegador aprovados. Os dois cenários Turnstile foram repetidos separadamente após corrigir a simulação do atributo vazio no HTML; os outros dez cenários já haviam passado. A varredura por padrões de chaves privadas/credenciais não encontrou ocorrências no código do projeto; os nomes das variáveis privadas também não aparecem nos bundles públicos.

- `npm run build`, `npm run check`, `npm run lint`.
- `npm run test:security`: 10 casos, cobrindo consentimento inválido/antigo/expirado, aceite, campos extras e limites, escape de HTML, replay, honeypot, assinatura, 2999/3000 ms, expiração, 5 envios concorrentes e bloqueio do sexto, liberação após janela, isolamento por IP, origem, tamanho, configuração incompleta e falhas de Redis/Resend, Turnstile inválido e válido.
- `npm run test:e2e`: Chrome desktop e viewport/touch de celular, servindo o build com os cabeçalhos reais. Verifica recusa sem requisições para Google/Meta/Maps, persistência, foco/Escape, consentimento e revogação do mapa, GA4 simulado com padrão denied e remoção de query, Turnstile opcional simulado, armazenamento bloqueado, formulário sem aceite, erros, envio JSON com versão/data, links legais, rel de links externos e 404 noindex.
- Os provedores são simulados; não são testes contra Resend, Upstash ou Cloudflare reais. O comportamento da janela e das instâncias é exercitado com Redis simulado, sem validar execução Lua em um Redis contratado. Fazer teste de integração após configurar as contas.
- `npm audit --audit-level=high`: zero vulnerabilidades na consulta de 19/09/2026.
- `.env.example` tem valores vazios; `.env` e `.env.*` estão ignorados, exceto o exemplo. Nenhuma credencial real foi adicionada. Os testes geram o segredo efêmero em memória.

### Configuração pendente

1. Preencher no painel Vercel as variáveis de `.env.example`: origem exata HTTPS sem barra final, segredo aleatório de pelo menos 32 caracteres, remetente verificado, destinatário, Resend e Upstash. Nunca fornecer esses valores em conteúdo público.
2. Opcionalmente configurar as duas chaves Turnstile juntas, hostname e ação `contato`. A chave pública precisa estar presente também no build. Sem as credenciais obrigatórias, o formulário retorna erro genérico 503 e não envia.
3. `[CONFIRMAR — revisão jurídica]` Controlador, CNPJ, encarregado, prazo proposto de 90 dias para contatos e rotina de exclusão, bases legais, contratos e transferências internacionais, retenção da infraestrutura e inventário de terceiros. Os textos são bases para revisão, não certificação de conformidade.
4. `[CONFIRMAR]` Contato de segurança em `public/.well-known/security.txt`. O placeholder não é um endereço RFC 9116 válido; substituir antes de publicar. Expiração definida: 18/09/2027.
5. `[CONFIRMAR]` ID GA4, se desejado. A ausência do ID mantém analytics inativo.

### Critérios de aceite

- [x] Recusa impede carregamento de Analytics, Meta e Maps nos cenários de navegador testados.
- [x] Preferências reabríveis pelo rodapé e persistentes entre visitas; bloqueio de armazenamento tratado.
- [x] Formulário bloqueado sem aceite. Honeypot, tempo mínimo, replay e rate limit cobertos pelos testes descritos.
- [x] Documentos acessíveis pelo rodapé, banner e formulário, com aviso de revisão, versão e atualização.
- [x] Cabeçalhos configurados e exercitados localmente. **Pendente após deploy:** medição A/A+.
- [x] Nenhum segredo real adicionado; configuração privada por ambiente.

### Arquivos

Criados:

- `.env.example`, `vercel.json`, `playwright.config.ts`.
- `api/contato.ts`, `src/server/contato.ts`.
- `src/components/CookieConsent.astro`.
- `src/lib/consent.ts`, `src/lib/analytics.ts`, `src/lib/contato-schema.ts`, `src/lib/turnstile.ts`.
- `src/content/politicas.ts`, `src/pages/404.astro`.
- `public/_headers`, `public/.well-known/security.txt`.
- `scripts/security-headers.mjs`.
- `tests/fixtures.ts`, `tests/security.test.ts`, `tests/server.ts`, `tests/e2e/privacy.spec.ts`.
- `docs/T6-relatorio.md`.

Alterados:

- `.gitignore`, `package.json`, `package-lock.json`.
- `src/content/site.ts`, `src/content/types.ts`, `src/content/paginasLegais.ts`.
- `src/lib/formulario.ts`.
- `src/components/Contato.astro`, `src/components/Footer.astro`, `src/components/Mapa.astro`.
- `src/layouts/BaseLayout.astro`, `src/pages/[documento].astro`.

Removido: `src/lib/consentimento.ts` (stub substituído pelo módulo real).

### Fontes de referência

- [LGPD — texto oficial compilado](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm): bases e direitos sujeitos à revisão indicada nos documentos.
- [Google — Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) e [modos básico e avançado](https://developers.google.com/tag-platform/security/concepts/consent-mode): implementação básica, sem tags antes de permissão.
- [Vercel — cabeçalhos da requisição](https://vercel.com/docs/headers/request-headers): IP confiável da plataforma.
- [Upstash — REST API](https://upstash.com/docs/redis/features/restapi): comandos Redis por HTTPS.
- [Resend — envio de e-mail](https://resend.com/docs/api-reference/emails/send-email): payload e API de entrega.
- [Cloudflare — widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) e [validação do token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/): renderização explícita e verificação no servidor.

### Atualização pelo Ajuste A1

- CSP: `media-src 'self'` foi acrescentado (reels em `public/reels/`). A geração agora inclui quatro hashes de scripts inline (o script dos pincéis entrou; JSON-LD é ignorado por não ser executável).
- A Política de Privacidade passou a mencionar que fotos e vídeos de clientes são publicados mediante autorização de uso de imagem, mantendo o aviso de revisão jurídica.
- O bloco de miniaturas do Instagram da T4 foi substituído pelo botão "Ver mais no Instagram" na seção Reels; não há embed nem script do Instagram.

### Formulário removido no Ajuste A2

O formulário de contato, o endpoint `api/contato.ts`, o anti-spam (honeypot, tempo mínimo, rate limit), as integrações com Resend, Upstash e Cloudflare Turnstile, as variáveis de ambiente correspondentes, a dependência `zod` e os testes do formulário foram removidos. A CSP não lista mais `challenges.cloudflare.com`. As políticas foram reescritas (o site não coleta dados pessoais diretamente; agendamento e contato ocorrem na Trinks e no WhatsApp) e a versão passou a `2026-09-19.2`, o que faz o banner de cookies pedir consentimento de novo. As seções acima sobre formulário, retenção de contatos, Resend, Upstash e Turnstile descrevem o estado anterior a este ajuste.
