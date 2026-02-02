import React from "react";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/lib/navigation";

export default function ModalFooter({
  buttonText,
  children,
  saveClick,
}: {
  children?: React.ReactNode;
  buttonText: string;
  saveClick?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-row p-6 justify-between items-center">
      <Button
        type="button"
        className="px-[18px] py-[10px]"
        variant="outline"
        onClick={saveClick}
      >
        <span className="font-semibold text-base text-[#414651]">
          Save for later
        </span>
      </Button>
      <Button
        type="button"
        className="flex flex-row gap-2 items-center"
        onClick={() => router.push("/settings?value=Billing")}
      >
        <span className="font-semibold text-base text-white">{buttonText}</span>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
}
