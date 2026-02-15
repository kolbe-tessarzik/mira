import React, { useState } from 'react';
import miraLogo from '../assets/mira_logo.png';
import { useTabs } from '../features/tabs/TabsProvider';

export default function NewTab() {
  const [query, setQuery] = useState('');
  const { navigate } = useTabs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const searchQuery = new URLSearchParams({ q: trimmed }).toString();
    navigate(`https://www.google.com/search?${searchQuery}`);
    setQuery('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '12vh',
        background: 'var(--bg)',
        color: 'var(--text1)',
      }}
    >
      <img src={miraLogo} alt="Mira logo" style={{ width: 220, height: 220, objectFit: 'contain' }} />
      <h1 style={{ marginTop: 20, fontSize: 34, fontWeight: 700, letterSpacing: 0.3 }}>Welcome to Mira</h1>
      <form
        onSubmit={handleSearch}
        style={{ display: 'flex', width: '60%', maxWidth: 600, minWidth: 320, marginTop: 28 }}
      >
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
