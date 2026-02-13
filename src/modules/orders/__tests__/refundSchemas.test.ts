import { describe, it, expect } from 'vitest';
import { refundSchema } from '../schemas/refundSchemas';

describe('refundSchema', () => {
  it('accepts a valid refund request', () => {
    const result = refundSchema.safeParse({ amount: 9.99, reason: 'Product was defective upon arrival' });
    expect(result.success).toBe(true);
  });

  it('rejects zero amount', () => {
    const result = refundSchema.safeParse({ amount: 0, reason: 'Some valid reason here' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('greater than zero');
  });

  it('rejects negative amount', () => {
    const result = refundSchema.safeParse({ amount: -5, reason: 'Some valid reason here' });
    expect(result.success).toBe(false);
  });

  it('rejects reason shorter than 10 chars', () => {
    const result = refundSchema.safeParse({ amount: 10, reason: 'Too short' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('at least 10 characters');
  });

  it('rejects reason longer than 500 chars', () => {
    const result = refundSchema.safeParse({ amount: 10, reason: 'x'.repeat(501) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('500 characters');
  });

  it('rejects non-numeric amount', () => {
    const result = refundSchema.safeParse({ amount: 'ten', reason: 'Some valid reason here' });
    expect(result.success).toBe(false);
  });
});
