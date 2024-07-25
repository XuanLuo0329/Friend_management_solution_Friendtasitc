import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MemoryDetails from '../Components/MemoryComponent/MemoryDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the fetch API to handle the GET and DELETE requests
global.fetch = vi.fn(url => {
  if (url.includes('DELETE')) {
    return Promise.resolve({
      ok: true // assume deletion is always successful for simplicity
    });
  } else {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        _id: '1',
        title: 'Trip to Paris',
        date: '2022-04-15',
    
        description: 'It was a fantastic journey!',
        image: 'ski1.jpg'
      })
    });
  }
});

// Mock navigation and parameters
const mockNavigate = vi.fn();
const useParams = vi.fn().mockReturnValue({ id: '1' });

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useParams: () => useParams(),
    useNavigate: () => mockNavigate
  };
});

describe('MemoryDetails Component Tests', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MemoryDetails />
      </BrowserRouter>
    );
  });

  it('displays the memory details correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('Trip to Paris')).toBeInTheDocument();
      expect(screen.getByText('It was a fantastic journey!')).toBeInTheDocument();
    });
  });

  it('navigates to update page when edit button is clicked', async () => {
    const editButton = await screen.findByRole('button', { name: 'Edit' });
    userEvent.click(editButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/update-memory/1');
    });
  });

  it('calls delete API and navigates back when delete button is clicked', async () => {
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });
    userEvent.click(deleteButton);
    await waitFor(() => {
        // Check if any of the fetch calls were made with the DELETE method
        const deleteFetchCall = global.fetch.mock.calls.find(call => 
          call[0].includes('/api/user/memories/') && call[1].method === 'DELETE'
        );
    
        expect(deleteFetchCall).toBeDefined();  // Ensure that there was a DELETE call
        expect(mockNavigate).toHaveBeenCalledWith('/showAllMemories');
      });
  });
});
