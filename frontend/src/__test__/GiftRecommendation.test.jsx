import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GiftRecommendation from '../GiftRecommendation';
import '@testing-library/jest-dom';


beforeEach(() => {
    // Mock for window.matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),  // Deprecated but included for older implementations
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
});

// Correct the mocks to ensure all are returning with a 'default' key
vi.mock('../Components/GiftComponents/FriendsSelector', () => ({
    default: ({ onSelect, disabled }) => (
        <button onClick={() => onSelect({ id: 1, name: 'John Doe' })} disabled={disabled}>Select Friend</button>
    )
}));
vi.mock('../Components/GiftComponents/FriendProfileSlideOver', () => ({
    default: () => <div>Friend Profile</div>
}));
vi.mock('../Components/GiftComponents/GiftCriteria', () => ({
    default: () => <div>Gift Criteria</div>
}));
vi.mock('../Components/GiftComponents/GiftsDisplay', () => ({
    default: () => <div>Gifts Display</div>
}));
vi.mock('../usePost', () => ({
    default: () => ({
        postData: vi.fn().mockResolvedValue({ success: true, response: [] }),
        loading: false,
        error: null
    })
}));
vi.mock('../useSessionStorageState', () => ({
    default: (key, initialValue) => {
        const [state, setState] = React.useState(initialValue);
        return [state, setState];
    }
}));

describe('GiftRecommendation Component Tests', () => {
    it('renders the component correctly', () => {
        render(<GiftRecommendation />);
        expect(screen.getByText('Select Friend')).toBeInTheDocument();
    });

    it('selects a friend and updates state correctly', () => {
        render(<GiftRecommendation />);
        fireEvent.click(screen.getByText('Select Friend'));
        expect(screen.getByText('Gift Criteria')).toBeInTheDocument();
    });

    it('submits the form after friend selection', async () => {
        render(<GiftRecommendation />);
        fireEvent.click(screen.getByText('Select Friend')); // First select a friend
        fireEvent.click(screen.getByRole('button', { name: 'Submit' })); // Then submit the form
        await screen.findByText('Gifts Display'); // Checking for the Gifts Display to appear post-submission
        expect(screen.getByText('Gifts Display')).toBeInTheDocument();
    });
});
