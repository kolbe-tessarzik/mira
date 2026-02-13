import { useDownloads } from '../features/downloads/DownloadProvider';

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function formatTime(ts?: number): string {
  if (!ts) return '-';
  return new Date(ts).toLocaleString();
}

function formatDuration(start?: number, end?: number): string {
  if (!start || !end || end < start) return '-';
  const secs = Math.round((end - start) / 1000);
  return `${secs}s`;
}

export default function Downloads() {
  const { downloads, cancel, openFolder } = useDownloads();
  const items = [...downloads].sort((a, b) => b.startedAt - a.startedAt);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Downloads</h2>
      {items.length === 0 && <div>No downloads yet.</div>}

      {items.map((d) => {
        const progress =
          d.totalBytes > 0 ? Math.min((d.receivedBytes / d.totalBytes) * 100, 100) : 0;
        const isActive = d.status === 'pending' || d.status === 'in-progress';
        const sourceHost = (() => {
          try {
            return new URL(d.url).host;
          } catch {
            return '-';
          }
        })();

        return (
          <div
            key={`${d.id}-${d.startedAt}`}
            style={{
              border: '1px solid #444',
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              background: '#202225',
              color: '#f5f5f5',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, wordBreak: 'break-all' }}>
              {d.filename}
            </div>

            <div
              style={{ fontSize: 12, color: '#c6c6c6', marginBottom: 8, wordBreak: 'break-all' }}
            >
              {d.url}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 4,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              <div style={{ color: '#9aa0a6' }}>Status</div>
              <div>{d.status}</div>

              <div style={{ color: '#9aa0a6' }}>Source</div>
              <div>{sourceHost}</div>

              <div style={{ color: '#9aa0a6' }}>Progress</div>
              <div>
                {formatBytes(d.receivedBytes)} /{' '}
                {d.totalBytes > 0 ? formatBytes(d.totalBytes) : 'Unknown size'} (
                {d.totalBytes > 0 ? `${progress.toFixed(1)}%` : '-'})
              </div>

              <div style={{ color: '#9aa0a6' }}>Started</div>
              <div>{formatTime(d.startedAt)}</div>

              <div style={{ color: '#9aa0a6' }}>Finished</div>
              <div>{formatTime(d.endedAt)}</div>

              <div style={{ color: '#9aa0a6' }}>Duration</div>
              <div>{formatDuration(d.startedAt, d.endedAt)}</div>

              <div style={{ color: '#9aa0a6' }}>Download ID</div>
              <div style={{ wordBreak: 'break-all' }}>{d.id}</div>

              {d.savePath && (
                <>
                  <div style={{ color: '#9aa0a6' }}>Saved to</div>
                  <div style={{ wordBreak: 'break-all' }}>{d.savePath}</div>
                </>
              )}

              {d.error && (
                <>
                  <div style={{ color: '#ff8b8b' }}>Error</div>
                  <div style={{ color: '#ff8b8b' }}>{d.error}</div>
                </>
              )}
            </div>

            {isActive && (
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{ height: 6, background: '#444', borderRadius: 999, overflow: 'hidden' }}
                >
                  <div style={{ width: `${progress}%`, height: '100%', background: '#3aa675' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              {d.status === 'completed' && d.savePath && (
                <button
                  onClick={() => openFolder(d.savePath!)}
                  style={{
                    border: '1px solid #3aa675',
                    background: 'transparent',
                    color: '#3aa675',
                  }}
                >
                  Show in folder
                </button>
              )}

              {isActive && (
                <button
                  onClick={() => cancel(d.id)}
                  style={{
                    border: '1px solid #d9534f',
                    background: 'transparent',
                    color: '#d9534f',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
