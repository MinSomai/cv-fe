"use client";

import React from "react";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { toast } from "sonner";

import Header from "@/components/Header/Header";
import SignUpForm from "../../_components/SignUpForm";
import JoinSignUpForm from "../../_components/JoinSignUpForm";
import Footer from "@/components/Footer/Footer";

const WelcomePage: React.FC = () => {
  const params = useParams();
  const token = params.token as string;
  const tError = useTranslations("errors");

  const entityInviteSignup = () => {
    return (
      <div className="flex self-stretch bg-white">
        <div className="flex flex-col flex-1 shrink justify-between w-full basis-0 min-w-[240px] max-md:max-w-full">
          <Header />
          <section className="flex flex-col items-center px-8 mt-16 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col max-w-full w-[416px]">
              <JoinSignUpForm token={token} />
            </div>
          </section>
          <Footer />
        </div>
      </div>
    );
  };

  const individualInviteSignup = () => {
    return (
      <main className="flex overflow-hidden flex-col bg-white">
        <div className="flex flex-wrap w-full bg-white min-h-[960px] max-md:max-w-full">
          <section className="flex flex-col flex-1 shrink justify-between basis-28 min-w-[480px] max-md:max-w-full">
            <Header />
            <main className="flex flex-col items-center px-8 w-full max-md:px-5 max-md:max-w-full">
              <div className="flex flex-col max-w-full w-[416px]">
                <SignUpForm token={token} />
              </div>
            </main>
            <Footer />
          </section>
        </div>
      </main>
    );
  };

  if (token[token.length - 1] !== "i" && token[token.length - 1] !== "e") {
    toast.error(tError("wrongUrl"));
    return tError("pageNotFound");
  }

  return token[token.length - 1] === "i"
    ? individualInviteSignup()
    : entityInviteSignup();
};

export default WelcomePage;
