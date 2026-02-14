import React, { useState } from 'react';
import { useTabs } from '../features/tabs/TabsProvider';

export default function NewTab() {
  const [query, setQuery] = useState('');
  const { navigate } = useTabs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const query = new URLSearchParams({ q: trimmed }).toString();
    const searchUrl = `https://www.google.com/search?${query}`;
    navigate(searchUrl); // <-- update current tab, not create a new window
    setQuery('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text1)',
      }}
    >
      <form onSubmit={handleSearch} style={{ display: 'flex', width: '60%', maxWidth: 600 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Google..."
          style={{
            flex: 1,
            padding: '10px 15px',
            fontSize: 18,
            borderRadius: '6px 0 0 6px',
          }}
          className="theme-input"
        />
        <button
          type="submit"
          className="theme-btn theme-btn-go"
          style={{
            padding: '10px 20px',
            fontSize: 18,
            borderRadius: '0 6px 6px 0',
          }}
        >
          Search
        </button>
      </form>
    </div>
  );
}
