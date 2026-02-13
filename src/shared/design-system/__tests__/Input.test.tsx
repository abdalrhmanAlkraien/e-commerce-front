import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/Input';

describe('Input — label', () => {
  it('renders the label when provided', () => {
    render(<Input id="email" label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input id="username" label="Username" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'username');
  });
});

describe('Input — error state', () => {
  it('shows error message', () => {
    render(<Input id="email" error="Email is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input id="email" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('links input to error via aria-describedby', () => {
    render(<Input id="email" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'email-error');
  });
});

describe('Input — helper text', () => {
  it('shows helper text when no error', () => {
    render(<Input id="email" helperText="We will never share your email" />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  it('does NOT show helper text when error is present', () => {
    render(<Input id="email" error="Required" helperText="Help text" />);
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });
});

describe('Input — password toggle', () => {
  it('renders password input with toggle button', () => {
    render(<Input id="pw" type="password" label="Password" />);
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<Input id="pw" type="password" label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByLabelText('Show password'));
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
  });
});

describe('Input — disabled', () => {
  it('is disabled when disabled prop is true', () => {
    render(<Input id="field" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
