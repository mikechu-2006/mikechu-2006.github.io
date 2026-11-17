---
title: '从零搭好这个博客：完整步骤'
description: '本地跑起来、推上 GitHub、免费发布到 GitHub Pages，全流程。'
date: 2026-11-16
tags: ['Astro', '博客', '教程']
draft: false
---

这篇文章记录这个仓库从零到上线的全部步骤。照着做，大约 20 分钟。

## 0. 准备

- Node.js 22 或更高版本（`node -v` 检查）
- 一个 GitHub 账号（用来放代码和免费托管）
- 一个域名——**不需要**，先用 `*.github.io` 就够

## 1. 本地跑起来

```bash
# 安装依赖
npm install

# 启动开发服务器，默认 http://localhost:4321
npm run dev
```

打开浏览器就能看到首页。改 `src/` 下的文件会热更新，改 Markdown 也一样。

构建一次生产版本，确认没有报错：

```bash
npm run build    # 产物在 dist/
npm run preview  # 本地预览构建结果
```

## 2. 改成你自己的信息

只需要动两个文件：

1. `src/consts.ts`：站点名、作者名、简介、社交链接
2. `astro.config.mjs`：把 `site` 改成你的最终域名

```js
export default defineConfig({
  site: 'https://your-domain.com', // ← 改这里
  // ...
});
```

这个值决定了 RSS、sitemap 和 canonical 链接里的绝对地址，**写错会导致搜索引擎收录出问题**，别偷懒。

## 3. 写第一篇文章

在 `src/content/blog/` 下新建 `my-first-post.md`：

```markdown
---
title: '文章标题'
description: '一句话摘要，会显示在列表和搜索结果里。'
date: 2026-11-18
tags: ['标签一', '标签二']
draft: false
---

正文从这里开始。
```

文件名就是 URL：`my-first-post.md` → `/blog/my-first-post/`。

> 想先写草稿不发布？把 `draft` 设成 `true`，生产构建会自动跳过它。

## 4. 推到 GitHub

```bash
git init
git add .
git commit -m "init: astro blog"
git branch -M main
git remote add origin git@github.com:yourname/blog.git
git push -u origin main
```

## 5. 发布到 GitHub Pages

1. 在 GitHub 上新建一个**公开**仓库，名字必须是 `<你的用户名>.github.io`
2. 把代码推上去：

   ```bash
   git init
   git add .
   git commit -m "init: astro blog"
   git branch -M main
   git remote add origin git@github.com:<用户名>/<用户名>.github.io.git
   git push -u origin main
   ```

3. 仓库 → **Settings** → **Pages** → **Build and deployment** → Source 选 **GitHub Actions**
4. 到 **Actions** 标签等 "Deploy to GitHub Pages" 跑完，大约一分钟
5. 打开 `https://<你的用户名>.github.io`

仓库里的 `.github/workflows/deploy.yml` 会自动构建并发布 `dist/`，站点地址也会自动拼好，不用改配置。

> 仓库名如果不是 `<用户名>.github.io`，站点会挂在子路径下，站内链接需要配 base 前缀——新手别踩这个坑。

## 6. 关于域名

不买域名也能用，`*.github.io` 可以长期免费。哪天想要自己的地址，在 Pages 设置里加一条自定义域名和 DNS 记录即可，不用重做站。

## 7. 上线后该做的三件事

- 到 [Google Search Console](https://search.google.com/search-console) 添加站点，提交 `/sitemap-index.xml`
- 百度站长平台同理，提交 sitemap
- 把链接发出去：掘金、知乎、微信群，正文同步一份，文末放原文链接

`robots.txt` 里的 sitemap 地址会跟着站点域名自动生成，不用手改。

## 常见问题

**Actions 跑失败？** 先确认 Settings → Pages 的 Source 已经设成 GitHub Actions，再点 "Re-run all jobs"。

**访问是 404？** 仓库名和用户名不一致，或者 workflow 还没跑完。

**样式在线上不生效？** 大概率是仓库名导致的子路径问题，见第 5 步的提示。

**想加评论？** 推荐 [giscus](https://giscus.app/)，基于 GitHub Discussions，免费且不需要数据库。把生成的 `<script>` 贴到 `PostLayout.astro` 的评论区位置即可。

**想加搜索？** 用 [Pagefind](https://pagefind.app/)，构建后扫一遍产物就能生成静态索引，适合几百篇文章的规模。
