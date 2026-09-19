// Copia o site gerado (dist/) para a raiz do projeto, com os caminhos ajustados para relativos.
// Resultado: index.html na raiz e o site funcionando (CSS, fontes, imagens e scripts) mesmo em
// hospedagens que servem a raiz do repositório, sem etapa de build.
//
// - index.html e as páginas legais usam caminhos relativos (./ ou ../), então funcionam na raiz
//   do domínio ou em uma subpasta.
// - 404.html mantém caminhos absolutos (é servida em qualquer profundidade de URL).
// - Os arquivos copiados ficam listados em .publicado-raiz.json; a cada execução os antigos são
//   removidos antes (os nomes dos arquivos em _astro/ mudam a cada build).
import { readdir, readFile, writeFile, mkdir, rm, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const MANIFESTO = '.publicado-raiz.json';
// Prefixos absolutos do site gerado que precisam virar relativos.
const ESTATICOS = ['_astro/', 'reels/', 'mapa-placeholder.svg', 'politica-de-cookies', 'politica-de-privacidade', 'termos-de-uso'];

async function listar(dir, base = dir) {
  const itens = await readdir(dir, { withFileTypes: true });
  const partes = await Promise.all(
    itens.map((e) => (e.isDirectory() ? listar(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name))])),
  );
  return partes.flat();
}

/** Prefixo relativo até a raiz para uma página: index.html -> "./"; pasta/index.html -> "../". */
function prefixoDe(arquivo) {
  const profundidade = arquivo.split(path.sep).length - 1;
  return profundidade === 0 ? './' : '../'.repeat(profundidade);
}

function relativizarHtml(html, prefixo) {
  let saida = html;
  for (const alvo of ESTATICOS) {
    const esc = alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // "/_astro/x" precedido por aspas, espaço, vírgula, ponto e vírgula (&quot;) ou parêntese.
    saida = saida.replace(new RegExp(`(?<![A-Za-z0-9_.:-])/${esc}`, 'g'), `${prefixo}${alvo}`);
  }
  // Links de páginas (pastas) terminam em "/" para funcionar em qualquer servidor.
  saida = saida.replace(/(href="\.{1,2}\/(?:politica-de-cookies|politica-de-privacidade|termos-de-uso))"/g, '$1/"');
  // Link para o início: href="/"
  saida = saida.replace(/href="\/"/g, `href="${prefixo}"`);
  return saida;
}

function relativizarCss(css) {
  // O CSS fica em _astro/, junto das fontes e imagens.
  return css.replace(/(?<![A-Za-z0-9_.:-])\/_astro\//g, './');
}

// 1. Remove o que foi publicado na execução anterior.
try {
  const antigos = JSON.parse(await readFile(MANIFESTO, 'utf8'));
  for (const arq of antigos) await rm(arq, { force: true });
  const pastas = [...new Set(antigos.map((a) => path.dirname(a)).filter((d) => d !== '.'))].sort((a, b) => b.length - a.length);
  for (const pasta of pastas) {
    const resto = await readdir(pasta).catch(() => null);
    if (resto && resto.length === 0) await rm(pasta, { recursive: true, force: true });
  }
} catch {
  // Primeira execução: nada a limpar.
}

// 2. Copia dist/ para a raiz, ajustando os caminhos.
const arquivos = await listar(DIST);
const publicados = [];
for (const arq of arquivos) {
  const origem = path.join(DIST, arq);
  const destino = arq;
  await mkdir(path.dirname(destino) || '.', { recursive: true });
  if (arq.endsWith('.html') && arq !== '404.html') {
    await writeFile(destino, relativizarHtml(await readFile(origem, 'utf8'), prefixoDe(arq)));
  } else if (arq.endsWith('.css')) {
    await writeFile(destino, relativizarCss(await readFile(origem, 'utf8')));
  } else {
    await copyFile(origem, destino);
  }
  publicados.push(arq);
}

// GitHub Pages ignora pastas iniciadas por "_" (como _astro) sem este arquivo.
await writeFile('.nojekyll', '');
publicados.push('.nojekyll');

await writeFile(MANIFESTO, JSON.stringify(publicados.sort(), null, 2) + '\n');
const info = await stat('index.html');
console.log(`publicar-raiz: ${publicados.length} arquivos na raiz (index.html: ${Math.round(info.size / 1024)} KB).`);
