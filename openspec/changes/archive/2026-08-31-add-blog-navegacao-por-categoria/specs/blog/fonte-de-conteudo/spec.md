## ADDED Requirements

### Requirement: Leitura por categoria

A fonte de conteúdo SHALL oferecer, no mesmo contrato das leituras existentes: listar uma página de posts de uma categoria (recebendo a categoria e o número da página), obter o total de páginas de uma categoria e obter a contagem de posts publicados por categoria.

Essas leituras SHALL aplicar as mesmas regras de exposição e ordenação das demais — apenas posts publicados, do mais recente para o mais antigo, com desempate determinístico — para que a paginação de uma categoria não mude entre consultas.

A listagem por categoria SHALL incluir o post em destaque quando ele pertencer à categoria consultada, diferindo nisso da listagem geral paginada.

A contagem por categoria SHALL ser obtida em uma única consulta, não em uma por categoria.

#### Scenario: Pagina de uma categoria

- **WHEN** é solicitada uma página de posts de uma categoria
- **THEN** vêm apenas posts publicados daquela categoria, do mais recente para o mais antigo, na quantidade fixa por página

#### Scenario: Rascunho na categoria

- **WHEN** existe um post com situação de rascunho na categoria consultada
- **THEN** ele não aparece na listagem daquela categoria nem é contado no total dela

#### Scenario: Destaque pertence a categoria consultada

- **WHEN** o post em destaque do blog pertence à categoria consultada
- **THEN** ele consta da listagem e da contagem daquela categoria

#### Scenario: Contagem por categoria

- **WHEN** é solicitada a contagem de posts publicados por categoria
- **THEN** vem a contagem de cada categoria que tem ao menos um post publicado, em uma única consulta

#### Scenario: Categoria fora das reconhecidas

- **WHEN** é solicitada uma página de posts de uma categoria que não é reconhecida pelo blog
- **THEN** a operação indica ausência de resultado, sem lançar erro de execução
