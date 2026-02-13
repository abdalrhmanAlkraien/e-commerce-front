import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  country: z.string().min(2, 'Country is required.'),
  postalCode: z.string().min(1, 'Postal code is required.'),
});

export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;
