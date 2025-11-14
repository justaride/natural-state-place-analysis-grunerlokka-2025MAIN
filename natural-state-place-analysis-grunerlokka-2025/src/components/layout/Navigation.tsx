'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Forside' },
  { href: '/analyser', label: 'Analyser' },
  { href: '/om-prosjektet', label: 'Om Prosjektet' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-natural-forest text-white shadow-sm'
                : 'text-natural-forest hover:bg-natural-sage/20 hover:text-natural-forest'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
