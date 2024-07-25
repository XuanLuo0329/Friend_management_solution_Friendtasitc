import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import NewEventDialog from '../Components/NewEventDialog';
import { DashboardContext } from '../Components/Dashboard';
import { vi } from 'vitest';
import "@testing-library/jest-dom";

// Mock axios
vi.mock('axios');

// Mock data for testing
const mockRefreshEvent = vi.fn();
const mockOnClose = vi.fn();

// Render Component with context
const renderNewEventDialog = (onClose = mockOnClose) => {
    return render(
        <DashboardContext.Provider value={{ refreshEvent: mockRefreshEvent }}>
            <NewEventDialog onClose={onClose} />
        </DashboardContext.Provider>
    );
};

describe('NewEventDialog', () => {
    beforeEach(() => {
        mockRefreshEvent.mockClear();
        mockOnClose.mockClear();
        axios.post.mockClear();
    });

    it('validates form inputs before submitting', async () => {
        renderNewEventDialog();

        // Try to submit with empty required fields
        fireEvent.submit(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(screen.getByText(/Title is required/)).toBeInTheDocument();
            expect(screen.getByText(/Content is required/)).toBeInTheDocument();
            expect(screen.getByText(/Start Time is required/)).toBeInTheDocument();
        });
    });

    it('sends correct data on successful submission', async () => {
        renderNewEventDialog();

        // Fill out the form
        fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'My New Event' } });
        fireEvent.change(screen.getByTestId('content-input'), { target: { value: 'An amazing event' } });
        fireEvent.change(screen.getByTestId('startTime-input'), { target: { value: '2024-06-01T09:00' } });
        fireEvent.change(screen.getByTestId('daysBefore-input'), { target: { value: '2' } });

        // Mock successful creation
        axios.post.mockResolvedValue({ data: 'Event created successfully!' });

        // Submit form
        fireEvent.submit(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
                title: 'My New Event',
                content: 'An amazing event',
                startTime: new Date('2024-06-01T09:00'),
                endTime: null,
                reminder: {
                    daysBefore: 2,
                    method: 'email',
                },
                repeat: false,
                repeatRule: undefined,
                tags: [],
            });
            expect(screen.getByText(/Event created successfully!/)).toBeInTheDocument();
        });
        await new Promise((resolve) => {setTimeout(resolve, 2000);});
        expect(mockRefreshEvent).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes the modal when "Cancel" is clicked', () => {
        renderNewEventDialog();

        fireEvent.click(screen.getByTestId('cancel-button'));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
