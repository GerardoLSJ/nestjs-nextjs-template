import { ErrorBoundary } from '../components/errors';
import { LayoutWrapper } from '../components/layout/LayoutWrapper';
import { QueryProvider } from '../providers/QueryProvider';
import './global.css';

export const metadata = {
  title: 'Auth Tutorial',
  description: 'NestJS + Next.js Authentication Tutorial with TanStack Query',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
