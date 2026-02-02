import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Size = "default" | "sm" | "lg" | "icon";

type Props = {
  name: string;
  // label: string;
  // inputPosition?: string;
  register?: UseFormRegister<FieldValues & any>;
  required?: boolean;
  // requiredClassName?: string;
  size?: Size;
  value?: string;
  defaultValue?: string;
  type?: "text" | "number" | "password" | "email";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => boolean | string;
  className?: string;
  placeholder?: string;
  error?: any;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
};

const inputVariants = cva(
  cn(
    "whitespace-nowrap ring-offset-background transition-colors overflow-hidden text-base text-accent-foreground rounded-lg shadow-sm w-full",
    "disabled:pointer-events-none disabled:bg-[#F9FAFB] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2",
    "border border-slate-300 border-solid focus-visible:border-primary bg-white text-accent-foreground placeholder:text-slate-500 autofill:!bg-white"
  ),
  {
    variants: {
      size: {
        default: "h-11 px-3.5 py-2.5",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const Input: React.FC<Props> = ({
  name,
  // label,
  // inputPosition,
  required,
  // requiredClassName,
  register,
  type = "text",
  onChange,
  validate,
  value,
  defaultValue,
  size = "default",
  className = "",
  placeholder = "",
  error = null,
  disabled = false,
  icon,
  iconPosition = "right",
  onIconClick,
}) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {/* <label
        htmlFor="name"
        className={cn(
          "text-sm font-medium leading-none text-[#0E131D]",
          inputPosition === "right" && "flex-1"
        )}
      >
        {label}&nbsp;
        {required ? <label className={cn(requiredClassName)}>*</label> : ""}
      </label> */}
      <div className="relative">
        <input
          className={inputVariants({ size, className })}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          {...(register &&
            register(name, {
              required,
              validate,
              ...(type === "email"
                ? {
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email",
                    },
                  }
                : {}),
              ...(type === "password"
                ? {
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  }
                : {}),
            }))}
        />
        <div
          className={cn(
            "absolute inset-y-0 flex items-center pr-3 cursor-pointer",
            iconPosition === "right" ? "right-0" : "left-4"
          )}
          onClick={onIconClick}
        >
          {icon}
        </div>
        {error && (
          <div className="mt-1 text-rose-500 text-sm">
            {!error?.message && error?.type === "required"
              ? "This field is required"
              : error?.message}
          </div>
        )}
      </div>
    </div>
  );
};
