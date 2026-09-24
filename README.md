# Estúdio Flávio Barcelos: site

Site estático (Astro). O agendamento e o contato acontecem pelo WhatsApp.

> O README completo (edição de conteúdo, deploy e pós-lançamento) será entregue na T8. Por enquanto, veja `docs/midia.md` para colocar fotos e vídeos.

## index.html na raiz

O comando `npm run build` gera o site em `dist/` **e copia o resultado para a raiz do projeto** (`index.html`, `404.html`, `_astro/`, `politica-de-privacidade/`, `termos-de-uso/`, `politica-de-cookies/` e outros). Os caminhos são ajustados para relativos, então o site funciona na raiz do domínio ou em uma subpasta, e também em hospedagens que servem os arquivos do repositório sem etapa de build (GitHub Pages, por exemplo; o arquivo `.nojekyll` já está incluído).

- Depois de **qualquer mudança no conteúdo**, rode `npm run build` e faça commit dos arquivos novos da raiz junto com a mudança.
- A lista dos arquivos gerados fica em `.publicado-raiz.json`. A cada build, os arquivos antigos são apagados e recriados. **Não edite** `index.html` nem `_astro/` à mão.
- Para copiar de novo sem refazer o build: `npm run publicar:raiz`.
- Abrir o `index.html` com duplo clique (endereço `file://`) mostra o visual, mas os recursos interativos (menu, carrosséis, galeria e reels) não carregam nesse modo, porque o navegador bloqueia scripts de módulo em arquivos locais. Para ver tudo funcionando, use `npm run preview` ou publique.
- `404.html` usa caminhos absolutos (`/`) e assume o site na raiz do domínio.

## Rodar no computador

```
npm install
npm run dev        # desenvolvimento
npm run build      # gera o site em dist/
npm run preview    # abre o site gerado
```

## Variável obrigatória no deploy: `SITE_ORIGIN`

`SITE_ORIGIN` é o endereço final do site, com `https://` e sem barra no fim (ex.: `https://www.exemplo.com.br`). **É obrigatória no deploy**: sem ela, os dados estruturados (JSON-LD) não geram os endereços absolutos das fotos e dos vídeos. Configure-a no painel da hospedagem (Vercel: Settings → Environment Variables). O domínio é definido no deploy; não há domínio no código.

Nenhuma outra variável de ambiente é necessária.

## Conferências

```
npm run check            # tipos
npm run lint
npm run check:encoding   # acentos quebrados
npm run build            # também valida os alt da galeria
```
