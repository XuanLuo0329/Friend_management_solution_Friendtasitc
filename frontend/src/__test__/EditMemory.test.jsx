import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EditMemory from '../Components/MemoryComponent/EditMemory';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock fetch instead of axios
global.fetch = vi.fn((url) => {
  if (url.includes('/api/user/memories/1')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        _id: '1',
        title: 'Existing Memory',
        tag: 'Nature',
        date: '2021-05-16',
        description: 'A lovely trip to the mountains',
        image: 'mountain.jpg'
      })
    });
  } else if (url.includes('/api/user/memories/1')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        _id: '1',
        title: 'Updated Title',
        tag: 'Updated Tag',
        date: '2021-05-16',
        description: 'Updated Description',
        image: 'updated.jpg'
      })
    });
  }
  return Promise.reject(new Error('path not found'));
});
// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' })
    };
});

describe('EditMemory Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <EditMemory />
      </MemoryRouter>
    );
  });

  it('loads existing memory details into form fields', async () => {
    // Using findByDisplayValue to handle the asynchronous loading of data
    const title = await screen.findByDisplayValue('Existing Memory');
    const tag = await screen.findByDisplayValue('Nature');
    const date = await screen.findByDisplayValue('2021-05-16');
    const description = await screen.findByDisplayValue('A lovely trip to the mountains');

    expect(title).toBeInTheDocument();
    expect(tag).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('updates memory details when form fields are changed and submitted', async () => {
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api/user/memories/1'), expect.any(Object));
    });
  });

  it('navigates to the memory list on cancel', async () => {
    const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/showAllMemories');
  });
});
