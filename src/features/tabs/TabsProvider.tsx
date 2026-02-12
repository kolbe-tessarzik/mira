import { createContext, useContext, useState } from 'react';
import type { Tab } from './types';

type TabsContextType = {
  tabs: Tab[];
  activeId: string;
  newTab: (url?: string) => void;
  closeTab: (id: string) => void;
  navigate: (url: string) => void;
  setActive: (id: string) => void;
};

const TabsContext = createContext<TabsContextType>(null!);

export const useTabs = () => useContext(TabsContext);

export default function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([{ id: crypto.randomUUID(), url: 'https://google.com' }]);

  const [activeId, setActiveId] = useState(tabs[0].id);

  const newTab = (url = 'mira://NewTab') => {
    const id = crypto.randomUUID();
    setTabs((t) => [...t, { id, url }]);
    setActiveId(id);
  };

  const closeTab = (id: string) => {
    setTabs((t) => {
      const next = t.filter((tab) => tab.id !== id);
      if (id === activeId && next.length) setActiveId(next[0].id);
      return next;
    });
  };

  const navigate = (url: string) => {
    setTabs((t) => t.map((tab) => (tab.id === activeId ? { ...tab, url } : tab)));
  };

  return (
    <TabsContext.Provider
      value={{ tabs, activeId, newTab, closeTab, navigate, setActive: setActiveId }}
    >
      {children}
    </TabsContext.Provider>
  );
}
