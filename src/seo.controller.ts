import { Controller, Get, Header, Redirect, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { publicRoot } from './public-root';

function requestOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.trim().replace(/\/+$/, '');
  if (configured) return configured;

  const forwardedProto = request.get('x-forwarded-proto')?.split(',')[0].trim();
  const protocol = forwardedProto || request.protocol || 'http';
  const host = (request.get('host') ?? 'localhost')
    .replace(/[^a-zA-Z0-9.:-]/g, '')
    .slice(0, 253);

  return `${protocol}://${host}`;
}

@Controller()
export class SeoController {
  @Get()
  @Header('Cache-Control', 'public, max-age=0, must-revalidate')
  root(@Req() request: Request, @Res() response: Response): void {
    const origin = requestOrigin(request);
    const html = readFileSync(join(publicRoot, 'index.html'), 'utf8')
      .replaceAll('__SITE_URL__', origin)
      .replaceAll('__OG_IMAGE__', `${origin}/assets/og.jpg?v=2`);

    response.type('html').send(html);
  }

  @Get('index.html')
  @Redirect('/', 301)
  index(): void {}

  @Get('sitemap.xml')
  sitemap(@Req() request: Request, @Res() response: Response): void {
    const origin = requestOrigin(request);
    const lastmod = new Date().toISOString().slice(0, 10);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

    response.type('application/xml').send(xml);
  }

  @Get('robots.txt')
  robots(@Req() request: Request, @Res() response: Response): void {
    const origin = requestOrigin(request);
    const text = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${origin}/sitemap.xml
`;

    response.type('text/plain').send(text);
  }
}
