/**
 * Prefix for public assets. Empty in dev, '/olympiad' in production.
 * Use this instead of hardcoding '/olympiad/' in src paths.
 *
 * Usage:
 *   import { assetPath } from '@/lib/basePath';
 *   <img src={assetPath('/logo.png')} />
 */
export const BASE_PATH =
  process.env.NODE_ENV === 'production' ? '/olympiad' : '';

export function assetPath(path: string): string {
  // Ensure path always starts with /
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
