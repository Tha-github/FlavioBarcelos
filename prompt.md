# prompt.md — Landing page de alto padrão · Studio Flávio Barcelos

Este documento descreve o projeto completo. As tarefas (T1 a T8) serão enviadas uma de cada vez. Antes de executar qualquer tarefa, leia este arquivo inteiro e siga o que está aqui como fonte da verdade.

---

## 1. Contexto do negócio

### 1.1 Dados verificados (fontes: Instagram do estúdio, certificado MEI e informações do cliente)

| Campo | Valor |
|---|---|
| Nome | Studio Flávio Barcelos |
| Categoria | Salão de beleza, com foco principal em **cabelos** (especialista em loiras) |
| Aberto desde | 2020 |
| Endereço | Rua México, 119, Sala 201 — Centro, Rio de Janeiro/RJ — CEP 20031-907 |
| Horário | Segunda a sábado, 09:00 às 20:00. Domingo fechado |
| Público | Atende adultos e crianças |
| Pagamento | Visa, Mastercard, American Express, Hipercard, Elo (crédito e débito), Maestro, Visa Electron, PIX, dinheiro, transferência/DOC/TED |
| WhatsApp e telefone | +55 21 96926-1188 — exibido como (21) 96926-1188; link https://wa.me/5521969261188 |
| Agendamento | Pelo WhatsApp (o site não usa mais a Trinks) |
| Empresa | Flavio Barcelos da Silva (MEI) — CNPJ 44.024.538/0001-01. A razão social completa não é publicada (contém números do CPF); nenhum CPF e nenhum e-mail aparecem no site |
| Privacidade | Responsável: Flavio Barcelos, contato apenas pelo WhatsApp |
| Instagram | @studioflaviobarcelos — https://www.instagram.com/studioflaviobarcelos/ |
| Perfil no Google | https://share.google/tSQAKlFFjTH7ANBKs |
| Domínio | Configurado no deploy pela variável `SITE_ORIGIN` |

### 1.2 Dados pendentes [CONFIRMAR]

Enquanto não forem fornecidos, use o marcador `[CONFIRMAR]` no código e no conteúdo. **Nunca invente** avaliações, notas, depoimentos, preços, prêmios, telefones ou nomes.

- Nota média e número de avaliações no Google (só exibir com autorização)
- 3 a 6 depoimentos reais do Google, com autorização
- Mini-bio do Flávio Barcelos (experiência, formação, especialidades)
- Respostas do FAQ marcadas [CONFIRMAR] (ordem de chegada, orçamento de coloração e mechas, cancelamento e atraso, estacionamento)
- Foto do hero (o cliente vai escolher) e retrato do Flávio (`src/assets/sobre/retrato.*`)
- 3 imagens 4:5 de "Cabelo é o nosso foco" (`src/assets/foco/foco-1.*`, `foco-2.*` e `foco-3.*`) e seus textos alternativos
- Logotipo em SVG
- Confirmar a autorização de uso de imagem das 15 fotos da galeria e revisar os textos alternativos (`src/content/galeria.json`)
- 8 vídeos (reels) com poster, título, descrição e legendas, se houver fala (`src/content/reels.json`)
- Os 2 pincéis do hero, fornecidos pelo cliente como imagem (PNG ou WebP com fundo transparente): `src/assets/hero/pincel-a.png` e `pincel-b.png`
- Revisão jurídica das páginas legais e modelo do termo de autorização de imagem

Google Analytics (ID) fica por conta do cliente, no final; a estrutura de consentimento já está pronta.

### 1.3 Objetivo da página

- **Primário:** gerar agendamentos de serviços capilares pelo WhatsApp.
- **Secundário:** apresentar os demais serviços do espaço e reforçar a autoridade do Flávio.
- **Público:** mulheres e homens de 25 a 55 anos que trabalham ou circulam no Centro do Rio. Valorizam atendimento personalizado e decidem pelo Instagram e pelas avaliações do Google.
- **Tom de voz:** sofisticado, acolhedor e direto. Frases curtas e sem exageros como "o melhor do Rio" ou "transformação garantida". Falar do resultado e do cuidado.

### 1.4 Mapa da página (ordem das seções)

1. Header fixo
2. Hero (banner, com pincéis flutuantes)
3. Cabelo é o nosso foco (`#cabelos`, com 3 imagens)
4. Serviços capilares (`#servicos`, em boxes)
5. Como funciona o atendimento (`#como-funciona`, em carrossel)
6. Cabelos feitos no studio (`#galeria`)
7. O studio em movimento (`#reels`, um vídeo por vez)
8. Sobre o Flávio (`#sobre`)
9. Além dos cabelos (`#outros-servicos`, em boxes)
10. Perguntas frequentes (`#faq`)
11. Depoimentos (oculta enquanto não houver depoimento autorizado)
12. Como chegar (`#como-chegar`)
13. CTA final
14. Rodapé

Removidas no Ajuste A2: a seção "O espaço" e a seção "Fale com o estúdio" (formulário).

Páginas extras: `/politica-de-privacidade`, `/termos-de-uso`, `/politica-de-cookies`, `404`.

---

## 2. Direção de design

### 2.1 Referência

Moodboard do Behance: https://www.behance.net/moodboard/209067711/Landing-page-p-Clinicas-de-Esttica

O que aproveitar dele:
- Hero dominado por fotografia de retrato grande.
- Blocos alternando foto e texto, com muito respiro.
- CTAs repetidos ao longo da página.
- Prova social perto dos CTAs.
- Lógica de página de vendas aplicada a serviço local: problema, solução, prova, ação.

Não copiar layouts, fotos, textos ou identidades desses projetos.

### 2.2 Conceito visual: "Os pincéis"

Dois pincéis de coloração renderizados em 3D flutuam no hero e atravessam a borda inferior, inspirados nos brincos flutuantes da referência. São o único elemento ousado. Todo o resto é silencioso, editorial e disciplinado.

*(Substitui o conceito anterior "O fio", removido pelo Ajuste A1.)*

### 2.3 Tokens

**Cores** (paleta "Luxe & Elegant", ajuste A4; valores aproximados lidos da imagem enviada pelo cliente)

| Token | Hex | Uso |
|---|---|---|
| --onyx | #000000 | Texto principal e superfícies muito escuras (sobreposições, controles de vídeo) |
| --velvet | #212F52 | Marinho: botões, títulos, links, foco e fundo do CTA final |
| --marble | #E9E6E1 | Fundo de seções claras alternadas |
| --pearl | #FFFFFF | Fundo principal claro |
| --champagne | #D2B589 | Acento decorativo: bordas finas, detalhes e ícones. Nunca em texto |
| --silk | #EEE6DB | Fundo do hero, do header e do rodapé (textos em --onyx e --velvet) |

Todas as combinações de texto devem passar em WCAG AA.

**Tipografia**

- Display: **Bodoni Moda** (pesos 400 e 500), auto-hospedada, com tracking levemente negativo nos títulos.
- Texto: **Manrope** (pesos 400, 500 e 700).
- Escala modular de 1.25, com base de 17px no mobile e 18px no desktop.
- Linhas de até cerca de 70 caracteres e entrelinha de 1.6 no corpo.
- Evitar:
  - rótulos em CAIXA ALTA espaçada acima dos títulos;
  - uma palavra isolada em itálico ou cor dentro do título;
  - setas "→" em todos os botões.

**Layout e movimento**

- Largura máxima de 1240px. **Site centralizado** (Ajuste A2): títulos, textos, botões, grids e carrosséis ficam centralizados em todas as seções. Exceções: o hero no desktop (texto à esquerda, foto à direita) e o header (logo e menu nas posições atuais). No mobile tudo é centralizado, inclusive o hero. Parágrafos com no máximo ~60 caracteres por linha e `margin-inline: auto`.
- Fotos sem border-radius (recorte editorial). Botões principais em pílula. Sem sombras genéricas.
- Evitar grades de cards idênticos.
- Um único movimento automático: a flutuação dos pincéis no hero (continua sendo a única animação automática da página) (pausada fora da viewport e desligada com `prefers-reduced-motion`). As demais animações só acontecem em resposta a ações do usuário.
- Respeitar `prefers-reduced-motion`.

---

## 3. Stack

- Astro (versão estável mais recente), TypeScript estrito, Tailwind CSS
- Imagens via `astro:assets` (AVIF + WebP com srcset)
- Fontes auto-hospedadas via `@fontsource`, com `font-display: swap`
- Sem formulário e sem função serverless: o agendamento e o contato acontecem pelo WhatsApp (formulário removido no Ajuste A2; Trinks removida no A3)
- Hospedagem na Vercel ou Netlify, com HTTPS
- ESLint, Prettier e `astro check`

Estrutura:

```
/
├─ public/            favicon, og-image.jpg, robots.txt, _headers, reels/ (mp4)
├─ src/
│  ├─ assets/
│  ├─ components/     Header, Hero, PinceisFlutuantes, FocoCabelos,
│  │                  ServicosCapilares, BoxServico, ComoFunciona, Galeria,
│  │                  Lightbox, ReelsPlayer, Reels, Sobre, OutrosServicos,
│  │                  Depoimentos, FAQ, Localizacao, CTAAgendar, CTAFinal,
│  │                  Footer, CookieConsent, WhatsAppButton
│  │                  (saíram: Ambiente, Contato, ReelsCarrossel, api/contato.ts)
│  ├─ content/        site.ts, servicos.json, depoimentos.json, faq.json,
│  │                  galeria.json, reels.json
│  ├─ layouts/        BaseLayout.astro
│  ├─ pages/          index.astro, politica-de-privacidade.astro,
│  │                  termos-de-uso.astro, politica-de-cookies.astro, 404.astro
│  └─ styles/         global.css
├─ vercel.json
└─ astro.config.mjs
```

---

## 4. Plano de tarefas

| Tarefa | Entrega | Situação |
|---|---|---|
| T1 | Fundação do projeto e design system | Concluída |
| T2 | Header, Hero e os pincéis (antes, o "fio") | Concluída (fio substituído pelo A1) |
| T3 | Seção principal: Cabelos | Concluída (antes/depois substituído pelo A1) |
| T4 | Sobre, demais serviços e prova social | Concluída (bloco do Instagram substituído pelo A1) |
| T5 | Localização, FAQ, contato e rodapé | Concluída (formulário removido no A2) |
| T6 | Segurança, privacidade e aceite de termos (LGPD) | Concluída (formulário removido no A2) |
| T7 | SEO técnico e SEO local | Concluída (atualizada pelo A1 e pelo A2) |
| A1 | Pincéis, galeria e reels: [`docs/ajustes/A1.md`](docs/ajustes/A1.md) | Concluído |
| A2 | Layout, cores e reorganização das seções: [`docs/ajustes/A2.md`](docs/ajustes/A2.md) | Concluído |
| A3 | Dados reais do estúdio, WhatsApp como agendamento e serviços: [`docs/ajustes/A3.md`](docs/ajustes/A3.md) | Concluído |
| A4 | Nova paleta de cores "Luxe & Elegant" (enviada como imagem): [`docs/ajustes/A4.md`](docs/ajustes/A4.md) | Concluído |
| T8 | Desempenho, acessibilidade, testes e publicação | **Próxima** |

---

## 5. Regras gerais

1. Todo o conteúdo em português do Brasil, com acentuação correta.
2. Dados do negócio vivem apenas em `src/content/`. Nada de dados fixos espalhados pelos componentes.
3. Não inventar dados. Use `[CONFIRMAR]` e siga em frente.
4. Em desenvolvimento, use placeholders neutros com as proporções corretas, sem fotos de bancos genéricos.
5. Prefira HTML semântico e recursos nativos (`<details>`, `<dialog>`, `<picture>`) a bibliotecas.
6. Execute apenas a tarefa enviada. Não adiante tarefas futuras.
7. Ao terminar cada tarefa:
   - liste os arquivos criados e alterados;
   - confira os critérios de aceite um a um;
   - informe o que ficou pendente com `[CONFIRMAR]`.