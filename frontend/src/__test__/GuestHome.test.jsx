// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GuestHome from "../GuestHome";

// Test suite for GuestHome component
describe("GuestHome Component Tests", () => {
  // Test case: Check if the main heading and subtext are rendered correctly
  it("should render the main heading and subtext correctly", () => {
    render(<GuestHome />);
    const heading = screen.getByText(/Connect Deeper, Stress Less with Friendtastic!/i);
    const subtext = screen.getByText(/Your Personal Companion for Memorable Friendships./i);

    // Assertions to check if the heading and subtext are in the document
    expect(heading).toBeInTheDocument();
    expect(subtext).toBeInTheDocument();
  });

  // Test case: Check if the 'Get started' and 'Learn more' links are displayed
  it("should display the 'Get started' and 'Learn more' links", () => {
    render(<GuestHome />);
    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });

    // Assertions to check if the links have the correct href attributes
    expect(getStartedLink).toHaveAttribute('href', '/login');
    expect(learnMoreLink).toHaveAttribute('href', '/about');
  });
});