// Jest setup file for React Testing Library
import '@testing-library/jest-dom';

// Mock per window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock per le chiamate API globali
const mockResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ...mockResponse,
    json: () => Promise.resolve({}),
  })
);
