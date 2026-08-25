import PostCard from "@/components/sections/blog/post-card";

export default function RelatedPosts({ posts }) {
  // Blog com um unico post publicado nao mostra a secao.
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="border-t border-gray-200 pt-12">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Leia também</h2>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
