"use client";

import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectInputTypeFieldProps {
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string;
  disabled?: boolean;
}

export const SelectInputTypeField = ({
  name,
  options,
  defaultValue,
  disabled,
}: SelectInputTypeFieldProps) => {
  const { setValue, getValues } = useFormContext();
  const [currentType, setCurrentType] = useState<string>("");
  const [inputOptions, setInputOptions] = useState<string[]>([]);
  const isInitialized = useRef(false);

  // Initialize state from default value (runs only once)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (!defaultValue) {
      setCurrentType("");
      setInputOptions([]);
      return;
    }

    try {
      const parsed = JSON.parse(defaultValue);
      setCurrentType(parsed.type || "");
      setInputOptions(parsed.options || []);
    } catch {
      setCurrentType("");
      setInputOptions([]);
    }
  }, [defaultValue]);

  // Update form value directly in event handlers
  const updateFormValue = (type: string, options: string[] = []) => {
    const formValue =
      type === "select"
        ? JSON.stringify({ type, options })
        : JSON.stringify({ type });

    setValue(name, formValue, { shouldValidate: true });
  };

  const handleTypeChange = (val: string) => {
    setCurrentType(val);
    if (val !== "select") {
      setInputOptions([]);
      updateFormValue(val);
    } else {
      updateFormValue(val, inputOptions);
    }
  };

  const addOption = () => {
    const newOptions = [...inputOptions, ""];
    setInputOptions(newOptions);
    updateFormValue(currentType, newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = inputOptions.filter((_, i) => i !== index);
    setInputOptions(newOptions);
    updateFormValue(currentType, newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...inputOptions];
    newOptions[index] = value;
    setInputOptions(newOptions);
    updateFormValue(currentType, newOptions);
  };

  return (
    <div className="space-y-4">
      <Select
        value={currentType}
        onValueChange={handleTypeChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select field type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentType === "select" && (
        <div className="mt-4">
          <div className="mb-2 font-medium">Options</div>
          <div className="space-y-2 mb-3">
            {inputOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  disabled={disabled}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOption(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={addOption}
            disabled={disabled}
            className="w-full"
          >
            Add Option
          </Button>
        </div>
      )}
    </div>
  );
};
