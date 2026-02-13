import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../utils/authSchemas';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});

describe('registerSchema', () => {
  const valid = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@test.com',
    password: 'Password1!',
  };

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects missing first name', () => {
    const result = registerSchema.safeParse({ ...valid, firstName: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.firstName).toBeDefined();
  });

  it('rejects missing last name', () => {
    const result = registerSchema.safeParse({ ...valid, lastName: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.lastName).toBeDefined();
  });

  it('rejects malformed email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad-email' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'short' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });

  it('accepts password of exactly 8 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: '12345678' });
    expect(result.success).toBe(true);
  });
});
