'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  tabKey: string;
  label: string;
  content: string;
}

export default function AboutTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.tabKey ?? '');
  const current = tabs.find((t) => t.tabKey === active);

  return (
    <>
      <div className="about-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.tabKey}
            className={`about-tab ${active === tab.tabKey ? 'active' : ''}`}
            onClick={() => setActive(tab.tabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="about-tab-content">
        {current?.content ?? ''}
      </div>
    </>
  );
}
