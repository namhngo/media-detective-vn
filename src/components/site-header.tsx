"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanSearch } from "lucide-react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  const nav = [
    { href: "/", label: t("navHome"), short: t("navHome") },
    { href: "/dashboard", label: t("navDashboard"), short: t("navDashboard"), mobileHidden: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0c]/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap">
          <span className="flex size-8 items-center justify-center rounded-full bg-amber-400 text-[#0b0b0c] shadow-[0_0_24px_rgba(251,191,36,0.3)]">
            <ScanSearch className="size-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Media Detective
          </span>
          <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60 sm:inline">
            Vietnam
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "rounded-full px-2.5 py-1.5 text-[13px] whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
                    item.mobileHidden && "hidden sm:inline-flex",
                    active
                      ? "bg-white/10 font-medium text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="rounded-full px-2.5 py-1.5 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm"
              >
                {t("signIn")}
              </button>
            </SignInButton>
            <SignUpButton>
              <button
                type="button"
                className="hidden rounded-full bg-amber-400 px-3 py-1.5 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-amber-300 sm:inline-flex"
              >
                {t("createAccount")}
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
