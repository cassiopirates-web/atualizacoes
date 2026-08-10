# Política de privacidade — Atualizações (nova aba)

Última atualização: 10 de agosto de 2026.

Esta política cobre a extensão de navegador **Atualizações — nova aba** e o site
<https://cassiopirates-web.github.io/atualizacoes/>.

## Resumo

A extensão não coleta absolutamente nada.

## Dados coletados

**Nenhum.** A extensão não coleta, não armazena, não transmite e não vende
nenhum dado pessoal ou de navegação. Especificamente, ela não acessa:

- histórico de navegação, guias abertas ou conteúdo de páginas visitadas;
- informações de identificação pessoal (nome, e-mail, endereço, telefone);
- credenciais, cookies de terceiros ou dados de formulários;
- localização;
- dados financeiros ou de saúde.

## Permissões

A extensão **não declara nenhuma permissão** no seu manifesto. Ela usa apenas o
campo `chrome_url_overrides`, da API padrão de extensões, para substituir a
página de nova guia.

## Rastreamento

Não há analytics, telemetria, pixels de rastreamento, anúncios, fingerprinting
nem cookies de terceiros — nem na extensão, nem no site que ela exibe.

## Requisições de rede

Ao abrir uma nova guia, a extensão carrega a página
<https://cassiopirates-web.github.io/atualizacoes/> dentro de um `<iframe>`.
Essa requisição é feita ao GitHub Pages, serviço que hospeda o site. Como em
qualquer acesso a um site, o GitHub pode registrar dados técnicos de conexão
(endereço IP, user agent) nos seus próprios logs de servidor, sob a
[Declaração de Privacidade do GitHub](https://docs.github.com/pt/site-policy/privacy-policies/github-privacy-statement).
Nenhum desses dados é acessível a esta extensão, ao seu autor ou a terceiros.

## Conteúdo

O conteúdo exibido é editorial e público: sínteses semanais de artigos, com
título original, fonte e link. Ele é idêntico para todas as pessoas que usam a
extensão — não há personalização, perfilamento ou segmentação.

## Código-fonte

O código da extensão e do site é aberto e auditável:
<https://github.com/cassiopirates-web/atualizacoes>.

## Alterações no navegador

A extensão altera **apenas** a página de nova guia. Página inicial, mecanismo de
busca padrão, favoritos e demais configurações não são tocados. Para reverter,
basta desativar ou remover a extensão em `edge://extensions`.

## Contato

Dúvidas sobre esta política: abra uma issue em
<https://github.com/cassiopirates-web/atualizacoes/issues>.
