import { useState, useMemo, useRef, useEffect } from 'react';
import { icons } from 'lucide-react';
import { Search, ChevronDown } from 'lucide-react';

export default function IconPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconNames = useMemo(() => Object.keys(icons), []);

  const filteredIcons = useMemo(() => {
    if (!search) return iconNames.slice(0, 100); // Show top 100 by default for performance
    return iconNames.filter(name => name.toLowerCase().includes(search.toLowerCase())).slice(0, 100);
  }, [search, iconNames]);

  const SelectedIcon = icons[value];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field py-1.5 text-sm flex items-center justify-between w-full text-left bg-white dark:bg-primary-950"
      >
        <div className="flex items-center gap-2 truncate">
          {SelectedIcon ? <SelectedIcon className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 shrink-0 border border-dashed border-gray-300 rounded" />}
          <span className="truncate">{value || 'Search icon...'}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-1 w-full sm:w-64 bg-white dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-primary-100 dark:border-primary-800 flex items-center gap-2 bg-primary-50/50 dark:bg-primary-900/50">
            <Search className="w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-6 sm:grid-cols-5 gap-1">
            {filteredIcons.map(name => {
              const IconComp = icons[name];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  title={name}
                  className={`p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 flex items-center justify-center transition-colors ${value === name ? 'bg-primary-200 dark:bg-primary-700 text-primary-900 dark:text-white' : 'text-primary-600 dark:text-primary-300'}`}
                >
                  <IconComp className="w-5 h-5" strokeWidth={1.5} />
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="col-span-full text-center text-sm text-primary-400 py-6">No icons found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
