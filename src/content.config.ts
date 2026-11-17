import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 所有文章放在 src/content/blog/ 下，一个 .md 文件就是一篇。
 * front-matter 的字段在这里校验，写错了构建会直接报错。
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.string().default('zh-CN'),
  }),
});

export const collections = { blog };
