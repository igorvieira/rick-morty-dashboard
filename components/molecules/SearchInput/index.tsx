'use client';

import { Button } from "@/components/atoms/Buttons";
import { Input } from "@/components/atoms/Input";


interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, className = '' }: SearchInputProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {value && (
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          className="px-3"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
