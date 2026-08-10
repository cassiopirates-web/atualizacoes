/*
  package-extension.mjs — empacota extension/ no .zip que sobe para o
  Partner Center (Microsoft Edge Add-ons).

  Escreve o ZIP na mão (deflate via zlib do Node) em vez de depender do
  Compress-Archive do PowerShell: o mesmo comando roda no Windows e no CI.
  Timestamps fixos deixam o pacote determinístico — dois builds do mesmo
  conteúdo geram bytes idênticos.

  Uso: node scripts/package-extension.mjs
*/

import { deflateRawSync } from 'node:zlib';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = join(ROOT, 'extension');
const DESTINO_DIR = join(ROOT, 'store');

// 2026-01-01 00:00:00 em campos DOS — fixo, para o zip ser reprodutível.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function listar(dir) {
  const saida = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name.startsWith('.')) continue; // .gitkeep e afins não vão no pacote
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) saida.push(...listar(caminho));
    else if (statSync(caminho).size >= 0) saida.push(caminho);
  }
  return saida;
}

const arquivos = listar(ORIGEM)
  // Nomes internos do zip usam barra normal, sempre — inclusive no Windows.
  .map((caminho) => ({ caminho, nome: relative(ORIGEM, caminho).split('\\').join('/') }))
  .sort((a, b) => (a.nome < b.nome ? -1 : 1));

if (!arquivos.some((a) => a.nome === 'manifest.json')) {
  console.error('extension/manifest.json não encontrado — nada a empacotar.');
  process.exit(1);
}

const locais = [];
const central = [];
let offset = 0;

for (const { caminho, nome } of arquivos) {
  const conteudo = readFileSync(caminho);
  const comprimido = deflateRawSync(conteudo, { level: 9 });
  const crc = crc32(conteudo);
  const nomeBuf = Buffer.from(nome, 'utf8');

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4); // versão necessária
  local.writeUInt16LE(0, 6); // flags
  local.writeUInt16LE(8, 8); // deflate
  local.writeUInt16LE(DOS_TIME, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(comprimido.length, 18);
  local.writeUInt32LE(conteudo.length, 22);
  local.writeUInt16LE(nomeBuf.length, 26);
  local.writeUInt16LE(0, 28); // extra
  locais.push(local, nomeBuf, comprimido);

  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0);
  cd.writeUInt16LE(20, 4); // versão de origem
  cd.writeUInt16LE(20, 6); // versão necessária
  cd.writeUInt16LE(0, 8);
  cd.writeUInt16LE(8, 10);
  cd.writeUInt16LE(DOS_TIME, 12);
  cd.writeUInt16LE(DOS_DATE, 14);
  cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(comprimido.length, 20);
  cd.writeUInt32LE(conteudo.length, 24);
  cd.writeUInt16LE(nomeBuf.length, 28);
  cd.writeUInt16LE(0, 30); // extra
  cd.writeUInt16LE(0, 32); // comentário
  cd.writeUInt16LE(0, 34); // disco
  cd.writeUInt16LE(0, 36); // atributos internos
  cd.writeUInt32LE(0, 38); // atributos externos
  cd.writeUInt32LE(offset, 42);
  central.push(cd, nomeBuf);

  offset += local.length + nomeBuf.length + comprimido.length;
}

const corpo = Buffer.concat(locais);
const diretorio = Buffer.concat(central);

const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4); // disco
eocd.writeUInt16LE(0, 6); // disco do diretório central
eocd.writeUInt16LE(arquivos.length, 8);
eocd.writeUInt16LE(arquivos.length, 10);
eocd.writeUInt32LE(diretorio.length, 12);
eocd.writeUInt32LE(corpo.length, 16);
eocd.writeUInt16LE(0, 20); // comentário

const { version } = JSON.parse(readFileSync(join(ORIGEM, 'manifest.json'), 'utf8'));
const destino = join(DESTINO_DIR, `atualizacoes-nova-aba-${version}.zip`);

mkdirSync(DESTINO_DIR, { recursive: true });
writeFileSync(destino, Buffer.concat([corpo, diretorio, eocd]));

console.log(`${arquivos.map((a) => a.nome).join(', ')}`);
console.log(`\n-> store/atualizacoes-nova-aba-${version}.zip (${statSync(destino).size} B)`);
