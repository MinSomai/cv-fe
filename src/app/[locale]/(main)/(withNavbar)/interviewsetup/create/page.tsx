"use client";

import React, { Suspense } from "react";
import InterviewSetupCreate from "../_components/Create/InterviewSetupCreate";
import { useAuth } from "@/providers/Auth";
import Loading from "@/components/Loading";

export default function InterviewSetupCreatePage() {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <Suspense fallback={<Loading />}>
      <InterviewSetupCreate />
    </Suspense>
  );
}
