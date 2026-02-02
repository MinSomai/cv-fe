import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Option } from "@/utils/types";

export { LocaleSwitcher } from "./LocaleSwitcher";
export { LanguageSelector } from "./LanguageSelector";

type Props = {
  name: string;
  type: string;
  options: Array<Option> | string[];
  placeholder: string;
  className?: string;
  containerClassName?: string;
  selectedOption: string | undefined;
  where?: string;
  icon?: React.ReactNode;
  isShowIcon?: boolean;
  isGroupSelect?: boolean;
  createNewGroup?: (option: string) => void;
  onSelect?: (option: Option | string) => void;
  onChange?: (option: string) => void;
};

export const Dropdown: React.FC<Props> = ({
  name,
  type,
  options,
  placeholder,
  containerClassName,
  className,
  selectedOption,
  where,
  icon,
  isShowIcon = true,
  isGroupSelect,
  createNewGroup,
  onSelect,
  onChange,
}) => {
  const t = useTranslations("dropdown");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [positionAbove, setPositionAbove] = useState(false);
  // const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (type === "number" && parseInt(value) > options.length) {
      return;
    }
    onChange && onChange(value);
    setIsOpen(true);

    setFilteredOptions(
      options
        .filter(
          (option) =>
            typeof option !== "string" &&
            option.type?.toLowerCase() !== "custom"
        )
        .filter((option) => {
          if (typeof option === "string") {
            return option.toLowerCase().includes(value.toLowerCase());
          } else if (typeof option === "object" && "label" in option) {
            return option.label.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        }) as Option[] | string[]
    );

    // autoResizeTextarea();
  };

  // const autoResizeTextarea = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "auto"; // Reset height to ensure shrinking works
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match content
  //   }
  // };

  // useEffect(() => {
  //   if (textareaRef.current) {
  //     autoResizeTextarea(); // Resize on initial load
  //   }
  // }, [selectedOption]); // Trigger resize when `selectedOption` changes

  // useEffect(() => {
  //   if (!isOpen) return;

  //   const checkDropdownPosition = () => {
  //     if (textareaRef.current && dropdownRef.current) {
  //       textareaRef.current.addEventListener("keydown", function (event) {
  //         if (event.key === "Enter") {
  //           event.preventDefault(); // This stops the newline
  //         }
  //       });
  //       const textareaRect = textareaRef.current.getBoundingClientRect();
  //       const dropdownHeight = dropdownRef.current.offsetHeight;
  //       const spaceBelow = window.innerHeight - textareaRect.bottom;
  //       const spaceAbove = textareaRect.top;

  //       setPositionAbove(
  //         dropdownHeight > spaceBelow && spaceAbove > spaceBelow
  //       );
  //     }
  //   };

  //   checkDropdownPosition();
  //   window.addEventListener("resize", checkDropdownPosition);

  //   return () => {
  //     window.removeEventListener("resize", checkDropdownPosition);
  //   };
  // }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const ShowOptions: React.FC<{ key: number; item: Option | string }> = ({
    item,
  }) => {
    const [showCheckIcon, setShowCheckIcon] = useState(false);
    return (
      <li
        className="flex flex-row justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 hover:font-bold scrollbar"
        onClick={() => {
          if (onSelect) {
            onSelect(item);
            setIsOpen(false);
          }
        }}
        onMouseEnter={() => {
          setShowCheckIcon(true);
        }}
        onMouseLeave={() => {
          setShowCheckIcon(false);
        }}
      >
        {typeof item !== "string" ? item.label : item}
        {typeof item !== "string" && selectedOption === item.label && (
          <Check size={20} color="#465FF1" />
        )}
        {typeof item !== "string" &&
          selectedOption !== item.label &&
          showCheckIcon && <Check size={20} color="#465FF1" />}
      </li>
    );
  };

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          typeof option !== "string" && option.type?.toLowerCase() !== "custom"
      ) as Option[] | string[]
    );
  }, [options]);

  return (
    <div
      ref={dropdownContainerRef} // Attach the ref here
      className={cn(
        "text-center w-full lg:text-[64px] md:text-4xl text-2xl",
        containerClassName
      )}
    >
      <div className="relative w-full mx-auto">
        <div className="relative">
          {icon}
          <input
            name={name}
            type={type}
            className={cn(
              "inter px-4 w-full border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-muted custom-number-input",
              className
            )}
            placeholder={placeholder}
            value={selectedOption}
            onChange={handleInputChange}
            onClick={() => setIsOpen(!isOpen)}
            maxLength={40}
          />
          {/* <textarea
            name={name}
            ref={textareaRef}
            style={{ overflow: "hidden" }}
            className={cn(
              "inter px-2 w-full border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-muted custom-number-input resize-none",
              className
            )}
            placeholder={placeholder}
            value={selectedOption}
            onChange={handleInputChange}
            onClick={() => setIsOpen(!isOpen)}
            rows={1}
          /> */}
          <button
            type="button"
            className="absolute inset-y-0 right-[14px] flex items-center text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isShowIcon ? (
              isOpen ? (
                <ChevronUp color={selectedOption ? "#0E131D" : "#D4D4DF"} />
              ) : (
                <ChevronDown color={selectedOption ? "#0E131D" : "#D4D4DF"} />
              )
            ) : null}
          </button>
        </div>
        {isOpen && (
          <ul
            ref={dropdownRef}
            className={cn(
              "absolute z-10 w-full mt-2 text-sm text-start font-medium bg-white border rounded-lg shadow-lg max-h-72 overflow-y-auto scrollbar",
              positionAbove ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {isGroupSelect && (
              <li
                className="flex flex-row px-4 py-2 gap-2 cursor-pointer hover:bg-gray-100 scrollbar"
                onClick={() =>
                  createNewGroup && createNewGroup(selectedOption as string)
                }
              >
                <Plus size={20} color="#465FF1" />
                <span className="text-[#475467]">
                  {selectedOption === "" ||
                  (Array.isArray(options) &&
                    options.every((opt) => typeof opt === "string") &&
                    options.includes(selectedOption as string))
                    ? t("createNewGroup")
                    : selectedOption}
                </span>
              </li>
            )}
            {filteredOptions.map((item, index) => (
              <ShowOptions key={index} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
