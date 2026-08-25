## Purpose

Define como o blog passa a servir conteúdo que muda sem novo deploy — quando uma página é atualizada, o que o leitor vê enquanto isso e como o site se comporta quando o banco está fora — agora que o site deixa de ser um pacote estático congelado no build.

## ADDED Requirements

### Requirement: Conteudo publicado aparece sem novo deploy

Um post publicado pela ingestão SHALL passar a aparecer no blog sem que o site seja construído e implantado de novo.

A atualização SHALL alcançar todas as páginas afetadas: o índice, as páginas de listagem, a página do post e o sitemap.

#### Scenario: Post novo publicado

- **WHEN** a automação publica um post
- **THEN** o post passa a aparecer no índice e a ter sua própria página, sem novo deploy

#### Scenario: Post publicado depois do build

- **WHEN** um post é publicado depois de o site já ter sido construído
- **THEN** sua página é renderizada sob demanda no primeiro acesso, em vez de resultar em conteúdo não encontrado

#### Scenario: Sitemap depois de uma publicacao

- **WHEN** um post novo é publicado
- **THEN** o sitemap passa a incluir a URL daquele post

### Requirement: Paginas servidas de cache

As páginas do blog SHALL ser servidas a partir de conteúdo já renderizado, de modo que uma visita comum não dependa de uma consulta ao banco no momento da requisição.

O leitor NÃO SHALL esperar pelo banco para receber uma página que já foi renderizada antes.

#### Scenario: Duas visitas seguidas a um post

- **WHEN** dois leitores abrem o mesmo post em sequência
- **THEN** a segunda visita é servida sem nova consulta ao banco

#### Scenario: Paginas institucionais

- **WHEN** um visitante abre qualquer página institucional do site
- **THEN** ela é servida sem consultar o banco, pois não depende de conteúdo do blog

### Requirement: Blog nao quebra com o banco fora

Com o banco indisponível, o blog SHALL continuar servindo as páginas do blog que já havia renderizado, e o restante do site SHALL continuar funcionando integralmente.

Uma página do blog ainda não renderizada, solicitada enquanto o banco está fora, SHALL resultar em erro tratado do site — nunca em página em branco nem em vazamento de detalhe técnico como consulta, credencial ou rastreamento de pilha.

#### Scenario: Banco fora, post ja renderizado

- **WHEN** o banco está indisponível e um leitor abre um post já renderizado
- **THEN** o post é servido normalmente

#### Scenario: Banco fora, pagina nunca renderizada

- **WHEN** o banco está indisponível e é solicitada uma página do blog ainda não renderizada
- **THEN** o leitor recebe uma página de erro do próprio site, sem detalhe técnico exposto

#### Scenario: Banco fora, paginas institucionais

- **WHEN** o banco está indisponível
- **THEN** home, soluções, quem somos, comparação e contato seguem funcionando

### Requirement: Site publicado com runtime

O site SHALL ser publicado em modo com servidor, e NÃO SHALL depender de export estático para as rotas do blog nem para a ingestão.

O que era removido do build para viabilizar o export estático SHALL ter destino decidido explicitamente: ou passa a ser publicado, ou é excluído por decisão registrada — nunca publicado por efeito colateral da mudança de modo.

#### Scenario: Ingestao disponivel no site publicado

- **WHEN** o site é publicado
- **THEN** o endpoint de ingestão responde no ambiente publicado

#### Scenario: Area restrita no site publicado

- **WHEN** o site é publicado no novo modo
- **THEN** a presença ou ausência da área restrita no ambiente publicado corresponde a uma decisão registrada, e não ao efeito colateral de sair do modo estático
