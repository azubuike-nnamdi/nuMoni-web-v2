"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import * as React from "react"
import { Control, FieldPath, FieldValues, useController } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ComboboxOption {
  value: string
  label: string
}

interface FormComboboxMultiProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  placeholder?: string
  options: ComboboxOption[]
  disabled?: boolean
  required?: boolean
  className?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
}

export function FormComboboxMulti<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "Select options...",
  options,
  disabled = false,
  required = false,
  className = "",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  isLoading = false,
}: FormComboboxMultiProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules: { required: required ? `${label} is required` : false },
  })

  const selectedValues: string[] = Array.isArray(field.value) ? field.value : []
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))

  // Debounce search value to improve performance
  React.useEffect(() => {
    if (searchValue !== debouncedSearchValue) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchValue, debouncedSearchValue]);

  // Filter options based on debounced search value
  const filteredOptions = React.useMemo(() => {
    if (!debouncedSearchValue.trim()) return options;

    const searchLower = debouncedSearchValue.toLowerCase().trim();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower)
    );
  }, [options, debouncedSearchValue]);

  // Clear search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
      setDebouncedSearchValue("");
      setIsSearching(false);
    }
  }, [open]);

  const toggleOption = (value: string) => {
    const currentValues: string[] = Array.isArray(field.value) ? field.value : []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    field.onChange(newValues)
  }

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentValues: string[] = Array.isArray(field.value) ? field.value : []
    field.onChange(currentValues.filter((v) => v !== value))
  }

  const displayText = selectedOptions.length > 0
    ? `${selectedOptions.length} selected`
    : placeholder

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isLoading}
            className={cn(
              "w-full justify-between h-auto min-h-12 px-3 py-2 text-left font-normal",
              !selectedOptions.length && "text-gray-500",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    {option.label}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeOption(option.value, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          removeOption(option.value, e as unknown as React.MouseEvent);
                        }
                      }}
                      className="hover:bg-gray-200 rounded-full p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                ))
              ) : (
                <span>{isLoading ? "Loading categories..." : displayText}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              {isLoading ? (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-theme-dark-green rounded-full animate-spin"></div>
                    Loading categories...
                  </div>
                </div>
              ) : isSearching ? (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-theme-dark-green rounded-full animate-spin"></div>
                    Searching...
                  </div>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.slice(0, 50).map((option, index) => {
                      const isSelected = selectedValues.includes(option.value)
                      return (
                        <CommandItem
                          key={`${option.value}-${index}`}
                          value={option.value}
                          onSelect={() => {
                            toggleOption(option.value)
                            setSearchValue("")
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      )
                    })}
                    {filteredOptions.length > 50 && (
                      <div className="px-2 py-1 text-xs text-gray-500 text-center">
                        Showing first 50 results. Refine your search for more specific results.
                      </div>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  )
}

