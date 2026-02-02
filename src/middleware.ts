import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale prefix in URL
  localePrefix: "as-needed",
});

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes, static files, and Next.js internals
  matcher: [
    // Match all pathnames except:
    // - API routes (/api)
    // - Next.js internals (_next)
    // - Static files (files with extensions like .ico, .png, etc.)
    "/((?!api|_next|_vercel|get-access-token|generate-pdf|openai|.*\\..*).*)",
    // Explicitly include root to handle redirect to /en
    "/",
  ],
};
