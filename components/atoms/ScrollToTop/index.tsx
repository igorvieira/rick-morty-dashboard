'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 400, className = '' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed cursor-pointer bottom-6 right-6 z-50 w-12 h-12 bg-gray-300 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${className}`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} className='text-black' />
    </button>
  );
}