import { describe, it, expectTypeOf } from 'vitest';
import type { components, operations } from '../api';

describe('generated API types — compilation contract', () => {
  it('LoginRequest has email and password fields', () => {
    type LoginReq = components['schemas']['LoginRequest'];
    expectTypeOf<LoginReq>().toHaveProperty('email');
    expectTypeOf<LoginReq>().toHaveProperty('password');
  });

  it('AuthResponse has token and user', () => {
    type AuthResp = components['schemas']['AuthResponse'];
    expectTypeOf<AuthResp>().toHaveProperty('token');
    expectTypeOf<AuthResp>().toHaveProperty('user');
  });

  it('UserDto role is a union of ADMIN | CUSTOMER', () => {
    type Role = components['schemas']['UserDto']['role'];
    expectTypeOf<'ADMIN'>().toMatchTypeOf<Role>();
    expectTypeOf<'CUSTOMER'>().toMatchTypeOf<Role>();
  });

  it('loginUser operation response 200 returns AuthResponse', () => {
    type LoginOp = operations['loginUser'];
    type Response200 = LoginOp['responses']['200']['content']['application/json'];
    expectTypeOf<Response200>().toHaveProperty('token');
  });

  it('OrderDto status covers all lifecycle values', () => {
    type OrderStatus = components['schemas']['OrderDto']['status'];
    expectTypeOf<'PENDING'>().toMatchTypeOf<OrderStatus>();
    expectTypeOf<'DELIVERED'>().toMatchTypeOf<OrderStatus>();
    expectTypeOf<'REFUNDED'>().toMatchTypeOf<OrderStatus>();
  });
});
