// Configurazione globale per i test
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Estendi expect con i matcher di jest-dom
expect.extend(matchers);

// Esegui il cleanup dopo ogni test case (importante!)
afterEach(() => {
  cleanup();
});

// Configurazione per i test con jsdom
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

// Mock per matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock per ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
