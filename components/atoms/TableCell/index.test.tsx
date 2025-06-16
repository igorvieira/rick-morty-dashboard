import { render, screen, cleanup } from '@testing-library/react';
import { expect, test, afterEach } from 'vitest';
import { TableCell } from './';

afterEach(() => {
  cleanup();
});

test('renders TableCell with default props', () => {
  render(
    <table>
      <tbody>
        <tr>
          <TableCell>Cell Content</TableCell>
        </tr>
      </tbody>
    </table>
  );

  const cell = screen.getByText('Cell Content');
  expect(cell).toBeInTheDocument();
  expect(cell).toHaveClass('px-6 py-4 text-sm text-gray-700 border-b border-gray-200');
});

test('renders TableCell as header', () => {
  render(
    <table>
      <thead>
        <tr>
          <TableCell header>Header Content</TableCell>
        </tr>
      </thead>
    </table>
  );

  const headerCell = screen.getByText('Header Content');
  expect(headerCell).toBeInTheDocument();
  expect(headerCell).toHaveClass('px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50 border-b border-gray-200');
});

test('applies additional className', () => {
  render(
    <table>
      <tbody>
        <tr>
          <TableCell className="custom-class">Cell Content</TableCell>
        </tr>
      </tbody>
    </table>
  );

  const cell = screen.getByText('Cell Content');
  expect(cell).toHaveClass('custom-class');
});
