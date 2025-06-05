import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  text: string;
}

interface CourseSorterProps {
  options: SortOption[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

const CourseSorter: React.FC<CourseSorterProps> = ({ 
  options, 
  defaultValue = options[0]?.value, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SortOption>(
    options.find(opt => opt.value === defaultValue) || options[0]
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SortOption) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-56 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected.text}</span>
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-10 w-56 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1 overflow-auto text-sm max-h-60">
            {options.map((option) => (
              <li 
                key={option.value}
                className={`cursor-pointer px-4 py-2.5 hover:bg-gray-50 ${
                  selected.value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseSorter;