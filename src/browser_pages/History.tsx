import { useEffect, useMemo, useState } from 'react';
import { useTabs } from '../features/tabs/TabsProvider';
import { listHistoryEntries } from '../features/history/clientHistory';
import type { HistoryEntry } from '../features/history/clientHistory';

function formatDayHeading(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getDayKey(ts: number): string {
  const date = new Date(ts);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function History() {
  const { navigate } = useTabs();
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listHistoryEntries()
      .then((list) => {
        if (!mounted) return;
        setItems(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo(() => {
    const grouped: Array<{ dayKey: string; heading: string; entries: HistoryEntry[] }> = [];
    const map = new Map<string, number>();

    for (const entry of items) {
      const dayKey = getDayKey(entry.visitedAt);
      const existingIdx = map.get(dayKey);
      if (existingIdx !== undefined) {
        grouped[existingIdx].entries.push(entry);
        continue;
      }
      map.set(dayKey, grouped.length);
      grouped.push({
        dayKey,
        heading: formatDayHeading(entry.visitedAt),
        entries: [entry],
      });
    }

    return grouped;
  }, [items]);

  return (
    <div style={{ padding: 20, background: 'var(--bg)', color: 'var(--text1)', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>History</h2>
      </div>

      {loading && <div>Loading history...</div>}
      {!loading && items.length === 0 && (
        <div className="theme-text2">No history yet. Entries are kept for 7 days.</div>
      )}

      {sections.map((section) => (
        <section key={section.dayKey} style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '8px 0', fontSize: 14 }} className="theme-text2">
            {section.heading}
          </h3>
          <div className="theme-panel" style={{ borderRadius: 8, overflow: 'hidden' }}>
            {section.entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => navigate(entry.url)}
                className="theme-btn theme-btn-nav"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: 0,
                  borderWidth: 0,
                  borderBottom: '1px solid var(--tabBorder)',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}>
                      {entry.title}
                    </div>
                    <div style={{ fontSize: 12, wordBreak: 'break-all' }} className="theme-text2">
                      {entry.url}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, flexShrink: 0 }} className="theme-text3">
                    {formatTime(entry.visitedAt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
