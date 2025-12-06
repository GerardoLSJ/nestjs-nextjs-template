import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Header } from './Header';

describe('Header', () => {
  it('should render with default title', () => {
    render(<Header />);
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<Header title="My App" />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('should call onMenuClick when menu button is clicked', async () => {
    const handleMenuClick = jest.fn();
    const user = userEvent.setup();

    render(<Header onMenuClick={handleMenuClick} />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it('should call onProfileClick when profile button is clicked', async () => {
    const handleProfileClick = jest.fn();
    const user = userEvent.setup();

    render(<Header onProfileClick={handleProfileClick} />);

    const profileButton = screen.getByRole('button', { name: /open profile/i });
    await user.click(profileButton);

    expect(handleProfileClick).toHaveBeenCalledTimes(1);
  });

  it('should not render menu button when onMenuClick is not provided', () => {
    render(<Header />);
    expect(screen.queryByRole('button', { name: /open menu/i })).not.toBeInTheDocument();
  });

  it('should not render profile button when onProfileClick is not provided', () => {
    render(<Header />);
    expect(screen.queryByRole('button', { name: /open profile/i })).not.toBeInTheDocument();
  });

  it('should hide profile button when showProfile is false', () => {
    render(<Header onProfileClick={jest.fn()} showProfile={false} />);
    expect(screen.queryByRole('button', { name: /open profile/i })).not.toBeInTheDocument();
  });

  it('should have proper ARIA labels on buttons', () => {
    render(<Header onMenuClick={jest.fn()} onProfileClick={jest.fn()} />);

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open profile/i })).toBeInTheDocument();
  });
});
