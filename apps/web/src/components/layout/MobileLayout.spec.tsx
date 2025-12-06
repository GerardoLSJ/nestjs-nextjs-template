import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';

import { MobileLayout } from './MobileLayout';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('MobileLayout', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('should render children in main content area', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render header when showHeader is true', () => {
    render(<MobileLayout>Content</MobileLayout>);

    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('should hide header when showHeader is false', () => {
    render(<MobileLayout showHeader={false}>Content</MobileLayout>);

    expect(screen.queryByText('App')).not.toBeInTheDocument();
  });

  it('should render bottom navigation when showBottomNav is true', () => {
    render(<MobileLayout>Content</MobileLayout>);

    expect(screen.getByRole('navigation', { name: /bottom navigation/i })).toBeInTheDocument();
  });

  it('should hide bottom nav when showBottomNav is false', () => {
    render(<MobileLayout showBottomNav={false}>Content</MobileLayout>);

    expect(
      screen.queryByRole('navigation', { name: /bottom navigation/i })
    ).not.toBeInTheDocument();
  });

  it('should call onMenuClick when menu button is clicked', async () => {
    const handleMenuClick = jest.fn();
    const user = userEvent.setup();

    render(<MobileLayout onMenuClick={handleMenuClick}>Content</MobileLayout>);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it('should call onProfileClick when profile button is clicked', async () => {
    const handleProfileClick = jest.fn();
    const user = userEvent.setup();

    render(<MobileLayout onProfileClick={handleProfileClick}>Content</MobileLayout>);

    const profileButton = screen.getByRole('button', { name: /open profile/i });
    await user.click(profileButton);

    expect(handleProfileClick).toHaveBeenCalledTimes(1);
  });

  it('should use custom header title', () => {
    render(<MobileLayout headerTitle="My App">Content</MobileLayout>);

    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('should render both header and bottom nav by default', () => {
    render(<MobileLayout>Content</MobileLayout>);

    expect(screen.getByText('App')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /bottom navigation/i })).toBeInTheDocument();
  });

  it('should render without header and bottom nav', () => {
    render(
      <MobileLayout showHeader={false} showBottomNav={false}>
        Content
      </MobileLayout>
    );

    expect(screen.queryByText('App')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: /bottom navigation/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
