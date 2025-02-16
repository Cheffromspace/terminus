"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Post } from "@/types/blog";
import { searchPosts } from "@/utils/posts";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const searchResults = await searchPosts(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-nav-item
      />
      
      {query.trim() && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="block p-4 hover:bg-gray-50"
                    data-nav-item
                  >
                    <h3 className="font-medium">{post.title}</h3>
                    {post.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {post.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No posts found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
