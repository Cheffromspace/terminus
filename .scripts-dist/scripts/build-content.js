import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
const POSTS_DIRECTORY = process.env.BLOG_CONTENT_DIR
    ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
    : path.join(process.cwd(), 'content', 'posts');
const OUTPUT_DIRECTORY = path.join(process.cwd(), 'public', 'content');
async function buildContent() {
    try {
        // Ensure output directory exists
        if (!existsSync(OUTPUT_DIRECTORY)) {
            mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
        }
        if (!existsSync(POSTS_DIRECTORY)) {
            console.error(`Posts directory not found: ${POSTS_DIRECTORY}`);
            process.exit(1);
        }
        const files = await readdir(POSTS_DIRECTORY);
        if (files.length === 0) {
            console.warn('No markdown files found in posts directory');
            return;
        }
        const markdownProcessor = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeHighlight)
            .use(rehypeStringify);
        // First pass: gather all series information
        const seriesMap = new Map();
        for (const file of files) {
            if (!file.endsWith('.md'))
                continue;
            const content = await readFile(path.join(POSTS_DIRECTORY, file), 'utf-8');
            const { data } = matter(content);
            if (data.series) {
                seriesMap.set(data.series, (seriesMap.get(data.series) || 0) + 1);
            }
        }
        // Second pass: process all posts with complete series information
        const posts = await Promise.all(files
            .filter(file => file.endsWith('.md'))
            .map(async (file) => {
            const filePath = path.join(POSTS_DIRECTORY, file);
            const content = await readFile(filePath, 'utf-8');
            const { data, content: markdown } = matter(content);
            // Pre-render markdown to HTML
            const html = await markdownProcessor.process(markdown);
            // Extract metadata
            const wordCount = markdown.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);
            const post = {
                id: path.basename(file, '.md'),
                title: data.title,
                slug: data.slug || path.basename(file, '.md'),
                date: new Date(data.date).toISOString(),
                publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : undefined,
                content: markdown,
                preRenderedHtml: String(html),
                description: data.description || '',
                draft: data.draft || false,
                excerpt: data.excerpt || data.description || '',
                metadata: {
                    wordCount,
                    readingTime
                },
                series: data.series ? {
                    name: data.series,
                    order: parseInt(data.title.match(/Part (\d+)/)?.[1] || '1'),
                    totalParts: seriesMap.get(data.series) || 1
                } : undefined
            };
            return post;
        }));
        // Sort posts
        const sortedPosts = posts.sort((a, b) => {
            if (a.series && b.series && a.series.name === b.series.name) {
                return a.series.order - b.series.order;
            }
            if (a.series && !b.series)
                return -1;
            if (!a.series && b.series)
                return 1;
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateCompare !== 0)
                return dateCompare;
            return a.title.localeCompare(b.title);
        });
        // Write individual post files
        for (const post of sortedPosts) {
            const postPath = path.join(OUTPUT_DIRECTORY, `${post.slug}.json`);
            writeFileSync(postPath, JSON.stringify({
                ...post,
                content: undefined // Exclude raw markdown from JSON
            }, null, 2));
        }
        // Generate manifest
        const manifest = {
            posts: sortedPosts.map((post) => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                date: post.date,
                publishDate: post.publishDate,
                description: post.description,
                draft: post.draft,
                excerpt: post.excerpt,
                series: post.series,
                metadata: post.metadata
            }))
        };
        writeFileSync(path.join(OUTPUT_DIRECTORY, 'manifest.json'), JSON.stringify(manifest, null, 2));
        console.log(`Successfully processed ${sortedPosts.length} posts`);
        console.log(`Generated content manifest and individual post files in ${OUTPUT_DIRECTORY}`);
    }
    catch (error) {
        console.error('Error building content:', error);
        process.exit(1);
    }
}
buildContent();
