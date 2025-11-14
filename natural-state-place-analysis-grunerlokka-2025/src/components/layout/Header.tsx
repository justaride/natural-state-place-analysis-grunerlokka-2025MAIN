'use client';

import Link from 'next/link';
import Navigation from './Navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-transform duration-300 supports-[backdrop-filter]:bg-white/60 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-[2100px] px-[4vw]">
        <div className="flex h-20 items-center justify-between py-[2vw]">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="text-2xl font-bold text-natural-forest">
              Natural State
            </div>
            <span className="text-gray-400">|</span>
            <div className="text-sm text-gray-600">
              Place Analysis Grünerløkka
            </div>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
