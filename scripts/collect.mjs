#!/usr/bin/env node
// Camada determinística de coleta do feed curado.
// Uso: node scripts/collect.mjs [--week 2026-W00] [--sources config/sources.sample.yml]

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import YAML from 'yaml';
import Parser from 'rss-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
const FETCH_TIMEOUT_MS = 15_000;
const CONCURRENCY = 5;
const RETRIES_PER_SOURCE = 1; // 1 retry = até 2 tentativas
const TRACKING_PARAM_EXACT = new Set(['fbclid', 'gclid', 'ref', 'source']);
const PT_FUNCTION_WORDS = [
  ' de ', ' da ', ' do ', ' das ', ' dos ', ' que ', ' não ', ' para ', ' com ',
  ' uma ', ' um ', ' são ', ' está ', ' isso ', ' como ', ' mais ', ' também ',
  ' pelo ', ' pela ', ' seu ', ' sua ', ' foi ', ' ser ', ' há ', ' às ', ' ao ',
];

const rssParser = new Parser();

// ---------- CLI & config ----------

function parseArgs(argv) {
  const args = { week: null, sources: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--week') args.week = argv[++i];
    else if (argv[i] === '--sources') args.sources = argv[++i];
  }
  return args;
}

function currentIsoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // segunda=0 ... domingo=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // quinta-feira da semana corrente
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d - firstThursday) / (7 * 24 * 3600 * 1000));
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

async function loadYaml(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return YAML.parse(raw);
}

async function resolveSourcesPath(argSources) {
  if (argSources) return path.resolve(process.cwd(), argSources);
  const prod = path.join(ROOT, 'config', 'sources.yml');
  if (existsSync(prod)) return prod;
  console.warn('[collect] config/sources.yml não encontrado — usando config/sources.sample.yml');
  return path.join(ROOT, 'config', 'sources.sample.yml');
}

// ---------- fetch ----------

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const current = cursor++;
      results[current] = await worker(items[current]);
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, next);
  await Promise.all(runners);
  return results;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/rss+xml, application/atom+xml, application/xml, application/json;q=0.9, */*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTextWithRetry(url) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRIES_PER_SOURCE; attempt++) {
    try {
      return await fetchText(url);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

// ---------- parsing ----------

function extractLink(item) {
  if (typeof item.link === 'string' && item.link) return item.link.trim();
  if (item.link && typeof item.link === 'object' && item.link.href) return String(item.link.href).trim();
  if (Array.isArray(item.links) && item.links.length) {
    const alt = item.links.find((l) => !l.rel || l.rel === 'alternate') || item.links[0];
    if (alt?.href) return String(alt.href).trim();
  }
  if (typeof item.guid === 'string' && item.guid.startsWith('http')) return item.guid.trim();
  return '';
}

function normalizeRssItem(item) {
  return {
    title: (item.title || '').trim(),
    link: extractLink(item),
    publishedRaw: item.isoDate || item.pubDate || item.published || '',
    excerptRaw: item.contentSnippet || item.summary || item.content || item.description || '',
  };
}

function parseJsonFeed(text) {
  const json = JSON.parse(text);
  const items = Array.isArray(json.items) ? json.items : [];
  return items.map((item) => ({
    title: (item.title || '').trim(),
    link: (item.url || item.external_url || '').toString().trim(),
    publishedRaw: item.date_published || item.date_modified || '',
    excerptRaw: item.summary || item.content_text || item.content_html || '',
  }));
}

async function fetchSourceItems(source) {
  const text = await fetchTextWithRetry(source.url);
  if (source.type === 'jsonfeed') return parseJsonFeed(text);
  // rss, atom, arxiv (Atom) são todos lidos como XML via rss-parser
  const feed = await rssParser.parseString(text);
  return (feed.items || []).map(normalizeRssItem);
}

// ---------- normalização de item ----------

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(raw, maxLen = 400) {
  const text = stripHtml(raw || '');
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

function normalizeDate(raw) {
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function isWithinWindow(publishedAtIso, windowDays, now) {
  const publishedMs = Date.parse(publishedAtIso);
  const cutoff = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  return publishedMs >= cutoff;
}

function canonicalizeUrl(rawUrl) {
  const url = new URL(rawUrl.trim());
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    const lower = key.toLowerCase();
    if (lower.startsWith('utm_') || TRACKING_PARAM_EXACT.has(lower)) url.searchParams.delete(key);
  }
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
  }
  return url.toString();
}

function shortHash(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(0, 8);
}

function detectLang(text) {
  const padded = ` ${text.toLowerCase()} `;
  const hits = PT_FUNCTION_WORDS.reduce((count, w) => count + (padded.includes(w) ? 1 : 0), 0);
  return hits >= 2 ? 'pt' : 'en';
}

function matchesExcludeKeyword(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function dedupeById(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

// ---------- caps & quotas por eixo ----------

function applyAxisQuotas(items, axisQuotas, maxCandidates) {
  const byAxis = new Map();
  const unknownAxisItems = [];
  for (const item of items) {
    if (Object.prototype.hasOwnProperty.call(axisQuotas, item.axis_hint)) {
      if (!byAxis.has(item.axis_hint)) byAxis.set(item.axis_hint, []);
      byAxis.get(item.axis_hint).push(item);
    } else {
      unknownAxisItems.push(item);
    }
  }
  const byRecencyDesc = (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at);
  for (const list of byAxis.values()) list.sort(byRecencyDesc);
  unknownAxisItems.sort(byRecencyDesc);

  const axes = Object.keys(axisQuotas);
  const available = Object.fromEntries(axes.map((a) => [a, (byAxis.get(a) || []).length]));
  const quotas = { ...axisQuotas };

  // redistribuição proporcional (water-filling) da sobra de eixos que não preenchem a quota
  for (let iteration = 0; iteration < axes.length + 2; iteration++) {
    let leftover = 0;
    const surplusAxes = [];
    for (const axis of axes) {
      if (quotas[axis] > available[axis]) {
        leftover += quotas[axis] - available[axis];
        quotas[axis] = available[axis];
      } else if (quotas[axis] < available[axis]) {
        surplusAxes.push(axis);
      }
    }
    if (leftover <= 0 || surplusAxes.length === 0) break;
    const weightSum = surplusAxes.reduce((s, a) => s + axisQuotas[a], 0);
    const additions = {};
    let distributed = 0;
    for (const axis of surplusAxes) {
      const share = weightSum > 0 ? (axisQuotas[axis] / weightSum) * leftover : leftover / surplusAxes.length;
      additions[axis] = Math.floor(share);
      distributed += additions[axis];
    }
    let remainder = leftover - distributed;
    let idx = 0;
    while (remainder > 0 && surplusAxes.length > 0) {
      additions[surplusAxes[idx % surplusAxes.length]] += 1;
      remainder--;
      idx++;
    }
    let changed = false;
    for (const axis of surplusAxes) {
      const next = Math.min(quotas[axis] + (additions[axis] || 0), available[axis]);
      if (next !== quotas[axis]) changed = true;
      quotas[axis] = next;
    }
    if (!changed) break;
  }

  const selected = [];
  for (const axis of axes) selected.push(...(byAxis.get(axis) || []).slice(0, quotas[axis]));

  let remainingCapacity = maxCandidates - selected.length;
  if (remainingCapacity > 0 && unknownAxisItems.length > 0) {
    selected.push(...unknownAxisItems.slice(0, remainingCapacity));
  }

  if (selected.length > maxCandidates) {
    selected.sort(byRecencyDesc);
    return selected.slice(0, maxCandidates);
  }
  return selected;
}

// ---------- seen-index (dedupe permanente) ----------

async function loadSeenIndex(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    console.warn(`[collect] seen-index.json inválido, recriando: ${err.message}`);
    return {};
  }
}

async function saveSeenIndex(filePath, index) {
  const sorted = Object.fromEntries(Object.keys(index).sort().map((k) => [k, index[k]]));
  await writeFile(filePath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
}

// ---------- pipeline por fonte ----------

async function processSource(source, filters, week, seenIndex, now) {
  let rawItems;
  try {
    rawItems = await fetchSourceItems(source);
  } catch (err) {
    return { source, ok: false, error: err.message || String(err) };
  }

  const kept = [];
  for (const raw of rawItems) {
    if (!raw.title || !raw.link) continue;

    const publishedAtIso = normalizeDate(raw.publishedRaw);
    if (!publishedAtIso || !isWithinWindow(publishedAtIso, filters.window_days, now)) continue;

    let canonicalUrl;
    try {
      canonicalUrl = canonicalizeUrl(raw.link);
    } catch {
      continue;
    }

    const id = shortHash(canonicalUrl);
    const seenWeek = seenIndex[id];
    if (seenWeek && seenWeek !== week) continue; // já visto em outra semana

    const excerpt = buildExcerpt(raw.excerptRaw);
    if (matchesExcludeKeyword(`${raw.title} ${excerpt}`, filters.exclude_keywords || [])) continue;

    kept.push({
      id,
      title: raw.title,
      url: canonicalUrl,
      source_id: source.id,
      source_tier: source.tier,
      axis_hint: source.axis,
      published_at: publishedAtIso,
      excerpt,
      lang: detectLang(`${raw.title} ${excerpt}`),
    });
  }

  const deduped = dedupeById(kept).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  const cap = source.type === 'arxiv' ? filters.arxiv_cap : filters.per_source_cap;
  const capped = deduped.slice(0, cap);

  return { source, ok: true, fetched: rawItems.length, kept: capped };
}

// ---------- console ----------

function printSummary(results, week, sourcesPath, totalEmitted, outPath) {
  console.log(`\n[collect] semana=${week} fontes=${path.relative(ROOT, sourcesPath)}`);
  for (const r of results) {
    if (r.ok) {
      console.log(`  ok     ${r.source.id.padEnd(20)} fetched=${r.fetched} kept=${r.kept.length}`);
    } else {
      console.log(`  falha  ${r.source.id.padEnd(20)} erro=${r.error}`);
    }
  }
  console.log(`[collect] total de candidatos emitidos: ${totalEmitted}`);
  console.log(`[collect] saída: ${path.relative(ROOT, outPath)}`);
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const week = args.week || currentIsoWeek();
  if (!/^\d{4}-W\d{2}$/.test(week)) {
    console.error(`[collect] semana inválida: "${week}" (esperado YYYY-Www)`);
    process.exitCode = 1;
    return;
  }

  const sourcesPath = await resolveSourcesPath(args.sources);
  const filtersPath = path.join(ROOT, 'config', 'filters.yml');
  const [sourcesConfig, filters] = await Promise.all([loadYaml(sourcesPath), loadYaml(filtersPath)]);
  const sources = sourcesConfig.sources || [];

  const now = new Date();
  const seenIndexPath = path.join(ROOT, 'data', 'candidates', 'seen-index.json');
  const seenIndex = await loadSeenIndex(seenIndexPath);

  const results = await runWithConcurrency(sources, CONCURRENCY, (source) =>
    processSource(source, filters, week, seenIndex, now)
  );

  const failedSources = results.filter((r) => !r.ok).map((r) => ({ id: r.source.id, error: r.error }));
  const allKept = results.filter((r) => r.ok).flatMap((r) => r.kept);
  const finalCandidates = applyAxisQuotas(allKept, filters.axes || {}, filters.max_candidates)
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));

  for (const c of finalCandidates) seenIndex[c.id] = week;
  await saveSeenIndex(seenIndexPath, seenIndex);

  const outDir = path.join(ROOT, 'data', 'candidates');
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${week}.json`);
  const output = {
    week,
    generated_at: now.toISOString(),
    fetch_report: { failed_sources: failedSources },
    candidates: finalCandidates,
  };
  await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  printSummary(results, week, sourcesPath, finalCandidates.length, outPath);
}

main().catch((err) => {
  console.error('[collect] erro fatal:', err);
  process.exitCode = 1;
});
