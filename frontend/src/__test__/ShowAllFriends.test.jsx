import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShowAllFriends from '../ShowAllFriends';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mocks
vi.mock('axios', () => ({
  __esModule: true,
  default: {
    get: vi.fn(() => Promise.resolve({
      data: [
        { name: "Alice Smith", birthday: "1985-09-15", gender: "Female", relationship: "Friend", _id: "123", preferences: { likes: ["Coffee"], dislikes: ["Slow Internet"]}},
        { name: "Bob Johnson", birthday: "1990-01-01", gender: "Male", relationship: "Colleague", _id: "456", preferences: { likes: ["Coding"], dislikes: ["Slow Internet"]}}
      ]
    })),
  }
}));

vi.mock('./useDelete', () => ({
  __esModule: true,
  default: () => ({
      deleteData: vi.fn(() => Promise.resolve())
  })
}));

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => vi.fn()
  };
});

// Define tests
describe('ShowAllFriends Component Tests', () => {
  beforeEach(() => {
      render(
          <BrowserRouter>
              <ShowAllFriends />
          </BrowserRouter>
      );
  });

  it('displays all contacts correctly', async () => {
    await screen.findByText('Alice Smith');
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });
 
});
