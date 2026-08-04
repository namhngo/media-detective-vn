import type { Metadata } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bevn",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Media Detective Vietnam — AI-assisted media literacy",
  description:
    "Check suspicious content, learn the manipulation techniques behind scams and fake news, and help others spot them. AI assists, you decide.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} ${plexMono.variable}`}>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ClerkProvider>
          <MotionProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
