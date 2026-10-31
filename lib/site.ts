export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const raw = configured || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000');

  try {
    return new URL(raw).origin;
  } catch {
    return 'http://localhost:3000';
  }
}
