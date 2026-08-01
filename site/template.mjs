// site/template.mjs
// Camada de apresentação do gerador estático. Produz strings HTML a partir
// dos dados de uma semana (data/weekly/*.json) e da config (config/site.yml).
// Sem dependências externas — apenas string templates + escaping manual.

// ---------------------------------------------------------------------------
// Taxonomia fixa (ordem importa: define a ordem das seções por eixo)
// ---------------------------------------------------------------------------

export const AXES = [
  { id: 'ia-aplicada', label: 'IA aplicada, futuro com a humanidade & ROI real' },
  { id: 'produto-descoberta', label: 'Produto & Descoberta' },
  { id: 'design-lideranca', label: 'Design & Liderança' },
  { id: 'acessibilidade', label: 'Acessibilidade' },
  { id: 'branding-tendencias', label: 'Branding & Tendências' },
  { id: 'macro-capital', label: 'Macro & Capital' },
];

export const TIERS = {
  referencia: { label: 'Referência central', className: 'tier-referencia' },
  citada: { label: 'Amplamente citada', className: 'tier-citada' },
  solida: { label: 'Contribuição sólida', className: 'tier-solida' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function escapeHtml(value) {
  const str = value === undefined || value === null ? '' : String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  const base = String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return base.slice(0, 64) || 'item';
}

function formatDateTimePtBR(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return String(isoString);
  try {
    const datePart = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d);
    const timePart = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    return `${datePart}, ${timePart}`;
  } catch {
    return String(isoString);
  }
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function buildFeedbackUrl(repoUrl, template, title, url) {
  const prefixLabel = template === 'ouro.yml' ? '[ouro] ' : '[ruído] ';
  const titleParam = encodeURIComponent(prefixLabel + (title || ''));
  const urlParam = encodeURIComponent(url || '');
  return `${repoUrl}/issues/new?template=${template}&title=${titleParam}&url=${urlParam}`;
}

// ---------------------------------------------------------------------------
// Scripts inline (tema). Curtos de propósito — únicos usos de JS do site.
// ---------------------------------------------------------------------------

// Roda no <head>, antes da primeira pintura: aplica o tema salvo (se houver
// override explícito do usuário) para evitar flash de tema errado (FOUC).
// Sem localStorage disponível, ou sem preferência salva, o CSS cuida do
// tema via prefers-color-scheme — nenhuma leitura de conteúdo depende disto.
const FOUC_SCRIPT = `<script>(function(){try{var t=localStorage.getItem('atualizacoes-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();</script>`;

// Roda no fim do body: liga o botão de alternância de tema. É o único
// comportamento interativo do site — a leitura funciona 100% sem isto.
//
// Aprimoramento progressivo: o <li> do botão sai do HTML com [hidden] e só
// é revelado aqui. Sem JS não existe um controle que não faz nada, e o
// aria-pressed nunca é publicado com valor errado — ele é sincronizado com
// o tema real ANTES do botão aparecer. O listener de matchMedia mantém o
// estado correto se o usuário trocar o tema do sistema sem override manual.
const TOGGLE_SCRIPT = `<script>(function(){
  var btn = document.getElementById('theme-toggle');
  var item = document.getElementById('theme-toggle-item');
  if (!btn) return;
  var KEY = 'atualizacoes-theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function current(){
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function sync(){
    btn.setAttribute('aria-pressed', String(current() === 'dark'));
  }
  sync();
  if (item) item.hidden = false;
  btn.addEventListener('click', function(){
    var next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    sync();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', sync);
})();</script>`;

// ---------------------------------------------------------------------------
// Blocos de header / footer
// ---------------------------------------------------------------------------

/**
 * @param {boolean}      isHome         página é dist/index.html (link do título
 *                                      aponta para ela mesma → aria-current).
 * @param {string|null}  archiveCurrent 'page' no índice do arquivo; 'true' nas
 *                                      páginas de semana dentro do arquivo
 *                                      (são a seção atual, não a própria URL).
 */
function renderHeader({ site, week, generatedAt, prefix, isHome, archiveCurrent }) {
  const homeHref = `${prefix}index.html`;
  const arquivoHref = `${prefix}arquivo/`;
  const actionsHref = `${site.repo_url}/actions/workflows/weekly-curation.yml`;

  const dateLabel = formatDateTimePtBR(generatedAt);
  const dateValid = generatedAt && !Number.isNaN(new Date(generatedAt).getTime());
  const dateHtml = dateValid
    ? `<time datetime="${escapeHtml(generatedAt)}">${escapeHtml(dateLabel)}</time>`
    : escapeHtml(dateLabel);
  const weekMeta = week
    ? `<p class="week-meta">Semana <strong>${escapeHtml(week)}</strong> · atualizado em ${dateHtml}</p>`
    : '';

  const homeCurrent = isHome ? ' aria-current="page"' : '';
  const archiveAttr = archiveCurrent ? ` aria-current="${escapeHtml(archiveCurrent)}"` : '';

  // `role="list"` é redundante em HTML puro, mas `list-style: none` faz o
  // Safari/VoiceOver descartar a semântica de lista — o role a restaura.
  return `<header class="site-header">
    <div class="header-row">
      <h1 class="site-title"><a href="${escapeHtml(homeHref)}"${homeCurrent}>${escapeHtml(site.title)}</a></h1>
    </div>
    ${weekMeta}
    <nav aria-label="Principal" class="site-nav">
      <ul role="list">
        <li><a href="${escapeHtml(arquivoHref)}"${archiveAttr}>Arquivo</a></li>
        <li><a href="${escapeHtml(actionsHref)}">Atualizar agora <span class="visually-hidden">(executa a curadoria no GitHub Actions)</span></a></li>
        <li id="theme-toggle-item" hidden>
          <button type="button" id="theme-toggle" class="theme-toggle" aria-pressed="false">
            <span aria-hidden="true" class="theme-toggle__icon">◐</span>
            <span class="theme-toggle__label">Modo escuro</span>
          </button>
        </li>
      </ul>
    </nav>
  </header>`;
}

function renderFooter({ site, prefix }) {
  const arquivoHref = `${prefix}arquivo/`;
  return `<footer class="site-footer">
    <p>Curadoria automatizada semanal · <a href="${escapeHtml(site.repo_url)}">Repositório no GitHub</a></p>
    <p><a href="${escapeHtml(arquivoHref)}">Arquivo de semanas</a></p>
  </footer>`;
}

// ---------------------------------------------------------------------------
// Seções de conteúdo
// ---------------------------------------------------------------------------

function renderConvergencesSection(text) {
  const paragraphs = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('\n      ');
  return `<section aria-labelledby="h-convergencias">
      <p class="eyebrow">Panorama</p>
      <h2 id="h-convergencias">Convergências da semana</h2>
      ${paragraphs || '<p>Nenhuma convergência registrada nesta semana.</p>'}
    </section>`;
}

function renderTensionsSection(tensions) {
  if (!Array.isArray(tensions) || tensions.length === 0) return '';
  const blocks = tensions
    .map((t, i) => {
      const titleId = `h-tensao-${i}`;
      const refs = Array.isArray(t.refs) ? t.refs.filter(Boolean) : [];
      // A lista ganha nome próprio para que "nngroup.com" não fique órfã de
      // contexto na navegação por links/listas do leitor de tela.
      const refsLabel = `Referências sobre: ${t.title_ptbr || 'esta tensão'}`;
      const refsList = refs.length
        ? `<ul class="tension-refs" role="list" aria-label="${escapeHtml(refsLabel)}">
          ${refs
            .map(
              (r) =>
                `<li><a href="${escapeHtml(r)}">${escapeHtml(hostnameOf(r))}</a></li>`
            )
            .join('\n          ')}
        </ul>`
        : '';
      return `<div class="tension">
        <h3 id="${titleId}">${escapeHtml(t.title_ptbr || '')}</h3>
        <div class="tension-grid">
          <div class="tension-side">
            <p class="side-label">Um lado</p>
            <p>${escapeHtml(t.side_a || '')}</p>
          </div>
          <div class="tension-divider" aria-hidden="true"></div>
          <div class="tension-side">
            <p class="side-label">Outro lado</p>
            <p>${escapeHtml(t.side_b || '')}</p>
          </div>
        </div>
        ${refsList}
      </div>`;
    })
    .join('\n      ');
  return `<section aria-labelledby="h-tensoes">
      <p class="eyebrow">Debate</p>
      <h2 id="h-tensoes">Tensões vivas</h2>
      ${blocks}
    </section>`;
}

function renderItemArticle(item, idSeed, repoUrl) {
  const title = item.title_original || '(sem título)';
  const url = item.url || '#';
  const source = item.source || '';
  const tierInfo = TIERS[item.tier] || {
    label: item.tier ? String(item.tier) : 'Sem classificação',
    className: 'tier-desconhecida',
  };
  const articleId = `item-${slugify(`${idSeed}-${title}`)}`;
  const headingId = `${articleId}-title`;
  const ruidoUrl = buildFeedbackUrl(repoUrl, 'ruido.yml', title, url);
  const ouroUrl = buildFeedbackUrl(repoUrl, 'ouro.yml', title, url);
  const latamBlock = item.latam_note
    ? `<p class="latam-note"><span class="latam-marker" aria-hidden="true">🌎</span><strong>LATAM —</strong> ${escapeHtml(item.latam_note)}</p>`
    : '';
  // Os metadados são rótulos visuais (fonte + selo de relevância). Sem o
  // prefixo oculto, o leitor de tela lê "Rich Sutton Referência central"
  // sem dizer o que cada valor significa.
  const sourceSpan = source
    ? `<span class="item-source"><span class="visually-hidden">Fonte: </span>${escapeHtml(source)}</span>`
    : '';
  return `<article class="item" aria-labelledby="${headingId}">
          <h3 id="${headingId}"><a href="${escapeHtml(url)}" lang="en">${escapeHtml(title)}</a></h3>
          <p class="item-meta">
            ${sourceSpan}
            <span class="tier-badge ${tierInfo.className}"><span class="visually-hidden">Relevância: </span>${escapeHtml(tierInfo.label)}</span>
          </p>
          <p class="item-synthesis">${escapeHtml(item.synthesis_ptbr || '')}</p>
          ${latamBlock}
          <p class="item-feedback">
            <a href="${escapeHtml(ruidoUrl)}" aria-label="${escapeHtml(`Marcar "${title}" como ruído (abre uma issue no GitHub)`)}">ruído</a>
            <span class="feedback-sep" aria-hidden="true">·</span>
            <a href="${escapeHtml(ouroUrl)}" aria-label="${escapeHtml(`Marcar "${title}" como ouro (abre uma issue no GitHub)`)}">ouro</a>
          </p>
        </article>`;
}

function renderAxisSections(items, repoUrl) {
  return AXES.map((axis) => {
    const axisItems = (items || []).filter((it) => it && it.axis === axis.id);
    if (axisItems.length === 0) return '';
    const headingId = `h-eixo-${axis.id}`;
    const articles = axisItems
      .map((item, i) => renderItemArticle(item, `${axis.id}-${i}`, repoUrl))
      .join('\n        ');
    return `<section aria-labelledby="${headingId}">
      <p class="eyebrow">Eixo</p>
      <h2 id="${headingId}">${escapeHtml(axis.label)}</h2>
      <div class="items">
        ${articles}
      </div>
    </section>`;
  })
    .filter(Boolean)
    .join('\n    ');
}

function renderFailedSourcesAside(failedSources) {
  if (!Array.isArray(failedSources) || failedSources.length === 0) return '';
  const li = failedSources
    .map((f) => {
      if (typeof f === 'string') return `<li>${escapeHtml(f)}</li>`;
      const name = (f && f.id) || 'Fonte desconhecida';
      const reason = f && f.error ? ` — ${f.error}` : '';
      return `<li>${escapeHtml(name)}${escapeHtml(reason)}</li>`;
    })
    .join('\n        ');
  return `<aside aria-labelledby="h-falhas">
      <p class="eyebrow">Aviso</p>
      <h2 id="h-falhas">Fontes que falharam na coleta</h2>
      <ul role="list">
        ${li}
      </ul>
    </aside>`;
}

// ---------------------------------------------------------------------------
// Documento completo
// ---------------------------------------------------------------------------

function renderDocument({ site, prefix, titleSuffix, description, headerHtml, mainHtml, footerHtml }) {
  const cssHref = `${prefix}styles.css`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(site.title)}${titleSuffix ? ' — ' + escapeHtml(titleSuffix) : ''}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="${escapeHtml(cssHref)}">
${FOUC_SCRIPT}
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${headerHtml}
<!-- tabindex="-1" é o que faz o skip link realmente mover o foco: sem ele,
     navegadores como o Safari apenas rolam a página e o próximo Tab volta
     para o topo. Não entra na ordem de tabulação. -->
<main id="conteudo" tabindex="-1">
    ${mainHtml}
</main>
${footerHtml}
${TOGGLE_SCRIPT}
</body>
</html>
`;
}

/**
 * Renderiza a página completa de uma semana (usada tanto para dist/index.html
 * quanto para dist/arquivo/<week>.html — mesmo layout, muda só o `prefix`).
 */
export function renderWeekPage({ site, weekData, prefix = '', isArchiveSection = false }) {
  const items = Array.isArray(weekData.items) ? weekData.items : [];
  const headerHtml = renderHeader({
    site,
    week: weekData.week,
    generatedAt: weekData.generated_at,
    prefix,
    isHome: !isArchiveSection,
    archiveCurrent: isArchiveSection ? 'true' : null,
  });
  const footerHtml = renderFooter({ site, prefix });
  const mainHtml = [
    renderConvergencesSection(weekData.convergences_ptbr),
    renderTensionsSection(weekData.tensions),
    renderAxisSections(items, site.repo_url),
    renderFailedSourcesAside(weekData.fetch_report && weekData.fetch_report.failed_sources),
  ]
    .filter(Boolean)
    .join('\n    ');

  // A mesma semana é publicada em dist/index.html e em dist/arquivo/<week>.html.
  // Títulos distintos evitam duas entradas idênticas no histórico/abas e
  // dizem ao leitor de tela em qual das duas ele está (2.4.2).
  const weekLabel = `Semana ${weekData.week}`;
  return renderDocument({
    site,
    prefix,
    titleSuffix: isArchiveSection ? `${weekLabel} (arquivo)` : weekLabel,
    description: isArchiveSection
      ? `Edição arquivada do feed semanal de conhecimento curado — semana ${weekData.week}.`
      : `Feed semanal de conhecimento curado — semana ${weekData.week}.`,
    headerHtml,
    mainHtml,
    footerHtml,
  });
}

/**
 * Renderiza dist/arquivo/index.html — lista de todas as semanas publicadas.
 */
export function renderArchiveIndexPage({ site, weeksMeta, prefix = '../' }) {
  const headerHtml = renderHeader({
    site,
    week: null,
    generatedAt: null,
    prefix,
    isHome: false,
    archiveCurrent: 'page',
  });
  const footerHtml = renderFooter({ site, prefix });

  const rows = (weeksMeta || [])
    .map((w) => {
      const href = `${w.week}.html`;
      const dateLabel = formatDateTimePtBR(w.generated_at);
      const dateValid = w.generated_at && !Number.isNaN(new Date(w.generated_at).getTime());
      const dateHtml = dateValid
        ? `<time datetime="${escapeHtml(w.generated_at)}">${escapeHtml(dateLabel)}</time>`
        : escapeHtml(dateLabel);
      const count =
        typeof w.itemCount === 'number' ? `${w.itemCount} ${w.itemCount === 1 ? 'item' : 'itens'}` : '';
      return `<li class="archive-entry">
          <a href="${escapeHtml(href)}">Semana ${escapeHtml(w.week)}</a>
          <p class="archive-meta">${dateHtml}${count ? ' · ' + escapeHtml(count) : ''}</p>
        </li>`;
    })
    .join('\n        ');

  const mainHtml = `<section aria-labelledby="h-arquivo">
      <p class="eyebrow">Histórico</p>
      <h2 id="h-arquivo">Arquivo de semanas</h2>
      <ul class="archive-list" role="list">
        ${rows || '<li>Nenhuma semana publicada ainda.</li>'}
      </ul>
    </section>`;

  return renderDocument({
    site,
    prefix,
    titleSuffix: 'Arquivo',
    description: `Arquivo de todas as semanas publicadas de ${site.title}.`,
    headerHtml,
    mainHtml,
    footerHtml,
  });
}
