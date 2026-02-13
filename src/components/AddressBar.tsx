import { useEffect, useState } from 'react';
import { useTabs } from '../features/tabs/TabsProvider';
import DownloadButton from './DownloadButton';
import { getBrowserSettings } from '../features/settings/browserSettings';

type AddressBarProps = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export default function AddressBar({ inputRef }: AddressBarProps) {
  const { tabs, activeId, navigate, goBack, goForward, reload } = useTabs();
  const [input, setInput] = useState('');

  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeId);
    if (!activeTab) return;

    if (activeTab.url === getBrowserSettings().newTabPage) {
      setInput('');
    } else {
      setInput(activeTab.url);
    }
  }, [tabs, activeId]);

  const isSupportedProtocol = (url: string) => {
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('file://') ||
      url.startsWith('mira://')
    );
  };

  const go = () => {
    const raw = input.trim();
    if (!raw) return;

    let finalUrl: string;
    if (isSupportedProtocol(raw)) {
      finalUrl = raw;
    } else if (raw.includes('.')) {
      finalUrl = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
    } else {
      const query = encodeURIComponent(raw);
      finalUrl = `https://www.google.com/search?q=${query}`;
    }

    navigate(finalUrl);
  };

  const activeTab = tabs.find((t) => t.id === activeId);
  const canGoBack = activeTab && activeTab.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 6,
        gap: 4,
        background: 'var(--bg)',
      }}
    >
      <button
        onClick={goBack}
        disabled={!canGoBack}
        title="Back"
        className="theme-btn theme-btn-nav"
        style={{ padding: '4px 8px' }}
      >
        {'<'}
      </button>

      <button
        onClick={goForward}
        disabled={!canGoForward}
        title="Forward"
        className="theme-btn theme-btn-nav"
        style={{ padding: '4px 8px' }}
      >
        {'>'}
      </button>

      <button
        onClick={reload}
        title="Refresh"
        className="theme-btn theme-btn-nav"
        style={{ padding: '4px 8px' }}
      >
        R
      </button>

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder="Enter URL"
        className="theme-input"
        style={{
          flex: 1,
          padding: '6px 10px',
          fontSize: 16,
        }}
      />

      <button
        onClick={go}
        className="theme-btn theme-btn-go"
        style={{
          padding: '6px 12px',
          fontSize: 16,
        }}
      >
        Go
      </button>

      <DownloadButton />
    </div>
  );
}
