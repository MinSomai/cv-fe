import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";

import Script from "next/script";

import "./globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import IntercomWidget from "./InterComWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReCV.ai",
  description: "AI-powered interview and career counseling platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${inter.className} bg-white overflow-y-auto scrollbar`}>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" />
        <Toaster />
        <IntercomWidget />
        {children}
      </body>
    </html>
  );
}
