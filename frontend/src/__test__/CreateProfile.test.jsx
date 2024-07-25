import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateProfile from '../CreateProfile';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from "@testing-library/user-event";

// Mocks
vi.mock('axios', () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url.includes('/api/user/friend/')) {
                return Promise.resolve({
                    data: {
                        name: 'John Doe',
                        birthday: new Date('1990-01-01'),
                        gender: "Male",
                        relationship: "Colleague",
                        mbtiType: "INTJ",
                        hobbies: ["Reading", "Coding"],
                        skills: ["JavaScript"],
                        preferences: { likes: ["Coffee"], dislikes: ["Slow Internet"] }
                    }
                });
            } else {
                return Promise.resolve({ data: { isAuthenticated: true } });
            }
        }),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        put: vi.fn(() => Promise.resolve({ data: {} }))
    }
}));

vi.mock('../usePost', () => ({
    __esModule: true,
    default: () => ({
        postData: vi.fn(() => Promise.resolve({ status: 'success' })),
        data: null,
        loading: false,
        error: null
    })
}));

vi.mock('../usePut', () => ({
    __esModule: true,
    default: () => ({
        putData: vi.fn(() => Promise.resolve({ status: 'updated' })),
        data: null,
        loading: false,
        error: null
    })
}));

// Mock navigation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '123' }), 
        BrowserRouter: actual.BrowserRouter
    };
});

describe('CreateProfile Component Tests', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <CreateProfile />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders correctly', () => {
        expect(screen.getByText('Create a profile')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter full name (first + last)')).toBeInTheDocument();
    });


    it('submits the form with all required fields filled', async () => {
        await userEvent.type(screen.getByPlaceholderText('Enter full name (first + last)'), 'John Doe');
        await userEvent.type(screen.getByPlaceholderText('Select a gender'), 'Male');
        await userEvent.type(screen.getByPlaceholderText('Describe your relationship with this person (e.g., colleague, friend)'), 'Colleague');

        userEvent.click(screen.getByText('Save'));
        await vi.waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/showAllFriends');
        }, { timeout: 4000 });
    });

    it('shows error when required fields are missing', async () => {
        fireEvent.change(screen.getByPlaceholderText('Enter full name (first + last)'), { target: { value: '' } }); // Clear the name field
        fireEvent.click(screen.getByText('Save'));
        expect(await screen.findByText('Name, gender, and relationship are required.')).toBeInTheDocument();
    });
    
});