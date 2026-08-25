# blog/catalogo Specification

## Purpose

Define o comportamento da página índice do blog — o post em destaque, a grade de cards e a paginação — que é a porta de entrada do conteúdo para quem chega por busca orgânica ou pela navegação do site.

## Requirements

### Requirement: Página índice do blog

O site SHALL expor a rota pública `/blog` apresentando, no topo, o post em destaque e, abaixo, a grade dos demais posts publicados em ordem cronológica decrescente.

Cada card da grade SHALL exibir capa, categoria, título, resumo, data de publicação e tempo de leitura, e SHALL levar à página do post ao ser acionado.

#### Scenario: Visitante abre o blog

- **WHEN** um visitante acessa `/blog`
- **THEN** vê o post em destaque e a grade dos posts mais recentes, cada card com capa, categoria, título, resumo, data e tempo de leitura

#### Scenario: Card acionado

- **WHEN** o visitante aciona um card da grade
- **THEN** é levado à página do post correspondente àquele `slug`

#### Scenario: Nenhum post em destaque marcado

- **WHEN** nenhum post publicado está marcado como destaque
- **THEN** o post mais recente ocupa a posição de destaque e não aparece duplicado na grade

### Requirement: Paginação navegável e indexável

A listagem SHALL ser paginada com um número fixo de posts por página. A primeira página SHALL ser servida em `/blog`; as demais SHALL ter URL própria e estável (`/blog/pagina/<n>`), acessível por link e compartilhável.

A navegação SHALL indicar a página atual e oferecer acesso às páginas anterior e seguinte quando existirem.

#### Scenario: Ir para a próxima página

- **WHEN** o visitante aciona a navegação para a página seguinte em `/blog`
- **THEN** chega a uma URL própria, com os posts seguintes na ordem cronológica e sem repetir posts da página anterior

#### Scenario: URL de página compartilhada

- **WHEN** alguém abre diretamente a URL de uma página de listagem existente
- **THEN** aquela página é exibida com seus posts e com a navegação indicando a página atual

#### Scenario: Página inexistente

- **WHEN** alguém abre a URL de uma página de listagem que não existe
- **THEN** recebe a página de conteúdo não encontrado do site, e não uma página vazia

#### Scenario: Primeira página com endereço único

- **WHEN** o visitante navega da página 2 de volta para a primeira página
- **THEN** é levado a `/blog`, que é o único endereço da primeira página

### Requirement: Lista sem posts

Quando não houver nenhum post publicado, `/blog` SHALL exibir uma mensagem de ausência de conteúdo e manter cabeçalho, rodapé e navegação do site, sem erro.

#### Scenario: Blog sem conteúdo publicado

- **WHEN** não existe nenhum post publicado
- **THEN** `/blog` mostra a mensagem de ausência de conteúdo publicado e o restante da página permanece funcional

### Requirement: Blog integrado à navegação e ao SEO do site

O blog SHALL estar acessível a partir da navegação principal do site (menu desktop e menu mobile) e SHALL constar no `sitemap.xml`, incluindo a página índice, as páginas de listagem e cada post publicado.

A página índice SHALL ter título, descrição e URL canônica próprios, no mesmo padrão das demais páginas do site.

#### Scenario: Acesso pelo menu

- **WHEN** o visitante usa o menu principal, no desktop ou no mobile
- **THEN** encontra o link para o blog e chega a `/blog`

#### Scenario: Sitemap consultado

- **WHEN** o `sitemap.xml` é consultado
- **THEN** contém a URL do índice do blog, das páginas de listagem e de cada post publicado, e nenhuma URL de rascunho
