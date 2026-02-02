import React from "react";
import Image from "next/image";

export default function GoodNews() {
  return (
    <div className="flex relative items-center px-4 py-3.5 text-white bg-primary rounded-3xl min-h-[165px] max-md:max-w-full">
      <Image
        src="/14.svg"
        alt=""
        width={560}
        height={166}
        className="absolute bottom-0 z-0 rounded-2xl aspect-[3.39] h-[166px] left-[0px] min-w-[240px] w-[560px] max-md:max-w-full opacity-60"
      />
      <div className="flex z-0 flex-col my-auto text-lg min-w-[240px] w-[307px]">
        <div className="font-bold">
          Good news! <span className="">🎁</span>
        </div>
        <div className="mt-2 leading-6">
          As a member of this esteemed institution, you&apos;ve unlocked a 10%
          discount on all our subscriptions.
        </div>
      </div>
      <div className="z-0 my-auto text-9xl font-bold max-md:text-4xl">
        <span className="font-extrabold tracking-tighter">10</span>
        <span className="text-5xl tracking-tighter">%</span>
      </div>
    </div>
  );
}
