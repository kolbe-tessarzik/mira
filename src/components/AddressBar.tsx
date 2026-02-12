import { useState, useEffect } from 'react';
import { useTabs } from '../features/tabs/TabsProvider';

export default function AddressBar() {
  const { tabs, activeId, navigate } = useTabs();
  const [input, setInput] = useState('');

  // Sync input with the active tab's URL
  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeId);
    if (!activeTab) return;

    // Only show the URL if it's not the NewTab page
    if (activeTab.url === 'mira://NewTab') {
      setInput('');
    } else {
      setInput(activeTab.url);
    }
  }, [tabs, activeId]);

  const go = () => {
    let url = input.trim();
    if (!url) return;

    // If user didn't type a protocol, assume https
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mira://')) {
      url = 'https://' + url;
    }

    navigate(url);
  };

  return (
    <div style={{ display: 'flex', padding: 4, background: 'var(--address-bar-bg, #222)' }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        style={{
          flex: 1,
          padding: '6px 10px',
          fontSize: 16,
          borderRadius: 4,
          border: '1px solid #555',
          outline: 'none',
          background: 'var(--input-bg, #333)',
          color: 'var(--input-fg, #fff)',
        }}
        placeholder="Enter URL"
      />
      <button
        onClick={go}
        style={{
          marginLeft: 4,
          padding: '6px 12px',
          fontSize: 16,
          borderRadius: 4,
          border: '1px solid #555',
          background: '#4285F4',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Go
      </button>
    </div>
  );
}
