"use client";

import React from "react";
import Image from "next/image";

import { useRouter } from "@/lib/navigation";

import { Button } from "@/components/Button";

export default function ReCVComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/interviewsetup");
  };

  return (
    <div className="flex flex-col items-center justify-center text-accent-foreground bg-primary-foreground">
      <div className="flex gap-3 items-center text-2xl font-bold w-full p-6">
        <div className="flex w-6 h-6 bg-indigo-50 rounded" />
        <div>ReCV</div>
      </div>
      <div className="flex flex-col items-center justify-center text-center px-5 w-full">
        <div className="flex flex-col max-w-full gap-8 w-[715px]">
          <Image src="/16.svg" alt="" width={670} height={500} />
          <div className="flex flex-wrap items-center justify-center gap-8 w-full">
            <h1 className="text-4xl font-bold">You&apos;re all set !</h1>
            <p className="text-2xl leading-8 max-md:max-w-full">
              You&apos;re ready to shine! 🌟 Start practicing with our
              AI-powered interview coach and take your skills to the next level.
            </p>
            <Button
              type="button"
              variant="default"
              className="w-48"
              onClick={handleClick}
            >
              Let&apos;s start
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
