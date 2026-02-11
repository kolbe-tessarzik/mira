import { useTabs } from './TabsProvider';

export default function TabBar() {
  const { tabs, activeId, setActive, closeTab, newTab } = useTabs();

  return (
    <div style={{ display: 'flex', background: '#222' }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            padding: '6px 10px',
            cursor: 'pointer',
            background: tab.id === activeId ? '#333' : '#222',
            color: 'white',
            display: 'flex',
            gap: 6,
          }}
        >
          Tab
          <span
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            ✕
          </span>
        </div>
      ))}

      <button onClick={() => newTab()}>＋</button>
    </div>
  );
}
