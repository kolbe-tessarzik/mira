import type { Theme } from "../../themes/types";

export function applyTheme(theme: Theme | null | undefined) {
  if (!theme || typeof theme !== "object") return;
  if (!theme.colors || typeof theme.colors !== "object") return;

  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value !== "string") return;
    root.style.setProperty(`--${key}`, value);
  });
}
