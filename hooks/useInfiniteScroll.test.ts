import { renderHook, act } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

const mockIntersectionObserver = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

test('creates IntersectionObserver when hasMore is true', () => {
  const mockCallback = vi.fn();
  renderHook(() => useInfiniteScroll(mockCallback, true));

  expect(mockIntersectionObserver).toHaveBeenCalledWith(
    expect.any(Function),
    {
      threshold: 0.1,
      rootMargin: '20px',
    }
  );
});

test('does not create observer when hasMore is false', () => {
  const mockCallback = vi.fn();
  renderHook(() => useInfiniteScroll(mockCallback, false));

  expect(mockIntersectionObserver).not.toHaveBeenCalled();
});

test('returns observerRef', () => {
  const mockCallback = vi.fn();
  const { result } = renderHook(() => useInfiniteScroll(mockCallback, true));

  expect(result.current[1]).toBeDefined();
  expect(result.current[1].current).toBeNull();
});

test('calls callback when intersection occurs', () => {
  const mockCallback = vi.fn();
  let intersectionCallback: Function;

  mockIntersectionObserver.mockImplementation((callback) => {
    intersectionCallback = callback;
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });

  renderHook(() => useInfiniteScroll(mockCallback, true));

  act(() => {
    intersectionCallback([{ isIntersecting: true }]);
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('does not call callback when not intersecting', () => {
  const mockCallback = vi.fn();
  let intersectionCallback: Function;

  mockIntersectionObserver.mockImplementation((callback) => {
    intersectionCallback = callback;
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });

  renderHook(() => useInfiniteScroll(mockCallback, true));

  act(() => {
    intersectionCallback([{ isIntersecting: false }]);
  });

  expect(mockCallback).not.toHaveBeenCalled();
});
