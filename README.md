# 山止川行 · 个人博客

纯静态博客：Markdown 写作，Git 管理，**零成本发布到 GitHub Pages**。没有服务器、没有数据库、没有月费。

## 快速开始

需要 Node.js 22+（Astro 7 的最低要求）。

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
npm run preview    # 预览构建结果
```

## 技术栈

| 部分 | 选择 | 为什么 |
| --- | --- | --- |
| 框架 | [Astro 7](https://astro.build) | 默认输出零 JS，Markdown 是一等公民 |
| 内容 | Markdown + Content Collections | front-matter 有类型校验，写错构建就报错 |
| 样式 | 手写 CSS | 一个文件 [src/styles/global.css](src/styles/global.css)，改起来直接 |
| 代码高亮 | Shiki（内置） | 构建时高亮，双主题，无运行时开销 |
| RSS / sitemap | `@astrojs/rss`、`@astrojs/sitemap` | 一行集成 |
| 发布 | GitHub Pages + GitHub Actions | 免费、自动部署、自带 HTTPS |

## 目录结构

```
blog/
├─ .github/workflows/deploy.yml  # push 后自动构建并发布到 GitHub Pages
├─ astro.config.mjs              # 站点配置（域名从 SITE_URL 环境变量读）
├─ src/
│  ├─ consts.ts                  # 站点名、作者、简介、社交链接 ← 先改这里
│  ├─ content.config.ts          # 文章 front-matter 的 schema
│  ├─ content/blog/              # ★ 所有文章，一个 .md 一篇
│  ├─ layouts/                   # BaseLayout / PostLayout
│  ├─ components/                # Header / Footer / PostList
│  ├─ pages/                     # 首页、归档、标签、文章、关于、404、RSS、robots
│  ├─ styles/global.css          # 全站样式（配色变量在文件顶部）
│  └─ utils/                     # 日期格式化、阅读时间、文章查询
├─ public/                       # 静态资源：favicon、_redirects、_headers
└─ scripts/new-post.mjs          # 新建文章的脚手架
```

## 写文章

```bash
npm run new -- my-post-slug
```

会在 `src/content/blog/` 下生成带 front-matter 的文件。文件名就是 URL：`my-post-slug.md` → `/blog/my-post-slug/`。

### front-matter 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | string | 是 | 标题，同时用于 `<title>` 和 OG |
| `date` | date | 是 | 发布日期，写成 `2026-11-17` 即可 |
| `description` | string | 否 | 摘要，出现在列表、RSS、搜索结果里 |
| `tags` | string[] | 否 | 标签，会自动生成标签页 |
| `updated` | date | 否 | 更新时间，填了会显示"更新于" |
| `draft` | boolean | 否 | `true` 时生产构建跳过 |
| `lang` | string | 否 | 默认 `zh-CN` |

字段写错或漏掉必填项，`npm run build` 会直接报错并指出是哪个文件。

### 图片

放在 `public/images/` 下，正文里用绝对路径：

```markdown
![Redis 集群拓扑](/images/redis-cluster.png)
```

## 发布到公网（0 元，不需要买域名）

静态站点要"被所有人看到"，只需要一个托管。下面两个方案都免费。

### 方案 A：GitHub Pages（推荐，你已经有账号）

最终地址是 `https://<你的用户名>.github.io`，永久免费、自带 HTTPS。

**1. 建仓库**

新建一个**公开**仓库，名字必须是 `<你的用户名>.github.io`。比如用户名是 `alice`，仓库就叫 `alice.github.io`。

> 名字很重要：只有这样站点才挂在域名根目录下。如果叫别的名字，站点会变成 `https://alice.github.io/仓库名/`，站内链接需要额外配置 base 前缀。

**2. 推代码**

```bash
git add .
git commit -m "init: astro blog"
git branch -M main
git remote add origin git@github.com:alice/alice.github.io.git
git push -u origin main
```

**3. 打开 Pages**

仓库 → **Settings** → **Pages** → **Build and deployment** → Source 选 **GitHub Actions**。

**4. 等部署**

仓库的 **Actions** 标签里会出现 "Deploy to GitHub Pages"，一两分钟跑完。

**5. 访问**

`https://<你的用户名>.github.io` —— 这就是你的公开博客，任何人都能打开。

之后每次 `git push`，workflow 会自动重新构建发布，你什么都不用管。站点地址由 workflow 自动拼好并写进 `SITE_URL`，所以 RSS、sitemap、canonical 里的域名都是对的，不用手改。

**免费额度的边界**（[官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)）：

- 免费账号下 Pages 需要仓库公开（博客源码本来也没什么好藏的）
- 站点总大小 1 GB 以内
- 每月约 100 GB 流量软限制

对纯文字博客，这些限制基本碰不到。

### 方案 B：Cloudflare Pages（可选，同一个仓库再挂一个入口）

GitHub Pages 在国内偶尔会慢，如果你想多一个地址，或者哪天 GitHub 抽风，可以再挂一份：

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选同一个仓库，配置：

   | 配置项 | 值 |
   | --- | --- |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | 环境变量 | `NODE_VERSION` = `22`，`SITE_URL` = `https://<项目名>.pages.dev` |

3. 部署完会拿到 `xxx.pages.dev` 地址

两个地址指向同一个仓库，推一次代码两边都会更新。哪个快就把哪个发给人。

### 关于域名

现在**完全不需要买域名**：`*.github.io` 和 `*.pages.dev` 都是可以长期用的免费地址。

什么时候才值得买：想要自己的品牌（`yourname.com`），或者不想让地址里带着平台名。以后想买，两个平台都支持随时绑定，改一条 DNS 记录就行，不用重做站。

如果你有学生身份，[GitHub Student Developer Pack](https://education.github.com/pack) 里包含 Namecheap 的免费 `.me` 域名一年——想试试的话可以去申请，但记得第二年续费要钱。

### 怎么让别人看到

地址有了，但没人会凭空点进来。最低成本的几件事：

- 写完把链接发到掘金 / 知乎 / 微信 / QQ 群，正文同步一份，文末放原文链接
- 提交 [Google Search Console](https://search.google.com/search-console) 和百度站长平台，让搜索引擎能收录
- 提供 RSS（`/rss.xml`），用 Feedly、Inoreader 的读者可以订阅

## 上线后的检查清单

- [ ] 把 `src/consts.ts` 里的站点名、作者、社交链接改成真的
- [ ] 删掉 `src/content/blog/` 下的四篇示例文章
- [ ] 打开 `https://<用户名>.github.io` 确认样式正常、文章能打开
- [ ] 访问 `/rss.xml` 和 `/sitemap-index.xml`，确认链接是真实域名
- [ ] Google Search Console / 百度站长提交 sitemap

## 下一步可以加

- **评论**：[giscus](https://giscus.app/)，基于 GitHub Discussions，免费无后端
- **搜索**：[Pagefind](https://pagefind.app/)，构建后生成静态索引
- **统计**：[Umami](https://umami.is/) 或 Cloudflare Web Analytics（免费、无 Cookie）
- **分享图**：用 `satori` 在构建时为每篇文章生成 OG 图

## 迁移旧文章

旧文章迁过来，重点不在复制文本，而在**旧 URL 的 301 映射**。规则写在 `public/_redirects`（Cloudflare Pages 用；GitHub Pages 不支持，需要改用 `_redirects` 或者每篇文章一个跳转页）。

完整清单见 [src/content/blog/migration-plan.md](src/content/blog/migration-plan.md)。

## 常见问题

**push 之后 Actions 报错 / 没有部署**

检查 Settings → Pages 里的 Source 是不是 **GitHub Actions**。改完可以到 Actions 页面点 "Re-run all jobs"。

**访问 `https://<用户名>.github.io` 是 404**

仓库名必须是 `<用户名>.github.io`，且用户名要完全一致（不区分大小写）。

**样式没加载 / 链接全 404**

多半是用了项目仓库（`xxx.github.io/blog`）但没配 base。改用方案 A 的命名方式最省事。

**Windows 上构建报 `EPERM`**

Astro 遥测要写用户目录，被权限或沙箱挡住。设环境变量 `ASTRO_TELEMETRY_DISABLED=1` 再构建。

**标签 URL 是中文**

标签直接做路径（`/tags/博客/`），浏览器会自动百分号编码。想改成英文，把 `tags` 换成英文即可。

**想换配色**

`src/styles/global.css` 顶部的 `:root` 和 `html[data-theme="dark"]` 两块变量，改完全站生效。
