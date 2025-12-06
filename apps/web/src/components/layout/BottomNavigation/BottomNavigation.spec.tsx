import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';

import { BottomNavigation } from './BottomNavigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('BottomNavigation', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('should render all default navigation items', () => {
    render(<BottomNavigation />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Add')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  it('should highlight active item based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/profile');
    render(<BottomNavigation />);

    const profileLink = screen.getByLabelText('Profile');
    expect(profileLink).toHaveAttribute('aria-current', 'page');
  });

  it('should highlight home when on home route', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<BottomNavigation />);

    const homeLink = screen.getByLabelText('Home');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('should call onItemClick when item is clicked', async () => {
    const handleItemClick = jest.fn();
    const user = userEvent.setup();

    render(<BottomNavigation onItemClick={handleItemClick} />);

    const homeLink = screen.getByLabelText('Home');
    await user.click(homeLink);

    expect(handleItemClick).toHaveBeenCalledWith('home');
  });

  it('should have proper navigation role', () => {
    render(<BottomNavigation />);

    const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('should render with custom items', () => {
    const customItems = [
      {
        id: 'test',
        label: 'Test',
        icon: ({ className }: { className?: string }) => <span className={className}>T</span>,
        href: '/test',
        elevated: false,
      },
    ];

    render(<BottomNavigation items={customItems} />);

    expect(screen.getByLabelText('Test')).toBeInTheDocument();
    expect(screen.queryByLabelText('Home')).not.toBeInTheDocument();
  });

  it('should use activeId prop over pathname detection', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<BottomNavigation activeId="profile" />);

    const profileLink = screen.getByLabelText('Profile');
    expect(profileLink).toHaveAttribute('aria-current', 'page');
  });

  it('should render all items as links with correct hrefs', () => {
    render(<BottomNavigation />);

    expect(screen.getByLabelText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByLabelText('Add')).toHaveAttribute('href', '/add');
    expect(screen.getByLabelText('Profile')).toHaveAttribute('href', '/profile');
  });
});
