import Image from "next/image";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { buildHeadingIdMap } from "@/lib/blog/headings";
import { isValidBlock } from "@/lib/blog/model";
import { isRun, isSafeHref, normalizeRuns } from "@/lib/blog/rich-text";

/**
 * Texto de bloco: uma lista de trechos, em que o trecho com `href` e um link.
 *
 * Um endereco que nao passa por `isSafeHref` renderiza como TEXTO, nao
 * desaparece: o leitor perde o link, nao a frase. A ingestao ja recusa endereco
 * inseguro (`ingest-mapping.js`); esta guarda cobre o que ja estiver gravado.
 */
function RichText({ value }) {
  return normalizeRuns(value).map((run, index) => {
    if (!isRun(run)) return null;

    if (!isSafeHref(run.href)) return run.text;

    return (
      <a
        key={index}
        href={run.href}
        target="_blank"
        // noreferrer junto com noopener: o destino e uma fonte externa citada
        // pelo texto, nao um parceiro nosso.
        rel="noopener noreferrer nofollow"
        className="font-medium text-[#0043FE] underline decoration-[#0043FE]/40 underline-offset-2 transition-colors hover:decoration-[#0043FE]"
      >
        {run.text}
      </a>
    );
  });
}

function Block({ block, headingId }) {
  switch (block.type) {
    case "paragraph":
      return <p className="mb-6 text-lg leading-relaxed text-gray-700"><RichText value={block.text} /></p>;

    case "heading":
      return (
        // scroll-margin evita o header fixo cobrir o titulo ao vir do sumario.
        <h2 id={headingId} className="section-anchor mb-4 mt-12 text-2xl font-bold text-gray-900">
          <RichText value={block.text} />
        </h2>
      );

    case "list": {
      const items = Array.isArray(block.items) ? block.items : [];
      const ListTag = block.ordered ? "ol" : "ul";

      return (
        <ListTag
          className={`mb-6 space-y-3 pl-6 text-lg leading-relaxed text-gray-700 ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((item, index) => (
            <li key={index} className="pl-1">
              <RichText value={item} />
            </li>
          ))}
        </ListTag>
      );
    }

    case "quote":
      return (
        <blockquote className="mb-6 border-l-4 border-[#0043FE] bg-white px-6 py-5 shadow-sm">
          <p className="text-lg italic leading-relaxed text-gray-800"><RichText value={block.text} /></p>
          {block.cite ? <footer className="mt-3 text-sm font-medium text-gray-500">— {block.cite}</footer> : null}
        </blockquote>
      );

    case "image":
      return (
        <figure className="mb-8">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={block.src}
              alt={block.alt}
              width={1200}
              height={600}
              sizes="(max-width: 1024px) 100vw, 768px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="h-auto w-full object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center text-sm text-gray-500">{block.caption}</figcaption>
          ) : null}
        </figure>
      );

    default:
      return null;
  }
}

export default function PostBody({ content }) {
  const blocks = Array.isArray(content) ? content : [];
  const headingIds = buildHeadingIdMap(blocks);

  return (
    <div className="max-w-3xl">
      {/* Bloco de tipo desconhecido e ignorado: conteudo gerado automaticamente
          nao pode derrubar a pagina nem injetar markup. */}
      {blocks.map((block, index) =>
        isValidBlock(block) ? <Block key={index} block={block} headingId={headingIds.get(index)} /> : null
      )}
    </div>
  );
}
