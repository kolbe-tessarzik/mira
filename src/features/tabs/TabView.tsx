import { useTabs } from "./TabsProvider";

export default function TabView() {
  const { tabs, activeId } = useTabs();

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {tabs.map((tab) => (
        <webview
          key={tab.id}
          src={tab.url}
          allowpopups
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: tab.id === activeId ? "block" : "none",
          }}
        />
      ))}
    </div>
  );
}
