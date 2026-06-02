import { render, screen } from "@testing-library/react";

import { HeroSection } from "./HeroSection";

// jsPDF (reached via the Download Resume use-case) pulls in an ESM-only chain
// CRA's Jest can't transform. It's a system boundary unused during render, so mock it.
jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({})),
}));

test("the value proposition is the hero's level-1 heading", () => {
  render(<HeroSection introExiting instantReveal />);
  const h1 = screen.getByRole("heading", { level: 1 });
  expect(h1).toHaveTextContent("I build accessible, motion-driven interfaces.");
});

test("the name is present but not a heading", () => {
  render(<HeroSection introExiting instantReveal />);
  expect(screen.getByText(/John Remy C\. Gonzales/)).not.toHaveAttribute("role", "heading");
});
