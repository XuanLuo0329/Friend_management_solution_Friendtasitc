import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EventDetailDialog from '../Components/EventDetailDialog';
import { DashboardContext } from '../Components/Dashboard';
import { vi } from 'vitest';
import "@testing-library/jest-dom";

// Mock axios
vi.mock('axios');

// Mock data
const mockEvent = {
  _id: 'event123',
  title: 'Test Event',
  content: 'This is a test event',
  startTime: new Date('2024-06-01T09:00').toISOString(),
  endTime: new Date('2024-06-01T10:00').toISOString(),
  reminder: { daysBefore: 2, method: 'email' },
  repeat: true,
  repeatRule: {
    startDate: new Date('2024-06-01T09:00').toISOString(),
    repeat: 'weekly',
    interval: 1,
    endDate: new Date('2024-08-01T09:00').toISOString(),
  },
  tags: ['tag1', 'tag2'],
};

// Mock functions
const mockRefreshEvent = vi.fn();
const mockOnClose = vi.fn();
const mockOnEdit = vi.fn();

// Render Component with context
const renderEventDetailDialog = (event = mockEvent) => {
  return render(
    <DashboardContext.Provider value={{ refreshEvent: mockRefreshEvent }}>
      <EventDetailDialog event={event} onClose={mockOnClose} onEdit={mockOnEdit} />
    </DashboardContext.Provider>
  );
};

describe('EventDetailDialog', () => {
  beforeEach(() => {
    mockRefreshEvent.mockClear();
    mockOnClose.mockClear();
    mockOnEdit.mockClear();
    axios.delete.mockClear();
  });

  it('displays event data correctly', () => {
    renderEventDetailDialog();

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/This is a test event/i)).toBeInTheDocument();
    expect(screen.getByText('01/06/2024, 09:00')).toBeInTheDocument();
    expect(screen.getByText('01/06/2024, 10:00')).toBeInTheDocument();
    expect(screen.getByText(/Days Before: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Method: email/i)).toBeInTheDocument();
    expect(screen.getByText(/Repeat Frequency: weekly/i)).toBeInTheDocument();
    expect(screen.getByText(/Interval: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date: 01\/06\/2024, 09:00/)).toBeInTheDocument();
    expect(screen.getByText(/End Date: 01\/08\/2024, 09:00/)).toBeInTheDocument();
  });

  it('calls onEdit when the edit button is clicked', () => {
    renderEventDetailDialog();

    const editButton = screen.getByTitle(/Edit Event/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onClose after successful event deletion and waits for 2 seconds', async () => {
    renderEventDetailDialog();

    axios.delete.mockResolvedValue({ data: 'Event deleted successfully!' });

    const deleteButton = screen.getByTitle(/Delete Event/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Event deleted successfully!/i)).toBeInTheDocument();
    });

    await new Promise((resolve) => { setTimeout(resolve, 2000); });
    expect(mockRefreshEvent).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays an error message on delete failure', async () => {
    renderEventDetailDialog();

    axios.delete.mockRejectedValue(new Error('Deletion failed'));

    const deleteButton = screen.getByTitle(/Delete Event/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Error updating event/i)).toBeInTheDocument();
    });

    expect(mockRefreshEvent).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
