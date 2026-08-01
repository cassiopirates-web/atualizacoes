# Atualizações — feed de nova aba

Feed pessoal semanal de conhecimento curado de alto sinal: estratégia, produto, design & liderança, IA aplicada, acessibilidade, macro & capital, com lente LATAM/BR. Publicado via GitHub Pages, abre automaticamente em cada nova aba do Chrome.

## Como funciona

Três camadas de filtragem:

1. **Coleta determinística** (`scripts/collect.mjs`) — extrai feeds RSS, newsletters e fontes definidas em `config/sources.yml`
2. **Curadoria automática** — Claude Code Action executa `prompts/weekly-curation.md`, ordena por força de sinal
3. **Julgamento humano** — critérios em `config/criteria.md`, feedback via issues (`feedback:ruido`, `feedback:ouro`)

## Setup

1. Criar repositório público no GitHub
2. Rodar `claude setup-token` → criar secret `CLAUDE_CODE_OAUTH_TOKEN`
3. Settings → Pages → Source: GitHub Actions
4. Settings → Actions → Workflow permissions: **Read and write**
5. Instalar a extensão em `extension/`: `chrome://extensions` → ativar **Modo do desenvolvedor** → **Carregar sem compactação** → selecionar a pasta `extension/` (o redirect em `extension/newtab.html` já aponta para a `base_url` de `config/site.yml`)

## Comandos

```bash
npm run collect    # Coleta feeds e armazena em data/candidates/
npm run build      # Gera HTML estático em dist/
```

## Renovar token

Se o workflow falhar com erro de autenticação:

```bash
claude setup-token
```

Atualizar o secret `CLAUDE_CODE_OAUTH_TOKEN` no repositório.
