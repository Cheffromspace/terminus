#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface PostFrontmatter {
  title: string;
  date: string;
  draft: boolean;
  series?: string;
  description?: string;
}

async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function migratePost(filePath: string): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: markdown } = matter(content);
  const frontmatter = data as PostFrontmatter;
  
  const slug = await generateSlug(frontmatter.title);
  const newContent = matter.stringify(markdown, {
    title: frontmatter.title,
    date: frontmatter.date,
    draft: frontmatter.draft ?? false,
    description: frontmatter.description ?? '',
    series: frontmatter.series,
    slug
  });

  const newPath = path.join(process.cwd(), 'src/content/posts', `${slug}.md`);
  await fs.mkdir(path.dirname(newPath), { recursive: true });
  await fs.writeFile(newPath, newContent);
  
  console.log(`Migrated: ${path.basename(filePath)} -> ${path.basename(newPath)}`);
}

async function migrateAllPosts(): Promise<void> {
  const oldPostsDir = path.join(process.cwd(), '..', 'content/posts');
  const files = await fs.readdir(oldPostsDir);
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      await migratePost(path.join(oldPostsDir, file));
    }
  }
}

migrateAllPosts().catch(console.error);
