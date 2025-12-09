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
      expect(screen.getByLabelText(/messages/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const messagesInput = screen.getByLabelText(/messages/i);
      const timeInput = screen.getByLabelText(/time/i);

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(titleInput).toBeRequired();
      expect(messagesInput).toBeRequired();
      expect(timeInput).toHaveAttribute('type', 'time');
      expect(timeInput).toBeRequired();
    });

    it('should have correct placeholder text', () => {
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const membersInput = screen.getByLabelText(/members/i);
      const messagesInput = screen.getByLabelText(/messages/i);

      expect(titleInput).toHaveAttribute('placeholder', 'Team Meeting');
      expect(membersInput).toHaveAttribute('placeholder', 'John, Sarah, Mike');
      expect(messagesInput).toHaveAttribute(
        'placeholder',
        'Add event details, agenda, or notes...'
      );
    });

    it('should render members input as optional', () => {
      render(<EventForm {...defaultProps} />);

      const membersInput = screen.getByLabelText(/members/i);
      expect(membersInput).not.toBeRequired();
    });

    it('should render messages input as required', () => {
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i);
      expect(messagesInput).toBeRequired();
    });

    it('should render messages as a textarea element', () => {
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i);
      expect(messagesInput.tagName).toBe('TEXTAREA');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with all fields filled', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Team Meeting');
      await user.type(screen.getByLabelText(/members/i), 'Alice, Bob, Charlie');
      await user.type(screen.getByLabelText(/messages/i), 'Discuss Q4 goals');
      // Time is already 14:00 via defaultProps

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Team Meeting',
          members: 'Alice, Bob, Charlie',
          messages: 'Discuss Q4 goals',
          datetime: `${TEST_DATE_TIME_BASE}14:00`,
        });
      });
    });

    it('should submit form with only required fields (no optional members)', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Solo Task');
      await user.type(screen.getByLabelText(/messages/i), 'Personal task details');
      // Time is already 14:00 via defaultProps

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Solo Task',
          members: '',
          messages: 'Personal task details',
          datetime: `${TEST_DATE_TIME_BASE}14:00`,
        });
      });
    });

    it('should reset all internal form fields after successful submission (but not time)', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;
      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;
      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;
      const timeInput = screen.getByLabelText(/time/i) as HTMLInputElement;

      // Values are set by props/internal state
      await user.type(titleInput, 'Test Event');
      await user.type(membersInput, 'Test Member');
      await user.type(messagesInput, 'Test Message');

      // Submitting resets internal state (title/members/messages) but time is controlled externally
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(membersInput.value).toBe('');
        expect(messagesInput.value).toBe('');
        expect(timeInput.value).toBe('14:00'); // Time remains from prop
      });
    });

    it('should call onSubmit only once per submission', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/event title/i), 'Test Event');
      await user.type(screen.getByLabelText(/messages/i), 'Test message');

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

    it('should not allow submission with empty messages due to HTML5 validation', () => {
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;
      expect(messagesInput.required).toBe(true);
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

    it('should update messages textarea value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;

      await user.type(messagesInput, 'Meeting agenda and notes');

      expect(messagesInput.value).toBe('Meeting agenda and notes');
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

    it('should allow clearing and re-entering messages', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;

      await user.type(messagesInput, 'First message');
      expect(messagesInput.value).toBe('First message');

      await user.clear(messagesInput);
      expect(messagesInput.value).toBe('');

      await user.type(messagesInput, 'Second message');
      expect(messagesInput.value).toBe('Second message');
    });

    it('should allow multiline input in messages textarea', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;

      await user.type(messagesInput, 'Line 1{enter}Line 2{enter}Line 3');

      expect(messagesInput.value).toContain('Line 1');
      expect(messagesInput.value).toContain('Line 2');
      expect(messagesInput.value).toContain('Line 3');
    });
  });

  describe('Multiple Submissions', () => {
    it('should handle multiple event creations in sequence', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      // First event
      await user.type(screen.getByLabelText(/event title/i), 'Event 1');
      await user.type(screen.getByLabelText(/messages/i), 'Message 1');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      // Second event
      await user.type(screen.getByLabelText(/event title/i), 'Event 2');
      await user.type(screen.getByLabelText(/messages/i), 'Message 2');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(2);
      });

      // Both submissions should use the same default datetime prop value
      expect(mockOnSubmit).toHaveBeenNthCalledWith(1, {
        title: 'Event 1',
        members: '',
        messages: 'Message 1',
        datetime: `${TEST_DATE_TIME_BASE}14:00`,
      });

      expect(mockOnSubmit).toHaveBeenNthCalledWith(2, {
        title: 'Event 2',
        members: '',
        messages: 'Message 2',
        datetime: `${TEST_DATE_TIME_BASE}14:00`,
      });
    });
  });

  describe('Messages Field Usability', () => {
    it('should have textarea with 3 rows for better usability', () => {
      render(<EventForm {...defaultProps} />);

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;
      expect(messagesInput).toHaveAttribute('rows', '3');
    });

    it('should display long messages correctly', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const longMessage =
        'This is a very long message that contains important details about the meeting agenda and action items for the team to follow up on';

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;
      await user.type(messagesInput, longMessage);

      expect(messagesInput.value).toBe(longMessage);
    });

    it('should handle special characters in messages', async () => {
      const user = userEvent.setup();
      render(<EventForm {...defaultProps} />);

      const specialMessage = 'Task #1: Review @team! Cost: $500 (50% discount)';

      const messagesInput = screen.getByLabelText(/messages/i) as HTMLTextAreaElement;
      await user.type(messagesInput, specialMessage);

      expect(messagesInput.value).toBe(specialMessage);
    });
  });
});
