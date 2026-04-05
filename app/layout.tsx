import type { Metadata } from 'next';
import Script from 'next/script';
import { colors, getGoogleFontsLink } from '../lib/branding';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'Apply for Internships at Tera-Tech Ltd - Systems Innovation Company',
  description: 'Join Tera-Tech Ltd\'s internship program in Bamenda, Cameroon. We build practical, scalable solutions through systems thinking, community development, and real-world innovation. Apply now and gain hands-on experience.',
  keywords: ['systems innovation', 'practical solutions', 'Africa tech', 'education', 'skill development', 'community systems', 'internship', 'Tera-Tech Ltd', 'Bamenda', 'Cameroon', 'technology', 'systems design'],
  authors: [{ name: 'Tera-Tech Ltd' }],
  creator: 'Tera-Tech Ltd',
  publisher: 'Tera-Tech Ltd',
  openGraph: {
    title: 'Apply for Internships at Tera-Tech Ltd - Systems Innovation Company',
    description: 'Join Tera-Tech Ltd\'s internship program. We build practical, scalable solutions through systems thinking, community development, and real-world innovation.',
    url: 'https://teratechcompany.tech', // Replace with actual URL
    siteName: 'Tera-Tech Ltd Internship Portal',
    images: [
      {
        url: '/teratechcompany.jpg',
        width: 1200,
        height: 630,
        alt: 'Tera-Tech Ltd Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apply for Internships at Tera-Tech Ltd - Systems Innovation Company',
    description: 'Join Tera-Tech Ltd\'s internship program. We build practical, scalable solutions through systems thinking, community development, and real-world innovation.',
    images: ['/teratechcompany.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
    ],
  },
};

// Google Fonts link
export const googleFontsLink = getGoogleFontsLink();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tera-Tech Ltd",
  "url": "https://teratechcompany.tech",
  "logo": "https://teratechcompany.tech/teratechcompany.jpg", // Replace with actual domain
  "description": "Tera-Tech Ltd is a systems innovation company focused on solving real-world problems through practical, scalable, and context-driven solutions. We connect technology with real-world systems to design, test, and scale solutions that work in real conditions.",
  "foundingDate": "2018",
  "address": {
    "@type": "00000",
    "addressLocality": "Bamenda",
    "addressCountry": "Cameroon"
  },
  "sameAs": [
    "https://teratechcompany.tech"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsLink} rel="stylesheet" />
      </head>
      <body className={`antialiased bg-${colors.neutral[50]}`}>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}