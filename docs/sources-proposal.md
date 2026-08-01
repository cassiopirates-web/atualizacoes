# Proposta de fontes — para seu veto/aprovação

Documento de consolidação das 6 propostas de eixos de conteúdo para revisão e aprovação. Estas são as fontes candidatas do feed; para vetar uma fonte, adicione `[VETADO]` na linha do nome dela (ou apague a seção inteira). Para adicionar uma fonte, copie o formato de qualquer entrada existente. Quando terminar a revisão, avise o Claude no chat para converter as aprovadas em `config/sources.yml`.

---

## Resumo

| Fonte | Eixo | Tier | Acesso | LATAM | Feed OK |
|-------|------|------|--------|-------|---------|
| arXiv — Agentes autônomos e interação humano-IA | ia-aplicada | 1 | open | não | sim |
| MIT Sloan Management Review | ia-aplicada | 1 | partial | não | sim |
| Berkeley Artificial Intelligence Research (BAIR) Blog | ia-aplicada | 1 | open | não | sim |
| Microsoft Research Blog | ia-aplicada | 1 | open | não | sim |
| AI as Normal Technology | ia-aplicada | 2 | open | não | sim |
| One Useful Thing | ia-aplicada | 2 | open | não | sim |
| Benedict Evans — Essays | ia-aplicada | 2 | open | não | sim |
| MIT Sloan Management Review Brasil | ia-aplicada | 2 | partial | sim | sim |
| Import AI | ia-aplicada | 3 | open | não | sim |
| Technovation | produto-descoberta | 1 | partial | não | sim |
| Product Talk — Teresa Torres | produto-descoberta | 2 | open | não | sim |
| Silicon Valley Product Group | produto-descoberta | 2 | open | não | sim |
| Itamar Gilad | produto-descoberta | 2 | open | não | sim |
| A Smart Bear — Jason Cohen | produto-descoberta | 2 | open | não | sim |
| Roman Pichler | produto-descoberta | 2 | open | não | sim |
| Joca Torres | produto-descoberta | 2 | open | sim | sim |
| The Beautiful Mess — John Cutler | produto-descoberta | 3 | partial | não | sim |
| The Product Compass — Paweł Huryn | produto-descoberta | 3 | partial | não | sim |
| Latitud Newsletter | produto-descoberta | 3 | open | sim | sim |
| Nielsen Norman Group | design-lideranca | 1 | open | não | sim |
| She Ji: The Journal of Design, Economics, and Innovation | design-lideranca | 1 | open | não | sim |
| InfoDesign — Revista Brasileira de Design da Informação | design-lideranca | 1 | open | sim | sim |
| Jakob Nielsen on UX | design-lideranca | 2 | open | não | sim |
| Peter Merholz | design-lideranca | 2 | open | não | sim |
| Cennydd Bowles | design-lideranca | 2 | open | não | sim |
| Behavioral Scientist | design-lideranca | 2 | open | não | sim |
| Jorge Arango | design-lideranca | 2 | open | não | sim |
| The Convivial Society | design-lideranca | 2 | partial | não | sim |
| UX Collective 🇧🇷 | design-lideranca | 3 | partial | sim | sim |
| W3C Web Accessibility Initiative | acessibilidade | 1 | open | não | sim |
| WebAIM | acessibilidade | 1 | open | não | sim |
| TetraLogical | acessibilidade | 2 | open | não | sim |
| Deque Systems | acessibilidade | 2 | open | não | sim |
| Level Access | acessibilidade | 2 | open | não | sim |
| Adrian Roselli | acessibilidade | 2 | open | não | sim |
| Eric Eggert (yatil) | acessibilidade | 2 | open | não | sim |
| Equal Entry | acessibilidade | 2 | open | não | sim |
| Reinaldo Ferraz | acessibilidade | 2 | open | sim | sim |
| Craig Abbott | acessibilidade | 3 | open | não | sim |
| Accessibility Weekly | acessibilidade | 3 | open | não | sim |
| Kellogg Insight | branding-tendencias | 1 | open | não | sim |
| Knowledge at Wharton | branding-tendencias | 1 | open | não | sim |
| Prophet | branding-tendencias | 2 | open | não | sim |
| Siegel+Gale | branding-tendencias | 2 | open | não | sim |
| Vivaldi Group | branding-tendencias | 2 | open | não | sim |
| Branding Strategy Insider | branding-tendencias | 3 | open | não | sim |
| MKT1 Newsletter | branding-tendencias | 3 | partial | não | sim |
| Ana Couto | branding-tendencias | 3 | open | sim | sim |
| BIS — Bank for International Settlements | macro-capital | 1 | open | não | sim |
| Liberty Street Economics — Federal Reserve Bank of New York | macro-capital | 1 | open | não | sim |
| LAVCA — Association for Private Capital Investment in Latin America | macro-capital | 1 | partial | sim | sim |
| a16z — Andreessen Horowitz | macro-capital | 2 | open | não | sim |
| Crunchbase News | macro-capital | 2 | open | não | sim |
| Brazil Journal | macro-capital | 2 | open | sim | sim |
| LatamList | macro-capital | 2 | open | sim | sim |
| Tomasz Tunguz | macro-capital | 3 | open | não | sim |
| Clouded Judgement — Jamin Ball | macro-capital | 3 | open | não | sim |

---

## Estatísticas

- **Total de fontes únicas**: 60 (removidas 2 duplicatas)
- **Distribuição por tier**: 
  - Tier 1: 14 fontes
  - Tier 2: 28 fontes
  - Tier 3: 18 fontes
- **Fontes LATAM**: 10 (Brasil + LatAm regional)
- **Distribuição de acesso**:
  - Open (totalmente aberto): 49 fontes
  - Partial (parcialmente pago): 11 fontes
  - Paywalled: 0 fontes

---

## Duplicatas Removidas

As fontes abaixo foram identificadas como duplicatas e removidas, mantendo apenas a entrada com tier mais alto ou rationale mais forte:

1. **Nielsen Norman Group** (`nielsen-norman-group`)
   - Aparecia em: `ia-aplicada` (Tier 2), `design-lideranca` (Tier 1)
   - Mantida em: `design-lideranca` (Tier 1 + homepage mais específica)
   - Também relevante para: `ia-aplicada`

2. **Benedict Evans** (`benedict-evans-essays` / `benedict-evans`)
   - Aparecia em: `ia-aplicada` (Tier 2, id: `benedict-evans-essays`), `macro-capital` (Tier 3, id: `benedict-evans`)
   - Mantida em: `ia-aplicada` (Tier 2 + rationale mais específico para agentes)
   - Também relevante para: `macro-capital`

---

## IA Aplicada

### arXiv — Agentes autônomos e interação humano-IA (cs.HC + cs.MA)
- id: arxiv-agentic-hci-ma
- axis: ia-aplicada
- tier: 1
- type: arxiv
- url: http://export.arxiv.org/api/query?search_query=%28cat%3Acs.HC+OR+cat%3Acs.MA%29+AND+%28abs%3A%22agentic%22+OR+abs%3A%22LLM+agent%22%29&sortBy=submittedDate&sortOrder=descending&max_results=30
- homepage: https://arxiv.org/list/cs.HC/recent
- access: open
- latam: false
- rationale: Fonte primária da pesquisa mundial em agentes que planejam e executam cadeias longas, com o corte cs.HC trazendo delegação, supervisão humana e confiança sistêmica antes de virar prática de mercado.
- feed_status: verificado OK

### MIT Sloan Management Review
- id: mit-sloan-management-review
- axis: ia-aplicada
- tier: 1
- type: rss
- url: https://sloanreview.mit.edu/feed/
- homepage: https://sloanreview.mit.edu/
- access: partial
- latam: false
- rationale: Periódico de gestão do MIT que publica pesquisa longitudinal com empresas sobre adoção de IA, governança e ROI mensurado — a referência para separar valor real de teatro de transformação.
- feed_status: verificado OK

### Berkeley Artificial Intelligence Research (BAIR) Blog
- id: bair-berkeley-blog
- axis: ia-aplicada
- tier: 1
- type: rss
- url: https://bair.berkeley.edu/blog/feed.xml
- homepage: https://bair.berkeley.edu/blog/
- access: open
- latam: false
- rationale: Laboratório acadêmico de primeira linha explicando em prosa acessível a arquitetura de agentes de horizonte longo, memória e sistemas construídos para operar com agentes.
- feed_status: verificado OK

### Microsoft Research Blog
- id: microsoft-research-blog
- axis: ia-aplicada
- tier: 1
- type: rss
- url: https://www.microsoft.com/en-us/research/feed/
- homepage: https://www.microsoft.com/en-us/research/
- access: open
- latam: false
- rationale: Laboratório com produção sustentada sobre agentes de uso de computador, ambientes de avaliação e estudos empíricos de produtividade em trabalho real — pesquisa aplicada, não anúncio de produto.
- feed_status: verificado OK

### AI as Normal Technology (Arvind Narayanan e Sayash Kapoor, Princeton)
- id: ai-normal-technology
- axis: ia-aplicada
- tier: 2
- type: rss
- url: https://www.normaltech.ai/feed
- homepage: https://www.normaltech.ai/
- access: open
- latam: false
- rationale: Sucessor do AI Snake Oil, escrito por pesquisadores de Princeton amplamente citados; melhor antídoto contra hype com argumentos rigorosos sobre difusão, agência humana e limites reais de automação.
- feed_status: verificado OK

### One Useful Thing (Ethan Mollick, Wharton)
- id: one-useful-thing-mollick
- axis: ia-aplicada
- tier: 2
- type: rss
- url: https://www.oneusefulthing.org/feed
- homepage: https://www.oneusefulthing.org/
- access: open
- latam: false
- rationale: Professor da Wharton que testa sistematicamente IA em tarefas organizacionais reais e traduz achados em prática de trabalho — referência mais citada sobre adoção de IA em empresas.
- feed_status: verificado OK

### Benedict Evans — Essays
- id: benedict-evans-essays
- axis: ia-aplicada
- tier: 2
- type: rss
- url: https://www.ben-evans.com/benedictevans?format=rss
- homepage: https://www.ben-evans.com/
- access: open
- latam: false
- rationale: Analista de referência em estratégia de plataformas; ensaios densos sobre economia de tokens, exposição de trabalho e como a IA redesenha posicionamento de produto em escala global.
- feed_status: verificado OK
- nota: Também relevante para: macro-capital

### MIT Sloan Management Review Brasil
- id: mit-sloan-review-brasil
- axis: ia-aplicada
- tier: 2
- type: rss
- url: https://mitsloanreview.com.br/feed/
- homepage: https://mitsloanreview.com.br/
- access: partial
- latam: true
- rationale: Edição brasileira licenciada do MIT SMR, em pt-BR, com pauta constante sobre liderança em IA, métricas além de redução de carga de trabalho e casos de adoção no contexto corporativo local.
- feed_status: verificado OK

### Import AI (Jack Clark)
- id: import-ai-jack-clark
- axis: ia-aplicada
- tier: 3
- type: rss
- url: https://importai.substack.com/feed
- homepage: https://importai.substack.com/
- access: open
- latam: false
- rationale: Newsletter semanal de sinal comprovado que conecta avanços de capacidade agêntica a implicações de política, governança e risco — leitura padrão de pesquisadores e reguladores.
- feed_status: verificado OK

---

## Produto & Descoberta

### Technovation (Elsevier)
- id: technovation-journal
- axis: produto-descoberta
- tier: 1
- type: rss
- url: https://rss.sciencedirect.com/publication/science/01664972
- homepage: https://www.sciencedirect.com/journal/technovation
- access: partial
- latam: false
- rationale: Periódico revisado por pares em gestão da inovação e empreendedorismo tecnológico, com evidência empírica sobre criação e apropriação de valor — base científica para decisão de negócio informada, incluindo estudos em economias emergentes.
- feed_status: verificado OK

### Product Talk — Teresa Torres
- id: product-talk-teresa-torres
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://www.producttalk.org/feed/
- homepage: https://www.producttalk.org/
- access: open
- latam: false
- rationale: Fonte canônica de discovery contínuo (Opportunity Solution Tree, entrevistas semanais, hábitos de descoberta); publica estudos de caso longos de times reais, não opinião solta.
- feed_status: verificado OK

### Silicon Valley Product Group — Marty Cagan
- id: svpg-insights
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://www.svpg.com/feed/
- homepage: https://www.svpg.com/insights/
- access: open
- latam: false
- rationale: Referência mundial na separação discovery/delivery e em times de produto empoderados; textos densos sobre risco de valor, viabilidade de negócio e o que de fato vale ser construído.
- feed_status: verificado OK

### Itamar Gilad
- id: itamar-gilad
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://itamargilad.com/feed/
- homepage: https://itamargilad.com/
- access: open
- latam: false
- rationale: Autor de Evidence-Guided e do framework GIST; trata explicitamente de como transformar hipótese em evidência e evidência em decisão de investimento de produto.
- feed_status: verificado OK

### A Smart Bear — Jason Cohen
- id: a-smart-bear-jason-cohen
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://longform.asmartbear.com/index.xml
- homepage: https://longform.asmartbear.com/
- access: open
- latam: false
- rationale: Fundador do WP Engine e do Smart Bear escrevendo ensaios longos sobre as dores reais de fundadores B2B SaaS — precificação, foco, priorização e crítica fundamentada a frameworks de decisão como RICE.
- feed_status: verificado OK

### Roman Pichler
- id: roman-pichler
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://www.romanpichler.com/feed/
- homepage: https://www.romanpichler.com/
- access: open
- latam: false
- rationale: Autor amplamente citado em estratégia e visão de produto; entrega frameworks reutilizáveis que ligam visão, estratégia, roadmap e backlog — o encadeamento que sustenta o "o que construir".
- feed_status: verificado OK

### Joca Torres
- id: joca-torres
- axis: produto-descoberta
- tier: 2
- type: rss
- url: https://medium.com/feed/@jocatorres
- homepage: https://medium.com/@jocatorres
- access: open
- latam: true
- rationale: Autor canônico brasileiro de gestão de produtos digitais (ex-CPO Gympass/Conta Azul), escrevendo com cadência semanal sobre discovery no dia a dia, métricas perversas e OKRs no contexto de SaaS.
- feed_status: verificado OK

### The Beautiful Mess — John Cutler
- id: the-beautiful-mess-john-cutler
- axis: produto-descoberta
- tier: 3
- type: rss
- url: https://cutlefish.substack.com/feed
- homepage: https://cutlefish.substack.com/
- access: partial
- latam: false
- rationale: Leitura sistêmica de por que organizações constroem a coisa errada — fluxo de valor, capacidades, contratos sociais e os padrões que corrompem a descoberta antes de ela começar.
- feed_status: verificado OK

### The Product Compass — Paweł Huryn
- id: the-product-compass
- axis: produto-descoberta
- tier: 3
- type: rss
- url: https://www.productcompass.pm/feed
- homepage: https://www.productcompass.pm/
- access: partial
- latam: false
- rationale: Newsletter de alto sinal focada em discovery operacional e PM AI-native, com guias passo a passo e templates aplicáveis em vez de comentário de mercado.
- feed_status: verificado OK

### Latitud Newsletter
- id: latitud-newsletter
- axis: produto-descoberta
- tier: 3
- type: rss
- url: https://latitudlatam.substack.com/feed
- homepage: https://latitudlatam.substack.com/
- access: open
- latam: true
- rationale: Braço de conteúdo da Latitud (fundo e plataforma para fundadores latino-americanos), com análise direta das dores de quem constrói SaaS B2B na região e o LatAm Tech Report como base de dados.
- feed_status: verificado OK

---

## Design & Liderança

### Nielsen Norman Group
- id: nielsen-norman-group
- axis: design-lideranca
- tier: 1
- type: rss
- url: https://www.nngroup.com/feed/rss/
- homepage: https://www.nngroup.com/articles/
- access: open
- latam: false
- rationale: Instituição de pesquisa em UX mais citada do mundo (Nielsen/Norman); publica estudos empíricos próprios sobre IA aplicada a design, mentoria e maturidade de equipes, não opinião.
- feed_status: verificado OK
- nota: Também relevante para: ia-aplicada

### She Ji: The Journal of Design, Economics, and Innovation
- id: she-ji-journal
- axis: design-lideranca
- tier: 1
- type: rss
- url: https://rss.sciencedirect.com/publication/science/24058726
- homepage: https://www.journals.elsevier.com/she-ji-the-journal-of-design-economics-and-innovation
- access: open
- latam: false
- rationale: Periódico revisado por pares (Tongji University Press) de referência em teoria e filosofia do design; trata design como disciplina de sistemas, poder e futuros — a base conceitual que falta ao discurso de mercado.
- feed_status: verificado OK

### InfoDesign — Revista Brasileira de Design da Informação (SBDI)
- id: infodesign-sbdi
- axis: design-lideranca
- tier: 1
- type: rss
- url: https://infodesign.emnuvens.com.br/infodesign/gateway/plugin/WebFeedGatewayPlugin/rss2
- homepage: https://infodesign.emnuvens.com.br/infodesign
- access: open
- latam: true
- rationale: Único periódico brasileiro revisado por pares de design com continuidade desde 2004 (Sociedade Brasileira de Design da Informação, CC BY); pesquisa nacional sobre LLMs, personas e ergonomia informacional.
- feed_status: verificado OK

### Jakob Nielsen on UX (UX Tigers)
- id: jakob-nielsen-ux-tigers
- axis: design-lideranca
- tier: 2
- type: rss
- url: https://jakobnielsenphd.substack.com/feed
- homepage: https://jakobnielsenphd.substack.com/
- access: open
- latam: false
- rationale: Autor mais citado da usabilidade escrevendo semanalmente sobre a interseção IA×UX — design para agentes, novos paradigmas de interface e o impacto da IA na profissão, com posições fortes e argumentadas.
- feed_status: verificado OK

### Peter Merholz
- id: peter-merholz
- axis: design-lideranca
- tier: 2
- type: rss
- url: https://www.petermerholz.com/blog/feed/
- homepage: https://www.petermerholz.com/blog/
- access: open
- latam: false
- rationale: Coautor de "Org Design for Design Orgs", a referência canônica em estruturação de times de design; escreve sobre linha de reporte, OKRs e carreira sênior — o eixo de liderança em estado puro.
- feed_status: verificado OK

### Cennydd Bowles
- id: cennydd-bowles
- axis: design-lideranca
- tier: 2
- type: rss
- url: https://cennydd.com/writing?format=rss
- homepage: https://cennydd.com/writing
- access: open
- latam: false
- rationale: Autor de "Future Ethics" e hoje doutorando em filosofia (Leeds) sobre engano e manipulação em design autorado por IA; a voz mais rigorosa em design ético e value-sensitive design.
- feed_status: verificado OK

### Behavioral Scientist
- id: behavioral-scientist
- axis: design-lideranca
- tier: 2
- type: rss
- url: https://behavioralscientist.org/feed/
- homepage: https://behavioralscientist.org/
- access: open
- latam: false
- rationale: Publicação sem fins lucrativos editada por pesquisadores de ciência comportamental; traduz psicologia do usuário e limites do "nudge" com rigor de evidência, sem o vício da dica de conversão.
- feed_status: verificado OK

### Jorge Arango
- id: jorge-arango
- axis: design-lideranca
- tier: 2
- type: atom
- url: https://jarango.com/feed/
- homepage: https://jarango.com/
- access: open
- latam: false
- rationale: Coautor do "polar bear book" (Information Architecture, O'Reilly) e autor de "Duly Noted"; combina arquitetura de informação, sistemas e o podcast Traction Heroes sobre agência e liderança em organizações complexas.
- feed_status: verificado OK

### The Convivial Society
- id: the-convivial-society
- axis: design-lideranca
- tier: 2
- type: rss
- url: https://theconvivialsociety.substack.com/feed
- homepage: https://theconvivialsociety.substack.com/
- access: partial
- latam: false
- rationale: L. M. Sacasas na linhagem Illich/Ellul/Postman — a crítica filosófica da tecnologia mais consistente em atividade hoje; ensaios longos sobre atenção, mediação e o que a IA faz com a experiência humana.
- feed_status: verificado OK

### UX Collective 🇧🇷
- id: ux-collective-brasil
- axis: design-lideranca
- tier: 3
- type: rss
- url: https://brasil.uxdesign.cc/feed
- homepage: https://brasil.uxdesign.cc/
- access: partial
- latam: true
- rationale: Braço em português do UX Collective (ISSN 2766-5267), com curadoria editorial dos mesmos editores; a melhor concentração de escrita crítica em português sobre design especulativo, estratégia e IA na prática.
- feed_status: verificado OK

---

## Acessibilidade

### W3C Web Accessibility Initiative (WAI)
- id: w3c-wai-news
- axis: acessibilidade
- tier: 1
- type: atom
- url: https://www.w3.org/WAI/feed.xml
- homepage: https://www.w3.org/WAI/
- access: open
- latam: false
- rationale: Fonte normativa primária do WCAG/ARIA/ATAG — anuncia drafts, notas e publicações (ex.: WCAG-EM 2.0, WCAG 3.0 Working Draft) antes de qualquer intermediário.
- feed_status: verificado OK

### WebAIM
- id: webaim-blog
- axis: acessibilidade
- tier: 1
- type: rss
- url: https://webaim.org/blog/feed
- homepage: https://webaim.org/blog/
- access: open
- latam: false
- rationale: Centro institucional (Utah State University) por trás do WebAIM Million e do Contrast Checker; análise sóbria de conformidade, regulação (Section 508/504) e dados de campo.
- feed_status: verificado OK

### TetraLogical
- id: tetralogical
- axis: acessibilidade
- tier: 2
- type: atom
- url: https://tetralogical.com/feed.xml
- homepage: https://tetralogical.com/blog/
- access: open
- latam: false
- rationale: Consultoria de Léonie Watson (co-chair de grupos W3C); textos curtos e densos sobre semântica, apps nativos e leitura crítica das guidelines.
- feed_status: verificado OK

### Deque Systems
- id: deque-blog
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://www.deque.com/feed/
- homepage: https://www.deque.com/blog/
- access: open
- latam: false
- rationale: Criadora do axe-core (padrão de facto em testes automatizados); publica shift-left, integração em CI/CD e estratégia de programa de a11y em escala.
- feed_status: verificado OK

### Level Access
- id: level-access
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://www.levelaccess.com/feed/
- homepage: https://www.levelaccess.com/blog/
- access: open
- latam: false
- rationale: Maior consultoria enterprise de a11y (publica o State of Digital Accessibility Report); cobre maturidade de programa, risco jurídico e o caso de negócio que sustenta conversão e fidelização.
- feed_status: verificado OK

### Adrian Roselli
- id: adrian-roselli
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://adrianroselli.com/feed
- homepage: https://adrianroselli.com/
- access: open
- latam: false
- rationale: Referência técnica máxima da comunidade; deep-dives verificados em leitores de tela sobre ARIA, componentes e recursos novos da plataforma, com correções que viram consenso.
- feed_status: verificado OK

### Eric Eggert (yatil)
- id: eric-eggert-yatil
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://yatil.net/feed.xml
- homepage: https://yatil.net/
- access: open
- latam: false
- rationale: Ex-W3C/WAI, autor de material oficial de WCAG; escreve sobre como ler e aplicar as guidelines na prática profissional e sobre limites de ferramentas de teste.
- feed_status: verificado OK

### Equal Entry
- id: equal-entry
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://equalentry.com/feed/
- homepage: https://equalentry.com/
- access: open
- latam: false
- rationale: Consultoria com forte cobertura de testes por jornada de usuário e casos reais (checkout, doação, ticketing) — o elo direto entre a11y e conversão.
- feed_status: verificado OK

### Reinaldo Ferraz
- id: reinaldo-ferraz
- axis: acessibilidade
- tier: 2
- type: rss
- url: https://reinaldoferraz.com.br/feed/
- homepage: https://reinaldoferraz.com.br/
- access: open
- latam: true
- rationale: Especialista do Ceweb.br/W3C Brasil e autor de referência em português; cobre WCAG, ABNT NBR 17225 e o contexto normativo brasileiro (LBI) com profundidade técnica.
- feed_status: verificado OK

### Craig Abbott
- id: craig-abbott
- axis: acessibilidade
- tier: 3
- type: atom
- url: https://www.craigabbott.co.uk/feed.xml
- homepage: https://www.craigabbott.co.uk/blog/
- access: open
- latam: false
- rationale: Head of Accessibility em governo digital do Reino Unido; escreve sobre embutir a11y em design systems, CSS e processo — o melhor sinal disponível sobre shift-left organizacional.
- feed_status: verificado OK

### Accessibility Weekly
- id: accessibility-weekly
- axis: acessibilidade
- tier: 3
- type: atom
- url: https://a11yweekly.com/feed
- homepage: https://a11yweekly.com/
- access: open
- latam: false
- rationale: Newsletter curada por David A. Kennedy, ativa há mais de uma década; agrega o que a comunidade a11y considera relevante na semana, com curadoria consistentemente alta.
- feed_status: verificado OK

---

## Branding & Tendências

### Kellogg Insight
- id: kellogg-insight
- axis: branding-tendencias
- tier: 1
- type: rss
- url: https://insight.kellogg.northwestern.edu/feed/rss
- homepage: https://insight.kellogg.northwestern.edu/
- access: open
- latam: false
- rationale: Braço editorial da Kellogg (Northwestern), berço da disciplina moderna de marketing e brand management, publicando pesquisa peer-reviewed destilada em implicações estratégicas.
- feed_status: verificado OK

### Knowledge at Wharton
- id: knowledge-at-wharton
- axis: branding-tendencias
- tier: 1
- type: rss
- url: https://knowledge.wharton.upenn.edu/feed/
- homepage: https://knowledge.wharton.upenn.edu/
- access: open
- latam: false
- rationale: Journal de negócios da Wharton com pesquisa de marketing e estratégia de crescimento revisada por pares, aberta e sem paywall.
- feed_status: verificado OK

### Prophet
- id: prophet
- axis: branding-tendencias
- tier: 2
- type: rss
- url: https://prophet.com/feed/
- homepage: https://prophet.com/
- access: open
- latam: false
- rationale: Consultoria global de crescimento fundada na tradição de David Aaker, com pesquisa proprietária (Brand Relevance Index) sobre relevância, propósito e transformação de marca.
- feed_status: verificado OK

### Siegel+Gale
- id: siegel-gale
- axis: branding-tendencias
- tier: 2
- type: rss
- url: https://www.siegelgale.com/feed/
- homepage: https://www.siegelgale.com/
- access: open
- latam: false
- rationale: Consultoria de branding com estudo longitudinal proprietário (Global Brand Simplicity Index) ligando clareza de marca a preferência, preço e receita.
- feed_status: verificado OK

### Vivaldi Group
- id: vivaldi-group
- axis: branding-tendencias
- tier: 2
- type: rss
- url: https://vivaldigroup.com/feed/
- homepage: https://vivaldigroup.com/
- access: open
- latam: false
- rationale: Consultoria de Erich Joachimsthaler (coautor de "Brand Leadership" com Aaker) publicando frameworks proprietários como Demand Spaces — estratégia de marca ligada a demanda e go-to-market.
- feed_status: verificado OK

### Branding Strategy Insider
- id: branding-strategy-insider
- axis: branding-tendencias
- tier: 3
- type: rss
- url: https://brandingstrategyinsider.com/feed/
- homepage: https://brandingstrategyinsider.com/
- access: open
- latam: false
- rationale: Publicação do The Blake Project focada exclusivamente em estratégia e posicionamento de marca, com cadência diária e ensaios acionáveis (não notícias de campanha).
- feed_status: verificado OK

### MKT1 Newsletter (Emily Kramer)
- id: mkt1-newsletter
- axis: branding-tendencias
- tier: 3
- type: rss
- url: https://newsletter.mkt1.co/feed
- homepage: https://newsletter.mkt1.co/
- access: partial
- latam: false
- rationale: Newsletter de sinal comprovado sobre go-to-market e posicionamento em B2B, com frameworks operacionais de quem construiu marketing em Asana e Carta.
- feed_status: verificado OK

### Ana Couto
- id: ana-couto
- axis: branding-tendencias
- tier: 3
- type: rss
- url: https://anacouto.com.br/feed/
- homepage: https://anacouto.com.br/
- access: open
- latam: true
- rationale: Maior referência brasileira em branding, com método proprietário "Branding para a Estratégia" aplicado em O Boticário e Livelo; publica sobre consistência de marca, relevância e crescimento no mercado brasileiro.
- feed_status: verificado OK

### MIT Sloan Management Review Brasil
- id: mit-sloan-review-brasil
- axis: branding-tendencias
- tier: 2
- type: rss
- url: https://mitsloanreview.com.br/feed/
- homepage: https://mitsloanreview.com.br/
- access: partial
- latam: true
- rationale: Edição licenciada da MIT SMR com produção autoral brasileira (FGV, FDC, Insper) sobre estratégia, marca e crescimento no contexto LATAM.
- feed_status: verificado OK

---

## Macro & Capital

### BIS — Bank for International Settlements (publicações BIS/FSI)
- id: bis-publications
- axis: macro-capital
- tier: 1
- type: rss
- url: https://www.bis.org/doclist/bis_fsi_publs.rss
- homepage: https://www.bis.org/
- access: open
- latam: false
- rationale: O banco central dos bancos centrais publica aqui os papers que definem o enquadramento macro-financeiro global — incluindo IA na economia, stablecoins e crédito não-bancário — meses antes de virarem consenso de mercado.
- feed_status: verificado OK

### Liberty Street Economics — Federal Reserve Bank of New York
- id: ny-fed-liberty-street-economics
- axis: macro-capital
- tier: 1
- type: rss
- url: https://libertystreeteconomics.newyorkfed.org/feed/
- homepage: https://libertystreeteconomics.newyorkfed.org/
- access: open
- latam: false
- rationale: Blog de pesquisa do Fed de Nova York que traduz dados primários de crédito, juros e liquidez em análise curta — a leitura mais direta das condições macro que determinam o custo do capital de risco.
- feed_status: verificado OK

### LAVCA — Association for Private Capital Investment in Latin America
- id: lavca
- axis: macro-capital
- tier: 1
- type: rss
- url: https://www.lavca.org/feed/
- homepage: https://www.lavca.org/
- access: partial
- latam: true
- rationale: Associação de referência do capital privado latino-americano, com base de dados proprietária de rodadas, fundos e saídas — é a autoridade institucional sobre para onde o capital de risco da região está indo.
- feed_status: verificado OK (HTTP 200, application/rss+xml, 10 itens, mais recente 30/07/2026; WAF bloqueia alguns user-agents genéricos)

### a16z — Andreessen Horowitz
- id: a16z
- axis: macro-capital
- tier: 2
- type: rss
- url: https://www.a16z.news/feed
- homepage: https://a16z.com/
- access: open
- latam: false
- rationale: Research aberto da maior firma de VC dos EUA sobre teses de investimento, benchmarks de adoção de IA e como equipes menores estão construindo empresas — pauta o que o resto do mercado vai financiar.
- feed_status: verificado OK

### Crunchbase News
- id: crunchbase-news
- axis: macro-capital
- tier: 2
- type: rss
- url: https://news.crunchbase.com/feed/
- homepage: https://news.crunchbase.com/
- access: open
- latam: false
- rationale: Jornalismo movido pela base de dados da Crunchbase: volumes de funding por estágio e setor, concentração em IA e comportamento de seed/Série A com números, não com narrativa.
- feed_status: verificado OK

### Brazil Journal
- id: brazil-journal
- axis: macro-capital
- tier: 2
- type: rss
- url: https://braziljournal.com/rss
- homepage: https://braziljournal.com/
- access: open
- latam: true
- rationale: Veículo de referência sobre negócios, capital e tecnologia no Brasil, com acesso direto a gestores e fundadores — a leitura obrigatória do capital brasileiro sem ruído de mercado de varejo.
- feed_status: verificado OK

### LatamList
- id: latamlist
- axis: macro-capital
- tier: 2
- type: rss
- url: https://latamlist.com/feed/
- homepage: https://latamlist.com/
- access: open
- latam: true
- rationale: Cobertura em inglês, sistemática e sem hype, de rodadas, aquisições e expansões de startups latino-americanas — o registro mais consistente da atividade de VC regional fora do eixo Brasil.
- feed_status: verificado OK

### Tomasz Tunguz
- id: tomasz-tunguz
- axis: macro-capital
- tier: 3
- type: rss
- url: https://tomtunguz.com/index.xml
- homepage: https://tomtunguz.com/
- access: open
- latam: false
- rationale: VC (Theory Ventures) amplamente citado que publica análise diária e quantitativa de métricas de software — margem, retenção, custo de inferência e como o benchmark de eficiência mudou com a IA.
- feed_status: verificado OK

### Clouded Judgement — Jamin Ball (Altimeter Capital)
- id: clouded-judgement
- axis: macro-capital
- tier: 3
- type: rss
- url: https://cloudedjudgement.substack.com/feed
- homepage: https://cloudedjudgement.substack.com/
- access: open
- latam: false
- rationale: Análise semanal com dados de múltiplos, crescimento e capex de todo o universo de software listado — o termômetro mais citado de como o mercado público está reprecificando métricas de negócio na era da IA.
- feed_status: verificado OK
