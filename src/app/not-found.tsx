import Link from 'next/link';
import { getFeaturedStaticPosts } from '@/utils/server-posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Jonathan Flatt',
  description: 'Sorry, the page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  }
};

export default async function NotFound() {
  const featuredPosts = await getFeaturedStaticPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '404 - Page Not Found',
            description: 'Sorry, the page you are looking for does not exist.',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [{
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://jonathanflatt.dev'
              }, {
                '@type': 'ListItem',
                position: 2,
                name: '404 Not Found'
              }]
            }
          })
        }}
      />
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-[var(--comment)] mb-8">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link
          href="/"
          className="text-[var(--accent)] hover:underline mb-8 inline-block"
        >
          Return to Home
        </Link>

        {featuredPosts.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-12 mb-4" role="heading" aria-level={2}>
              Featured Posts You Might Like
            </h2>
            <div className="space-y-6">
              {featuredPosts.map((post) => (
                <article key={post.slug} className="border-b border-[var(--border)] pb-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-lg font-medium hover:text-[var(--accent)]"
                  >
                    {post.title}
                  </Link>
                  {post.description && (
                    <p className="text-[var(--comment)] mt-2">
                      {post.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
}
