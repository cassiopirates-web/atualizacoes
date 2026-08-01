#!/usr/bin/env node
// scripts/build-site.mjs
// Gera o site estático em dist/ a partir de config/site.yml + data/weekly/*.json.
// Sem frameworks: lê os dados, chama site/template.mjs para gerar HTML,
// escreve os arquivos e copia site/styles.css + site/assets/*.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

import { AXES, renderWeekPage, renderArchiveIndexPage } from '../site/template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CONFIG_PATH = path.join(ROOT, 'config', 'site.yml');
const WEEKLY_DIR = path.join(ROOT, 'data', 'weekly');
const SITE_DIR = path.join(ROOT, 'site');
const DIST_DIR = path.join(ROOT, 'dist');

const WEEK_ID_RE = /^(\d{4})-W(\d{2})$/;

function log(msg) {
  console.log(`[build-site] ${msg}`);
}
function warn(msg) {
  console.warn(`[build-site] Aviso: ${msg}`);
}
function fail(msg) {
  console.error(`[build-site] Erro: ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. Config
// ---------------------------------------------------------------------------

function loadSite() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail(`config/site.yml não encontrado em ${CONFIG_PATH}`);
  }
  let site;
  try {
    site = parseYaml(fs.readFileSync(CONFIG_PATH, 'utf8')) || {};
  } catch (err) {
    fail(`falha ao ler config/site.yml — ${err.message}`);
  }
  const required = ['title', 'repo_url'];
  for (const key of required) {
    if (!site[key]) fail(`config/site.yml está sem o campo obrigatório "${key}"`);
  }
  return site;
}

// ---------------------------------------------------------------------------
// 2. Semanas (data/weekly/*.json)
// ---------------------------------------------------------------------------

function parseWeekId(weekId) {
  const m = WEEK_ID_RE.exec(weekId);
  if (!m) return null;
  return { year: Number(m[1]), week: Number(m[2]) };
}

function loadWeeks() {
  if (!fs.existsSync(WEEKLY_DIR)) {
    warn(`diretório data/weekly/ não encontrado — nenhuma semana será publicada.`);
    return [];
  }

  const files = fs
    .readdirSync(WEEKLY_DIR)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .sort();

  const validAxisIds = new Set(AXES.map((a) => a.id));
  const weeks = [];

  for (const file of files) {
    const fullPath = path.join(WEEKLY_DIR, file);
    let raw;
    try {
      raw = fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      warn(`ignorando data/weekly/${file} — não foi possível ler o arquivo (${err.message}).`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      warn(`ignorando data/weekly/${file} — JSON inválido (${err.message}).`);
      continue;
    }

    if (!data || typeof data !== 'object') {
      warn(`ignorando data/weekly/${file} — conteúdo não é um objeto JSON.`);
      continue;
    }
    if (typeof data.week !== 'string' || !parseWeekId(data.week)) {
      warn(`ignorando data/weekly/${file} — campo "week" ausente ou fora do formato AAAA-Wnn.`);
      continue;
    }
    if (!Array.isArray(data.items)) {
      warn(`ignorando data/weekly/${file} — campo "items" ausente ou não é uma lista.`);
      continue;
    }

    for (const item of data.items) {
      if (item && item.axis && !validAxisIds.has(item.axis)) {
        warn(`data/weekly/${file}: item "${item.title_original || '(sem título)'}" usa eixo desconhecido "${item.axis}" — não será exibido em nenhuma seção.`);
      }
    }

    weeks.push({ file, data });
  }

  weeks.sort((a, b) => {
    const pa = parseWeekId(a.data.week);
    const pb = parseWeekId(b.data.week);
    if (pa.year !== pb.year) return pb.year - pa.year;
    return pb.week - pa.week;
  });

  return weeks;
}

// ---------------------------------------------------------------------------
// 3. Escrita em dist/
// ---------------------------------------------------------------------------

function resetDist() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'arquivo'), { recursive: true });
}

function writeFile(relPath, content) {
  const full = path.join(DIST_DIR, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

function copyStaticAssets() {
  const cssSrc = path.join(SITE_DIR, 'styles.css');
  if (!fs.existsSync(cssSrc)) {
    fail(`site/styles.css não encontrado em ${cssSrc}`);
  }
  fs.copyFileSync(cssSrc, path.join(DIST_DIR, 'styles.css'));

  const assetsSrc = path.join(SITE_DIR, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, path.join(DIST_DIR, 'assets'), { recursive: true });
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  const site = loadSite();
  const weeks = loadWeeks();

  if (weeks.length === 0) {
    fail('nenhum arquivo válido em data/weekly/*.json — nada para publicar.');
  }

  resetDist();

  const latest = weeks[0];
  writeFile('index.html', renderWeekPage({ site, weekData: latest.data, prefix: '', isArchiveSection: false }));
  log(`dist/index.html — semana ${latest.data.week} (${latest.data.items.length} itens)`);

  for (const w of weeks) {
    const html = renderWeekPage({ site, weekData: w.data, prefix: '../', isArchiveSection: true });
    writeFile(`arquivo/${w.data.week}.html`, html);
    log(`dist/arquivo/${w.data.week}.html`);
  }

  const weeksMeta = weeks.map((w) => ({
    week: w.data.week,
    generated_at: w.data.generated_at,
    itemCount: Array.isArray(w.data.items) ? w.data.items.length : 0,
  }));
  writeFile('arquivo/index.html', renderArchiveIndexPage({ site, weeksMeta, prefix: '../' }));
  log(`dist/arquivo/index.html — ${weeksMeta.length} semana(s) listada(s)`);

  copyStaticAssets();
  log('site/styles.css e site/assets/* copiados para dist/');

  log(`build concluído: ${weeks.length} semana(s), site em ${DIST_DIR}`);
}

main();
