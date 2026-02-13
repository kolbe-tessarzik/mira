import { useTabs } from '../features/tabs/TabsProvider';

export default function RestoreTabsPrompt() {
  const { restorePromptOpen, restoreTabCount, restorePreviousSession, discardPreviousSession } =
    useTabs();

  if (!restorePromptOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: 'calc(100vw - 32px)',
          background: '#1e1f22',
          color: '#f0f0f0',
          border: '1px solid #3a3a3a',
          borderRadius: 10,
          padding: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>Restore Previous Session?</h3>
        <p style={{ margin: '0 0 14px 0', color: '#c7c7c7', fontSize: 13, lineHeight: 1.4 }}>
          Mira found {restoreTabCount} tab{restoreTabCount === 1 ? '' : 's'} from your last session.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={discardPreviousSession}
            style={{
              border: '1px solid #5d5d5d',
              background: 'transparent',
              color: '#f0f0f0',
              borderRadius: 6,
              padding: '7px 12px',
              cursor: 'pointer',
            }}
          >
            Start Fresh
          </button>
          <button
            onClick={restorePreviousSession}
            style={{
              border: '1px solid #3b7cff',
              background: '#3b7cff',
              color: '#fff',
              borderRadius: 6,
              padding: '7px 12px',
              cursor: 'pointer',
            }}
          >
            Restore Tabs
          </button>
        </div>
      </div>
    </div>
  );
}
