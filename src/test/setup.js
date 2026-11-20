import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';
import { randomUUID } from 'node:crypto';

Object.assign(global, { TextEncoder, TextDecoder });
Object.defineProperty(global.crypto, 'randomUUID', { value: randomUUID });

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});
