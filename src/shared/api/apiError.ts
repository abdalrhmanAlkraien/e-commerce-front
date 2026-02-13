export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiErrorInstance extends Error implements ApiError {
  readonly status: number;
  readonly code?: string;

  constructor({ message, status, code }: ApiError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiErrorInstance.prototype);
  }
}

export function isApiError(error: unknown): error is ApiErrorInstance {
  return error instanceof ApiErrorInstance;
}
