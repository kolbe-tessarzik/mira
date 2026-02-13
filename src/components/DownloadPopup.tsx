import { useDownloads } from '../features/downloads/DownloadProvider';
import { useTabs } from '../features/tabs/TabsProvider';

interface Props {
  onClose: () => void;
}

export default function DownloadPopup({ onClose }: Props) {
  const { downloads, cancel, openFolder } = useDownloads();
  const { newTab } = useTabs();
  const recent = [...downloads].sort((a, b) => b.startedAt - a.startedAt).slice(0, 5);

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 4px)',
        width: 320,
        maxHeight: 420,
        overflowY: 'auto',
        background: '#222',
        border: '1px solid #444',
        borderRadius: 4,
        zIndex: 1000,
        padding: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#fff' }}>Downloads</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              newTab('mira://Downloads');
              onClose();
            }}
            style={{
              background: 'transparent',
              border: '1px solid #666',
              borderRadius: 4,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
              padding: '2px 6px',
            }}
          >
            Open Page
          </button>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>

      {recent.length === 0 && <div style={{ color: '#aaa' }}>No recent downloads</div>}

      {recent.map((d) => {
        const progress = d.totalBytes > 0 ? (d.receivedBytes / d.totalBytes) * 100 : 0;
        const isActive = d.status === 'pending' || d.status === 'in-progress';

        return (
          <div key={`${d.id}-${d.startedAt}`} style={{ marginBottom: 10, color: '#fff' }}>
            <div style={{ fontSize: 13, wordBreak: 'break-all' }}>{d.filename}</div>

            {isActive && (
              <div style={{ height: 4, background: '#555', borderRadius: 2, marginTop: 3 }}>
                <div
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: '100%',
                    background: '#4caf50',
                  }}
                />
              </div>
            )}

            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>
              {d.status === 'pending' && 'Starting...'}
              {d.status === 'in-progress' &&
                `${(d.receivedBytes / 1024).toFixed(0)} KB / ${d.totalBytes > 0 ? `${(d.totalBytes / 1024).toFixed(0)} KB` : 'unknown size'}`}
              {d.status === 'completed' && 'Completed'}
              {d.status === 'error' && `Error: ${d.error ?? 'unknown'}`}
              {d.status === 'canceled' && 'Canceled'}

              {d.status === 'completed' && d.savePath && (
                <button
                  onClick={() => openFolder(d.savePath!)}
                  style={{
                    marginLeft: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#4caf50',
                    cursor: 'pointer',
                  }}
                >
                  Show
                </button>
              )}

              {isActive && (
                <button
                  onClick={() => cancel(d.id)}
                  style={{
                    marginLeft: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#e53935',
                    cursor: 'pointer',
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
