import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEFAULT_OPTIONS = ["option1", "option2", "option3"];

export default function Selector({
  label,
  options = DEFAULT_OPTIONS,
  onChange,
  value,
  triggerClassName,
  parentClassName,
  placeholder = "Select an option",
  error,
  disabled,
}: {
  label?: string;
  options?: string[];
  onChange?: (value: string) => void;
  value?: string;
  triggerClassName?: string;
  parentClassName?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-2xl px-4 pt-4 pb-2",
        parentClassName
      )}
    >
      <p className="text-sm text-text_secondary font-medium">{label}</p>

      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          disabled={disabled}
          className={cn(
            "w-full min-h-8 border-0 text-sm text-text_primary font-semibold p-0 placeholder:text-text_primary shadow-none",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="!border-none max-h-[300px] overflow-y-auto">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
