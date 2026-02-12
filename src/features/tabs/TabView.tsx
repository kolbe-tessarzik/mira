/// <reference types="vite/client" />
import React, { useRef } from 'react';
import { useTabs } from './TabsProvider';

interface WebviewNavigationEvent extends Event {
  url: string;
}

interface WebviewElement extends HTMLElement {
  src: string;
  didNavigateHandler?: (e: WebviewNavigationEvent) => void;
  didNavigateInPageHandler?: (e: WebviewNavigationEvent) => void;
}

// Load all internal pages
const modules = import.meta.glob('../../browser_pages/**/*.tsx', { eager: true }) as Record<
  string,
  { default: React.ComponentType }
>;

const pages = Object.entries(modules).reduce<Record<string, React.ComponentType>>(
  (acc, [path, mod]) => {
    const m = path.match(/\/browser_pages\/(.+)\.tsx$/);
    if (!m) return acc;
    const route = m[1].replace(/\\/g, '/').toLowerCase();
    acc[route] = mod.default;
    const idxRoute = route.replace(/\/index$/, '');
    if (idxRoute !== route && !(idxRoute in acc)) acc[idxRoute] = mod.default;
    return acc;
  },
  {},
);

function isInternal(url: string) {
  return url.startsWith('mira://');
}

function renderInternal(url: string) {
  const routeRaw = url.replace(/^mira:\/\//, '').replace(/^\/+|\/+$/g, '');
  const route = routeRaw.toLowerCase();
  const Page = pages[route];
  if (Page) return <Page />;
  return <div style={{ padding: 20 }}>Unknown internal page: {routeRaw}</div>;
}

export default function TabView() {
  const { tabs, activeId, navigate } = useTabs();
  const webviewRefs = useRef<Record<string, WebviewElement>>({});

  return (
    <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
      {tabs.map((tab) => {
        const isVisible = tab.id === activeId;

        return (
          <div
            key={tab.id}
            style={{
              position: 'absolute',
              inset: 0,
              visibility: isVisible ? 'visible' : 'hidden',
              pointerEvents: isVisible ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {isInternal(tab.url) ? (
              <div style={{ flex: 1, overflow: 'auto' }}>{renderInternal(tab.url)}</div>
            ) : (
              <webview
                ref={(el) => {
                  if (!el) return;
                  const wv = el as unknown as WebviewElement;
                  webviewRefs.current[tab.id] = wv;

                  if (wv.didNavigateHandler) {
                    wv.removeEventListener('did-navigate', wv.didNavigateHandler as EventListener);
                  }
                  if (wv.didNavigateInPageHandler) {
                    wv.removeEventListener(
                      'did-navigate-in-page',
                      wv.didNavigateInPageHandler as EventListener,
                    );
                  }

                  const didNavigateHandler = (e: Event) => {
                    const event = e as WebviewNavigationEvent;
                    navigate(event.url);
                  };

                  const didNavigateInPageHandler = (e: Event) => {
                    const event = e as WebviewNavigationEvent;
                    navigate(event.url);
                  };

                  wv.didNavigateHandler = didNavigateHandler as (e: WebviewNavigationEvent) => void;
                  wv.didNavigateInPageHandler = didNavigateInPageHandler as (
                    e: WebviewNavigationEvent,
                  ) => void;

                  wv.addEventListener('did-navigate', didNavigateHandler);
                  wv.addEventListener('did-navigate-in-page', didNavigateInPageHandler);
                }}
                src={tab.url}
                allowpopups={true}
                style={{ flex: 1, width: '100%', height: '100%' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
