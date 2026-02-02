import React from "react";
import { Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-wrap gap-10 justify-center items-end w-full text-sm leading-none text-secondary-foreground max-md:px-5 max-md:max-w-full">
      <div className="flex gap-2 items-center whitespace-nowrap">
        <Mail className="w-4 h-4" />
        <a href="#" className="self-stretch my-auto">
          support@recv.ai
        </a>
      </div>
    </footer>
  );
};

export default Footer;
