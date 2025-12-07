import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventForm } from './EventForm';

describe('EventForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnDatetimeChange = jest.fn();
  const TEST_DATE_TIME_BASE = '2025-12-10T';

  const defaultProps = {
    onSubmit: mockOnSubmit,
    datetime: `${TEST_DATE_TIME_BASE}14:00`,
    onDatetimeChange: mockOnDatetimeChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with all elements', () => {
      render(<EventForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /create new event/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/members/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const timeInput = screen.getByLabelText(/time/i);

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(titleInput).toBeRequired();
      expect(timeInput).toHaveAttribute('type', 'time');
      expect(timeInput).toBeRequired();
    });

    it('should have correct placeholder text', () => {
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const membersInput = screen.getByLabelText(/members/i);

      expect(titleInput).toHaveAttribute('placeholder', 'Team Meeting');
      expect(membersInput).toHaveAttribute('placeholder', 'John, Sarah, Mike');
    });

    it('should render members input as optional', () => {
      render(<EventForm {...defaultProps} />);

      const membersInput = screen.getByLabelText(/members/i);
      expect(membersInput).not.toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with all fields filled', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Team Meeting');
      await user.type(screen.getByLabelText(/members/i), 'Alice, Bob, Charlie');
      // Time is already 14:00 via defaultProps

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Team Meeting',
          members: 'Alice, Bob, Charlie',
          datetime: `${TEST_DATE_TIME_BASE}14:00`,
        });
      });
    });

    it('should submit form with only required fields', async () => {
      const user = userEvent.setup();
      // Use default time from props
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Solo Task');
      // Time is already 14:00 via defaultProps

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Solo Task',
          members: '',
          datetime: `${TEST_DATE_TIME_BASE}14:00`,
        });
      });
    });

    it('should reset title/members form fields after successful submission (but not time)', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;
      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/time/i) as HTMLInputElement;

      // Values are set by props/internal state
      await user.type(titleInput, 'Test Event');
      await user.type(membersInput, 'Test Member');

      // Submitting resets internal state (title/members) but time is controlled externally
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(membersInput.value).toBe('');
        expect(timeInput.value).toBe('14:00'); // Time remains from prop
      });
    });

    it('should call onSubmit only once per submission', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Test Event');

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Form Validation', () => {
    it('should not allow submission with empty title due to HTML5 validation', () => {
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;
      expect(titleInput.required).toBe(true);
    });

    it('should not allow submission with empty time due to HTML5 validation', () => {
      // time is required, so the defaultProps set it to 14:00, making it valid.
      // We rely on the browser/user-event interaction to test required fields,
      // but for this unit test, we ensure the input attribute exists.
      render(<EventForm {...defaultProps} />);
      const timeInput = screen.getByLabelText(/time/i) as HTMLInputElement;
      expect(timeInput.required).toBe(true);
    });

    it('should accept members field as optional', () => {
      render(<EventForm {...defaultProps} />);

      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;
      expect(membersInput.required).toBe(false);
    });
  });

  describe('User Interaction', () => {
    it('should update title input value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;

      await user.type(titleInput, 'My Event');

      expect(titleInput.value).toBe('My Event');
    });

    it('should update members input value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;

      await user.type(membersInput, 'Alice, Bob');

      expect(membersInput.value).toBe('Alice, Bob');
    });

    it('should call onDatetimeChange when time input value changes', () => {
      // Initial state is 2025-12-10T14:00
      render(<EventForm {...defaultProps} />);

      const timeInput = screen.getByLabelText(/time/i) as HTMLInputElement;

      // Simulate user changing time to 18:30 using fireEvent for deterministic testing
      fireEvent.change(timeInput, { target: { value: '18:30' } });

      expect(mockOnDatetimeChange).toHaveBeenCalledWith('2025-12-10T18:30');
    });

    it('should allow clearing and re-entering title/members values', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;

      await user.type(titleInput, 'First Title');
      expect(titleInput.value).toBe('First Title');

      await user.clear(titleInput);
      expect(titleInput.value).toBe('');

      await user.type(titleInput, 'Second Title');
      expect(titleInput.value).toBe('Second Title');
    });
  });

  describe('Multiple Submissions', () => {
    it('should handle multiple event creations in sequence', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      // First event
      await user.type(screen.getByLabelText(/event title/i), 'Event 1');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      // Second event
      await user.type(screen.getByLabelText(/event title/i), 'Event 2');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(2);
      });

      // Both submissions should use the same default datetime prop value
      expect(mockOnSubmit).toHaveBeenNthCalledWith(1, {
        title: 'Event 1',
        members: '',
        datetime: `${TEST_DATE_TIME_BASE}14:00`,
      });

      expect(mockOnSubmit).toHaveBeenNthCalledWith(2, {
        title: 'Event 2',
        members: '',
        datetime: `${TEST_DATE_TIME_BASE}14:00`,
      });
    });
  });
});
