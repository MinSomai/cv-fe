import React from "react";

type props = {
  label: string;
  value: string;
};

const InterviwerChip: React.FC<props> = ({ label, value }) => {
  return (
    <div className="flex flex-row rounded-3xl bg-white bg-opacity-20 px-2 gap-1.5 h-[37px] items-center">
      <span className="text-sm font-medium leading-5 first-letter:uppercase">
        {label}
      </span>
      <div className="rounded-[32px] px-1 py-0.5 bg-white text-black text-sm font-medium">
        {value}%
      </div>
    </div>
  );
};

export default InterviwerChip;
