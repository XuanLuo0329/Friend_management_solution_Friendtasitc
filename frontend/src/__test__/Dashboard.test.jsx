import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Components/Dashboard';
import "@testing-library/jest-dom";
import { vi } from 'vitest';

vi.mock('../Components/Notification', () => ({
  __esModule: true,
  default: () => <div>Mock Notification</div>,
}));

// Mock the `useGet` hook
vi.mock('../useGet', () => ({
  default: vi.fn((url) => {
    if (url.includes('/api/user/event')) {
      return {
        data: [
          {
            id: '1',
            title: 'Event 1',
            content: 'Event Content 1',
            startTime: new Date().toISOString(),
          },
        ],
        mutate: vi.fn(),
      };
    } else if (url.includes('/api/user/friend')) {
      return {
        data: [
          {
            id: '2',
            name: 'Friend 1',
            relationship: 'Best Friend',
            birthday: new Date().toISOString(),
          },
        ],
      };
    }
    return { data: [] };
  }),
}));

describe('Dashboard', () => {
  it('renders the Dashboard component', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('renders the New Event button', () => {
    render(<Dashboard />);
    const newEventButton = screen.getByText(/New Event/i);
    expect(newEventButton).toBeInTheDocument();
    fireEvent.click(newEventButton);
  });

  it('displays events and friends', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Friend 1/i)).toBeInTheDocument();
  });

  it('renders the New Event button', () => {
    render(<Dashboard />);
    const newEventButton = screen.getByText(/New Event/i);
    expect(newEventButton).toBeInTheDocument();
    fireEvent.click(newEventButton);
    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create New Event')).not.toBeInTheDocument();
  });

  it('displays EventDetailDialog and then EditEventDialog', () => {
    render(<Dashboard />);
    const eventCard = screen.getByText(/Event 1/i);
    fireEvent.click(eventCard);
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Edit Event'));
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
    expect(screen.getByText('Edit Event')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
  });

  it('displays events and friends', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Friend 1/i)).toBeInTheDocument();
  });
});
