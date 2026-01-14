import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  width?: string;
  showSelectedOption?: boolean;
  showSearch?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder,
  width = "180px",
  showSelectedOption = false,
  showSearch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    if (showSelectedOption) {
      // Single selection mode
      onChange([id]);
      setIsOpen(false);
    } else {
      // Multi-selection mode
      if (selected.includes(id)) {
        onChange(selected.filter(item => item !== id));
      } else {
        onChange([...selected, id]);
      }
    }
  };

  const selectedOption = showSelectedOption ? options.find(opt => opt.id === selected[0]) : null;

  return (
    <div className="relative" style={{ width }} ref={dropdownRef}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-white dark:bg-background border border-input dark:border-slate-700 rounded-md shadow-sm hover:bg-accent dark:hover:bg-slate-700 focus:outline-none text-foreground dark:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-sm font-normal flex items-center gap-2">
          {selected.length === 0 ? (
            placeholder
          ) : showSelectedOption ? (
            <>
              {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
              <span>{selectedOption?.name || placeholder}</span>
            </>
          ) : (
            `${placeholder} (${selected.length})`
          )}
        </span>
        <span className="ml-2 text-muted-foreground dark:text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-background border dark:border-slate-700 rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
          {showSearch && (
            <div className="flex items-center px-3 py-2 border-b dark:border-slate-700">
              <span className="flex items-center w-5 h-5 mr-2 justify-center flex-shrink-0">
                <Search className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent focus:ring-0 text-foreground dark:text-white dark:placeholder-gray-500"
              />
            </div>
          )}
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-muted-foreground dark:text-gray-400 text-sm">No results</li>
            )}
            {filteredOptions.map(option => (
              <li
                key={option.id}
                className={`flex items-center px-3 py-2 text-sm cursor-pointer select-none transition-colors rounded-md hover:bg-accent dark:hover:bg-slate-700 text-foreground dark:text-gray-300`}
                onClick={() => handleSelect(option.id)}
                title={option.name}
              >
                <span className="flex items-center w-5 h-5 mr-2 justify-center flex-shrink-0">
                  {selected.includes(option.id) && <Check className="h-4 w-4 text-primary" />}
                </span>
                {option.icon && <span className="mr-2 flex-shrink-0">{option.icon}</span>}
                <span className="truncate overflow-hidden">{option.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;