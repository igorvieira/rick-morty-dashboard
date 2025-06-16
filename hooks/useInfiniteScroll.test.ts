import { renderHook, act } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
  Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
  Object.defineProperty(document.documentElement, 'offsetHeight', { value: 2000, writable: true });
});

afterEach(() => {
  vi.clearAllMocks();
});

test('calls callback when scrolled to bottom with hasMore true', () => {
  const mockCallback = vi.fn();
  const { result } = renderHook(() => useInfiniteScroll(mockCallback, true));

  act(() => {
    document.documentElement.scrollTop = 1000;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(result.current[0]).toBe(false);
});

test('does not call callback when hasMore is false', () => {
  const mockCallback = vi.fn();
  renderHook(() => useInfiniteScroll(mockCallback, false));

  act(() => {
    document.documentElement.scrollTop = 1000;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(mockCallback).not.toHaveBeenCalled();
});

test('does not call callback when not scrolled to bottom', () => {
  const mockCallback = vi.fn();
  renderHook(() => useInfiniteScroll(mockCallback, true));

  act(() => {
    document.documentElement.scrollTop = 500;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(mockCallback).not.toHaveBeenCalled();
});

test('returns isFetching state correctly', () => {
  const mockCallback = vi.fn();
  const { result } = renderHook(() => useInfiniteScroll(mockCallback, true));

  expect(result.current[0]).toBe(false);

  act(() => {
    document.documentElement.scrollTop = 1000;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current[0]).toBe(false);
});

test('prevents multiple calls when already fetching', () => {
  const mockCallback = vi.fn();
  const { result } = renderHook(() => useInfiniteScroll(mockCallback, true));

  act(() => {
    document.documentElement.scrollTop = 1000;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);

  act(() => {
    document.documentElement.scrollTop = 1200;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(result.current[0]).toBe(false);
});
