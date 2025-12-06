'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { MobileLayout } from './MobileLayout';

const AUTH_ROUTES = ['/login', '/register'];

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <MobileLayout>{children}</MobileLayout>;
}
