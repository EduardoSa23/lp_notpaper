## ADDED Requirements

### Requirement: Fonte de conteudo servida pelo banco

A fonte de conteúdo do blog SHALL ser o banco de dados do próprio projeto, e NÃO SHALL haver conteúdo de post embutido no repositório.

O ponto único de acesso SHALL continuar sendo o mesmo módulo de contrato: nenhuma página, componente ou rota SHALL consultar o banco diretamente.

A leitura NÃO SHALL passar por requisição HTTP ao próprio site: as páginas renderizam no servidor e consultam o banco pela camada de dados, sem chamar endpoint próprio.

#### Scenario: Pagina do blog busca conteudo

- **WHEN** qualquer página do blog precisa de conteúdo
- **THEN** ela chama o módulo de contrato, que consulta o banco, e não conhece consulta nem conexão

#### Scenario: Construcao do site

- **WHEN** o site é construído
- **THEN** as páginas obtêm conteúdo consultando o banco diretamente, sem depender de um servidor do próprio site estar respondendo

#### Scenario: Repositorio sem conteudo de post

- **WHEN** o repositório é inspecionado
- **THEN** não existe arquivo de dados com texto de post; todo conteúdo vem do banco

### Requirement: Definicao unica do modelo

A definição do que é um post válido SHALL existir em um único módulo, usado tanto pela ingestão quanto pela leitura.

NÃO SHALL haver duas implementações das mesmas regras de validação, que possam divergir quando o modelo mudar.

#### Scenario: Campo novo no modelo

- **WHEN** um campo é acrescentado ou tem sua regra alterada no modelo
- **THEN** a mudança vale imediatamente para a ingestão e para a leitura, sem edição em dois lugares

## MODIFIED Requirements

### Requirement: Modelo do post

Todo post exposto pela fonte de conteúdo SHALL conter: `slug`, `title`, `excerpt`, `content` (lista de blocos), `coverImage` (caminho e texto alternativo), `author` (nome e cargo), `publishedAt` (data ISO 8601), `readingMinutes` (inteiro maior ou igual a 1), `category`, `tags` (lista, possivelmente vazia), `featured` (booleano) e `status` (`published` ou `draft`).

Os blocos de `content` SHALL ser de tipos declarados e finitos — no mínimo parágrafo, subtítulo, lista, citação e imagem — de modo que a renderização não dependa de HTML livre vindo da fonte.

A capa SHALL apontar para uma imagem que o site consegue servir, recebida na entrega do post e guardada pelo site. NÃO SHALL existir post exposto sem capa servível, e NÃO SHALL haver capa composta pelo site a partir da categoria ou de outro dado.

#### Scenario: Post entregue com o modelo completo

- **WHEN** a fonte de conteúdo entrega um post para qualquer página do blog
- **THEN** todos os campos do modelo estão presentes e `content` traz apenas blocos de tipos declarados

#### Scenario: Bloco de tipo desconhecido

- **WHEN** um post traz um bloco de `content` com tipo não declarado
- **THEN** esse bloco é ignorado na renderização e o restante do post é exibido normalmente, sem quebrar a página

#### Scenario: Capa de um post automatico

- **WHEN** um post criado pela automação é exibido
- **THEN** sua capa é a que veio na entrega, e a imagem é servida pelo site sem falha de carregamento

### Requirement: Operações de leitura do contrato

A fonte de conteúdo SHALL oferecer, como único ponto de acesso ao conteúdo do blog: listar uma página de posts (recebendo o número da página), obter um post por `slug`, obter o post em destaque, obter os posts relacionados a um `slug` e listar todos os slugs publicados.

O contrato SHALL permanecer independente da origem dos dados: trocar a implementação por trás dele NÃO SHALL exigir alteração nas páginas que o consomem.

#### Scenario: Troca da fonte mock pela API

- **WHEN** a implementação da fonte de conteúdo passa de dados mock para a fonte real de conteúdo
- **THEN** as páginas do blog continuam funcionando sem alteração nas suas chamadas ao contrato

#### Scenario: Post inexistente

- **WHEN** é solicitado um post por um `slug` que não existe ou não está publicado
- **THEN** a operação indica ausência de resultado, sem lançar erro de execução

## REMOVED Requirements

### Requirement: Conteúdo mock representativo

**Reason**: O banco existe e recebe conteúdo pela ingestão, então a fonte mock deixa de ser a origem do conteúdo. O requisito servia para validar a interface antes de haver backend, e essa validação já foi feita.

**Migration**: `data/blog-posts.js` é removido e `lib/blog/content-source.js` passa a consultar o banco pela camada de dados. Os posts que existiam no mock, se ainda fizerem sentido como conteúdo, entram pela ingestão como qualquer outro post.
