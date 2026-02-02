"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
    // router.push("/login");
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleClick = () => {
    logout();
  };

  return (
    <main className="flex overflow-hidden flex-col bg-white min-h-screen">
      <div className="flex relative flex-col items-center justify-center py-14 w-full min-h-[1024px] max-md:max-w-full gap-[86px]">
        <div className="flex relative flex-col justify-center items-center self-center max-w-full w-[890px]">
          <header className="flex flex-col justify-center items-center w-full text-center text-black">
            <h1 className="text-9xl font-bold leading-[142px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
              {t("welcome")}
            </h1>
            <p className="mt-6 text-base tracking-normal leading-6 w-[522px] max-md:max-w-full">
              {t("tagline")}
            </p>
          </header>
          <button
            // onClick={handleClick}
            className="gap-2 px-5 py-4 mt-8 max-w-full text-base font-semibold text-white bg-indigo-600 rounded-lg min-h-[48px] w-[250px]"
          >
            {t("getStarted")}
          </button>
        </div>
      </div>
    </main>
  );
}
