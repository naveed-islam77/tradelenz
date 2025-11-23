import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type OptionType = {
  label: string;
  value: string;
};

const DEFAULT_OPTIONS: OptionType[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export default function SelectorWithLabelValue({
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
  options?: OptionType[];
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
            <SelectItem key={option.value} value={option.value}>
              {option.label}
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
