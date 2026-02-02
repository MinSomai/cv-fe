import React from "react";
import Image from "next/image";

type props = {
  username: string | undefined;
  email: string | undefined;
  avatar: string;
  isNavbarClose?: boolean;
};

const Account: React.FC<props> = ({
  username,
  email,
  avatar,
  isNavbarClose,
}) => {
  return (
    <div className="flex flex-row gap-2 relative">
      <div className="relative w-10 h-10">
        <Image
          src={avatar || "/users/user.png"}
          alt="User Avatar"
          className="w-full h-full rounded-full"
          width={40}
          height={40}
          unoptimized
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      {!isNavbarClose && (
        <div className="flex flex-row justify-between">
          <div
            className="flex flex-col text-sm relative group"
            title={`${username || "No username"}\n${email || "No email"}`}
          >
            <span className="text-[#181D27] font-semibold">
              {username && username.length < 25
                ? username
                : username?.slice(0, 22) + "..."}
            </span>
            <span className="text-muted-foreground">
              {email && email.length < 25 ? email : email?.slice(0, 22) + "..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
