import React from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getFeaturedStaticPosts } from "@/utils/server-posts";
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://jonathanflatt.dev'),
  title: 'Jonathan Flatt - DevOps Engineer & Automation Specialist',
  description: 'DevOps engineer specializing in bespoke tooling, automation solutions, and AI-assisted development. Writing about DevOps practices and ergonomic design.',
  keywords: ['DevOps', 'automation', 'tooling', 'AI', 'development', 'software engineering'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jonathanflatt.dev',
    title: 'Jonathan Flatt - DevOps Engineer & Automation Specialist',
    description: 'DevOps engineer specializing in bespoke tooling, automation solutions, and AI-assisted development.',
    siteName: 'Jonathan Flatt',
  },
  alternates: {
    canonical: 'https://jonathanflatt.dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function Home(): Promise<React.ReactElement> {
  const featuredPosts = await getFeaturedStaticPosts();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              name: 'Jonathan Flatt',
              jobTitle: 'DevOps Engineer',
              description: 'DevOps engineer specializing in bespoke tooling and automation solutions',
              url: 'https://jonathanflatt.dev',
              email: 'jonflatt@gmail.com',
              sameAs: [
                'https://github.com/chefFromSpace'
              ]
            }
          })
        }}
      />
      <div className="max-w-4xl mx-auto h-card">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="p-name text-5xl font-bold mb-6">
          Hi, I&apos;m Jonathan Flatt
        </h1>
        <p className="p-note text-xl text-[var(--comment)] mb-8">
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
            rel="noopener noreferrer me"
            className="u-url px-6 py-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            data-nav-item
          >
            GitHub Profile
          </a>
        </div>
      </section>

      
      {/* Blog Posts */}
      <section className="mb-16 h-feed">
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
              className="h-entry block p-6 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
              data-nav-item
            >
              <h3 className="p-name text-xl font-medium mb-2">{post.title}</h3>
              <p className="p-summary text-[var(--comment)]">
                {post.description || post.excerpt}
              </p>
              <div className="mt-4 text-sm text-[var(--subtle)]">
                <time className="dt-published" dateTime={new Date(post.date).toISOString()}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
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
          href="mailto:jonflatt@gmail.com"
          className="u-email inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
          data-nav-item
        >
          Email Me
        </a>
      </section>
      </div>
    </>
  );
}
