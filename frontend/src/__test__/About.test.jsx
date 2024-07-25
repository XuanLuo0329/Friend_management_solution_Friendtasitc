// AboutPage.test.jsx
// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import About from "../About";

// Test suite for AboutPage component
describe("AboutPage Component Tests", () => {
  // Test case: Check if the AboutPage renders without crashing
  it("renders without crashing", () => {
    render(<About />);
    // Assertions to check if the main heading, subtext, and mission statement are in the document
    expect(screen.getByText("About Friendtastic")).toBeInTheDocument();
    expect(screen.getByText("Your Personal Companion for Memorable Friendships")).toBeInTheDocument();
    expect(screen.getByText(/meaningful connections should not be lost/)).toBeInTheDocument();
  });

  // Test case: Check if the founder's quote is rendered correctly
  it("renders the founder's quote correctly", () => {
    render(<About />);
    // Assertions to check if the founder's quote and name are in the document
    expect(screen.getByText(/We are a team of tech enthusiasts and advocates for deep interpersonal connections./)).toBeInTheDocument();
    expect(screen.getByText("An anonymous INTP")).toBeInTheDocument();
  });
});