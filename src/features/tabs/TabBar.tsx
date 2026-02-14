import { useTabs } from './TabsProvider';
import miraLogo from '../../assets/mira_logo.png';

function getDisplayTitle(url: string, title?: string): string {
  const normalizedTitle = title?.trim();
  if (normalizedTitle) return normalizedTitle;

  if (url.startsWith('mira://')) {
    const route = url.replace(/^mira:\/\//, '').trim();
    if (!route || route.toLowerCase() === 'newtab') return 'New Tab';
    return route;
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname || url;
  } catch {
    return url || 'New Tab';
  }
}

function getDisplayFavicon(url: string, favicon?: string): string | undefined {
  const normalizedFavicon = favicon?.trim();
  if (normalizedFavicon) return normalizedFavicon;
  if (url.startsWith('mira://')) return miraLogo;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return undefined;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=64`;
  } catch {
    return undefined;
  }
}

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
            padding: '6px 10px',
            cursor: 'pointer',
            borderRadius: tab.id === activeId ? '8px 8px 0 0' : '8px',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            position: 'relative',
            zIndex: tab.id === activeId ? 2 : 1,
            marginBottom: tab.id === activeId ? -1 : 1,
            background:
              tab.id === activeId
                ? 'var(--surfaceBgHover, var(--tabBgHover))'
                : undefined,
            borderBottomColor:
              tab.id === activeId
                ? 'var(--surfaceBgHover, var(--tabBgHover))'
                : undefined,
          }}
        >
          {getDisplayFavicon(tab.url, tab.favicon) ? (
            <img
              src={getDisplayFavicon(tab.url, tab.favicon)}
              alt=""
              style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0 }}
            />
          ) : (
            <span
              aria-hidden={true}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                display: 'inline-block',
                background: 'var(--borderColor, rgba(255,255,255,0.2))',
                flexShrink: 0,
              }}
            />
          )}
          <span
            title={getDisplayTitle(tab.url, tab.title)}
            style={{
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {getDisplayTitle(tab.url, tab.title)}
          </span>
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
