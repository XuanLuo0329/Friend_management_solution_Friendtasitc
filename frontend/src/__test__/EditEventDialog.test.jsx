import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EditEventDialog from '../Components/EditEventDialog';
import { DashboardContext } from '../Components/Dashboard';
import { vi } from 'vitest';
import "@testing-library/jest-dom";

// Mock axios
vi.mock('axios');

// Setup initial event data
const initialEvent = {
  _id: 'event123',
  title: 'Birthday Party',
  content: 'At my house',
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  reminder: { daysBefore: 3, method: 'email' },
  repeat: true,
  repeatRule: { startDate: new Date().toISOString(), repeat: 'weekly', interval: 2, endDate: new Date().toISOString() },
  tags: ['fun', 'friends']
};

// Render Component with context
const renderEditEventDialog = (event) => {
  return render(
    <DashboardContext.Provider value={{ refreshEvent: vi.fn() }}>
      <EditEventDialog event={event} onClose={vi.fn()} />
    </DashboardContext.Provider>
  );
};

describe('EditEventDialog', () => {
  it('validates form inputs before submitting', async () => {
    renderEditEventDialog(initialEvent);
    
    // Clear required fields and try to submit
    fireEvent.change(screen.getByTestId('title'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('content'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('startTime'), { target: { value: '' } });
    fireEvent.submit(screen.getByText('Update Event'));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/)).toBeInTheDocument();
      expect(screen.getByText(/Content is required/)).toBeInTheDocument();
      expect(screen.getByText(/Start Time is required/)).toBeInTheDocument();
    });
  });

  it('sends correct data on successful submission', async () => {
    renderEditEventDialog(initialEvent);

    // Mock successful update
    axios.put.mockResolvedValue({ data: 'Event updated successfully!' });

    // Submit form
    fireEvent.submit(screen.getByText('Update Event'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        title: initialEvent.title,
        content: initialEvent.content,
        startTime: expect.any(Date),
        endTime: expect.any(Date),
        reminder: {
          daysBefore: expect.any(Number),
          method: 'email',
        },
        repeat: true,
        repeatRule: {
          startDate: expect.any(Date),
          repeat: 'weekly',
          interval: 2,
          endDate: expect.any(Date),
        },
        tags: initialEvent.tags,
      });
      expect(screen.getByText(/Event updated successfully!/)).toBeInTheDocument();
    });
  });
});
