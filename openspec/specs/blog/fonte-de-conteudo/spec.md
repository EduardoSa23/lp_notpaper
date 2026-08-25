# blog/fonte-de-conteudo Specification

## Purpose

Define o contrato de leitura do conteúdo do blog — o modelo de um post e as regras de slug, publicação e ordenação — para que as páginas do blog dependam sempre do mesmo contrato, seja o conteúdo servido por dados mock hoje ou pela API do blog depois.

## Requirements

### Requirement: Modelo do post

Todo post exposto pela fonte de conteúdo SHALL conter: `slug`, `title`, `excerpt`, `content` (lista de blocos), `coverImage` (caminho e texto alternativo), `author` (nome e cargo), `publishedAt` (data ISO 8601), `readingMinutes` (inteiro maior ou igual a 1), `category`, `tags` (lista, possivelmente vazia), `featured` (booleano) e `status` (`published` ou `draft`).

Os blocos de `content` SHALL ser de tipos declarados e finitos — no mínimo parágrafo, subtítulo, lista, citação e imagem — de modo que a renderização não dependa de HTML livre vindo da fonte.

#### Scenario: Post entregue com o modelo completo

- **WHEN** a fonte de conteúdo entrega um post para qualquer página do blog
- **THEN** todos os campos do modelo estão presentes e `content` traz apenas blocos de tipos declarados

#### Scenario: Bloco de tipo desconhecido

- **WHEN** um post traz um bloco de `content` com tipo não declarado
- **THEN** esse bloco é ignorado na renderização e o restante do post é exibido normalmente, sem quebrar a página

### Requirement: Slug único e estável

Cada post SHALL ter um `slug` único, em minúsculas, sem acentos e sem espaços, usado como identificador na URL pública do post.

#### Scenario: Slug duplicado na fonte

- **WHEN** a fonte de conteúdo contém dois posts com o mesmo `slug`
- **THEN** a construção do site falha com erro explícito identificando o slug duplicado, em vez de gerar rotas ambíguas

### Requirement: Apenas posts publicados são expostos

A fonte de conteúdo SHALL expor publicamente somente posts com `status` igual a `published`. Posts com `status` `draft` NÃO SHALL aparecer em listagens, em relacionados, em rotas de post ou no sitemap.

#### Scenario: Rascunho existe na fonte

- **WHEN** a fonte contém um post com `status` `draft`
- **THEN** esse post não aparece em nenhuma listagem e sua URL não é gerada

### Requirement: Ordenação por data de publicação

As listagens SHALL ordenar os posts publicados por `publishedAt`, do mais recente para o mais antigo. Quando dois posts tiverem a mesma data, a ordenação SHALL ser determinística (desempate por `slug`), para que a paginação não mude entre construções.

#### Scenario: Duas construções seguidas do mesmo conteúdo

- **WHEN** o site é construído duas vezes sem alteração no conteúdo
- **THEN** a ordem dos posts e a composição de cada página de listagem são idênticas nas duas construções

### Requirement: Operações de leitura do contrato

A fonte de conteúdo SHALL oferecer, como único ponto de acesso ao conteúdo do blog: listar uma página de posts (recebendo o número da página), obter um post por `slug`, obter o post em destaque, obter os posts relacionados a um `slug` e listar todos os slugs publicados.

O contrato SHALL ser independente da origem dos dados, para que a substituição da fonte mock pela API não exija alteração nas páginas que a consomem.

#### Scenario: Troca da fonte mock pela API

- **WHEN** a implementação da fonte de conteúdo passa de dados mock para a API do blog
- **THEN** as páginas do blog continuam funcionando sem alteração nas suas chamadas ao contrato

#### Scenario: Post inexistente

- **WHEN** é solicitado um post por um `slug` que não existe ou não está publicado
- **THEN** a operação indica ausência de resultado, sem lançar erro de execução

### Requirement: Conteúdo mock representativo

Enquanto a API não existir, a fonte mock SHALL conter no mínimo posts suficientes para preencher mais de uma página de listagem, com pelo menos um post em destaque, categorias distintas e ao menos um post exercitando todos os tipos de bloco de conteúdo.

#### Scenario: Validação visual da paginação

- **WHEN** o blog é aberto com a fonte mock
- **THEN** existe mais de uma página de listagem navegável e a interface pode ser avaliada em estado realista
