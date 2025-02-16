import { NextResponse } from 'next/server';
import { postCache } from '@/utils/post-cache';

export async function GET(request: Request) {
  try {
    await postCache.initialize();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const featured = searchParams.get('featured');

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
      
      return NextResponse.json([...seriesPosts.slice(0, 2), ...recentPosts.slice(0, 2)]);
    }

    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      const filteredPosts = publishedPosts.filter(post => {
        const searchText = `${post.title} ${post.description} ${post.excerpt}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
      return NextResponse.json(filteredPosts);
    }

    return NextResponse.json(publishedPosts);
  } catch (error) {
    console.error('Error in posts API:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
