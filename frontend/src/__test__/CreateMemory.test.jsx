import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CreateMemory from '../Components/MemoryComponent/CreateMemory';
import.meta.env = { VITE_API_BASE_URL: 'http://localhost/3000' };

beforeEach(() => {
    // clear mocks
    vi.clearAllMocks();
    localStorage.clear();
  
    // modify fetch
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Memory created successfully' }),
    }));
  });
  
import.meta.env = { VITE_API_BASE_URL: 'http://example.com' };

// Mocking useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

// Mocking localStorage for token storage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CreateMemory component', () => {
  it('should render correctly', () => {
    render(<MemoryRouter><CreateMemory /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Create New Memory', level: 1 })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Create Memory' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
  });

  it('handles input changes', async () => {
    render(<MemoryRouter><CreateMemory /></MemoryRouter>);
    const titleInput = screen.getByLabelText('Title:');
    const descriptionTextArea = screen.getByLabelText('Description:');
    await userEvent.type(titleInput, 'New Memory');
    expect(titleInput.value).toBe('New Memory');
    await userEvent.type(descriptionTextArea, 'This is a new memory.');
    expect(descriptionTextArea.value).toBe('This is a new memory.');
  });

  it('handles form submission with valid data', async () => {
    render(<MemoryRouter><CreateMemory /></MemoryRouter>);
    const titleInput = screen.getByLabelText('Title:');
    const dateInput = screen.getByLabelText('Date:');
    const descriptionTextArea = screen.getByLabelText('Description:');
    const createButton = screen.getByRole('button', { name: 'Create Memory' });

    await userEvent.type(titleInput, 'New Memory');
    await userEvent.type(dateInput, '2023-05-01');
    await userEvent.type(descriptionTextArea, 'This is a new memory.');

    // Assuming the token is set in localStorage
    localStorage.setItem('token', 'some-token');

    fireEvent.submit(createButton);
    await vi.waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/showAllMemories');
    });
  });

  it('validates required fields', async () => {
    render(<MemoryRouter><CreateMemory /></MemoryRouter>);
    const createButton = screen.getByRole('button', { name: 'Create Memory' });
    fireEvent.click(createButton);

    await vi.waitFor(() => {
        const titleError = screen.getByTestId('titleError');
        const descriptionError = screen.getByTestId('descriptionError');
        expect(titleError).toBeDefined();
        expect(descriptionError).toBeDefined();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
});
