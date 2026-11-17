import type { APIContext } from 'astro';

// robots.txt 跟着站点地址走，换域名时不用手改
export function GET({ site }: APIContext) {
  const base = site ?? new URL('https://example.com');
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', base).href}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
