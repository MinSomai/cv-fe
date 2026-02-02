import { useState, useEffect } from "react";

interface ButtonGroupProps {
  handleNoneClick: () => void;
  handleCheckboxClick: (type: string) => void;
  selected: { none: boolean; inApp: boolean; email: boolean };
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  handleNoneClick,
  handleCheckboxClick,
  selected,
}) => {
  return (
    <div className="inline-flex border rounded-md overflow-hidden">
      <button
        onClick={handleNoneClick}
        className={`px-4 py-2 ${
          selected.none
            ? "bg-[#FAFAFA] text-[#252B37] font-semibold text-sm"
            : "bg-white text-[#414651] font-semibold text-sm hover:bg-gray-100"
        } border-r`}
      >
        None
      </button>
      <button
        onClick={() => handleCheckboxClick("inApp")}
        className={`px-4 py-2 ${
          selected.inApp
            ? "bg-[#FAFAFA] text-[#252B37] font-semibold text-sm"
            : "bg-white text-[#414651] font-semibold text-sm hover:bg-gray-100"
        } border-r`}
      >
        In-app
      </button>
      <button
        onClick={() => handleCheckboxClick("email")}
        className={`px-4 py-2 ${
          selected.email
            ? "bg-[#FAFAFA] text-[#252B37] font-semibold text-sm"
            : "bg-white text-[#414651] font-semibold text-sm hover:bg-gray-100"
        }`}
      >
        Email
      </button>
    </div>
  );
};

export default ButtonGroup;
