import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import { TableRow } from './';
import { Character } from '@/types/character';

// Mock TableCell component
vi.mock('../atoms/TableCell', () => ({
  TableCell: ({ children }: {
    children: React.ReactNode;
  }) => <td data-testid="table-cell">{children}</td>,

}));

afterEach(() => {
  cleanup();
});

const mockCharacter: Character = {
  id: 'some-id',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
  type: '',
  episode: []
};

test('renders character information correctly', () => {
  render(
    <table>
      <tbody>
        <TableRow character={mockCharacter} />
      </tbody>
    </table>
  );

  // Check if character name is displayed
  expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();

  // Check if character image is rendered with correct alt text
  const image = screen.getByAltText('Rick Sanchez');
  expect(image).toBeInTheDocument();

  // Check if other character details are displayed
  expect(screen.getByText('Human')).toBeInTheDocument();
  expect(screen.getByText('Male')).toBeInTheDocument();
  expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
  expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
});

test('applies correct status styling for alive character', () => {
  render(
    <table>
      <tbody>
        <TableRow character={mockCharacter} />
      </tbody>
    </table>
  );

  const statusBadge = screen.getByText('Alive');
  expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
});

test('applies correct status styling for dead character', () => {
  const deadCharacter = { ...mockCharacter, status: 'Dead' as const };

  render(
    <table>
      <tbody>
        <TableRow character={deadCharacter} />
      </tbody>
    </table>
  );

  const statusBadge = screen.getByText('Dead');
  expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
});

test('applies correct status styling for unknown character', () => {
  const unknownCharacter = { ...mockCharacter, status: 'unknown' as const };

  render(
    <table>
      <tbody>
        <TableRow character={unknownCharacter} />
      </tbody>
    </table>
  );

  const statusBadge = screen.getByText('unknown');
  expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
});

test('renders table row with hover effect', () => {
  render(
    <table>
      <tbody>
        <TableRow character={mockCharacter} />
      </tbody>
    </table>
  );

  const tableRow = screen.getByRole('row');
  expect(tableRow).toHaveClass('hover:bg-gray-50');
});
