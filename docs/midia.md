# Como colocar fotos e vídeos no site (passo a passo)

Guia simples. Sempre use **estes nomes e estas pastas**. O site cuida do tamanho e do formato (AVIF/WebP) sozinho.

> **Regra de ouro:** só publique foto ou vídeo de cliente com **autorização de uso de imagem** assinada.

A foto do banner (topo do site) **não** entra aqui: continua como espaço reservado até o Flávio escolher.

---

## 1. Retrato do Flávio (seção "Sobre")

1. Coloque a foto **vertical (4:5)**, por exemplo 1200 × 1500 px, em `src/assets/sobre/` com o nome **`retrato.jpg`** (pode ser `.png`, `.webp` ou `.avif`).
2. **Apague** o arquivo `retrato-placeholder.webp` da mesma pasta.
3. Abra `src/content/site.ts` e, em `sobre`, troque o texto de `retratoAlt` por uma descrição da foto (ex.: "Flávio Barcelos sorrindo, de avental preto, no salão"). Apague o `[CONFIRMAR]`.

## 2. Três imagens de "Cabelo é o nosso foco"

1. Coloque 3 fotos **verticais (4:5)**, cerca de 1200 × 1500 px, em `src/assets/foco/` com os nomes exatos **`foco-1.jpg`**, **`foco-2.jpg`** e **`foco-3.jpg`** (a extensão pode ser `.png`, `.webp` ou `.avif`).
2. **Apague** `foco-1-placeholder.webp`, `foco-2-placeholder.webp` e `foco-3-placeholder.webp`.
3. Em `src/content/site.ts`, troque os 3 textos de `focoAlts` por descrições reais (uma por imagem, na mesma ordem). Apague os `[CONFIRMAR]`.

## 3. Galeria "Cabelos feitos no studio" (hoje 15 fotos)

1. Coloque as fotos (de preferência **verticais, 4:5**), cerca de 1200 × 1500 px, em `src/assets/galeria/`. Dê nomes que descrevem a foto, sem espaços nem acentos, por exemplo `loiro-platinado-raiz-esfumada.jpg`.
2. Se sobrar algum arquivo `placeholder-NN.webp`, apague.
3. Abra `src/content/galeria.json`. Cada foto é um bloco assim:

```json
{
  "arquivo": "loiro-platinado-raiz-esfumada.jpg",
  "alt": "Loiro platinado com raiz esfumada em cabelo longo liso",
  "servico": "Loiros",
  "autorizado": true
}
```

| Campo        | O que colocar                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `arquivo`    | o nome exato do arquivo que você colocou na pasta                                                                                        |
| `alt`        | descrição da foto. **Tem que ser diferente em cada foto** e não pode ficar vazio. Não aparece na tela: ajuda leitores de tela e o Google |
| `servico`    | categoria interna (Corte, Coloração, Mechas, Loiros, Tratamento, Alisamento). Não aparece no site                                        |
| `autorizado` | `true` se há autorização de imagem. Com `false`, a foto **não aparece**                                                                  |
| `confirmar`  | **apague esta linha** quando a foto for real                                                                                             |

4. O aviso "Imagens publicadas com autorização das clientes." já aparece sob a galeria.

## 4. Reels (8 vídeos)

### 4.1 Preparar o vídeo (no computador, uma vez)

Padrão: **720 × 1280 (vertical 9:16), até 30 segundos, até 4 MB por vídeo.** Comprima com:

```
ffmpeg -i entrada.mp4 -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart -c:a aac -b:a 96k saida.mp4
```

Gere a imagem de capa (poster) com:

```
ffmpeg -ss 1 -i saida.mp4 -frames:v 1 -q:v 3 poster.jpg
```

### 4.2 Colocar no site

1. Coloque o vídeo em `public/reels/` (ex.: `public/reels/corte-long-bob.mp4`).
2. Coloque a capa em `src/assets/reels/` (ex.: `corte-long-bob.jpg`), vertical 9:16.
3. **Apague** os arquivos `placeholder-01.webp` a `placeholder-08.webp` de `src/assets/reels/`.
4. Abra `src/content/reels.json`. Cada vídeo é um bloco assim:

```json
{
  "arquivo": "/reels/corte-long-bob.mp4",
  "poster": "corte-long-bob.jpg",
  "titulo": "Corte long bob",
  "descricao": "Long bob com pontas leves em cabelo liso.",
  "duracao": "PT0M25S",
  "dataPublicacao": "2026-03-15",
  "legendas": null,
  "urlInstagram": null
}
```

| Campo            | O que colocar                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `arquivo`        | caminho do vídeo, começando por `/reels/`                                                                                             |
| `poster`         | nome do arquivo da capa em `src/assets/reels/`                                                                                        |
| `titulo`         | título curto. Não aparece na tela: é lido por leitores de tela e enviado ao Google                                                    |
| `descricao`      | uma linha. Também não aparece na tela                                                                                                 |
| `duracao`        | duração no formato `PT0M25S` (0 minutos e 25 segundos)                                                                                |
| `dataPublicacao` | data no formato `AAAA-MM-DD`                                                                                                          |
| `legendas`       | caminho de um arquivo `.vtt` em `public/reels/` (ex.: `"/reels/corte-long-bob.vtt"`) ou `null`. **Obrigatório se o vídeo tiver fala** |
| `urlInstagram`   | link do reel no Instagram ou `null`                                                                                                   |

Vídeos com qualquer campo `[CONFIRMAR]` não são enviados ao Google. O site **não** usa o player do Instagram e o vídeo só é baixado quando a pessoa clica em reproduzir.

> Os vídeos podem migrar para um CDN de vídeo (ex.: Bunny Stream ou Cloudflare Stream) trocando só o campo `arquivo` por um endereço `https://...`. Nesse caso, peça ajuda para liberar o domínio do CDN em `media-src` no arquivo `scripts/security-headers.mjs`.

## 5. Pincéis do banner

1. Coloque os dois pincéis (PNG ou WebP com **fundo transparente**) em `src/assets/hero/` com os nomes **`pincel-a.png`** e **`pincel-b.png`**.
2. Formato horizontal (cerdas à esquerda, cabo à direita), cerca de 520 × 148 px, até 40 KB cada. Não coloque sombra na imagem: o site aplica.
3. Enquanto os arquivos não existirem, o banner aparece sem os pincéis (isso é normal e não dá erro).

---

## Conferir se está tudo certo

Depois de colocar as imagens e editar os arquivos `.json` e `site.ts`, rode no terminal, dentro da pasta do projeto:

```
npm run check:encoding
npm run build
```

- `check:encoding` avisa se algum texto ficou com acento quebrado.
- `build` monta o site e **para com uma mensagem** se uma foto da galeria estiver com `alt` vazio, `alt` repetido ou com `arquivo` inexistente.

Para ver o resultado: `npm run preview` e abra o endereço mostrado.

## Cuidados

- Salve os arquivos de texto em UTF-8, sem BOM (o `.editorconfig` já orienta o editor). No PowerShell, use `Set-Content -Encoding utf8NoBOM` (PowerShell 7).
- Nunca coloque CPF, e-mail ou dados pessoais de clientes em textos, nomes de arquivo ou `alt`.
