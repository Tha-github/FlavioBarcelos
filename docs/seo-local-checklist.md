# Checklist de SEO local

> Arquivo criado no Ajuste A1. O checklist original da T7 não foi encontrado no projeto; os itens abaixo cobrem as mudanças do A1 e devem ser reunidos ao da T7 quando ele existir.

## Dados estruturados (JSON-LD)

- [ ] Nenhuma referência a antes/depois, comparador ou "Resultados" em qualquer JSON-LD, título ou descrição.
- [ ] `ImageGallery` "Cabelos feitos no Estúdio Flávio Barcelos" com até as 12 primeiras das 20 fotos autorizadas (`contentUrl` absoluta e `description` = `alt`). Só aparece com fotos reais e com `SITE_ORIGIN` (ou `site` no `astro.config.mjs`) definidos no build.
- [ ] Um `VideoObject` por reel real (`name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl`, todos absolutos). Reels com `[CONFIRMAR]` ficam de fora.
- [ ] Manter HairSalon, FAQPage, WebSite e WebPage da T7 e atualizar o que depender da nova estrutura de seções.
- [ ] Validar em https://validator.schema.org e no Rich Results Test (https://search.google.com/test/rich-results) com a URL publicada.

## On-page

- [ ] Um único `<h1>` e hierarquia h2/h3 sem saltos (Galeria e Reels são h2; nada de h3 visível nos reels).
- [ ] Fotos da galeria com nomes de arquivo descritivos e `alt` único (o build valida os `alt`).
- [ ] Sem legendas visíveis na galeria (Ajuste A2): o texto alternativo (alt) de cada foto carrega a descrição.
- [ ] Âncoras `#galeria` e `#reels` **não** entram no sitemap.

## Compartilhamento

- [ ] Imagem de compartilhamento (`og-image.jpg`): composição com a foto do hero, o logo e um dos pincéis. Não usar o fio nem foto de antes/depois.

## Sitemap

- [ ] Se a integração de sitemap permitir, incluir as imagens da galeria (image sitemap). Caso contrário, registrar aqui que ficou de fora.

## Perfil da Empresa no Google

- [ ] Publicar algumas fotos da galeria (com autorização) e os reels, com as mesmas legendas do site.
- [ ] Manter nome, endereço e telefone idênticos aos do site.

## Cor do topo (Ajuste A2)

- [ ] `<meta name="theme-color">` já usa o creme `#FDFBD4` (hero, header e rodapé).
- [ ] `site.webmanifest`: usar `background_color` e `theme_color` `#FDFBD4` quando o arquivo for criado (ele não existe no projeto hoje).
- [ ] `og-image.jpg`: se for criada com fundo escuro, refazer sobre o creme, com a foto do hero, o logo e um dos pincéis.
