import React from "react";
import { Copy } from "lucide-react";

const ShareLink: React.FC<{ token: string }> = ({ token }) => {
  return (
    <div className="flex flex-col mt-6 w-full max-md:max-w-full">
      <label
        htmlFor="shareLink"
        className="text-sm font-medium leading-none text-accent-foreground"
      >
        Share link
      </label>
      <div className="flex flex-wrap gap-1.5 mt-1.5 w-full text-base max-md:max-w-full">
        <div className="flex flex-1 gap-1.5 min-w-[240px]">
          <div className="flex flex-1 gap-2 items-center px-3.5 py-2.5 w-full bg-white rounded-lg border border-gray-300 border-solid min-w-[240px]">
            <input
              id="shareLink"
              type="text"
              readOnly
              value={`api/users/join/${token}`}
              className="flex-1 shrink gap-2 self-stretch my-auto w-full min-w-[240px] bg-transparent border-none focus:outline-none"
              aria-label="Share link"
            />
          </div>
        </div>
        <button className="flex font-small rounded-lg text-accent-foreground w-[145px]">
          <div className="flex flex-1 gap-2 text-[#0E131D] justify-center items-center px-5 py-2.5 w-full bg-primary-foreground rounded-lg border border-gray-300 border-solid">
            <Copy size={20} />
            <span className="self-stretch my-auto">Copy Link</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ShareLink;
