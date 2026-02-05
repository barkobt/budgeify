'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import type { Category } from '@/types';

interface CategoryAutocompleteProps {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * CategoryAutocomplete - Akıllı Kategori Seçici
 *
 * Harcama formunda kullanılacak autocomplete/dropdown özellikli kategori seçici.
 * Features:
 * - Filtreleme (arama)
 * - Emoji + kategori adı
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Click outside to close
 * - Accessible (ARIA labels)
 */
export const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const { getActiveCategories, getCategoryById } = useBudgetStore();
  const categories = getActiveCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected category
  const selectedCategory = value ? getCategoryById(value) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset focused index when filtered list changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleCategorySelect = (category: Category) => {
    onChange(category.id);
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCategories[focusedIndex]) {
          handleCategorySelect(filteredCategories[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  const displayValue = selectedCategory
    ? `${selectedCategory.emoji} ${selectedCategory.name}`
    : searchQuery;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label */}
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Kategori <span className="text-red-500">*</span>
      </label>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder="Kategori seç veya ara..."
          disabled={disabled}
          className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3 text-slate-900 backdrop-blur-sm outline-none transition-all duration-200 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          } ${disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : ''}`}
          aria-label="Kategori seçimi"
          aria-expanded={isOpen}
          aria-controls="category-listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Dropdown Arrow */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
          <span>⚠</span>
          {error}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-sm">
          {filteredCategories.length > 0 ? (
            <ul id="category-listbox" role="listbox" className="py-2">
              {filteredCategories.map((category, index) => (
                <li
                  key={category.id}
                  role="option"
                  aria-selected={category.id === value}
                  className={`cursor-pointer px-4 py-3 transition-colors duration-150 ${
                    index === focusedIndex
                      ? 'bg-blue-50'
                      : category.id === value
                      ? 'bg-slate-50'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      {category.emoji}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {category.name}
                    </span>
                    {category.id === value && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              <p>🔍 Kategori bulunamadı</p>
              <p className="mt-1 text-xs">&quot;{searchQuery}&quot; için sonuç yok</p>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-slate-500">
          💡 Kategorilerde arama yapabilirsiniz
        </p>
      )}
    </div>
  );
};

export default CategoryAutocomplete;
