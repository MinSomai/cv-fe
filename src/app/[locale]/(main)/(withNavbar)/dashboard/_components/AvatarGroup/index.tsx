import React from "react";

import Image from "next/image";

const AvatarGroup = ({ avatars }: { avatars: any[] }) => {
  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, 3).map((avatar, index) => (
        <Image
          key={index}
          className="inline-block size-8 rounded-full ring-2 ring-white cursor-pointer hover:ring-gray-300"
          src={avatar.photo || "/users/user.png"}
          width={24}
          height={24}
          alt="Avatar"
          title={avatar.name}
          unoptimized
        />
      ))}
      {avatars.length > 3 && (
        <div
          className="flex flex-col size-8 rounded-full ring-2 ring-white bg-[#F5F5F5] text-center text-[#535862] font-semibold justify-center cursor-pointer hover:ring-gray-300"
          title={avatars
            .slice(3, avatars.length)
            .map((avatar) => avatar.name)
            .join(", ")}
        >{`+${avatars.length - 3}`}</div>
      )}
    </div>
  );
};

export default AvatarGroup;
