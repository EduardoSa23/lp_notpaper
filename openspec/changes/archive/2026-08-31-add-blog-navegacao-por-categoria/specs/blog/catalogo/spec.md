## ADDED Requirements

### Requirement: Navegacao por categoria

O site SHALL expor uma listagem pública por categoria do blog, em URL própria e estável, apresentando os posts publicados daquela categoria em ordem cronológica decrescente, com os mesmos cards da grade do índice.

A listagem por categoria SHALL ser paginada com o mesmo número de posts por página da listagem geral. A primeira página SHALL ser servida na URL da categoria; as demais SHALL ter URL própria e estável, no mesmo padrão da paginação do índice.

A listagem por categoria NÃO SHALL excluir o post em destaque. O destaque é excluído da grade do índice porque aparece no topo daquela mesma página; a listagem de categoria não tem essa posição, e omiti-lo esconderia da categoria justamente o post mais promovido dela.

O rótulo de categoria exibido no card, no post em destaque e no cabeçalho do post SHALL levar à listagem daquela categoria.

O site SHALL oferecer, no índice e nas listagens de categoria, uma navegação entre as categorias que indique qual está ativa e informe quantos posts publicados cada uma tem. Essa navegação SHALL oferecer apenas categorias com ao menos um post publicado, e SHALL oferecer o caminho de volta à listagem geral.

#### Scenario: Visitante abre uma categoria

- **WHEN** um visitante acessa a URL de uma categoria que tem posts publicados
- **THEN** vê os posts daquela categoria em ordem cronológica decrescente, com os mesmos cards da grade do índice

#### Scenario: Categoria acionada pelo rotulo do card

- **WHEN** o visitante aciona o rótulo de categoria de um card da grade
- **THEN** é levado à listagem daquela categoria

#### Scenario: Post em destaque na propria categoria

- **WHEN** o post em destaque do blog pertence à categoria consultada
- **THEN** ele aparece na listagem daquela categoria, e não é omitido dela

#### Scenario: Paginacao dentro da categoria

- **WHEN** uma categoria tem mais posts publicados do que cabem em uma página e o visitante avança
- **THEN** chega a uma URL própria daquela categoria, com os posts seguintes e sem repetir os da página anterior

#### Scenario: Primeira pagina da categoria com endereco unico

- **WHEN** o visitante volta da segunda para a primeira página de uma categoria
- **THEN** é levado à URL da categoria, que é o único endereço da primeira página dela

#### Scenario: Categoria inexistente

- **WHEN** alguém abre uma URL de categoria que não corresponde a nenhuma categoria do blog
- **THEN** recebe a página de conteúdo não encontrado do site

#### Scenario: Categoria sem post publicado

- **WHEN** alguém abre a URL de uma categoria do blog que não tem nenhum post publicado
- **THEN** vê a mensagem de ausência de conteúdo daquela categoria, com cabeçalho, rodapé e navegação preservados, e não a página de conteúdo não encontrado

#### Scenario: Navegacao entre categorias

- **WHEN** o visitante está numa listagem de categoria
- **THEN** a navegação de categorias indica qual está ativa, informa a contagem de cada uma e oferece o caminho de volta à listagem geral

#### Scenario: Pagina de categoria inexistente

- **WHEN** alguém abre uma página de listagem de uma categoria além do total de páginas dela
- **THEN** recebe a página de conteúdo não encontrado do site, e não uma listagem vazia

## MODIFIED Requirements

### Requirement: Blog integrado à navegação e ao SEO do site

O blog SHALL estar acessível a partir da navegação principal do site (menu desktop e menu mobile) e SHALL constar no `sitemap.xml`, incluindo a página índice, as páginas de listagem, as listagens por categoria com suas páginas e cada post publicado.

A página índice e cada listagem por categoria SHALL ter título, descrição e URL canônica próprios, no mesmo padrão das demais páginas do site.

#### Scenario: Acesso pelo menu

- **WHEN** o visitante usa o menu principal, no desktop ou no mobile
- **THEN** encontra o link para o blog e chega a `/blog`

#### Scenario: Sitemap consultado

- **WHEN** o `sitemap.xml` é consultado
- **THEN** contém a URL do índice do blog, das páginas de listagem, das listagens por categoria com suas páginas e de cada post publicado, e nenhuma URL de rascunho

#### Scenario: Categoria sem post publicado no sitemap

- **WHEN** uma categoria do blog não tem nenhum post publicado
- **THEN** a URL dela não consta no `sitemap.xml`, pois não há conteúdo a indexar ali
