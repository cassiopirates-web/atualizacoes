/*
  build-icons.mjs — gera os ícones da extensão e o logo da loja.

  Zero dependências: desenha num buffer RGBA supersampled (antialiasing por
  média no downsample) e escreve o PNG na mão com zlib do próprio Node.

  Marca: as cores vêm dos tokens de site/styles.css — fundo azul --color-accent
  do tema claro, marcas em --color-bg ("papel") e o accent claro do tema escuro
  na última linha. O desenho é uma manchete sobre duas linhas de texto: lê como
  "matéria" tanto em 128px quanto em 16px.

  Uso: node scripts/build-icons.mjs
*/

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const AZUL = [0x23, 0x48, 0x76]; // --color-accent (tema claro)
const PAPEL = [0xf5, 0xf3, 0xee]; // --color-bg (tema claro)
const ACCENT = [0x9f, 0xc1, 0xf2]; // --color-accent (tema escuro)

/* Mistura duas cores opacas: evita alpha parcial no desenho e mantém o PNG
   inteiramente opaco fora dos cantos arredondados. */
const mix = (a, b, t) => a.map((v, i) => Math.round(v * t + b[i] * (1 - t)));

/* Layouts em coordenadas normalizadas (0..1). O compacto engrossa as barras e
   reduz as margens porque em 16px o layout normal vira um borrão cinza. */
const LAYOUT_NORMAL = {
  radius: 0.2235,
  bars: [
    { x: 0.203, y: 0.234, w: 0.594, h: 0.117, color: PAPEL },
    { x: 0.203, y: 0.43, w: 0.594, h: 0.078, color: mix(PAPEL, AZUL, 0.78) },
    { x: 0.203, y: 0.57, w: 0.414, h: 0.078, color: ACCENT },
  ],
};

const LAYOUT_COMPACTO = {
  radius: 0.2,
  bars: [
    { x: 0.17, y: 0.22, w: 0.66, h: 0.16, color: PAPEL },
    { x: 0.17, y: 0.46, w: 0.66, h: 0.12, color: mix(PAPEL, AZUL, 0.8) },
    { x: 0.17, y: 0.66, w: 0.43, h: 0.12, color: ACCENT },
  ],
};

const SS = 4; // fator de supersampling

/* Cobertura binária por amostra; o antialiasing sai da média no downsample. */
function fillRoundRect(buf, side, x0, y0, w, h, r, color) {
  const x1 = x0 + w;
  const y1 = y0 + h;
  const rad = Math.min(r, w / 2, h / 2);
  const px0 = Math.max(0, Math.floor(x0));
  const py0 = Math.max(0, Math.floor(y0));
  const px1 = Math.min(side, Math.ceil(x1));
  const py1 = Math.min(side, Math.ceil(y1));

  for (let py = py0; py < py1; py++) {
    const cy = py + 0.5;
    for (let px = px0; px < px1; px++) {
      const cx = px + 0.5;

      // Distância até o retângulo interno (o encolhido pelo raio): dentro do
      // raio => dentro do canto arredondado.
      const dx = Math.max(x0 + rad - cx, 0, cx - (x1 - rad));
      const dy = Math.max(y0 + rad - cy, 0, cy - (y1 - rad));
      if (dx * dx + dy * dy > rad * rad) continue;
      if (cx < x0 || cx > x1 || cy < y0 || cy > y1) continue;

      const i = (py * side + px) * 4;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
      buf[i + 3] = 255;
    }
  }
}

function render(size) {
  const layout = size <= 32 ? LAYOUT_COMPACTO : LAYOUT_NORMAL;
  const side = size * SS;
  const hi = new Uint8Array(side * side * 4); // transparente

  fillRoundRect(hi, side, 0, 0, side, side, layout.radius * side, AZUL);
  for (const b of layout.bars) {
    fillRoundRect(
      hi,
      side,
      b.x * side,
      b.y * side,
      b.w * side,
      b.h * side,
      (b.h * side) / 2, // pill
      b.color,
    );
  }

  // Downsample por média — inclusive do alpha, que arredonda os cantos.
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * side + (x * SS + sx)) * 4;
          const av = hi[i + 3] / 255;
          r += hi[i] * av;
          g += hi[i + 1] * av;
          b += hi[i + 2] * av;
          a += hi[i + 3];
        }
      }
      const n = SS * SS;
      const alpha = a / n;
      const o = (y * size + x) * 4;
      // Desfaz a pré-multiplicação para gravar RGBA não-premultiplicado.
      const k = alpha > 0 ? 255 / alpha : 0;
      out[o] = Math.min(255, Math.round((r / n) * k));
      out[o + 1] = Math.min(255, Math.round((g / n) * k));
      out[o + 2] = Math.min(255, Math.round((b / n) * k));
      out[o + 3] = Math.round(alpha);
    }
  }
  return out;
}

/* --- codificação PNG (RGBA de 8 bits, sem filtro por scanline) --- */

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

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function toPng(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profundidade de bits
  ihdr[9] = 6; // RGBA
  // 10..12 = compressão/filtro/entrelaçamento, todos 0

  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filtro None
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const alvos = [
  ...[16, 32, 48, 128].map((s) => [s, join(ROOT, 'extension', 'icons', `icon-${s}.png`)]),
  // Logo obrigatório da listagem no Partner Center.
  [300, join(ROOT, 'store', 'logo-300.png')],
];

for (const [size, destino] of alvos) {
  mkdirSync(dirname(destino), { recursive: true });
  const png = toPng(render(size), size);
  writeFileSync(destino, png);
  console.log(`${destino.replace(ROOT + '\\', '').replace(ROOT + '/', '')} — ${size}x${size}, ${png.length} B`);
}
