// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Home from "../Home";

// Mock UserHome component
vi.mock('../UserHome', () => {
  return {
    __esModule: true,
    default: () => <div>User home component</div>,
  };
});

// Mock GuestHome component
vi.mock('../GuestHome', () => {
  return {
    __esModule: true,
    default: () => <div>Guest home component</div>,
  };
});

// Function to mock localStorage
const mockLocalStorage = (userToken) => {
  const mock = {
    getItem: vi.fn(() => userToken),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  global.localStorage = mock;
};

// Test suite for Home component
describe("Home Component Tests", () => {
  // Clean up after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test case: UserHome should render if user is logged in
  it("should render UserHome if the user is logged in", () => {
    mockLocalStorage('some-token'); // Mock user being logged in
    render(<Home />);
    expect(screen.getByText("User home component")).toBeInTheDocument();
  });

  // Test case: GuestHome should render if user is not logged in
  it("should render GuestHome if the user is not logged in", () => {
    mockLocalStorage(null); // Mock user being logged out
    render(<Home />);
    expect(screen.getByText("Guest home component")).toBeInTheDocument();
  });
});