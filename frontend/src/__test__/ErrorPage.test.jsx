// ErrorPage.test.jsx
// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorPage from "../ErrorPage";

// Test suite for ErrorPage component
describe("ErrorPage Component Tests", () => {
  // Test case: Check if the ErrorPage renders correctly
  it("renders correctly", () => {
    render(<ErrorPage />);
    // Assertions to check if the error messages are in the document
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText(/It looks like you've accessed a page that hasn't been built yet or is experiencing an error./)).toBeInTheDocument();
  });

  // Test case: Check if the ErrorPage contains a link to go back home
  it("contains a link to go back home", () => {
    render(<ErrorPage />);
    const homeLink = screen.getByRole('link', { name: 'Go back home' });
    // Assertions to check if the home link is in the document and has the correct href attribute
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});