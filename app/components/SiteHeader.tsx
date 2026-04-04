'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',    href: '/#home'    },
  { label: 'About',   href: '/#about'   },
  { label: 'Alumni',  href: '/#alumni'  },
  { label: 'Contact', href: '/#contact' },
];

export default function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isApplyPage = pathname?.startsWith('/apply');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    // If on the apply page, navigate to home first then scroll
    if (isApplyPage) {
      router.push(href);
      return;
    }
    // On home page, smooth scroll
    const hash = href.split('#')[1];
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isScrolledOrSolid = scrolled || !transparent;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,.display { font-family: 'Syne', sans-serif; }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolledOrSolid
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-zinc-900 text-lg tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Sika<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA — hidden on apply page */}
          {!isApplyPage && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/apply"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Apply Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition"
              >
                {link.label}
              </button>
            ))}
            {!isApplyPage && (
              <div className="pt-3">
                <Link
                  href="/apply"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-xl w-full"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}