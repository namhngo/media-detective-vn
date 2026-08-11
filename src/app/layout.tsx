import type { Metadata } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import { MotionProvider } from "@/components/motion-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { ShareApp } from "@/components/share-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { getServerLanguage } from "@/lib/server-i18n";

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
  metadataBase: new URL("https://media-detective-vn.vercel.app"),
  openGraph: {
    title: "Media Detective Vietnam — AI-assisted media literacy",
    description:
      "Check suspicious posts before sharing. Media Detective explains scam and misinformation patterns so you can decide for yourself.",
    siteName: "Media Detective Vietnam",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Media Detective Vietnam — AI-assisted media literacy",
    description:
      "Check suspicious posts before sharing. AI assists, you decide.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const language = await getServerLanguage();
  return (
    <html lang={language} className={`${beVietnamPro.variable} ${plexMono.variable}`}>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <I18nProvider>
            <MotionProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <ShareApp floating />
              <Toaster />
            </MotionProvider>
          </I18nProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
