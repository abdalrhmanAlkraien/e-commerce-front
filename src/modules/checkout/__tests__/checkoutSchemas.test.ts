import { describe, it, expect } from 'vitest';
import { shippingAddressSchema } from '../schemas/checkoutSchemas';

const validAddress = {
  street: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  country: 'US',
  postalCode: '62701',
};

describe('shippingAddressSchema', () => {
  it('accepts a valid address', () => {
    expect(shippingAddressSchema.safeParse(validAddress).success).toBe(true);
  });

  it('rejects missing street', () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, street: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Street is required.');
  });

  it('rejects missing city', () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, city: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing state', () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, state: '' });
    expect(result.success).toBe(false);
  });

  it('rejects short country code', () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, country: 'X' });
    expect(result.success).toBe(false);
  });

  it('rejects missing postalCode', () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, postalCode: '' });
    expect(result.success).toBe(false);
  });
});
