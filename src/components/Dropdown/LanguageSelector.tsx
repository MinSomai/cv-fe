"use client";

import React, { useEffect, useState, useRef } from "react";
import { Language } from "@/utils/types";
import { cn } from "@/lib/utils";

interface FlagIconProps {
  countryCode: string;
}

function FlagIcon({ countryCode = "" }: FlagIconProps) {
  return (
    <span
      className={`fi fis w-8 h-8 text-[32px] rounded-full border-none shadow-[0px_0px_0px_2px_#0000000F] bg-white inline-block mr-2 fi-${countryCode}`}
    />
  );
}

export const LanguageSelector = ({
  language,
  languageOptions,
  onSelectLanguage,
}: {
  language: Language;
  languageOptions: Language[];
  onSelectLanguage: (language: Language) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [positionAbove, setPositionAbove] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (language: Language) => {
    onSelectLanguage(language);
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (!isOpen) return;

    const checkDropdownPosition = () => {
      if (buttonRef.current && dropdownRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        setPositionAbove(
          dropdownHeight > spaceBelow && spaceAbove > spaceBelow
        );
      }
    };

    checkDropdownPosition();
    window.addEventListener("resize", checkDropdownPosition);

    return () => {
      window.removeEventListener("resize", checkDropdownPosition);
    };
  }, [isOpen]);

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

  return (
    <>
      <div ref={dropdownContainerRef} className="flex items-center z-40 w-full">
        <div className="relative inline-block text-left w-full">
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              ref={buttonRef}
              type="button"
              className="inline-flex items-center justify-between w-full h-14 rounded-xl border border-[#F0F3FF] shadow-[0px_1px_2px_0px_#0A0D120D] pl-3 pr-[18px] py-3 bg-white text-base font-medium text-[#181D27] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="flex flex-row items-center">
                <FlagIcon countryCode={selectedLanguage.key} />
                {selectedLanguage.value}
              </div>
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isOpen && (
            <div
              ref={dropdownRef}
              className={`origin-top-right absolute ${
                positionAbove ? "bottom-full mb-2" : "top-full mt-2"
              } right-0 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-72 overflow-y-auto scrollbar`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="language-selector"
            >
              <div className="py-1 grid grid-cols-1 gap-2" role="none">
                {languageOptions.map((language, index) => {
                  return (
                    <button
                      key={language.key}
                      onClick={() => handleLanguageChange(language)}
                      className={cn(
                        "px-4 py-2 text-sm text-left items-center inline-flex hover:bg-gray-10",
                        {
                          "bg-gray-100 text-gray-900":
                            selectedLanguage.key === language.key,
                          "text-gray-700":
                            selectedLanguage.key !== language.key,
                        },
                        { "rounded-r": index % 2 === 0 },
                        { "rounded-l": index % 2 !== 0 }
                      )}
                      role="menuitem"
                    >
                      <FlagIcon countryCode={language.key} />
                      <span className="truncate">{language.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
