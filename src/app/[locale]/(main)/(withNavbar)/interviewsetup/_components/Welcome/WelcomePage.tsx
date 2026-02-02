import React from "react";
import { useRouter } from "@/lib/navigation";
import Image from "next/image";

import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import Header from "../InterviewSetupHeader";
import { toast } from "sonner";

export default function InterviewWelcomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (!user) return;
    router.push("/interviewsetup/create");
  };

  if (!user) return <></>;

  return (
    <>
      <Header userName={user.name} isExistInterview={false} />
      <div className="flex flex-col flex-1 gap-6 items-center py-28">
        <Image src="/17.svg" alt="image" width={180} height={238} />
        <div className="flex flex-col gap-4 w-[374px] text-center">
          <span className="text-[#0E131D] text-2xl font-semibold">
            When if not <span className="playfair-display">today</span>?
          </span>
          <span className="text-secondary-foreground text-base">
            It&apos;s time to start a new interview
          </span>
          <Button
            type="button"
            variant="defaultRing"
            onClick={handleButtonClick}
          >
            <span className="font-semibold">Start your first interview</span>
          </Button>
        </div>
      </div>
    </>
  );
}
