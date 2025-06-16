import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi, beforeEach } from 'vitest';
import { ScrollToTop } from './';

vi.mock('lucide-react', () => ({
  ChevronUp: () => <svg data-testid="chevron-up">↑</svg>,
}));

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test('does not show button when scroll is below threshold', () => {
  render(<ScrollToTop threshold={500} />);

  expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
});

test('shows button when scroll exceeds threshold', () => {
  const { rerender } = render(<ScrollToTop threshold={300} />);

  window.scrollY = 400;
  fireEvent.scroll(window);
  rerender(<ScrollToTop threshold={300} />);

  expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
});

test('scrolls to top when clicked', () => {
  window.scrollY = 500;
  render(<ScrollToTop threshold={300} />);

  fireEvent.scroll(window);
  const button = screen.getByLabelText('Scroll to top');
  fireEvent.click(button);

  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    behavior: 'smooth'
  });
});
