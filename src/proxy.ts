import { clerkMiddleware } from "@clerk/nextjs/server";

// Resource-level auth lives in each protected page and route handler. This
// middleware remains required for Clerk's App Router integration and tokens.
// Embedded auth pages keep sign-in on this site instead of the hosted portal.
export default clerkMiddleware({
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Clerk uses this path for automatic auth handling.
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
