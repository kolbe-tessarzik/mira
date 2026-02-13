type ErrorLayoutProps = {
  title: string;
  subtitle: string;
  description: string;
  onReload: () => void;
};

export default function ErrorLayout({ title, subtitle, description, onReload }: ErrorLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg, #111)',
        color: 'var(--fg, #fff)',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 48, lineHeight: 1.1 }}>{title}</h1>
      <h2 style={{ margin: '10px 0 0 0', fontSize: 24, fontWeight: 600 }}>{subtitle}</h2>
      <p style={{ margin: '12px 0 0 0', fontSize: 15, color: 'var(--muted-fg, #b9b9b9)' }}>
        {description}
      </p>
      <button
        type="button"
        onClick={onReload}
        style={{
          marginTop: 18,
          padding: '8px 14px',
          borderRadius: 6,
          border: '1px solid #3b7cff',
          background: '#3b7cff',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Reload
      </button>
    </div>
  );
}
