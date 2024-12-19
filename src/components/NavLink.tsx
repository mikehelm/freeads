import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-[#e0e4ed] hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}