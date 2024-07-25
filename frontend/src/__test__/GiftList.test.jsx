import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GiftList from "../Components/GiftComponents/GiftList";
import '@testing-library/jest-dom';

vi.mock('axios');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useLocation: () => ({
        state: { gifts: [{ _id: "1", giftName: "Teddy Bear", friendName: "John" }] }
      }),
      useNavigate: () => vi.fn(),
    };
  });
  
  describe('GiftList', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <GiftList />
        </MemoryRouter>
      );
      expect(screen.getByText("Teddy Bear")).toBeInTheDocument();
      expect(screen.getByText("- For John")).toBeInTheDocument();
    });

  });