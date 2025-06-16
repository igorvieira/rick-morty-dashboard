'use client';

import { useEffect, useState, useRef } from 'react';

// IntersectionObserver is more performant than scroll events because it runs on the main thread
// and only fires when elements actually intersect the viewport, reducing unnecessary calculations
export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setIsFetching(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return [isFetching, observerRef] as const;
}
