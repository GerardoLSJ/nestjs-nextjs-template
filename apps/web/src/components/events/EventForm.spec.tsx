import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventForm } from './EventForm';

describe('EventForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with all elements', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('heading', { name: /create new event/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/members/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date & time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const dateTimeInput = screen.getByLabelText(/date & time/i);

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(titleInput).toBeRequired();
      expect(dateTimeInput).toHaveAttribute('type', 'datetime-local');
      expect(dateTimeInput).toBeRequired();
    });

    it('should have correct placeholder text', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/event title/i);
      const membersInput = screen.getByLabelText(/members/i);

      expect(titleInput).toHaveAttribute('placeholder', 'Team Meeting');
      expect(membersInput).toHaveAttribute('placeholder', 'John, Sarah, Mike');
    });

    it('should render members input as optional', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const membersInput = screen.getByLabelText(/members/i);
      expect(membersInput).not.toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with all fields filled', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/event title/i), 'Team Meeting');
      await user.type(screen.getByLabelText(/members/i), 'Alice, Bob, Charlie');
      await user.type(screen.getByLabelText(/date & time/i), '2025-12-10T14:00');

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Team Meeting',
          members: 'Alice, Bob, Charlie',
          dateTime: '2025-12-10T14:00',
        });
      });
    });

    it('should submit form with only required fields', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/event title/i), 'Solo Task');
      await user.type(screen.getByLabelText(/date & time/i), '2025-12-15T09:00');

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Solo Task',
          members: '',
          dateTime: '2025-12-15T09:00',
        });
      });
    });

    it('should reset form fields after successful submission', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;
      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;
      const dateTimeInput = screen.getByLabelText(/date & time/i) as HTMLInputElement;

      await user.type(titleInput, 'Test Event');
      await user.type(membersInput, 'Test Member');
      await user.type(dateTimeInput, '2025-12-20T10:00');

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(membersInput.value).toBe('');
        expect(dateTimeInput.value).toBe('');
      });
    });

    it('should call onSubmit only once per submission', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/event title/i), 'Test Event');
      await user.type(screen.getByLabelText(/date & time/i), '2025-12-10T14:00');

      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Form Validation', () => {
    it('should not allow submission with empty title due to HTML5 validation', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;
      expect(titleInput.required).toBe(true);
    });

    it('should not allow submission with empty date/time due to HTML5 validation', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const dateTimeInput = screen.getByLabelText(/date & time/i) as HTMLInputElement;
      expect(dateTimeInput.required).toBe(true);
    });

    it('should accept members field as optional', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;
      expect(membersInput.required).toBe(false);
    });
  });

  describe('User Interaction', () => {
    it('should update title input value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement;

      await user.type(titleInput, 'My Event');

      expect(titleInput.value).toBe('My Event');
    });

    it('should update members input value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const membersInput = screen.getByLabelText(/members/i) as HTMLInputElement;

      await user.type(membersInput, 'Alice, Bob');

      expect(membersInput.value).toBe('Alice, Bob');
    });

    it('should update dateTime input value on user typing', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const dateTimeInput = screen.getByLabelText(/date & time/i) as HTMLInputElement;

      await user.type(dateTimeInput, '2025-12-25T18:00');

      expect(dateTimeInput.value).toBe('2025-12-25T18:00');
    });

    it('should allow clearing and re-entering values', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

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
      render(<EventForm onSubmit={mockOnSubmit} />);

      // First event
      await user.type(screen.getByLabelText(/event title/i), 'Event 1');
      await user.type(screen.getByLabelText(/date & time/i), '2025-12-10T10:00');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      // Second event
      await user.type(screen.getByLabelText(/event title/i), 'Event 2');
      await user.type(screen.getByLabelText(/date & time/i), '2025-12-11T11:00');
      await user.click(screen.getByRole('button', { name: /create event/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(2);
      });

      expect(mockOnSubmit).toHaveBeenNthCalledWith(1, {
        title: 'Event 1',
        members: '',
        dateTime: '2025-12-10T10:00',
      });

      expect(mockOnSubmit).toHaveBeenNthCalledWith(2, {
        title: 'Event 2',
        members: '',
        dateTime: '2025-12-11T11:00',
      });
    });
  });
});
