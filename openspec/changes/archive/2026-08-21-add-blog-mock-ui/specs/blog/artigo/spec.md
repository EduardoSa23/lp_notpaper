## Purpose

Define o comportamento da página de leitura de um post do blog — como o conteúdo é apresentado, compartilhado e encontrado por buscadores — que é a página onde o visitante efetivamente consome o material produzido pelo marketing.

## ADDED Requirements

### Requirement: Página de leitura do post

O site SHALL expor uma rota pública por post publicado, identificada pelo `slug` (`/blog/<slug>`), exibindo capa, categoria, título, resumo, nome e cargo do autor, data de publicação, tempo de leitura, tags e o corpo do post renderizado a partir dos seus blocos de conteúdo.

O cabeçalho e o corpo do post SHALL ocupar a mesma coluna, alinhados à esquerda, com a medida do texto limitada para leitura confortável.

#### Scenario: Visitante lê um post

- **WHEN** um visitante acessa a URL de um post publicado
- **THEN** vê capa, categoria, título, autor com cargo, data, tempo de leitura, tags e o corpo completo do post

#### Scenario: Corpo renderizado por tipo de bloco

- **WHEN** o post contém parágrafos, subtítulos, listas, citações e imagens
- **THEN** cada tipo de bloco é apresentado com sua formatação própria, na ordem definida no conteúdo

### Requirement: Trilha lateral de apoio à leitura

Em telas largas, a página do post SHALL apresentar, à direita do conteúdo, uma trilha de apoio que acompanha o scroll e reúne o sumário, as ações de compartilhamento e uma chamada para contato.

A trilha SHALL começar alinhada ao topo do artigo — ao lado do título, e não abaixo da capa — e SHALL acompanhar o scroll até o fim do corpo do post, sem avançar sobre os posts relacionados.

Em telas estreitas a trilha NÃO SHALL existir como coluna: seus blocos SHALL aparecer no fluxo vertical da página, cada um na posição definida pelo seu próprio requisito.

A trilha NÃO SHALL cobrir o conteúdo do post nem o cabeçalho fixo do site em nenhuma largura de tela.

#### Scenario: Leitura em tela larga

- **WHEN** o leitor abre um post em uma tela larga
- **THEN** o conteúdo ocupa a coluna principal e a trilha aparece à direita, permanecendo visível enquanto ele desce a página

#### Scenario: Leitura em tela estreita

- **WHEN** o leitor abre o mesmo post em uma tela estreita
- **THEN** não existe coluna lateral e os blocos aparecem no fluxo da página, sem sobrepor o conteúdo

#### Scenario: Fim do artigo alcancado

- **WHEN** o leitor chega ao fim do corpo do post em tela larga
- **THEN** a trilha para de acompanhar o scroll ali, e os posts relacionados aparecem abaixo sem nada sobreposto

### Requirement: Sumário do post

A página do post SHALL apresentar um sumário construído a partir dos subtítulos do conteúdo, e acionar um item do sumário SHALL levar o leitor à seção correspondente na página.

O sumário SHALL indicar qual seção está sendo lida, atualizando essa indicação conforme o leitor percorre o conteúdo.

Em telas largas o sumário SHALL ocupar o topo da trilha lateral; em telas estreitas SHALL aparecer antes do corpo do post.

#### Scenario: Navegação pelo sumário

- **WHEN** o leitor aciona um item do sumário
- **THEN** a página é posicionada na seção correspondente àquele subtítulo

#### Scenario: Seção em leitura destacada

- **WHEN** o leitor percorre o conteúdo e uma nova seção entra em leitura
- **THEN** o item correspondente no sumário passa a ser o indicado, e apenas ele

#### Scenario: Post sem subtítulos

- **WHEN** o post não contém nenhum subtítulo
- **THEN** o sumário não é exibido e o restante da página permanece íntegro

### Requirement: Compartilhamento do post

A página do post SHALL oferecer ações de compartilhamento que levem a URL pública canônica do post — incluindo copiar o link e compartilhar em redes — sem depender de scripts de terceiros carregados na página.

Em telas largas as ações SHALL ficar na trilha lateral, disponíveis durante toda a leitura; em telas estreitas SHALL aparecer ao final do corpo do post.

#### Scenario: Copiar o link

- **WHEN** o leitor aciona a ação de copiar o link
- **THEN** a URL canônica do post é copiada e o leitor recebe confirmação visual

#### Scenario: Compartilhar em rede social

- **WHEN** o leitor aciona o compartilhamento em uma rede social
- **THEN** é aberto o destino de compartilhamento daquela rede com a URL canônica do post

#### Scenario: Compartilhar no meio da leitura

- **WHEN** o leitor está no meio de um post longo em tela larga
- **THEN** as ações de compartilhamento continuam ao alcance, sem precisar chegar ao fim do texto

### Requirement: Chamada para contato no post

A página do post SHALL apresentar uma chamada para contato que leve ao canal de atendimento da notPaper no WhatsApp, abrindo em nova aba e sem carregar script de terceiro.

Em telas largas a chamada SHALL ocupar o pé da trilha lateral; em telas estreitas SHALL aparecer após o corpo do post e antes dos posts relacionados.

#### Scenario: Leitor aciona a chamada

- **WHEN** o leitor aciona a chamada para contato
- **THEN** o canal de atendimento no WhatsApp é aberto em nova aba, com a página do post preservada

#### Scenario: Posição em tela estreita

- **WHEN** o leitor termina de ler o post em uma tela estreita
- **THEN** encontra a chamada para contato entre o fim do texto e as sugestões de leitura

### Requirement: Posts relacionados

Ao final do post, ocupando a largura completa abaixo do conteúdo e da trilha lateral, a página SHALL sugerir outros posts publicados, priorizando a mesma categoria e completando com os mais recentes quando não houver relacionados suficientes. O próprio post NÃO SHALL aparecer entre as sugestões.

#### Scenario: Categoria com outros posts

- **WHEN** existem outros posts publicados na mesma categoria
- **THEN** as sugestões priorizam esses posts e não incluem o post atual

#### Scenario: Post único na categoria

- **WHEN** o post é o único publicado na sua categoria
- **THEN** as sugestões são completadas com os posts mais recentes de outras categorias

#### Scenario: Blog com um único post

- **WHEN** não existe nenhum outro post publicado
- **THEN** a seção de relacionados não é exibida

### Requirement: SEO e compartilhamento social por post

Cada página de post SHALL ter título, descrição, URL canônica e imagem de compartilhamento próprios, derivados dos dados do post, além de dados estruturados de artigo com título, autor e data de publicação.

#### Scenario: Link do post compartilhado

- **WHEN** a URL de um post é compartilhada em uma rede ou mensageiro
- **THEN** a prévia exibe o título, a descrição e a imagem de capa daquele post

### Requirement: Slug inexistente

Uma URL de post cujo `slug` não corresponda a nenhum post publicado SHALL resultar na página de conteúdo não encontrado do site, com o cabeçalho e o rodapé preservados e um caminho de volta para `/blog`.

#### Scenario: Endereço de post inválido

- **WHEN** alguém acessa `/blog/<slug>` com um slug que não existe ou está em rascunho
- **THEN** recebe a página de conteúdo não encontrado, com link de retorno para o blog
