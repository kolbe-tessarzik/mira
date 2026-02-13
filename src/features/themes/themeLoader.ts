import type { Theme } from '../../themes/types';

const modules = import.meta.glob('../../themes/*.json', { eager: true });

const CUSTOM_THEME_STORAGE_KEY = 'mira.themes.custom.v1';
export const DEFAULT_THEME_ID = 'default_dark';

type StoredTheme = { id: string; theme: Theme };

export type ThemeEntry = {
  id: string;
  theme: Theme;
  source: 'bundled' | 'custom';
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTheme(value: unknown): Theme | null {
  if (!isRecord(value)) return null;

  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const author = typeof value.author === 'string' ? value.author.trim() : '';
  if (!name || !author) return null;

  if (!isRecord(value.colors)) return null;

  const colors: Record<string, string> = {};
  Object.entries(value.colors).forEach(([key, raw]) => {
    if (!key || typeof raw !== 'string') return;
    colors[key] = raw;
  });

  if (!Object.keys(colors).length) return null;

  return {
    name,
    author,
    colors,
  };
}

function moduleToTheme(moduleValue: unknown): Theme | null {
  if (!isRecord(moduleValue)) return normalizeTheme(moduleValue);

  if ('default' in moduleValue) {
    return normalizeTheme(moduleValue.default);
  }

  return normalizeTheme(moduleValue);
}

function pathToThemeId(path: string): string | null {
  const match = path.match(/\/([^/]+)\.json$/);
  if (!match) return null;
  return match[1].trim();
}

const bundledThemes: ThemeEntry[] = Object.entries(modules).flatMap(([path, moduleValue]) => {
  const id = pathToThemeId(path);
  const theme = moduleToTheme(moduleValue);
  if (!id || !theme) return [];
  return [{ id, theme, source: 'bundled' as const }];
});

function readCustomThemes(): StoredTheme[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => {
        if (!isRecord(entry)) return null;
        const id = typeof entry.id === 'string' ? entry.id.trim() : '';
        const theme = normalizeTheme(entry.theme);
        if (!id || !theme) return null;
        return { id, theme };
      })
      .filter((entry): entry is StoredTheme => entry !== null);
  } catch {
    return [];
  }
}

function writeCustomThemes(themes: StoredTheme[]) {
  try {
    localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(themes));
  } catch {
    // Ignore storage failures.
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createCustomThemeId(theme: Theme, existingIds: Set<string>): string {
  const base = `${slugify(theme.name)}-${slugify(theme.author)}`.replace(/^-+|-+$/g, '') || 'custom-theme';
  let candidate = base;
  let counter = 2;
  while (existingIds.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function getAllThemes(): ThemeEntry[] {
  const customEntries: ThemeEntry[] = readCustomThemes().map((entry) => ({
    id: entry.id,
    theme: entry.theme,
    source: 'custom',
  }));

  const byId = new Map<string, ThemeEntry>();
  bundledThemes.forEach((entry) => byId.set(entry.id, entry));
  customEntries.forEach((entry) => byId.set(entry.id, entry));

  return Array.from(byId.values());
}

export function getThemeById(themeId: string | null | undefined): Theme | null {
  const allThemes = getAllThemes();
  const selected = allThemes.find((entry) => entry.id === themeId);
  if (selected) return selected.theme;

  const fallback = allThemes.find((entry) => entry.id === DEFAULT_THEME_ID) ?? allThemes[0];
  return fallback?.theme ?? null;
}

export function importThemeFromJson(jsonText: string): ThemeEntry {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Theme JSON is invalid.');
  }

  const theme = normalizeTheme(parsed);
  if (!theme) {
    throw new Error('Theme JSON must include name, author, and a colors object with string values.');
  }

  const customThemes = readCustomThemes();
  const existingIds = new Set(getAllThemes().map((entry) => entry.id));
  const id = createCustomThemeId(theme, existingIds);
  const storedTheme: StoredTheme = { id, theme };

  customThemes.push(storedTheme);
  writeCustomThemes(customThemes);

  return {
    id,
    theme,
    source: 'custom',
  };
}

export function deleteCustomTheme(themeId: string): boolean {
  const customThemes = readCustomThemes();
  const nextCustomThemes = customThemes.filter((entry) => entry.id !== themeId);

  if (nextCustomThemes.length === customThemes.length) {
    return false;
  }

  writeCustomThemes(nextCustomThemes);
  return true;
}
