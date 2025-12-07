import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventList } from './EventList';
import type { Event } from '../../types/event.types';

describe('EventList', () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should render empty state when no events exist', () => {
      render(<EventList events={[]} onDelete={mockOnDelete} />);

      expect(screen.getByText(/no events yet/i)).toBeInTheDocument();
      expect(screen.getByText(/create your first event!/i)).toBeInTheDocument();
    });

    it('should not render event list when empty', () => {
      render(<EventList events={[]} onDelete={mockOnDelete} />);

      expect(screen.queryByText(/your events/i)).not.toBeInTheDocument();
    });
  });

  describe('Events Display', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Team Meeting',
        members: 'Alice, Bob',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Project Review',
        members: 'Charlie, David',
        datetime: '2025-12-15T16:30',
        createdAt: '2025-12-06T11:00:00.000Z',
      },
    ];

    it('should render section heading when events exist', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText(/your events/i)).toBeInTheDocument();
    });

    it('should render all events', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Project Review')).toBeInTheDocument();
    });

    it('should display event members', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('Alice, Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie, David')).toBeInTheDocument();
    });

    it('should display formatted date and time', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      // The exact format depends on locale, but we can check that dates are rendered
      const dateElements = screen.getAllByText(/Dec|12/i);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should render delete button for each event', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete event/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it('should render single event correctly', () => {
      const singleEvent: Event[] = [
        {
          id: 'event-1',
          title: 'Solo Event',
          members: 'Just Me',
          datetime: '2025-12-20T10:00',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={singleEvent} onDelete={mockOnDelete} />);

      expect(screen.getByText('Solo Event')).toBeInTheDocument();
      expect(screen.getByText('Just Me')).toBeInTheDocument();
    });
  });

  describe('Event Members Display', () => {
    it('should display members section when members exist', () => {
      const eventsWithMembers: Event[] = [
        {
          id: 'event-1',
          title: 'Team Event',
          members: 'Alice, Bob',
          datetime: '2025-12-10T14:00',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithMembers} onDelete={mockOnDelete} />);

      expect(screen.getByText('Alice, Bob')).toBeInTheDocument();
    });

    it('should not display members section when members is empty', () => {
      const eventsWithoutMembers: Event[] = [
        {
          id: 'event-1',
          title: 'Solo Event',
          members: '',
          datetime: '2025-12-10T14:00',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithoutMembers} onDelete={mockOnDelete} />);

      expect(screen.getByText('Solo Event')).toBeInTheDocument();
      // Should only have one detail section (date) visible
      const detailSections = screen
        .getByText('Solo Event')
        .parentElement?.parentElement?.querySelectorAll('.detail');
      expect(detailSections?.length).toBe(1);
    });
  });

  describe('Delete Functionality', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Event to Delete',
        members: 'Alice',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Event to Keep',
        members: 'Bob',
        datetime: '2025-12-11T15:00',
        createdAt: '2025-12-06T11:00:00.000Z',
      },
    ];

    it('should call onDelete with correct event id when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete event/i });

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith('event-1');
      });
    });

    it('should call onDelete only once per click', async () => {
      const user = userEvent.setup();
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete event/i });

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
      });
    });

    it('should be able to delete multiple events', async () => {
      const user = userEvent.setup();
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete event/i });

      await user.click(deleteButtons[0]);
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledTimes(2);
      });

      expect(mockOnDelete).toHaveBeenNthCalledWith(1, 'event-1');
      expect(mockOnDelete).toHaveBeenNthCalledWith(2, 'event-2');
    });
  });

  describe('Date Formatting', () => {
    it('should handle valid date strings', () => {
      const events: Event[] = [
        {
          id: 'event-1',
          title: 'Valid Date Event',
          members: 'Alice',
          datetime: '2025-12-10T14:00',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('Valid Date Event')).toBeInTheDocument();
      // Date should be formatted and displayed (checking it exists is enough)
      const dateText = screen.getByText(/Dec|12/i);
      expect(dateText).toBeInTheDocument();
    });

    it('should handle empty date strings gracefully', () => {
      const events: Event[] = [
        {
          id: 'event-1',
          title: 'No Date Event',
          members: 'Alice',
          datetime: '',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('No Date Event')).toBeInTheDocument();
      expect(screen.getByText(/no date set/i)).toBeInTheDocument();
    });

    it('should handle invalid date strings gracefully', () => {
      const events: Event[] = [
        {
          id: 'event-1',
          title: 'Invalid Date Event',
          members: 'Alice',
          datetime: 'invalid-date',
          createdAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('Invalid Date Event')).toBeInTheDocument();
      // Should display the invalid date string as-is
      expect(screen.getByText('invalid-date')).toBeInTheDocument();
    });
  });

  describe('Event Icons', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Event with Icons',
        members: 'Alice',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
    ];

    it('should display calendar icon for date', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('should display members icon when members exist', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('👥')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Accessible Event',
        members: 'Alice',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
    ];

    it('should have proper aria-label on delete button', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete event/i });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete event');
    });

    it('should render headings with proper hierarchy', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      const mainHeading = screen.getByRole('heading', { name: /your events/i });
      expect(mainHeading).toBeInTheDocument();

      const eventTitles = screen.getAllByRole('heading', { name: /accessible event/i });
      expect(eventTitles).toHaveLength(1);
    });
  });
});
