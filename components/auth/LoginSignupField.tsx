"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

export type FormInputFieldProps<T extends FieldValues> = Omit<
  GlassInputProps,
  "name" | "value" | "defaultValue" | "onChange"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  /** Accessible label (visually hidden, the placeholder is what people see) */
  label: string;
  showLabel?: boolean;
};

/** Reusable react-hook-form text field: icon + glass input + error message. */

export function FormInputField<T extends FieldValues>({
  control,
  name,
  label,
  showLabel = false,
  ...inputProps
}: FormInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-0 w-full">
          <FormLabel
            className={
              showLabel ? "mb-2 text-sm font-medium text-white" : "sr-only"
            }
          >
            {label}
          </FormLabel>
          <FormControl>
            <GlassInput {...inputProps} {...field} />
          </FormControl>
          <FormMessage className="mt-2 pl-2 text-sm text-red-300" />
        </FormItem>
      )}
    />
  );
}

/** FormInputField + show/hide toggle. */
export function PasswordField<T extends FieldValues>(
  props: Omit<FormInputFieldProps<T>, "type" | "trailing">,
) {
  const [show, setShow] = useState(false);
  const Toggle = show ? Eye : EyeOff;

  return (
    <FormInputField
      icon={Lock}
      placeholder="Password"
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-white/70 transition hover:text-white"
        >
          <Toggle size={18} strokeWidth={1.6} />
        </button>
      }
    />
  );
}

type Propss<T extends FieldValues> = Omit<
  GlassSelectProps,
  "name" | "value" | "onValueChange"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  /** Accessible label (visually hidden) */
  label: string;
};

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  ...selectProps
}: Propss<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-0 w-full">
          <FormLabel className="sr-only">{label}</FormLabel>
          <FormControl>
            <GlassSelect
              {...selectProps}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          </FormControl>
          <FormMessage className="mt-2 pl-2 text-sm text-red-300" />
        </FormItem>
      )}
    />
  );
}

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
};

export function FormCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              className="size-6 rounded-md border-white/25 bg-white/5 text-white data-[state=checked]:border-[#3b82f6] data-[state=checked]:bg-[#2f6bff]"
            />
          </FormControl>
          <FormLabel className="cursor-pointer text-[15px] font-normal text-white/90">
            {label}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
export type SelectOption = { value: string; label: string };

export type GlassSelectProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "children" | "value" | "defaultValue" | "onChange"
> & {
  icon?: LucideIcon;
  options: SelectOption[];
  /** Shown (dimmed) while the value is "" */
  placeholder?: string;
  /** Sizing/spacing for the field; height defaults to h-14 */
  wrapperClassName?: string;
  value?: string;
  onValueChange?: (value: string | null) => void;
  name?: string;
};

/** Shared look for glass inputs and selects */
export const glassField = cn(
  "flex h-15 items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-5 transition",
  "focus-within:border-[#4c7dff]/70 focus-within:bg-white/[0.06] focus-within:ring-4 focus-within:ring-[#3b6bff]/15",
  "has-[[aria-invalid=true]]:border-red-400/70 has-[[aria-invalid=true]]:ring-red-400/10",
);

export interface GlassInputProps extends React.ComponentProps<"input"> {
  /** Leading icon */
  icon?: LucideIcon;
  /** Anything rendered on the right, e.g. a show/hide button */
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * Glass-styled input. Extra props (id, aria-*, ref, name...) go to the real
 * <input>, so it works inside shadcn's <FormControl>.
 */
export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon: Icon, trailing, wrapperClassName, className, ...props }, ref) => (
    <label className={cn(glassField, wrapperClassName)}>
      {Icon && (
        <Icon size={18} strokeWidth={1.5} className="shrink-0 text-white/70" />
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55",
          className,
        )}
        {...props}
      />
      {trailing}
    </label>
  ),
);
GlassInput.displayName = "GlassInput";
/** Native <select> with the glass look: simple, accessible, works inside <FormControl>. */
export const GlassSelect = React.forwardRef<
  HTMLButtonElement,
  GlassSelectProps
>(
  (
    {
      icon: Icon,
      options,
      placeholder,
      wrapperClassName,
      className,
      value,
      onValueChange,
      name,
      disabled,
      ...triggerProps
    },
    ref,
  ) => (
    <Select
      value={value}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
    >
      {/* The wrapper owns the height; the trigger fills it (overrides shadcn's fixed h-9) */}
      <div className={cn("h-14", wrapperClassName)}>
        <SelectTrigger
          ref={ref}
          className={cn(
            "h-full w-full rounded-lg border-white/10 bg-white/[0.03] px-5 text-sm text-white shadow-none",
            "data-[size=default]:h-full data-[size=sm]:h-full",
            "hover:bg-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
            "data-[placeholder]:text-white/55",
            "focus-visible:border-[#4c7dff]/70 focus-visible:bg-white/[0.06] focus-visible:ring-4 focus-visible:ring-[#3b6bff]/15",
            "aria-invalid:border-red-400/70 aria-invalid:ring-red-400/10 dark:aria-invalid:ring-red-400/10",
            "[&_svg:not([class*='text-'])]:text-white/70 [&>svg]:opacity-100",
            className,
          )}
          {...triggerProps}
        >
          <span className="flex min-w-0 items-center gap-4">
            {Icon && (
              <Icon
                size={18}
                strokeWidth={1.5}
                className="shrink-0 text-white/70"
              />
            )}
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
      </div>

      <SelectContent className="rounded-md p-2 mt-8 border-white/15 bg-[#0b1240]/95 text-white backdrop-blur-xl">
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="focus:bg-white/10 text-sm hover:bg-white/10 cursor-pointer focus:text-white"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
);
GlassSelect.displayName = "GlassSelect";
