import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";

interface SearchFieldProps {
  searchConfig?: {
    searchFunc?: (value: string) => void;
    debounceTime?: number;
  };
  options: { id: string; value: string }[];
  disabled?: boolean;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchField({
  disabled,
  searchConfig,
  options,
  placeholder,
  onChange,
  value,
}: SearchFieldProps) {
  const { searchFunc, debounceTime = 400 } = searchConfig ?? {};
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState("");
  const selectedOption = options.find((opt) => opt.id === value);
  const [isSelected, setIsSeleted] = useState<boolean>(false);
  // Sync input display with selected value
  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.value);
    }
  }, []);

  function handleInputChange(value: string) {
    setInputValue(value);
    setIsSeleted(false);
    if (searchFunc) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        searchFunc(value);
      }, debounceTime);
    }
  }

  function handleSelect(id: string) {
    onChange?.(id);
    setIsSeleted(true);
    // Find the selected option and set the input display
    const selected = options.find((opt) => opt.id === id);
    if (selected) {
      setInputValue(selected.value);
    }
  }

  return (
    <Command>
      <CommandInput
        disabled={disabled}
        value={inputValue}
        placeholder={placeholder}
        onValueChange={handleInputChange}
      />
      <CommandList hidden={isSelected}>
        {options.map((option) => (
          <CommandItem
            key={option.id}
            value={option.value} // This allows matching by text
            onSelect={() => handleSelect(option.id)}
          >
            {option.value}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
