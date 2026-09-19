// Falha o build se a galeria tiver alt vazio, alt duplicado ou arquivo inexistente.
import { readFile, access } from 'node:fs/promises';

const itens = JSON.parse(await readFile('src/content/galeria.json', 'utf8'));
const problemas = [];
const vistos = new Map();
for (const f of itens) {
  if (!f.autorizado) continue;
  const alt = (f.alt ?? '').trim();
  if (!alt) problemas.push(`alt vazio: ${f.arquivo}`);
  else if (vistos.has(alt.toLowerCase()))
    problemas.push(`alt duplicado: "${alt}" (${vistos.get(alt.toLowerCase())} e ${f.arquivo})`);
  else vistos.set(alt.toLowerCase(), f.arquivo);
  await access(`src/assets/galeria/${f.arquivo}`).catch(() =>
    problemas.push(`arquivo inexistente: src/assets/galeria/${f.arquivo}`),
  );
}
if (problemas.length) {
  console.error(`check:galeria — ${problemas.length} problema(s):\n${problemas.join('\n')}`);
  process.exit(1);
}
console.log(`check:galeria — ${vistos.size} fotos autorizadas, alt únicos e arquivos presentes.`);
