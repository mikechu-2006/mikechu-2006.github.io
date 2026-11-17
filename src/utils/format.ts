/** 2026年11月17日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}

/** 2026-11-17 */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * 粗略估算阅读时间：中文按 380 字/分钟，西文按 220 词/分钟，
 * 取整后最少 1 分钟。只用于给读者一个预期，不需要精确。
 */
export function readingTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5\u3400-\u4dbf]/g) ?? []).length;
  const words = (text.replace(/[\u4e00-\u9fa5\u3400-\u4dbf]/g, ' ').match(/[A-Za-z0-9_'-]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 380 + words / 220));
}
