import PostCard from "@/components/sections/blog/post-card";

export default function PostGrid({ posts, heading }) {
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <section className="pb-16">
      <div className="container mx-auto px-4">
        {heading ? <h2 className="mb-8 text-2xl font-bold text-gray-900">{heading}</h2> : null}

        {hasPosts ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <p className="text-lg font-semibold text-gray-900">Nenhum conteúdo publicado por aqui ainda.</p>
            <p className="mt-2 text-gray-600">
              Estamos preparando os primeiros artigos. Volte em breve para acompanhar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
