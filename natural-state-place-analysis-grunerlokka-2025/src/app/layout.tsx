import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Natural State Place Analysis - Grünerløkka 2025',
    template: '%s | Natural State Place Analysis',
  },
  description: 'Comprehensive temporal and comparative place analysis of Grünerløkka, Oslo. Monthly insights, comparative studies, event impact analysis, and media tracking.',
  keywords: ['Grünerløkka', 'Oslo', 'place analysis', 'urban analytics', 'temporal analysis', 'Natural State'],
  authors: [{ name: 'Natural State' }],
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'Natural State Place Analysis - Grünerløkka 2025',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-lokka-light text-lokka-neutral antialiased">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
