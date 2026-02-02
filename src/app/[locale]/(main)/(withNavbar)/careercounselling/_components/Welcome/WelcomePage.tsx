import React from "react";
import { useRouter } from "@/lib/navigation";

import Header from "../CareerCounsellingHeader";
import Image from "next/image";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { toast } from "sonner";
import { BillingPlan } from "@/payload-types";
import { Crown } from "lucide-react";

export default function CareerCounsellingWelcomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (!user) return;

    console.log("👍👍👍checking user.interviewPlan", user.interviewPlan);

    // Check if user has Explorer plan
    const isExplorerPlan =
      user.interviewPlan &&
      (user.interviewPlan as BillingPlan).name
        .toLowerCase()
        .includes("explorer");

    if (isExplorerPlan) {
      // If user has Explorer plan, go to upgrade plan page
      router.push("/settings?value=Plans");
      return;
    }

    // For all other plans (including Pro, Achiever, etc.), go to create page
    router.push("/careercounselling/create");
  };

  return (
    <>
      <Header isExistInterview={false} />
      <div className="flex flex-col flex-1 gap-6 items-center py-28">
        <Image src="/17.svg" alt="image" width={180} height={238} />
        <div className="flex flex-col gap-4 w-[374px] text-center">
          <span className="text-[#0E131D] text-2xl font-semibold">
            Discover your <span className="playfair-display">True Calling</span>{" "}
            and unleash your{" "}
            <span className="playfair-display">Ultimate Potential</span>
          </span>
          <span className="text-secondary-foreground text-base">
            Your journey starts here! Get expert career advice and take the next
            step in your journey
          </span>
          <span className="text-secondary-foreground text-base">
            Info about the process
          </span>
          <Button
            type="button"
            variant="defaultRing"
            onClick={handleButtonClick}
          >
            {user?.interviewPlan &&
            (user?.interviewPlan as BillingPlan).name
              .toLowerCase()
              .includes("explorer") ? (
              <div className="flex items-center gap-2 justify-center">
                <Crown className="text-primary-foreground" size={24} />
                <span className="font-semibold">Upgrade your plan</span>
              </div>
            ) : (
              <span className="font-semibold">Discover my career path</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
