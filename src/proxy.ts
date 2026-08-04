import { clerkMiddleware } from "@clerk/nextjs/server";

// Resource-level auth lives in each protected page and route handler. This
// middleware remains required for Clerk's App Router integration and tokens.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Clerk uses this path for automatic auth handling.
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
