// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import App from "../App";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

// Test suite for App component's routing
describe("App Routing Tests", () => {
    // Test case: Check if the home page is rendered by default
    it("renders the home page by default", () => {
        render(
            <MemoryRouter initialEntries={["/"]}> // Set the initial route to "/"
                <App />
            </MemoryRouter>
        );
        // Assertion to check if the home page text is in the document
        expect(screen.getByText("Connect Deeper, Stress Less with Friendtastic!")).toBeInTheDocument();
    });

    // Test case: Check if the error page is rendered for unknown routes
    it("renders error page for unknown routes", () => {
        render(
            <MemoryRouter initialEntries={["/some/unknown/route"]}> // Set the initial route to an unknown route
                <App />
            </MemoryRouter>
        );
        // Assertion to check if the error page text is in the document
        expect(screen.getByText("Page not found")).toBeInTheDocument();
    });
});