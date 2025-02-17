import React from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getFeaturedStaticPosts } from "@/utils/server-posts";

export default async function Home(): Promise<React.ReactElement> {
  const featuredPosts = await getFeaturedStaticPosts();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Hi, I&apos;m Jon Flatt
        </h1>
        <p className="text-xl text-[var(--comment)] mb-8">
          I&apos;m a DevOps engineer crafting bespoke tools and automation solutions.
          I write about DevOps practices, ergonomic design, and AI-assisted development.
        </p>
        <div className="flex gap-4">
          <Link
            href="/posts"
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
            data-nav-item
          >
            Read the Blog
          </Link>
          <a
            href="https://github.com/chefFromSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            data-nav-item
          >
            GitHub Profile
          </a>
        </div>
      </section>

      
      {/* Blog Posts */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Latest Writing</h2>
            <p className="text-[var(--comment)]">
              Writing about DevOps, tooling, and the future of software development.
            </p>
          </div>
          <SearchBar />
        </div>
        <div className="grid gap-6">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block p-6 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
              data-nav-item
            >
              <h3 className="text-xl font-medium mb-2">{post.title}</h3>
              <p className="text-[var(--comment)]">
                {post.description || post.excerpt}
              </p>
              <div className="mt-4 text-sm text-[var(--subtle)]">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
        <p className="text-[var(--comment)] mb-8">
          Interested in collaborating or just want to say hi? I&apos;d love to hear from you.
        </p>
        <a
          href="mailto:contact@jonflatt.dev"
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
          data-nav-item
        >
          Email Me
        </a>
      </section>
    </div>
  );
}
