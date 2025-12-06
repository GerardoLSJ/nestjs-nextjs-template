import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CalendarPicker } from './CalendarPicker';

describe('CalendarPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock system time to ensure deterministic tests
    jest.useFakeTimers();
    // Use local time construction to avoid timezone issues
    jest.setSystemTime(new Date(2025, 11, 6)); // Dec 6, 2025
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render current month and year by default', () => {
      render(<CalendarPicker onChange={mockOnChange} />);

      expect(screen.getByText('December 2025')).toBeInTheDocument();
      expect(screen.getByRole('application', { name: /calendar/i })).toBeInTheDocument();
    });

    it('should render provided value date', () => {
      // Use local date construction to match component's internal logic
      const value = new Date(2025, 9, 15); // Oct 15, 2025
      render(<CalendarPicker value={value} onChange={mockOnChange} />);

      expect(screen.getByText('October 2025')).toBeInTheDocument();
      const selectedDay = screen.getByRole('button', { name: /october 15, 2025/i });
      expect(selectedDay).toHaveClass('selected');
      expect(selectedDay).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render days of the week', () => {
      render(<CalendarPicker onChange={mockOnChange} />);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.forEach((day) => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('should highlight today', () => {
      render(<CalendarPicker onChange={mockOnChange} />);

      const today = screen.getByRole('button', { name: /december 6, 2025/i });
      expect(today).toHaveClass('today');
    });
  });

  describe('Navigation', () => {
    it('should navigate to previous month', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CalendarPicker onChange={mockOnChange} />);

      const prevButton = screen.getByRole('button', { name: /previous month/i });
      await user.click(prevButton);

      expect(screen.getByText('November 2025')).toBeInTheDocument();
    });

    it('should navigate to next month', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CalendarPicker onChange={mockOnChange} />);

      const nextButton = screen.getByRole('button', { name: /next month/i });
      await user.click(nextButton);

      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onChange when a date is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CalendarPicker onChange={mockOnChange} />);

      const dayToClick = screen.getByRole('button', { name: /december 15, 2025/i });
      await user.click(dayToClick);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const callArg = mockOnChange.mock.calls[0][0];
      expect(callArg.getDate()).toBe(15);
      expect(callArg.getMonth()).toBe(11); // December is 11
      expect(callArg.getFullYear()).toBe(2025);
    });

    it('should not call onChange when clicking a disabled date (minDate)', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const minDate = new Date(2025, 11, 10); // Dec 10, 2025
      render(<CalendarPicker onChange={mockOnChange} minDate={minDate} />);

      const disabledDay = screen.getByRole('button', { name: /december 5, 2025/i });
      expect(disabledDay).toBeDisabled();
      expect(disabledDay).toHaveClass('disabled');

      await user.click(disabledDay);
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when clicking a disabled date (maxDate)', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const maxDate = new Date(2025, 11, 20); // Dec 20, 2025
      render(<CalendarPicker onChange={mockOnChange} maxDate={maxDate} />);

      const disabledDay = screen.getByRole('button', { name: /december 25, 2025/i });
      expect(disabledDay).toBeDisabled();
      expect(disabledDay).toHaveClass('disabled');

      await user.click(disabledDay);
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
