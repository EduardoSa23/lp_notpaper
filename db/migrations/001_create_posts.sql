-- Tabela dos posts publicados do blog.
--
-- Duas identidades, e elas nao se confundem:
--   id_externo  = Publicacao.Id do modulo de marketing. Chave de idempotencia
--                 da ingestao: e por ela que uma reentrega reconhece o post.
--   slug        = identidade publica, gerada por este lado a partir do titulo.
--                 Sobrevive a reentrega, porque a URL de um post publicado nao
--                 muda quando o texto e corrigido.
--
-- `json` e tipo nativo do SQL Server 2025. Em versao anterior isto seria
-- nvarchar(max) com CHECK (ISJSON(col) = 1).
--
-- A capa vem na entrega e mora aqui: bytes, formato real e texto alternativo.
-- Em disco ela sobreviveria mal - `public/` e substituido a cada implantacao.

CREATE TABLE dbo.posts (
    id                bigint            IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_posts PRIMARY KEY,

    id_externo        uniqueidentifier  NOT NULL,
    slug              nvarchar(200)     NOT NULL,

    title             nvarchar(300)     NOT NULL,
    excerpt           nvarchar(1000)    NOT NULL,
    content           json              NOT NULL,
    author            json              NOT NULL,

    cover_bytes       varbinary(max)    NOT NULL,
    cover_format      varchar(10)       NOT NULL
        CONSTRAINT CK_posts_cover_format CHECK (cover_format IN ('webp', 'png', 'jpeg')),
    cover_alt         nvarchar(500)     NOT NULL,

    published_at      datetimeoffset    NOT NULL,
    reading_minutes   int               NOT NULL
        CONSTRAINT CK_posts_reading_minutes CHECK (reading_minutes >= 1),

    category          nvarchar(100)     NOT NULL,
    tags              json              NOT NULL
        CONSTRAINT DF_posts_tags DEFAULT (N'[]'),
    featured          bit               NOT NULL
        CONSTRAINT DF_posts_featured DEFAULT (0),
    status            varchar(20)       NOT NULL
        CONSTRAINT CK_posts_status CHECK (status IN ('published', 'draft')),

    created_at        datetimeoffset    NOT NULL
        CONSTRAINT DF_posts_created_at DEFAULT (SYSDATETIMEOFFSET()),
    updated_at        datetimeoffset    NOT NULL
        CONSTRAINT DF_posts_updated_at DEFAULT (SYSDATETIMEOFFSET()),

    -- As duas unicidades que a aplicacao NAO pode garantir sozinha: e o que faz
    -- duas ingestoes simultaneas do mesmo id_externo nao virarem dois posts.
    CONSTRAINT UQ_posts_id_externo UNIQUE (id_externo),
    CONSTRAINT UQ_posts_slug       UNIQUE (slug)
);
GO

-- Cobre a ordenacao determinista de toda listagem, incluindo o desempate por
-- slug quando duas datas coincidem.
CREATE INDEX IX_posts_listagem
    ON dbo.posts (status, published_at DESC, slug);
GO
