import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../Components/Signup';
import "@testing-library/jest-dom";

it('renders input fields and submit button', () => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByPlaceholderText('First Name');
  const lastNameInput = screen.getByPlaceholderText('Last Name');
  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const signUpButton = screen.getByRole('button', { name: /sign up/i });

  expect(firstNameInput).to.exist;
  expect(lastNameInput).to.exist;
  expect(emailInput).to.exist;
  expect(passwordInput).to.exist;
  expect(signUpButton).to.exist;
});

it('renders link to sign in page', () => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

  const signInLink = screen.getByRole('link', { name: /sign in/i });

  expect(signInLink).to.exist;
});