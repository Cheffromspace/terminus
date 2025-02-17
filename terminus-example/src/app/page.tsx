import React from 'react';
import { PostList, SearchBar } from 'terminus-blog-engine';

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Terminus Blog Example</h1>
        <SearchBar className="mb-8" />
        <PostList />
      </div>
    </main>
  );
}
