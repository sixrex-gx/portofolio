import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const siteUrl = getSiteUrl();
const description =
  'Personal homepage of Stefanus Mario Bersyuby (Denkichi), an Information Systems student building quiet tools for Linux and the web.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Stefanus Mario Bersyuby · Information Systems Student',
  description,
  applicationName: 'Stefanus Mario Bersyuby',
  authors: [{ name: 'Stefanus Mario Bersyuby' }],
  creator: 'Stefanus Mario Bersyuby',
  publisher: 'Stefanus Mario Bersyuby',
  category: 'portfolio',
  keywords: [
    'Stefanus Mario Bersyuby',
    'Denkichi',
    'Information Systems',
    'portfolio',
    'Next.js',
    'Linux',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Stefanus Mario Bersyuby',
    title: 'Stefanus Mario Bersyuby',
    description:
      'Information Systems student building quiet tools for Linux and the web.',
    images: [
      {
        url: '/assets/og.jpg?v=2',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Stefanus Mario Bersyuby, Information Systems student',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stefanus Mario Bersyuby',
    description:
      'Information Systems student building quiet tools for Linux and the web.',
    images: [
      {
        url: '/assets/og.jpg?v=2',
        alt: 'Stefanus Mario Bersyuby, Information Systems student',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      {
        url: '/assets/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Denkichi',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0d0d',
  colorScheme: 'dark',
};

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Stefanus Mario Bersyuby',
  alternateName: 'Denkichi',
  url: `${siteUrl}/`,
  image: `${siteUrl}/assets/portrait-2.webp`,
  description:
    'Information Systems student building quiet tools for Linux and the web.',
  jobTitle: 'Information Systems Student',
  email: 'yuta911f@gmail.com',
  sameAs: [
    'https://github.com/sixrex-gx',
    'https://instagram.com/_stfnsmario',
  ],
  knowsAbout: [
    'Python',
    'TypeScript',
    'JavaScript',
    'PHP',
    'React',
    'Next.js',
    'Laravel',
    'Linux',
    'GTK 3',
    'Cairo',
    'Git',
    'Vercel',
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="js">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
