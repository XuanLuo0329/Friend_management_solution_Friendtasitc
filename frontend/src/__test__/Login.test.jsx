import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Components/Login';
import "@testing-library/jest-dom";

it('renders email and password inputs', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  expect(emailInput).to.exist;
  expect(passwordInput).to.exist;
});