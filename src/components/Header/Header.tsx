import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="flex items-start w-full -top-5">
      <div className="flex gap-3 items-center">
        <div className="w-40 h-16">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={120}
            height={30}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
