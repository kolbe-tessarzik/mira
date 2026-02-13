import { useTabs } from './TabsProvider';

export default function TabBar() {
  const { tabs, activeId, setActive, closeTab, newTab } = useTabs();

  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        padding: '4px 0',
        alignItems: 'center',
        minWidth: 0,
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`theme-tab ${tab.id === activeId ? 'theme-tab-selected' : ''}`}
          style={{
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: 6,
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <span>Tab</span>
          {tab.isSleeping ? (
            <span title="Sleeping" style={{ fontSize: 10, opacity: 0.75 }}>
              zz
            </span>
          ) : null}
          <span
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            style={{ opacity: 0.8 }}
          >
            x
          </span>
        </div>
      ))}

      <button
        onClick={() => newTab()}
        className="theme-btn theme-btn-nav"
        style={{ padding: '5px 10px', minWidth: 34, flexShrink: 0 }}
      >
        +
      </button>
    </div>
  );
}
