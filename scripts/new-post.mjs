#!/usr/bin/env node
/**
 * 新建一篇文章：npm run new -- my-post-slug
 * 会在 src/content/blog/ 下生成带 front-matter 的 Markdown 文件。
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const slug = process.argv[2];

if (!slug) {
  console.error('用法: npm run new -- <slug>');
  console.error('例如: npm run new -- redis-cluster-notes');
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('slug 只能包含小写字母、数字和连字符，例如 my-first-post');
  process.exit(1);
}

const dir = join(process.cwd(), 'src', 'content', 'blog');
await mkdir(dir, { recursive: true });

const file = join(dir, slug + '.md');

try {
  await access(file);
  console.error('文件已存在: ' + file);
  process.exit(1);
} catch {
  // 文件不存在，可以创建
}

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const template = [
  '---',
  "title: '新文章标题'",
  "description: ''",
  'date: ' + today,
  'tags: []',
  'draft: true',
  '---',
  '',
  '在这里开始写。',
  '',
  '## 小节标题',
  '',
  '正文。',
  '',
].join('\n');

await writeFile(file, template, 'utf-8');
console.log('已创建 ' + file);
console.log('写完后记得把 draft 改成 false。');
