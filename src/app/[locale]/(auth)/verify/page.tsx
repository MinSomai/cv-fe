import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const VerifyClient = dynamic(() => import("./_components/verifyClient"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function VerifyPage() {
  return <VerifyClient />;
}
