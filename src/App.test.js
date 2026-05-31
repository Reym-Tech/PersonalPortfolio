import { render, screen } from '@testing-library/react';
import App from './App';

// jsPDF pulls in an ESM-only dependency chain that CRA's Jest config can't
// transform. It's a system boundary (PDF export) unused during render, so mock it.
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({})),
}));

test('renders the portfolio owner name', () => {
  render(<App />);
  expect(screen.getAllByText(/John Remy Gonzales/i).length).toBeGreaterThan(0);
});
