import { Fragment, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export interface TabItem {
  label: string;
  content: h.JSX.Element;
}

interface TabBarProps {
  tabs: TabItem[];
}

export default function TabBar({ tabs }: TabBarProps): h.JSX.Element {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tabsElements = tabsRef.current?.children;
    const activeTabElement = tabsElements
      ? (tabsElements[activeTabIndex] as HTMLElement)
      : null;

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTabIndex]);

  return (
    <Fragment>
      <ul
        className="border-border bg-bg sticky top-0 z-50 flex border-b"
        ref={tabsRef}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <li
            key={tab.label}
            className={`px-4 py-2 font-semibold ${index === activeTabIndex ? 'text-text' : 'text-text-secondary'}`}
            role="tab"
            aria-selected={index === activeTabIndex}
            tabIndex={0}
            onClick={() => setActiveTabIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setActiveTabIndex(index);
            }}
          >
            {tab.label}
          </li>
        ))}
        <div
          className="border-bg-brand absolute bottom-0 h-1 border-b transition-all duration-150"
          style={indicatorStyle}
        />
      </ul>
      <div>{tabs[activeTabIndex].content}</div>
    </Fragment>
  );
}
