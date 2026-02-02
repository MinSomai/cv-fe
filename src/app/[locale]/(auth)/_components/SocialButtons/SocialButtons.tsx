"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import Image from "next/image";

import { socialButtons } from "@/utils/data";
import { Button } from "@/components/Button";
import { useAuth } from "@/providers/Auth";
import { User } from "@/payload-types";

interface Props {
  accountType: string;
}

export default function SocialLogin({ accountType }: Props) {
  const router = useRouter();
  const entitySocialButtons = [socialButtons[0], ...socialButtons.slice(-2)];
  const buttons =
    accountType === "individual" ? socialButtons : entitySocialButtons;
  const { fetchMe } = useAuth();

  const handleButtonClick = (url: string) => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      url,
      "Social Login",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars=yes,status=1`
    );

    window.addEventListener("message", async (event) => {
      if (
        event.origin === window.location.origin &&
        event.data === "loginSuccess"
      ) {
        if (popup) {
          const user = (await fetchMe()) as unknown as User;

          if (user?.entity?.role === "staff") router.push("/onboarding");
          else {
            if (user?.entity?.tenant) router.push("/dashboard");
            else router.push("/entitywelcome");
          }
        }
      }
    });
  };

  return (
    <form className="flex flex-col gap-3 mt-4 w-full">
      <div className="flex flex-wrap gap-3 justify-center items-center w-full">
        {/* {buttons.slice(0, 3).map((button, index) => (
          <React.Fragment key={index}>
            <Button
              type="button"
              onClick={() =>
                handleButtonClick(
                  button.href +
                    "?type=" +
                    (accountType === "individual" ? "indiv" : "entity")
                )
              }
              key={index}
              className="flex flex-1 justify-center items-center rounded-lg border border-gray-300 border-solid"
              variant="social"
            >
              <Image src={button.src} alt={`logo`} width={24} height={24} />
            </Button>
          </React.Fragment>
        ))} */}

        <React.Fragment>
          <Button
            type="button"
            onClick={() =>
              handleButtonClick(
                socialButtons[0].href +
                  "?type=" +
                  (accountType === "individual" ? "indiv" : "entity")
              )
            }
            className="flex flex-1 justify-center items-center rounded-lg border border-gray-300 border-solid"
            variant="social"
          >
            <Image
              src={socialButtons[0].src}
              alt={`logo`}
              width={24}
              height={24}
            />
          </Button>
        </React.Fragment>
      </div>

      {/* {accountType === "individual" && (
        <div className="flex flex-wrap gap-3 justify-center items-center w-full">
          {buttons.slice(3, 6).map((button, index) => (
            <React.Fragment key={index}>
              <Button
                type="button"
                onClick={() =>
                  handleButtonClick(
                    button.href +
                      "?type=" +
                      (accountType === "individual" ? "indiv" : "entity")
                  )
                }
                key={index}
                className="flex flex-1 justify-center items-center rounded-lg border border-gray-300 border-solid"
                variant="social"
              >
                <Image src={button.src} alt={`logo`} width={24} height={24} />
              </Button>
            </React.Fragment>
          ))}
        </div>
      )} */}
    </form>
  );
}
