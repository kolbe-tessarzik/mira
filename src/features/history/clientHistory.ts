import { electron } from '../../electronBridge';

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
}

const HISTORY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const DEV_HISTORY_KEY = 'mira_history';

function prune(entries: HistoryEntry[]): HistoryEntry[] {
  const cutoff = Date.now() - HISTORY_RETENTION_MS;
  return entries
    .filter((entry) => entry.visitedAt >= cutoff)
    .sort((a, b) => b.visitedAt - a.visitedAt);
}

function loadLocal(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(DEV_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return prune(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function saveLocal(entries: HistoryEntry[]) {
  localStorage.setItem(DEV_HISTORY_KEY, JSON.stringify(prune(entries)));
}

export async function addHistoryEntry(url: string, title: string): Promise<void> {
  const normalized = url.trim();
  if (!normalized || normalized.startsWith('mira://')) return;

  if (electron?.ipcRenderer) {
    await electron.ipcRenderer.invoke('history-add', { url: normalized, title: title.trim() || normalized });
    return;
  }

  const now = Date.now();
  const entries = loadLocal();
  const latest = entries[0];
  if (latest && latest.url === normalized && now - latest.visitedAt < 1500) {
    return;
  }

  saveLocal([
    {
      id: crypto.randomUUID(),
      url: normalized,
      title: title.trim() || normalized,
      visitedAt: now,
    },
    ...entries,
  ]);
}

export async function listHistoryEntries(): Promise<HistoryEntry[]> {
  if (electron?.ipcRenderer) {
    const list = await electron.ipcRenderer.invoke<HistoryEntry[]>('history-list');
    return prune(Array.isArray(list) ? list : []);
  }

  const entries = loadLocal();
  saveLocal(entries);
  return entries;
}
