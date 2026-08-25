import { absoluteUrl, blogPostUrl, SITE_URL } from "@/lib/blog/urls";

export default function ArticleStructuredData({ post }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage.src),
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "notPaper",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/image/Logo_notpaper.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogPostUrl(post.slug),
    },
    articleSection: post.category,
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
