import { cn } from "@/lib/utils";
import React from "react";

const FormBody: React.FC<{
  title: string;
  children?: React.ReactNode | undefined;
  titleClassName?: string;
  decorate?: React.ReactNode | undefined;
}> = ({ title = "", titleClassName = "", children, decorate }) => {
  return (
    <section className="flex flex-col items-center justify-center max-w-full">
      <div className="flex w-full justify-center">
        <h1
          className={cn(
            "relative text-center text-black max-md:max-w-full text-[40px] font-bold",
            titleClassName
          )}
        >
          {decorate}
          {title}
        </h1>
      </div>
      {children}
    </section>
  );
};
FormBody.displayName = "FormBody";

export { FormBody };
