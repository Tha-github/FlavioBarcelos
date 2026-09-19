// Falha se houver texto corrompido em src/, docs/ e demais arquivos de texto do projeto:
// mojibake (ex.: "Ã§"), U+FFFD e "?" no lugar de letras acentuadas em JSON de conteúdo.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const RAIZES = ['src', 'public', 'docs', 'api', 'README.md'];
const EXTENSOES = new Set([
  '.astro',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.css',
  '.md',
  '.txt',
  '.svg',
]);
// docs/ajustes guarda os textos dos ajustes como recebidos; o A1 cita exemplos de mojibake de propósito.
const IGNORAR = new Set(['node_modules', 'dist', '.astro', 'ajustes']);

async function arquivos(alvo) {
  let info;
  try {
    info = await readdir(alvo, { withFileTypes: true });
  } catch {
    const existe = await stat(alvo).then(
      () => true,
      () => false,
    );
    return existe && EXTENSOES.has(path.extname(alvo)) ? [alvo] : [];
  }
  const listas = await Promise.all(
    info
      .filter((e) => !IGNORAR.has(e.name))
      .map((e) => {
        const caminho = path.join(alvo, e.name);
        if (e.isDirectory()) return arquivos(caminho);
        return EXTENSOES.has(path.extname(e.name)) ? [caminho] : [];
      }),
  );
  return listas.flat();
}

// Padrões montados com String.fromCharCode para este arquivo não conter os próprios caracteres corrompidos.
const c = (...codigos) => String.fromCharCode(...codigos);
const mojibake = new RegExp(
  `${c(0xc3)}[${c(0x80)}-${c(0xbf)}]|${c(0xc2)}[${c(0xa0)}-${c(0xbf)}]|${c(0xe2, 0x20ac)}[${c(0x80)}-${c(0xbf)}${c(0x2122, 0x153, 0x201c, 0x201d, 0x2dc)}]`,
);
const regras = [
  { nome: 'caractere de substituição (U+FFFD)', teste: new RegExp(c(0xfffd)) },
  { nome: 'mojibake UTF-8 lido como Latin-1', teste: mojibake },
  // Em JSON de conteúdo, "?" colado em letras costuma ser acento perdido (ex.: "servi?o").
  {
    nome: '"?" no lugar de letra acentuada',
    teste: new RegExp(`${c(92)}p{L}${c(92)}?+${c(92)}p{L}`, 'u'),
    so: '.json',
  },
];

const problemas = [];
for (const raiz of RAIZES) {
  for (const arquivo of await arquivos(raiz)) {
    const linhas = (await readFile(arquivo, 'utf8')).split(/\r?\n/);
    linhas.forEach((linha, i) => {
      for (const r of regras) {
        if (r.so && path.extname(arquivo) !== r.so) continue;
        if (r.teste.test(linha)) {
          problemas.push(`${arquivo}:${i + 1}  ${r.nome}: ${linha.trim().slice(0, 90)}`);
        }
      }
    });
  }
}

if (problemas.length) {
  console.error(`check:encoding - ${problemas.length} problema(s):\n${problemas.join('\n')}`);
  process.exit(1);
}
console.log('check:encoding - nenhum texto corrompido encontrado.');
