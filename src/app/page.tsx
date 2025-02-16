import React from "react";
import { getFeaturedStaticPosts } from "@/utils/server-posts";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default async function Home(): Promise<React.ReactElement> {
  const featuredPosts = await getFeaturedStaticPosts();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to My Tech Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Exploring software development, cloud architecture, and DevOps practices
        </p>
        <SearchBar />
      </section>
      
      {/* Featured Articles */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">
          Featured Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block p-6 border rounded-lg hover:border-gray-300 transition-colors"
              data-nav-item
            >
              {post.series && (
                <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded mb-2">
                  Series: {post.series.name}
                </span>
              )}
              <h3 className="text-xl font-medium mb-2">{post.title}</h3>
              <p className="text-gray-600">
                {post.description || post.excerpt}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="text-center">
        <Link
          href="/posts"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          data-nav-item
        >
          Browse All Posts
        </Link>
      </section>
    </div>
  );
}
