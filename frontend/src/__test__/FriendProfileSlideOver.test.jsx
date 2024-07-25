import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FriendProfileSlideOver from '../Components/GiftComponents/FriendProfileSlideOver';
import '@testing-library/jest-dom';

// Mock 'axios' with a default export
vi.mock('axios', () => ({
  __esModule: true, // Ensure ES module semantics are respected
  default: {
    get: vi.fn().mockResolvedValue({ data: [] })
  }
}));

// Mock 'react-router-dom' to provide a custom useNavigate function
vi.mock('react-router-dom', async (importOriginal) => {
    return {
        ...await vi.importActual('react-router-dom'),
        useNavigate: () => navigate
    };
});

const navigate = vi.fn();

const friendMock = {
  _id: '123',
  name: 'John Doe',
  birthday: '1990-01-01',
  relationship: 'Friend',
  mbtiType: 'INTJ',
  hobbies: ['Reading', 'Gaming'],
  skills: ['Writing', 'Drawing'],
  preferences: {
    likes: ['Cats', 'Pizza'],
    dislikes: ['Dogs', 'Pasta']
  }
};

describe('FriendProfileSlideOver Component Tests', () => {
  beforeEach(() => {
    navigate.mockClear();
    vi.clearAllMocks(); // Clearing the mock correctly
  });

  it('renders the component with friend information', () => {
    render(<FriendProfileSlideOver friend={friendMock} disabled={false} />, { wrapper: MemoryRouter });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Friend')).toBeInTheDocument();
  });

  it('handles button click and navigates correctly', async () => {
    render(<FriendProfileSlideOver friend={friendMock} disabled={false} />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText('Gift List'));
    
    // Use waitFor to wait for the expected navigation to be called
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/giftList', { state: { gifts: [] } });
    }, { timeout: 1000 }); 
  });
});
