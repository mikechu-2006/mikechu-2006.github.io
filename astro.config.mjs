// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 部署到 GitHub Pages 时，workflow 会注入 SITE_URL（形如 https://<用户名>.github.io）。
// 本地开发、或者以后绑了自有域名，也可以自己设这个环境变量。
const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
});
