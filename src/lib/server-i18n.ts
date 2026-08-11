import { cookies } from "next/headers";

import { languageCookie, normalizeLanguage, translate, type MessageKey } from "@/lib/i18n";

export async function getServerLanguage() {
  const store = await cookies();
  return normalizeLanguage(store.get(languageCookie)?.value);
}

export function serverT(language: "en" | "vi", key: MessageKey) {
  return translate(language, key);
}
