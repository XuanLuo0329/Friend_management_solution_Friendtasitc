// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import EventRecommendation from "../EventRecommendation";
import { vi } from 'vitest';

// Mock function for navigation
const mockNavigate = vi.fn();

// Clear the mock function before each test
beforeEach(() => {
    mockNavigate.mockClear();
});

// Mock the 'react-router-dom' library to control navigation in tests
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock the 'usePost' hook to control the data returned by the API call
vi.mock('../usePost', () => ({
    __esModule: true,
    default: () => ({
        postData: vi.fn(() => Promise.resolve({ someData: 'data' })),
        data: null,
        loading: false,
        error: null
    })
}));

// Test suite for EventRecommendation component
describe("EventRecommendation Component Tests", () => {

    // Test case: Check if the input field accepts text
    it("allows entering text in the input field", async () => {
        render(<EventRecommendation />);
        const input = screen.getByPlaceholderText("What would you like to do today?");
        await userEvent.type(input, "Go hiking");
        expect(input).toHaveValue("Go hiking");
    });

    // Test case: Check if an error message is displayed when the form is submitted empty
    it("shows error message if the form is submitted empty", async () => {
        render(<EventRecommendation />);
        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);
        expect(await screen.findByText("Please enter a question!")).toBeInTheDocument();
    });

    // Test case: Check if the page navigates to the results page on successful data submission
    it("navigates on successful data submission", async () => {
        render(<EventRecommendation />);
        const input = screen.getByPlaceholderText("What would you like to do today?");
        await userEvent.type(input, "Go hiking");
        const submitButton = screen.getByText("Submit");
        await userEvent.click(submitButton);

        await vi.waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/EventRecommendationResult', {
                state: { question: 'Go hiking', data: { someData: 'data' } }
            });
        });
    });

});