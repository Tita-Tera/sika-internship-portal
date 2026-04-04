import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sika Internship Application Portal',
  description: 'Apply for internships at Sika - Build your future with us',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-50">
        {children}
      </body>
    </html>
  );
}