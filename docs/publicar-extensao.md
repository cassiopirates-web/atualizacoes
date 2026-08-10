# Publicar a extensão no Microsoft Edge Add-ons

Guia de submissão da extensão `extension/` no Partner Center. Os textos abaixo
estão prontos para copiar e colar em cada campo do formulário.

**Por que publicar:** carregada "sem pacote" (modo desenvolvedor), a extensão é
desativada pelo Edge de tempos em tempos — quando isso acontece, a nova guia
volta a ser o MSN. Extensão instalada pela loja não sofre esse problema.

---

## O que já está pronto no repositório

| Item | Onde | Status |
| --- | --- | --- |
| Pacote `.zip` para upload | `store/atualizacoes-nova-aba-1.0.0.zip` | pronto |
| Logo da listagem (300×300) | `store/logo-300.png` | pronto |
| Ícones da extensão (16/32/48/128) | `extension/icons/` | pronto |
| Política de privacidade | [`docs/privacidade.md`](privacidade.md) | pronto |
| Textos da listagem | este documento | pronto |
| Screenshots (opcionais) | — | ver [passo 7](#passo-7--store-listings) |

Para regerar tudo depois de mexer na extensão:

```bash
npm run package:extension
```

O comando reconstrói os ícones e reempacota o `.zip` com a versão que estiver no
`manifest.json`. O zip é determinístico: mesmo conteúdo gera bytes idênticos.

---

## Passo 1 — Criar a conta de desenvolvedor

Acesse o [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/public/login).

- **Não há taxa de registro** para o programa Microsoft Edge.
- É preciso uma conta Microsoft (MSA). **Atalho:** dá para entrar com a conta do
  GitHub — o Partner Center cria a MSA automaticamente. Como o repositório já
  está no GitHub, esse é o caminho mais curto.
- **Tipo de conta: Individual.** A verificação é bem mais rápida que a de
  empresa (que envolve ligação de parceiros de verificação da Microsoft e pode
  levar semanas). A escolha é **irreversível** — não dá para migrar de Company
  para Individual depois.
- **País/região:** Brasil. Também é irreversível.
- **Publisher display name:** o nome que aparece como autor na loja, até 50
  caracteres. Ex.: `Cássio Pirates`.
- Aceite o *App Developer Agreement* e clique em **Finish**.

A verificação da conta individual costuma ser rápida. Enquanto ela roda, dá para
seguir preparando a submissão.

---

## Passo 2 e 3 — Criar a extensão e subir o pacote

1. No workspace **Edge**, clique em **Create new extension**.
2. Arraste `store/atualizacoes-nova-aba-1.0.0.zip` para a área de upload.
3. Aguarde a verificação do pacote e clique em **Continue**.

O `name` e a `description` da listagem vêm do manifesto e ficam **somente
leitura** no Partner Center. Para mudá-los, é preciso editar o
`extension/manifest.json`, rodar `npm run package:extension` e subir o zip de
novo.

---

## Passo 4 — Availability

| Campo | Valor |
| --- | --- |
| **Visibility** | `Hidden` |
| **Markets** | todos (padrão) |

**Por que Hidden:** a extensão não aparece em buscas nem na vitrine, e você a
instala pelo link direto da listagem (disponível na página **Overview** da
extensão no Partner Center). É o modo adequado para algo de uso pessoal — e
evita competir por relevância numa vitrine pública, já que o conteúdo é a sua
curadoria. Você pode alternar para `Public` depois, sem reenviar o pacote.

---

## Passo 5 — Properties

| Campo | Valor |
| --- | --- |
| **Category** | `News & Weather` (se não existir, use `Productivity`) |
| **Website** | `https://github.com/cassiopirates-web/atualizacoes` |
| **Support contact detail** | `https://github.com/cassiopirates-web/atualizacoes/issues` |
| **Mature content** | desmarcado |

---

## Passo 6 — Privacy

### Single Purpose Description

```
Exibir, na página de nova guia, a edição semanal do feed editorial Atualizações,
publicada em https://cassiopirates-web.github.io/atualizacoes/.

Esse é o único comportamento da extensão. Ela substitui a nova guia pela API
padrão chrome_url_overrides e não faz mais nada: não declara permissões, não
injeta content scripts, não usa service worker, não altera a página inicial, o
mecanismo de busca ou os favoritos.
```

### Permission justification

Não haverá nenhum campo aqui — o manifesto não declara permissões. Se aparecer
alguma permissão listada, o pacote subiu errado.

### Are you using remote code?

Marque **`No, I am not using remote code`**.

A extensão não carrega nem executa JavaScript remoto no contexto da extensão. O
único recurso remoto é o documento HTML exibido dentro de um `<iframe>`, que roda
isolado na origem do próprio site — isso não é *remotely hosted code*. A
explicação está repetida nas notas de certificação do [passo 8](#passo-8--notes-for-certification-e-envio).

### Data usage

- Em **"What user data do you plan to collect from users now or in the future?"**:
  **não marque nada.**
- Em **"I certify that the following disclosures are true"**: marque todas as
  caixas.

### Privacy Policy URL

```
https://github.com/cassiopirates-web/atualizacoes/blob/main/docs/privacidade.md
```

A URL só é obrigatória quando há coleta de dados, mas informá-la não custa nada e
tira uma ambiguidade da mesa na revisão. **A página precisa estar acessível no
momento da submissão** — ou seja, `docs/privacidade.md` tem que já estar
commitado e no `main`.

---

## Passo 7 — Store listings

Abra **Edit details** na linha do idioma que aparecer.

### Extension logo (obrigatório)

Suba `store/logo-300.png`.

### Description (obrigatório — mínimo 250 caracteres, máximo 10.000)

```
Atualizações substitui a página de nova guia do Microsoft Edge por um feed
semanal curado: uma seleção de leituras sobre IA aplicada, produto e descoberta,
branding e tendências, design e liderança, acessibilidade e macroeconomia — com
América Latina e Brasil como lente transversal, e não como assunto à parte.

Toda segunda-feira, uma curadoria percorre dezenas de publicações de referência e
seleciona de 15 a 25 itens da semana. Cada item traz uma síntese em português, o
título original preservado, a fonte e um indicador de força do sinal, para você
decidir em segundos o que merece leitura completa. As edições anteriores
continuam disponíveis no arquivo.

COMO FUNCIONA
A extensão exibe, na nova guia, a edição publicada em
https://cassiopirates-web.github.io/atualizacoes/ — um site estático, sem
rastreadores, sem anúncios e sem cadastro. O conteúdo é atualizado no site, então
a extensão não precisa ser reinstalada a cada semana. É necessária conexão com a
internet para carregar a edição.

O QUE ELA ALTERA NO NAVEGADOR
Apenas a página de nova guia, usando a API padrão de extensões. Página inicial,
mecanismo de busca e favoritos permanecem exatamente como estão. Para reverter,
basta desativar ou remover a extensão em edge://extensions.

PRIVACIDADE
A extensão não pede nenhuma permissão, não coleta, não armazena e não transmite
dados pessoais, não usa analytics e não monitora a navegação. O código é aberto e
auditável em https://github.com/cassiopirates-web/atualizacoes.
```

### Search terms (opcional — até 7 termos, 21 palavras, 30 caracteres cada)

```
nova guia
feed semanal
curadoria
IA aplicada
design
produto
notícias
```

### Screenshots (opcional, mas recomendado)

Até 6 imagens, em **1280×800** ou **640×480** exatos. O jeito mais rápido:

1. Abra <https://cassiopirates-web.github.io/atualizacoes/> no Edge.
2. `Ctrl+Shift+S` → **Capturar área** (ou use a Ferramenta de Captura do Windows).
3. Redimensione para 1280×800 exatos antes de subir — a política exige que a
   imagem não fique esticada ou borrada.

Boas capturas: o topo do feed, um item expandido e a navegação do arquivo.

---

## Passo 8 — Notes for certification e envio

Clique em **Publish** e cole no campo **Notes for certification**:

```
Extensão de uso pessoal, publicada com visibilidade Hidden.

O QUE FAZ
Substitui a página de nova guia por uma página local do próprio pacote
(newtab.html), que exibe dentro de um <iframe> a edição semanal do site
https://cassiopirates-web.github.io/atualizacoes/ — site estático de minha
autoria, hospedado no GitHub Pages. Código-fonte público (extensão e site):
https://github.com/cassiopirates-web/atualizacoes

COMO TESTAR
Instale a extensão e abra uma nova guia. A edição da semana carrega diretamente.
Não há credenciais de teste porque não existe login, cadastro ou paywall em
nenhuma parte do fluxo. O servidor é estático e está no ar.

OBSERVAÇÕES
- O manifesto (MV3) não declara nenhuma permissão.
- Não há service worker, content script, nem código ofuscado. O pacote tem 6
  arquivos: manifest.json, newtab.html e quatro PNGs de ícone.
- Não há código remoto executado no contexto da extensão. O único recurso remoto
  é o documento HTML carregado no iframe, isolado na origem do site.
- Não há coleta, armazenamento ou transmissão de dados pessoais, analytics ou
  anúncios. Política de privacidade:
  https://github.com/cassiopirates-web/atualizacoes/blob/main/docs/privacidade.md
- A alteração da nova guia usa a API padrão chrome_url_overrides, está descrita
  na listagem e é revertida ao desativar ou remover a extensão.
- O conteúdo é atualizado semanalmente no site por um workflow do GitHub Actions
  do repositório acima; a extensão em si não muda entre as edições.
```

Clique em **Publish**. A certificação leva **até 7 dias úteis** — na prática,
costuma sair antes.

---

## Depois da aprovação

1. O status no painel passa a **In the Store**. Pegue o link da listagem na
   página **Overview** da extensão (com visibilidade `Hidden`, esse link é a
   única forma de instalar).
2. Abra o link no Edge e instale.
3. **Remova a versão carregada sem pacote** em `edge://extensions` — se as duas
   ficarem ativas, elas disputam a nova guia e o resultado é imprevisível.
4. Confirme numa nova guia. A partir daí a extensão é gerenciada pela loja e não
   é mais desativada sozinha.

## Publicar uma atualização

1. Edite o que precisar em `extension/`.
2. Incremente `version` no `extension/manifest.json` (a loja recusa reenvio da
   mesma versão).
3. `npm run package:extension`.
4. No Partner Center: **Packages** → suba o novo zip → **Publish**. Descreva a
   mudança nas notas de certificação.

Lembrando: mudanças **no conteúdo do feed não exigem atualização da extensão** —
elas saem no site, que a extensão carrega ao vivo. Só é preciso republicar se o
comportamento da própria extensão mudar.

---

## Riscos conhecidos da revisão

A política de maior atenção aqui é a **1.1.8 (Altering browser settings)**: a
alteração da nova guia precisa usar API padrão e estar declarada na listagem.
Ambos estão cobertos — `chrome_url_overrides` e a seção "O QUE ELA ALTERA NO
NAVEGADOR" da descrição.

O segundo ponto é o princípio de **valor distinto** (seção 1.1): uma extensão que
apenas embute um site pode ser questionada. Três coisas trabalham a favor: o
conteúdo é de autoria própria (não é wrapper de site de terceiro), a submissão é
`Hidden` (não disputa espaço na vitrine pública) e a **1.2.3** permite depender
de serviço externo desde que isso esteja divulgado na descrição — e está.

Se a submissão for recusada, a mensagem cita a política específica. O caminho de
recurso é o [formulário de suporte](https://support.microsoft.com/supportrequestform/e7a381be-9c9a-fafb-ed76-262bc93fd9e4);
o tempo médio de processamento divulgado para o FY2026 foi de 3 dias.
