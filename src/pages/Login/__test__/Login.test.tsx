import Login from '../Login';
import { AppProvider } from 'AppProvider';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const MockLogin = () => {
  return (
    <BrowserRouter>
      <AppProvider.Provider>
        <Login />
      </AppProvider.Provider>
    </BrowserRouter>
  );
};

beforeEach(() => {
  render(<MockLogin />);
});

describe('Login page', () => {
  it('shows email input when user is not logged in', () => {
    const emailInput = screen.getByLabelText('email-input');
    expect(emailInput).toBeInTheDocument();
  });

  it('shows password input when user is not logged in', () => {
    const passwordInput = screen.getByLabelText('password-input');
    expect(passwordInput).toBeInTheDocument();
  });

  it('shows a link to reset user password', () => {
    const forgotPasswordLink = screen
      .getByText(/Login.trouble_logging_in_link/i)
      .closest('a');
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgotpassword');
  });

  it('shows a link to happySun website', () => {
    const happySunLink = screen
      .getByText(/Reset_password.happysun_text/i)
      .closest('a');
    expect(happySunLink).toHaveAttribute(
      'href',
      'https://www.sihealth.co.uk/our-technology/happysun/'
    );
  });

  it('shows email error message when user clicks on login and with no email provided', async () => {
    const loginButton = screen.getByText(/Login.button_text/i);
    fireEvent.click(loginButton);
    const emailErrorMessage = await screen.findByText(
      /Forgot_password.email_required/i
    );
    expect(emailErrorMessage).toBeInTheDocument();
  });
});
