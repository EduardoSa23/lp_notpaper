## Purpose

Define como um post aprovado entra no blog pelo módulo de marketing autônomo — autenticação, o que o payload traz, o que o site preenche, o que ele devolve e o que cada resposta significa para quem entregou — de modo que uma publicação automática nunca deixe o blog com conteúdo quebrado nem faça o módulo retentar em vão.

## ADDED Requirements

### Requirement: Ingestao autenticada por token de cabecalho proprio

A ingestão SHALL exigir o token em um cabeçalho próprio (`X-Ingestao-Token`), e SHALL rejeitar requisição sem token ou com token inválido, sem alterar nada na base.

O token SHALL vir de configuração do ambiente, nunca do código, e a aplicação NÃO SHALL registrar o token em log nem devolvê-lo em corpo de resposta de erro. A resposta de rejeição NÃO SHALL distinguir token ausente de token incorreto.

#### Scenario: Requisicao sem token

- **WHEN** uma requisição de ingestão chega sem o cabeçalho de token
- **THEN** é rejeitada como não autorizada e nenhum post é criado ou alterado

#### Scenario: Token invalido

- **WHEN** o token enviado não corresponde ao configurado
- **THEN** a requisição é rejeitada como não autorizada, com resposta indistinguível da de token ausente

#### Scenario: Erro nao devolve o recebido

- **WHEN** a ingestão responde com erro
- **THEN** o corpo da resposta não contém o token nem os cabeçalhos recebidos

### Requirement: Payload traz conteudo, e so conteudo

A ingestão SHALL aceitar, no corpo da requisição, exatamente seis campos: título, resumo, corpo em blocos de conteúdo, categoria, minutos de leitura e capa. A capa SHALL ser obrigatória, e SHALL trazer a imagem embutida, o formato dela e o texto alternativo — os três.

A ingestão NÃO SHALL exigir nem aceitar como autoridade os campos que são identidade do post no blog — slug, autor, destaque, situação de publicação e data de publicação. Esses são preenchidos pelo site, conforme `blog/persistencia-de-posts`.

Os minutos de leitura SHALL ser usados como recebidos, e NÃO SHALL ser recalculados pelo site — quem tem o texto integral é quem os envia.

#### Scenario: Payload minimo aceito

- **WHEN** o payload traz título, resumo, corpo em blocos, categoria e minutos de leitura
- **THEN** o post é publicado, com o site preenchendo slug, autor, situação e data

#### Scenario: Minutos de leitura respeitados

- **WHEN** o payload informa os minutos de leitura
- **THEN** o post publicado exibe esse valor, sem recálculo pelo site

### Requirement: Vocabulario do payload traduzido na fronteira

Os blocos de conteúdo chegam com os nomes de tipo e de campo do módulo que os produz, que não são os mesmos usados internamente pelo blog. A ingestão SHALL traduzir esse vocabulário na fronteira, e NÃO SHALL propagá-lo para dentro do modelo.

A tradução SHALL cobrir todos os tipos que o módulo produz — parágrafo, subtítulo, citação e lista, esta com seus itens e a indicação de ordenada. Tipo de bloco fora do que o módulo produz SHALL ser recusado.

#### Scenario: Blocos traduzidos

- **WHEN** o payload traz blocos no vocabulário do módulo
- **THEN** eles são armazenados no vocabulário do modelo do blog, e as páginas os renderizam sem conhecer o formato de origem

#### Scenario: Tipo de bloco desconhecido

- **WHEN** o payload traz um bloco de tipo que a tradução não reconhece
- **THEN** a ingestão recusa o conteúdo, em vez de armazenar um bloco que o blog descartaria em silêncio na renderização

#### Scenario: Corpo sem nenhum bloco

- **WHEN** o corpo do post não traz nenhum bloco
- **THEN** a ingestão recusa o conteúdo, pois não há o que renderizar

### Requirement: Ingestao valida o payload contra o modelo

A ingestão SHALL validar o payload e SHALL recusar o que não conformar, respondendo qual campo falhou e por quê.

A validação SHALL cobrir, no mínimo: presença de título, resumo, corpo e categoria; categoria entre as reconhecidas pelo blog; corpo como lista não vazia de blocos traduzíveis; e minutos de leitura como inteiro maior ou igual a 1.

A validação SHALL usar a mesma definição de modelo que a leitura usa, e NÃO SHALL ser uma segunda implementação das mesmas regras.

A ingestão NÃO SHALL corrigir, completar ou adivinhar campo de conteúdo — a única exceção é a capa, tratada adiante. Um payload malformado SHALL falhar de forma visível, em vez de publicar conteúdo degradado.

#### Scenario: Campo obrigatorio ausente

- **WHEN** o payload não traz um campo obrigatório
- **THEN** a ingestão recusa nomeando o campo, e nada é persistido

#### Scenario: Categoria desconhecida

- **WHEN** o payload informa uma categoria que o blog não reconhece
- **THEN** a ingestão recusa a requisição, nomeando a categoria recebida

#### Scenario: Corpo interpretavel mas invalido

- **WHEN** o corpo é interpretável e falha a validação de algum campo
- **THEN** a ingestão recusa o conteúdo, nomeando o campo

### Requirement: Capa recebida na entrega

A capa SHALL vir na entrega, com a imagem embutida, o formato dela e o texto alternativo. Entrega sem capa, sem formato ou sem texto alternativo SHALL ser recusada.

NÃO SHALL existir origem alternativa de capa: o site não compõe nem substitui capa a partir da categoria nem de qualquer outro dado. Quem entrega já barra post de blog sem imagem antes de fazer a requisição, e um segundo caminho de capa aqui seria exercitado só quando o primeiro falhasse — exatamente a condição em que ele apodrece sem ninguém notar.

O formato SHALL ser interpretado como um token de tipo de imagem, entre os reconhecidos pelo site, e NÃO SHALL ser tratado como tipo de mídia completo.

#### Scenario: Entrega com capa completa

- **WHEN** a entrega traz imagem, formato e texto alternativo
- **THEN** o post é publicado com aquela capa, e ela é servida pelo site

#### Scenario: Entrega sem capa

- **WHEN** a entrega não traz capa
- **THEN** a ingestão recusa o conteúdo, nomeando a capa como o que falta

#### Scenario: Capa sem texto alternativo

- **WHEN** a capa vem sem texto alternativo
- **THEN** a ingestão recusa, pois o modelo do blog exige texto alternativo para toda imagem

#### Scenario: Formato nao reconhecido

- **WHEN** o formato declarado não está entre os reconhecidos pelo site
- **THEN** a ingestão recusa o conteúdo, sem gravar a imagem

### Requirement: Imagem recebida e verificada antes de ser servida

A imagem recebida SHALL ser verificada contra o formato declarado, examinando o próprio conteúdo dela, antes de ser aceita.

O site SHALL servir a imagem com um tipo de mídia derivado da sua própria lista de formatos reconhecidos, e NÃO SHALL derivar o tipo de mídia do texto recebido na entrega. O site SHALL instruir o navegador a não inferir o tipo por conta.

A razão é que estes bytes chegam pela rede e são servidos a visitantes: repassar um tipo de mídia declarado por terceiro permitiria servir conteúdo ativo sob o domínio do site.

#### Scenario: Formato declarado nao corresponde ao conteudo

- **WHEN** o formato declarado não corresponde ao conteúdo real da imagem
- **THEN** a ingestão recusa o conteúdo, sem gravar

#### Scenario: Imagem servida ao visitante

- **WHEN** um visitante carrega a capa de um post
- **THEN** ela é servida com tipo de mídia da lista do site e com a instrução de não inferir tipo

#### Scenario: Capa regerada nao vem do cache

- **WHEN** a capa de um post publicado é substituída por uma nova
- **THEN** o endereço da capa muda, e nenhum leitor recebe a imagem anterior de cache

#### Scenario: Conteudo que nao e imagem

- **WHEN** a entrega traz, no lugar da imagem, conteúdo que não é de um formato de imagem reconhecido
- **THEN** a ingestão recusa, e nada é gravado nem servido

### Requirement: Cria ou substitui pelo identificador externo

A ingestão SHALL usar o identificador que vem no endereço da requisição como identidade da publicação de origem: se ainda não houver post para ele, cria; se houver, substitui integralmente o conteúdo daquele post.

Enviar o mesmo payload mais de uma vez SHALL deixar a base no mesmo estado que uma única vez, e NÃO SHALL criar um segundo post. Este é o comportamento do qual depende a retentativa de quem entrega.

A substituição NÃO SHALL deixar campos da versão anterior misturados com a nova.

#### Scenario: Mesma entrega repetida

- **WHEN** a mesma entrega chega duas vezes para o mesmo identificador
- **THEN** existe um único post, e o resultado é idêntico ao de uma única entrega

#### Scenario: Correcao de um post publicado

- **WHEN** o mesmo identificador é reentregue com texto corrigido
- **THEN** o post passa a ter o novo conteúdo por completo, sem resquício da versão anterior

#### Scenario: Reentrega com capa nova

- **WHEN** a mesma publicação é reentregue com capa regerada
- **THEN** o post passa a exibir a capa nova, e a anterior deixa de ser servida

### Requirement: Resposta devolve o endereco publico do post

Uma ingestão bem-sucedida SHALL responder com o endereço público do post no site.

O endereço SHALL ser gerado pelo site, que é quem conhece o próprio acervo e a forma das suas URLs. A resposta de sucesso NÃO SHALL omitir o endereço: quem entrega precisa dele para registrar onde o conteúdo foi publicado, e sucesso sem endereço é tratado por quem entrega como falha.

#### Scenario: Publicacao bem-sucedida

- **WHEN** um post é ingerido com sucesso
- **THEN** a resposta traz o endereço público daquele post, e abrir esse endereço mostra o post

#### Scenario: Reentrega do mesmo identificador

- **WHEN** o mesmo identificador é reentregue depois de uma correção
- **THEN** a resposta traz o mesmo endereço da primeira entrega, pois o endereço do post não muda

### Requirement: Entrega sem tamanho declarado e aceita

A ingestão SHALL aceitar requisição cujo corpo chegue sem o tamanho declarado de antemão, lendo-o do fluxo. NÃO SHALL exigir cabeçalho de tamanho para processar a entrega, nem usá-lo como única base para limitar o tamanho aceito.

Quem entrega serializa o corpo em fluxo e não declara o tamanho. Um receptor que dependesse desse cabeçalho leria corpo vazio e gravaria um post sem título.

#### Scenario: Entrega sem tamanho declarado

- **WHEN** a entrega chega sem o cabeçalho de tamanho do corpo
- **THEN** o corpo é lido integralmente e o post é publicado normalmente

#### Scenario: Limite de tamanho aplicado

- **WHEN** uma entrega excede o tamanho aceito
- **THEN** o limite é aplicado sobre o que foi efetivamente lido, e não sobre um cabeçalho que pode não existir

### Requirement: Corpo ilegivel e tratado como falha de transporte

Corpo vazio, truncado ou que não chega a ser interpretável SHALL ser respondido como indisponibilidade, e NÃO como recusa de conteúdo.

A razão é a assimetria do prejuízo: quem entrega não repete o que foi recusado por conteúdo. Diagnosticar uma perda de transporte como conteúdo ruim faria o post ser abandonado até alguém editar e aprovar de novo, sem nada indicando que o texto estava bom. Diagnosticar conteúdo ruim como transporte, no pior caso, gasta as tentativas do outro lado e para de forma visível.

#### Scenario: Corpo vazio

- **WHEN** a entrega chega com corpo vazio
- **THEN** a ingestão responde indisponibilidade, e quem entrega retenta

#### Scenario: Corpo truncado

- **WHEN** a entrega chega com o corpo interrompido no meio
- **THEN** a ingestão responde indisponibilidade, sem gravar post parcial nem post sem título

### Requirement: Significado dos codigos de resposta

As respostas da ingestão SHALL distinguir três desfechos, porque quem entrega age de forma diferente em cada um:

- credencial não reconhecida, que nenhuma retentativa resolve;
- conteúdo recusado, que só muda se o conteúdo mudar, e portanto também não deve ser retentado;
- indisponibilidade do site, que deve ser retentada.

Falha de validação de campo, categoria desconhecida, corpo sem bloco, bloco de tipo não traduzível, capa ausente e capa que não confere com o formato declarado SHALL ser respondidos como conteúdo recusado. Falha de banco, corpo ilegível, indisponibilidade e erro inesperado SHALL ser respondidos como indisponibilidade.

A ingestão NÃO SHALL responder indisponibilidade para problema de conteúdo, nem recusa de conteúdo para falha de infraestrutura — o primeiro faria quem entrega retentar indefinidamente algo que nunca vai passar, e o segundo faria desistir de uma falha passageira.

#### Scenario: Conteudo invalido

- **WHEN** o payload é recusado por validação
- **THEN** a resposta indica recusa de conteúdo, e quem entrega não retenta

#### Scenario: Banco indisponivel

- **WHEN** a ingestão não consegue gravar por indisponibilidade do banco
- **THEN** a resposta indica indisponibilidade, e quem entrega retenta depois

#### Scenario: Erro inesperado

- **WHEN** ocorre um erro não previsto durante a ingestão
- **THEN** a resposta indica indisponibilidade, sem expor detalhe interno, e o ocorrido é registrado

### Requirement: Paginas atualizadas apos a ingestao

Depois de persistir um post com sucesso, a ingestão SHALL revalidar as páginas afetadas no mesmo processo, de modo que o conteúdo novo apareça sem novo deploy e sem depender de chamada de rede.

A revalidação SHALL alcançar o índice, as páginas de listagem, a página do post e o sitemap, e SHALL acontecer antes de a resposta de sucesso ser devolvida — quem entrega considera o post publicado a partir dela.

#### Scenario: Publicacao bem-sucedida

- **WHEN** um post é ingerido com sucesso
- **THEN** o endereço devolvido já mostra o post, sem espera por revalidação posterior

#### Scenario: Correcao de post existente

- **WHEN** um post já publicado é corrigido pela ingestão
- **THEN** a página daquele post passa a mostrar o conteúdo corrigido

### Requirement: Publicacao e tudo ou nada

Uma ingestão SHALL deixar o post inteiro publicado ou não deixar rastro dela. NÃO SHALL existir estado intermediário em que o post exista parcialmente gravado, nem em que o texto entre e a capa não.

Falha ao persistir SHALL responder indisponibilidade e NÃO SHALL revalidar página nenhuma.

#### Scenario: Falha no meio da escrita

- **WHEN** a persistência falha durante a ingestão
- **THEN** nenhum post parcial permanece na base e a resposta informa a falha

#### Scenario: Falha ao persistir nao revalida

- **WHEN** a ingestão falha ao gravar
- **THEN** nenhuma página é revalidada, e o blog continua servindo o conteúdo anterior
