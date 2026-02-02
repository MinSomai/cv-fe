import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header/Header";
import LoginForm from "../_components/LoginForm";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading";

const LoginPage: React.FC = async () => {
  const t = await getTranslations("common");
  
  return (
    <Suspense fallback={<Loading text={t("loading")} />}>
      <main className="flex overflow-hidden flex-col items-center bg-white">
        <div className="flex w-full min-h-[960px] max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
            <Header />
            <div className="flex flex-col gap-10">
              <section className="flex flex-col items-center px-8 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col max-w-full w-[416px]">
                  <LoginForm />
                </div>
              </section>
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default LoginPage;
