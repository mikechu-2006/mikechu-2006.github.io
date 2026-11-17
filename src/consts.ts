/**
 * 站点配置：改这里就够了。
 * 名字、简介、社交链接都会从这里读取。
 */
export const SITE = {
  title: 'mikechu',
  author: 'mikechu',
  description: '算法题解、C++ 细节，和一些比赛记录。',
  // 兜底地址。部署时由 SITE_URL 环境变量覆盖（GitHub Actions 会自动注入）
  url: 'https://mikechu-2006.github.io',
  // 留空则不显示邮箱
  email: '',
  social: {
    github: 'https://github.com/mikechu-2006',
    x: '',
    rss: '/rss.xml',
  },
} as const;
