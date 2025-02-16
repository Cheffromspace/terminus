import Link from 'next/link';
import { getFeaturedStaticPosts } from '@/utils/server-posts';

export default async function NotFound() {
  const featuredPosts = await getFeaturedStaticPosts();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          Return to Home
        </Link>

        {featuredPosts.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-12 mb-4">
              Featured Posts You Might Like
            </h2>
            <div className="space-y-6">
              {featuredPosts.map((post) => (
                <div key={post.slug} className="border-b pb-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.title}
                  </Link>
                  {post.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {post.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
