import { useState } from 'react';
import { useDownloads } from '../features/downloads/DownloadProvider';
import DownloadPopup from './DownloadPopup';

export default function DownloadButton() {
  const { downloads } = useDownloads();
  const [show, setShow] = useState(false);

  const pendingCount = downloads.filter(
    (d) => d.status !== 'completed' && d.status !== 'canceled' && d.status !== 'error',
  ).length;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShow((prev) => !prev)}
        title="Downloads"
        className="theme-btn theme-btn-download"
        style={{
          padding: '4px 10px',
          fontSize: 15,
          marginLeft: 4,
        }}
      >
        DL
        {pendingCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'var(--downloadButtonBgActive)',
              border: '1px solid var(--downloadButtonBorderActive)',
              borderRadius: 999,
              minWidth: 18,
              height: 18,
              lineHeight: '16px',
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--downloadButtonTextActive)',
              padding: '0 3px',
            }}
          >
            {pendingCount}
          </span>
        )}
      </button>

      {show && <DownloadPopup onClose={() => setShow(false)} />}
    </div>
  );
}
