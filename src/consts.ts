/**
 * 站点配置：改这里就够了。
 * 名字、简介、社交链接、导航都会从这里读取。
 */
export const SITE = {
  title: '山止川行',
  author: '山止川行',
  description: '记录技术、阅读与一些想不明白的事。',
  // 兜底地址。部署时由 SITE_URL 环境变量覆盖（GitHub Actions 会自动注入）
  url: 'https://example.com',
  email: 'you@example.com',
  social: {
    github: 'https://github.com/yourname',
    x: '',
    rss: '/rss.xml',
  },
} as const;
