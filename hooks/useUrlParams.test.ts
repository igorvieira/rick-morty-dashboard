import { renderHook } from '@testing-library/react';
import { test, expect, vi, beforeEach } from 'vitest';
import { useUrlParams } from './useUrlParams';

// Mock Next.js router
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

beforeEach(() => {
  mockPush.mockClear();
  mockSearchParams.forEach((_, key) => {
    mockSearchParams.delete(key);
  });
});

test('updateParam adds new parameter', () => {
  const { result } = renderHook(() => useUrlParams());

  result.current.updateParam('search', 'rick');

  expect(mockPush).toHaveBeenCalledWith('?search=rick', { scroll: false });
});

test('updateParam removes parameter when value is empty', () => {
  mockSearchParams.set('search', 'rick');
  const { result } = renderHook(() => useUrlParams());

  result.current.updateParam('search', '');

  expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
});

test('getParam returns parameter value', () => {
  mockSearchParams.set('search', 'morty');
  const { result } = renderHook(() => useUrlParams());

  const value = result.current.getParam('search');

  expect(value).toBe('morty');
});

test('getParam returns empty string for non-existent parameter', () => {
  const { result } = renderHook(() => useUrlParams());

  const value = result.current.getParam('nonexistent');

  expect(value).toBe('');
});
