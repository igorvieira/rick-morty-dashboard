import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import { SearchInput } from './';

vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="x-icon" />,
}));

afterEach(() => {
  cleanup();
});

test('renders input with correct props', () => {
  const handleChange = vi.fn();
  render(
    <SearchInput
      value="test value"
      onChange={handleChange}
      placeholder="Search..."
    />
  );

  const input = screen.getByRole('textbox');
  expect(input).toHaveValue('test value');
  expect(input).toHaveAttribute('placeholder', 'Search...');
  expect(input).toHaveAttribute('type', 'text');
  expect(input).toHaveClass('pr-10');
});

test('shows clear button when value is not empty', () => {
  const handleChange = vi.fn();
  render(<SearchInput value="test" onChange={handleChange} />);

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByTestId('x-icon')).toBeInTheDocument();
});

test('hides clear button when value is empty', () => {
  const handleChange = vi.fn();
  render(<SearchInput value="" onChange={handleChange} />);

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
});

test('calls onChange when input value changes', () => {
  const handleChange = vi.fn();
  render(<SearchInput value="" onChange={handleChange} />);

  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'new value' } });

  expect(handleChange).toHaveBeenCalledWith('new value');
});

test('clears input when clear button is clicked', () => {
  const handleChange = vi.fn();
  render(<SearchInput value="test value" onChange={handleChange} />);

  const clearButton = screen.getByRole('button');
  fireEvent.click(clearButton);

  expect(handleChange).toHaveBeenCalledWith('');
});

test('applies custom className to wrapper div', () => {
  const handleChange = vi.fn();
  render(
    <SearchInput
      value=""
      onChange={handleChange}
      className="custom-search-class"
    />
  );

  const wrapper = screen.getByRole('textbox').closest('div.relative');
  expect(wrapper).toHaveClass('relative', 'custom-search-class');
});
