"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheck, CircleAlert, MailCheck } from "lucide-react";
import { rest } from "@/lib/rest";
import Loading from "@/components/Loading";
import { Link } from "@/lib/navigation";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const token = useRef<string | null>(searchParams.get("token"));
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token.current) return;

      try {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/verify/${token.current}`,
          {},
          { method: "POST" }
        );
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full h-screen items-center justify-center">
      {token.current ? (
        status === "loading" ? (
          <div className="flex flex-col gap-4">
            <Loading />
            <span className="text-lg font-semibold text-secondary-foreground">
              Sending request to server for verification...
            </span>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col gap-4 items-center">
            <CircleCheck size={120} color="white" fill="#3EBA54" />
            <span className="text-lg font-semibold text-secondary-foreground">
              Congratulations! You are verified! 🚀
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <CircleAlert size={120} color="white" fill="red" />
            <span className="text-lg font-semibold text-secondary-foreground">
              Sorry, there was an error verifying your account. Please try
              again.
            </span>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <MailCheck size={120} className="text-primary" />
          <span className="text-lg font-semibold text-secondary-foreground">
            We&apos;ve sent you an email with a verification link. Please check.
          </span>
        </div>
      )}
      {status !== "loading" && (
        <Link href="/login">
          <u className="text-lg font-semibold text-secondary-foreground cursor-pointer">
            Go to login page
          </u>
        </Link>
      )}
    </div>
  );
}
