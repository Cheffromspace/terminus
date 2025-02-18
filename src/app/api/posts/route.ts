import { NextResponse } from 'next/server';
import { postCache, PostCache } from '@/utils/post-cache';

export const runtime = 'edge';
export const preferredRegion = 'auto';

export async function GET(request: Request) {
  try {
    // Reset cache for edge runtime
    if (process.env.NEXT_RUNTIME === 'edge') {
      PostCache.resetInstance();
    }
    
    await postCache.initialize();
    
    // Ensure proper URL parsing in edge runtime
    const url = request.url.startsWith('http') 
      ? request.url 
      : new URL(request.url, process.env.NEXT_PUBLIC_URL || 'http://localhost:3000').toString();
    
    const { searchParams } = new URL(url);
    const query = searchParams.get('q');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');

    // If requesting specific post content
    if (slug) {
      try {
        const content = await postCache.getPostContent(slug);
        return NextResponse.json({ content }, {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    const allPosts = postCache.getPosts();
    const now = new Date().toISOString();
    const publishedPosts = allPosts.filter(post => {
      if (post.draft) return false;
      if (!post.publishDate) return true;
      return post.publishDate <= now;
    });

    if (featured === 'true') {
      const seriesPosts = publishedPosts.filter(post => post.series);
      const recentPosts = publishedPosts
        .filter(post => !post.series)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return NextResponse.json([...seriesPosts.slice(0, 2), ...recentPosts.slice(0, 2)], {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      const filteredPosts = publishedPosts.filter(post => {
        const searchText = `${post.title} ${post.description} ${post.excerpt}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
      return NextResponse.json(filteredPosts, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return NextResponse.json(publishedPosts, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in posts API:', error);
    
    // Enhanced error handling for edge runtime
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorResponse = {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
