"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/lib/navigation";

const OAuthSuccessPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage("loginSuccess", window.location.origin);
      window.close();
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      <h1>Google Login Successful</h1>
      <p>Login completed. You can close this window.</p>
    </div>
  );
};

export default OAuthSuccessPage;
