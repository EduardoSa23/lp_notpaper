## Purpose

Define o que o armazenamento dos posts do blog garante — que um post publicado não se perde, que duas entregas simultâneas da mesma publicação de origem não geram duplicata, que a URL pública de um post é estável, e que o banco pode ser recriado do zero de forma reproduzível.

## ADDED Requirements

### Requirement: Consultas atendem o contrato de leitura

O armazenamento SHALL responder a todas as operações de `blog/fonte-de-conteudo` — página de posts, post por slug, post em destaque, relacionados de um slug e lista de slugs publicados — aplicando as regras de exposição e ordenação daquele contrato na própria consulta.

As regras SHALL valer no armazenamento e não em filtragem posterior em memória, para que o custo não cresça com o volume de posts.

#### Scenario: Listagem de uma pagina

- **WHEN** uma página de listagem é consultada
- **THEN** a consulta devolve apenas os posts daquela página, já ordenados, sem carregar os demais

#### Scenario: Rascunho na base

- **WHEN** existem posts em rascunho armazenados
- **THEN** nenhuma consulta de leitura os devolve, em nenhuma das operações do contrato

#### Scenario: Ordenacao entre consultas

- **WHEN** a mesma listagem é consultada duas vezes sem alteração nos dados
- **THEN** a ordem e a composição são idênticas, com desempate estável quando duas datas coincidem

### Requirement: Definicao unica de post em destaque

A regra do post em destaque — o marcado como destaque, ou o publicado mais recente quando nenhum estiver marcado — SHALL existir em um único lugar, usado tanto para obter o destaque quanto para excluí-lo da listagem paginada.

NÃO SHALL haver duas expressões independentes dessa regra, que possam divergir e fazer o destaque aparecer duplicado ou desaparecer do índice.

Marcar um post como destaque SHALL torná-lo o destaque, independentemente da data dele em relação aos demais. O armazenamento SHALL garantir isso desmarcando os outros no mesmo momento em que marca um, dentro da mesma transação.

Medido no acervo real: a regra ordena por marcação e depois por data, então com dois posts marcados vence o mais recente. Sem a garantia acima, marcar um post antigo gravaria a marcação e não mudaria nada na página — o revisor veria o painel confirmar uma escolha que o blog ignora, que é a divergência silenciosa que a regra única existe para evitar. A alternativa seria fazer quem entrega gerir a exclusividade, o que exigiria dele conhecer o acervo do site.

#### Scenario: Post antigo marcado como destaque

- **WHEN** um post publicado há mais tempo é marcado como destaque, havendo um post mais recente marcado
- **THEN** o post recém-marcado é o destaque exibido, e o anterior deixa de estar marcado

#### Scenario: Marcacao e desmarcacao na mesma operacao

- **WHEN** a marcação de um post como destaque é aplicada
- **THEN** a desmarcação dos demais acontece na mesma transação, sem instante intermediário em que dois estejam marcados ou nenhum esteja

#### Scenario: Nenhum post marcado como destaque

- **WHEN** nenhum post publicado está marcado como destaque
- **THEN** o mais recente é tratado como destaque, e é ele que a listagem paginada exclui

#### Scenario: Destaque marcado

- **WHEN** um post está marcado como destaque
- **THEN** ele é devolvido como destaque e não aparece na listagem paginada

### Requirement: Posts sobrevivem ao reinicio

Um post persistido com sucesso SHALL continuar disponível após reinício da aplicação, sem depender de estado em memória do processo.

#### Scenario: Aplicacao reiniciada

- **WHEN** a aplicação é reiniciada depois de uma ingestão bem-sucedida
- **THEN** o post continua sendo devolvido pelas consultas de leitura, com o mesmo conteúdo

### Requirement: Unicidade garantida no armazenamento

O armazenamento SHALL garantir, por si, que existe no máximo um post por identificador externo e no máximo um post por `slug` — e não apenas pela validação da aplicação.

O identificador externo é a chave de idempotência da ingestão: é por ele que uma reentrega reconhece o post que já existe. Duas ingestões concorrentes do mesmo identificador NÃO SHALL resultar em dois posts.

#### Scenario: Duas ingestoes simultaneas do mesmo identificador

- **WHEN** duas requisições de ingestão com o mesmo identificador externo chegam ao mesmo tempo
- **THEN** existe um único post ao fim das duas, e nenhuma delas deixa a base inconsistente

#### Scenario: Tentativa de repetir identificador externo

- **WHEN** uma escrita tenta criar um segundo post com identificador externo já existente
- **THEN** o armazenamento rejeita a operação, e a aplicação substitui o post existente em vez de duplicar

#### Scenario: Tentativa de repetir slug

- **WHEN** uma escrita tenta criar um segundo post com `slug` já existente
- **THEN** o armazenamento rejeita a operação, protegendo a unicidade da URL pública

### Requirement: Slug gerado pelo site

O `slug` de um post SHALL ser gerado pelo site a partir do título recebido, respeitando o formato que as rotas do blog exigem, e NÃO SHALL vir da ingestão.

Quando o slug derivado do título já pertencer a outro post, o site SHALL produzir um slug distinto, em vez de falhar ou sobrescrever o post alheio.

O slug de um post SHALL permanecer o mesmo em reentregas do mesmo identificador externo, inclusive quando o título mudar — a URL pública de um post publicado não muda por causa de uma correção de texto.

#### Scenario: Primeiro post com um titulo

- **WHEN** um post é ingerido e o slug derivado do seu título está livre
- **THEN** o post recebe aquele slug, e sua URL pública o usa

#### Scenario: Titulo que colide com post existente

- **WHEN** o slug derivado do título já pertence a outro post
- **THEN** o novo post recebe um slug distinto, e o post existente não é alterado

#### Scenario: Titulo corrigido em reentrega

- **WHEN** um post publicado é reentregue com o título alterado
- **THEN** o slug e a URL pública permanecem os mesmos, e o título exibido é o novo

#### Scenario: Titulo que produz slug reservado

- **WHEN** o slug derivado do título coincide com um segmento reservado pelas rotas do blog
- **THEN** o site produz um slug distinto, sem sequestrar a rota

### Requirement: Campos de identidade preenchidos pelo site

O site SHALL preencher os campos que são identidade do post no blog e que a ingestão não traz: autor, situação de publicação e data de publicação. A indicação de destaque NÃO está entre eles: ela vem na entrega, conforme `blog/ingestao-de-post`.

O autor SHALL ser a voz institucional do blog, e NÃO SHALL identificar a pessoa que aprovou o conteúdo no módulo de origem.

A data de publicação de um post SHALL ser definida na primeira entrada dele e NÃO SHALL avançar em reentregas — uma correção de texto não torna o post mais recente do que os publicados depois dele.

#### Scenario: Post recem-ingerido

- **WHEN** um post entra pela ingestão
- **THEN** ele aparece publicado, com autor institucional e a data daquele momento

#### Scenario: Post corrigido dias depois

- **WHEN** um post publicado é reentregue com correção dias depois
- **THEN** sua data de publicação segue a original, e ele não salta para o topo da listagem

#### Scenario: Identidade de quem aprovou

- **WHEN** um post publicado é exibido
- **THEN** o autor mostrado é institucional, sem revelar quem aprovou no módulo de origem

### Requirement: Imagem da capa guardada com o post

O armazenamento SHALL guardar a imagem de capa recebida junto do post, com o formato dela e o texto alternativo, de modo que servir a capa não dependa de recurso externo ao banco.

A imagem SHALL sobreviver a nova implantação do site: NÃO SHALL depender de arquivo dentro do pacote de build, que é substituído a cada implantação.

Substituir um post SHALL substituir a capa dele, sem deixar a imagem anterior ocupando espaço nem sendo servida.

#### Scenario: Site reimplantado

- **WHEN** o site é construído e implantado de novo
- **THEN** as capas dos posts publicados continuam sendo servidas, sem reentrega

#### Scenario: Capa regerada

- **WHEN** um post é reentregue com capa nova
- **THEN** a capa servida é a nova, e a anterior não permanece armazenada

### Requirement: Banco recriavel de forma reproduzivel

O esquema SHALL ser criado por migrações versionadas, aplicáveis em ordem sobre um banco vazio, resultando sempre na mesma estrutura.

Aplicar as migrações duas vezes NÃO SHALL causar erro nem alterar a estrutura resultante.

#### Scenario: Ambiente novo

- **WHEN** as migrações são aplicadas sobre um banco vazio
- **THEN** o esquema fica pronto para receber ingestões, sem passo manual

#### Scenario: Migracoes aplicadas de novo

- **WHEN** as migrações são executadas sobre um banco que já está atualizado
- **THEN** nada muda e nenhum erro é reportado

### Requirement: Registro de quando o post mudou

Cada post armazenado SHALL registrar quando foi criado e quando foi atualizado pela última vez, de forma distinta da sua data de publicação.

Esses registros SHALL permitir diagnosticar quando um post entrou ou foi corrigido, sem depender de log da aplicação.

#### Scenario: Post corrigido pela automacao

- **WHEN** um post publicado é reenviado com conteúdo corrigido
- **THEN** a data de atualização muda, a de criação permanece, e a data de publicação segue a da primeira entrada

### Requirement: Configuracao por ambiente

A conexão com o banco e o token de ingestão SHALL vir de configuração do ambiente. A aplicação NÃO SHALL iniciar nem construir com configuração obrigatória ausente, falhando de forma explícita sobre o que falta.

Credencial NÃO SHALL constar do repositório.

#### Scenario: Configuracao obrigatoria ausente

- **WHEN** a aplicação sobe ou é construída sem a configuração de banco ou sem o token de ingestão
- **THEN** falha informando qual configuração falta, em vez de seguir e falhar na primeira requisição

### Requirement: Conexoes reaproveitadas

O acesso ao banco SHALL reaproveitar conexões entre requisições, em vez de abrir uma conexão por consulta.

A renderização de uma página que faz várias consultas NÃO SHALL abrir várias conexões novas.

#### Scenario: Pagina com multiplas consultas

- **WHEN** uma página do blog consulta destaque, listagem e total de páginas
- **THEN** as consultas compartilham o mesmo pool de conexões, sem esgotar o limite do banco
