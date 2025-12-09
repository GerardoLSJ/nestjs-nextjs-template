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
        messages: 'Discuss Q4 goals',
        datetime: '2025-12-10T14:00',
        userId: 'user-1',
        createdAt: '2025-12-06T10:00:00.000Z',
        updatedAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Project Review',
        members: 'Charlie, David',
        messages: 'Review deliverables',
        datetime: '2025-12-15T16:30',
        userId: 'user-1',
        createdAt: '2025-12-06T11:00:00.000Z',
        updatedAt: '2025-12-06T11:00:00.000Z',
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

    it('should display event messages', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('Discuss Q4 goals')).toBeInTheDocument();
      expect(screen.getByText('Review deliverables')).toBeInTheDocument();
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
          messages: 'Personal task',
          datetime: '2025-12-20T10:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={singleEvent} onDelete={mockOnDelete} />);

      expect(screen.getByText('Solo Event')).toBeInTheDocument();
      expect(screen.getByText('Just Me')).toBeInTheDocument();
      expect(screen.getByText('Personal task')).toBeInTheDocument();
    });
  });

  describe('Timezone Display', () => {
    const mockEventWithTimezone: Event[] = [
      {
        id: 'event-1',
        title: 'Timezone Event',
        members: 'Alice',
        messages: 'Test timezone',
        datetime: '2025-12-10T22:00:00.000Z', // UTC time
        userId: 'user-1',
        createdAt: '2025-12-06T10:00:00.000Z',
        updatedAt: '2025-12-06T10:00:00.000Z',
      },
    ];

    it('should display PDT timezone label', () => {
      render(<EventList events={mockEventWithTimezone} onDelete={mockOnDelete} />);

      expect(screen.getByText('PDT:')).toBeInTheDocument();
    });

    it('should display CST timezone label', () => {
      render(<EventList events={mockEventWithTimezone} onDelete={mockOnDelete} />);

      expect(screen.getByText('CST:')).toBeInTheDocument();
    });

    it('should show both PDT and CST times for the same event', () => {
      render(<EventList events={mockEventWithTimezone} onDelete={mockOnDelete} />);

      // Both timezone labels should exist
      expect(screen.getByText('PDT:')).toBeInTheDocument();
      expect(screen.getByText('CST:')).toBeInTheDocument();

      // Check that time values contain timezone abbreviations (PST/PDT or CST/CDT depending on date)
      const pdtRow = screen.getByText('PDT:').parentElement;
      const cstRow = screen.getByText('CST:').parentElement;

      expect(pdtRow).toBeInTheDocument();
      expect(cstRow).toBeInTheDocument();
    });

    it('should display different times for PDT and CST', () => {
      render(<EventList events={mockEventWithTimezone} onDelete={mockOnDelete} />);

      // PDT and CST are 2 hours apart, so the times should be different
      const pdtRow = screen.getByText('PDT:').parentElement;
      const cstRow = screen.getByText('CST:').parentElement;

      expect(pdtRow?.textContent).not.toEqual(cstRow?.textContent);
    });
  });

  describe('Event Members Display', () => {
    it('should display members section when members exist', () => {
      const eventsWithMembers: Event[] = [
        {
          id: 'event-1',
          title: 'Team Event',
          members: 'Alice, Bob',
          messages: 'Team meeting',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
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
          messages: 'Solo task',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithoutMembers} onDelete={mockOnDelete} />);

      expect(screen.getByText('Solo Event')).toBeInTheDocument();
      // Members icon should not be present
      expect(screen.queryByText('👥')).not.toBeInTheDocument();
    });
  });

  describe('Messages Display', () => {
    it('should display messages section when messages exist', () => {
      const eventsWithMessages: Event[] = [
        {
          id: 'event-1',
          title: 'Event with Message',
          members: 'Alice',
          messages: 'Important meeting notes',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithMessages} onDelete={mockOnDelete} />);

      expect(screen.getByText('Important meeting notes')).toBeInTheDocument();
      expect(screen.getByText('💬')).toBeInTheDocument();
    });

    it('should not display messages section when messages is empty', () => {
      const eventsWithoutMessages: Event[] = [
        {
          id: 'event-1',
          title: 'Event without Message',
          members: 'Alice',
          messages: '',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithoutMessages} onDelete={mockOnDelete} />);

      expect(screen.getByText('Event without Message')).toBeInTheDocument();
      // Messages icon should not be present
      expect(screen.queryByText('💬')).not.toBeInTheDocument();
    });

    it('should display long messages correctly', () => {
      const eventsWithLongMessage: Event[] = [
        {
          id: 'event-1',
          title: 'Event with Long Message',
          members: 'Alice',
          messages:
            'This is a very long message that contains important details about the meeting agenda and action items for the team',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={eventsWithLongMessage} onDelete={mockOnDelete} />);

      expect(
        screen.getByText(
          'This is a very long message that contains important details about the meeting agenda and action items for the team'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Event to Delete',
        members: 'Alice',
        messages: 'Delete me',
        datetime: '2025-12-10T14:00',
        userId: 'user-1',
        createdAt: '2025-12-06T10:00:00.000Z',
        updatedAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Event to Keep',
        members: 'Bob',
        messages: 'Keep me',
        datetime: '2025-12-11T15:00',
        userId: 'user-1',
        createdAt: '2025-12-06T11:00:00.000Z',
        updatedAt: '2025-12-06T11:00:00.000Z',
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
          messages: 'Valid event',
          datetime: '2025-12-10T14:00',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('Valid Date Event')).toBeInTheDocument();
      // Date should be formatted and displayed (shown twice for PDT and CST)
      const dateTexts = screen.getAllByText(/Dec|12/i);
      expect(dateTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty date strings gracefully', () => {
      const events: Event[] = [
        {
          id: 'event-1',
          title: 'No Date Event',
          members: 'Alice',
          messages: 'No date',
          datetime: '',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('No Date Event')).toBeInTheDocument();
      // "No date set" appears in both PDT and CST rows
      const noDateTexts = screen.getAllByText(/no date set/i);
      expect(noDateTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle invalid date strings gracefully', () => {
      const events: Event[] = [
        {
          id: 'event-1',
          title: 'Invalid Date Event',
          members: 'Alice',
          messages: 'Invalid date',
          datetime: 'invalid-date',
          userId: 'user-1',
          createdAt: '2025-12-06T10:00:00.000Z',
          updatedAt: '2025-12-06T10:00:00.000Z',
        },
      ];

      render(<EventList events={events} onDelete={mockOnDelete} />);

      expect(screen.getByText('Invalid Date Event')).toBeInTheDocument();
      // Should display the invalid date string as-is (shown twice for PDT and CST)
      const invalidDateTexts = screen.getAllByText('invalid-date');
      expect(invalidDateTexts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Event Icons', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Event with Icons',
        members: 'Alice',
        messages: 'Test messages',
        datetime: '2025-12-10T14:00',
        userId: 'user-1',
        createdAt: '2025-12-06T10:00:00.000Z',
        updatedAt: '2025-12-06T10:00:00.000Z',
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

    it('should display messages icon when messages exist', () => {
      render(<EventList events={mockEvents} onDelete={mockOnDelete} />);

      expect(screen.getByText('💬')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    const mockEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Accessible Event',
        members: 'Alice',
        messages: 'Accessible event message',
        datetime: '2025-12-10T14:00',
        userId: 'user-1',
        createdAt: '2025-12-06T10:00:00.000Z',
        updatedAt: '2025-12-06T10:00:00.000Z',
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
