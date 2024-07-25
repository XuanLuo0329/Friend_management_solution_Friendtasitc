import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemoryList from '../Components/MemoryComponent/MemoryList';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the fetch API to handle the GET request
const memoryData = [
    {
        _id: 'jadsfhakjsdaflsjdfasdkfhipawhehaweijbpifbefbagaibgrpiae',
        title: 'Trip to Paris',
        date: '2022-04-15',
        description: 'It was a fantastic journey!',
        image: 'ski1.jpg'
    },
    {
        _id: 'hiaugwiepgauwehgoaheiogoaidgiodfgsdgdfgsdfgsaheorigaeer',
        title: 'Daily Routine',
        date: '2022-05-20',
        description: 'Documenting my daily routine.',
        image: 'mountain1.jpg'
    }
];

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(memoryData)
    })
);

// Mock navigation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');
    return {
        ...original,
        useNavigate: () => mockNavigate
    };
});

describe('MemoryList Component Tests', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <MemoryList />
            </BrowserRouter>
        );
    });

    it('displays all memories correctly', async () => {
        await waitFor(() => {
            expect(screen.findByRole('heading', { name: 'Trip to Paris' })).toBeDefined();
            expect(screen.findByRole('heading', { name: 'Daily Routine' })).toBeDefined();
        });
    });


    it('calls fetchMemories again after deleting a memory', async () => {
        global.fetch.mockClear().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]) // Return empty list after delete
            })
        );

        await waitFor(() => {
            const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
            deleteButtons[0].click();
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2); // Once on component mount, once after delete
        });
    });
});
