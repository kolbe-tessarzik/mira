import { useEffect, useState } from 'react';
import { electron } from '../electronBridge';
import appIcon from '../assets/mira_icon.png';
import appWordmark from '../assets/mira.png';

function MinimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1 5.5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M3 1.5h5.5V7M1.5 3h5.5v5.5H1.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path
        d="M2.2 2.2l3.6 3.6M5.8 2.2L2.2 5.8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MacZoomIcon({ isMaximized }: { isMaximized: boolean }) {
  const triangles = isMaximized
    ? {
        topLeft: '2 4.5 2 2 4.5 2',
        bottomRight: '8 5.5 8 8 5.5 8',
      }
    : {
        topLeft: '1.5 3.8 1.5 1.5 3.8 1.5',
        bottomRight: '8.5 6.2 8.5 8.5 6.2 8.5',
      };

  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <polygon points={triangles.topLeft} fill="currentColor" />
      <polygon points={triangles.bottomRight} fill="currentColor" />
    </svg>
  );
}

export default function TopBar({ children }: { children?: React.ReactNode }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  const [showMacSymbols, setShowMacSymbols] = useState(false);

  useEffect(() => {
    setIsMacOS(/Mac|iPhone|iPad|iPod/.test(navigator.platform));

    electron?.ipcRenderer
      .invoke<boolean>('window-is-maximized')
      .then((value) => setIsMaximized(!!value))
      .catch(() => undefined);

    const onMaximizedChanged = (_event: unknown, value: boolean) => {
      setIsMaximized(!!value);
    };

    electron?.ipcRenderer.on('window-maximized-changed', onMaximizedChanged);
    return () => {
      electron?.ipcRenderer.off('window-maximized-changed', onMaximizedChanged);
    };
  }, []);

  const onMinimize = () => {
    electron?.ipcRenderer.invoke('window-minimize').catch(() => undefined);
  };

  const onToggleMaximize = () => {
    electron?.ipcRenderer.invoke('window-maximize-toggle').catch(() => undefined);
  };

  const onClose = () => {
    electron?.ipcRenderer.invoke('window-close').catch(() => undefined);
  };

  const brandSection = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingLeft: isMacOS ? 0 : 10,
        paddingRight: isMacOS ? 10 : 0,
      }}
    >
      <img src={appIcon} alt="Mira" style={{ width: 16, height: 16 }} />
      <img
        src={appWordmark}
        alt="Mira"
        style={{ height: 25, width: 'auto', marginLeft: -6, transform: 'translateY(1px)' }}
      />
    </div>
  );

  const controlsSection = isMacOS ? (
    <div
      onMouseEnter={() => setShowMacSymbols(true)}
      onMouseLeave={() => setShowMacSymbols(false)}
      onFocusCapture={() => setShowMacSymbols(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setShowMacSymbols(false);
        }
      }}
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '6px 6px 6px 10px',
        WebkitAppRegion: 'no-drag' as const,
      }}
    >
      <button
        title="Close"
        onClick={onClose}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid #d84a3a',
          background: '#ff5f57',
          color: '#7a2019',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', opacity: showMacSymbols ? 0.9 : 0, transition: 'opacity 120ms ease' }}>
          <CloseIcon />
        </span>
      </button>
      <button
        title="Minimize"
        onClick={onMinimize}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid #c99b22',
          background: '#ffbd2e',
          color: '#6c4f06',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', opacity: showMacSymbols ? 0.9 : 0, transition: 'opacity 120ms ease' }}>
          <MinimizeIcon />
        </span>
      </button>
      <button
        title={isMaximized ? 'Restore' : 'Maximize'}
        onClick={onToggleMaximize}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid #2f9f46',
          background: '#28c840',
          color: '#0f4a1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', opacity: showMacSymbols ? 0.9 : 0, transition: 'opacity 120ms ease' }}>
          <MacZoomIcon isMaximized={isMaximized} />
        </span>
      </button>
    </div>
  ) : (
    <div style={{ display: 'flex', WebkitAppRegion: 'no-drag' as const }}>
      <button
        title="Minimize"
        onClick={onMinimize}
        className="theme-btn theme-btn-nav"
        style={{
          width: 44,
          height: 38,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
        }}
      >
        <MinimizeIcon />
      </button>
      <button
        title={isMaximized ? 'Restore' : 'Maximize'}
        onClick={onToggleMaximize}
        className="theme-btn theme-btn-nav"
        style={{
          width: 44,
          height: 38,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
        }}
      >
        {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
      </button>
      <button
        title="Close"
        onClick={onClose}
        className="theme-btn theme-btn-nav"
        style={{
          width: 48,
          height: 38,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
        }}
      >
        <CloseIcon />
      </button>
    </div>
  );

  return (
    <div
      onDoubleClick={onToggleMaximize}
      style={{
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surfaceBg, var(--tabBg))',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      {isMacOS ? controlsSection : brandSection}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'stretch',
          padding: '0 8px',
          WebkitAppRegion: 'drag',
        }}
      >
        <div style={{ WebkitAppRegion: 'no-drag', minWidth: 0, display: 'flex', maxWidth: '100%' }}>
          {children}
        </div>
      </div>

      {isMacOS ? brandSection : controlsSection}
    </div>
  );
}
