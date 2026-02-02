import React from "react";

import Header from "./Header/Header";
import { FormBody } from "./FormBody/FormBody";
import FooterImage from "./Footer/FooterImage";

const OnboardingTemplate: React.FC<{
  headerTitle?: string;
  headerSubTitle?: string;
  bodyTitle?: string;
  bodyTitleClassName?: string;
  children?: React.ReactNode;
  decorateChildren?: React.ReactNode | undefined;
  handleBackClick: () => void;
}> = ({
  headerTitle = "",
  headerSubTitle = "",
  bodyTitle = "",
  bodyTitleClassName = "",
  children,
  decorateChildren,
  handleBackClick,
}) => {
  return (
    <main className="flex flex-col bg-white min-h-screen overflow-y-auto scrollbar">
      <Header
        className=""
        title={headerTitle}
        subtitle={headerSubTitle}
        onClick={handleBackClick}
      />
      <div className="flex flex-col items-center justify-center w-full h-[full] max-w-full gap-[178px]">
        <div className="flex flex-col items-center justify-center w-full max-w-full px-2 sm:px-4">
          <FormBody
            title={bodyTitle}
            titleClassName={bodyTitleClassName}
            decorate={decorateChildren}
          >
            {children}
          </FormBody>
        </div>
      </div>
    </main>
  );
};
OnboardingTemplate.displayName = "OnboardingTemplate";

export { OnboardingTemplate };
