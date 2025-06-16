import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import { CharacterTable } from './';
import { Character } from '@/type/character';

vi.mock('@/components/atoms/Spinner', () => ({
  Spinner: () => <div>Loading...</div>,
}));

vi.mock('@/components/atoms/TableCell', () => ({
  TableCell: ({ children, header }: { children: React.ReactNode; header?: boolean }) => (
    header ? <th data-testid="table-header">{children}</th> : <td>{children}</td >
  ),
}));

vi.mock('@/components/molecules/TableRow', () => ({
  TableRow: ({ character }: { character: Character }) => (
    <tr data-testid="table-row" >
      <td>{character.name}</td>
    </tr>
  ),
}));

vi.mock('./skeleton', () => ({
  TableSkeleton: ({ rows }: { rows: number }) => (
    <div data-testid="table-skeleton">Skeleton with {rows} rows</ div >
  ),
}));

afterEach(() => {
  cleanup();
});

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.jpg',
  origin: { name: 'Earth' },
  location: { name: 'Earth' },
  type: '',
  episode: []
};

test('shows skeleton when initial loading', () => {
  render(<CharacterTable characters={[]} initialLoading={true} />);

  expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  expect(screen.getByText('Skeleton with 10 rows')).toBeInTheDocument();
});

test('renders table with characters', () => {
  render(<CharacterTable characters={[mockCharacter]} />);

  expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  expect(screen.getByTestId('table-row')).toBeInTheDocument();
  expect(screen.getAllByTestId('table-header')).toHaveLength(6);
});

test('shows spinner when loading', () => {
  render(<CharacterTable characters={[mockCharacter]} loading={true} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('shows no characters message when empty', () => {
  render(<CharacterTable characters={[]} />);

  expect(screen.getByText('No characters found')).toBeInTheDocument();
});

test('does not show no characters message when loading', () => {
  render(<CharacterTable characters={[]} loading={true} />);

  expect(screen.queryByText('No characters found')).not.toBeInTheDocument();
});
