import '!./css/output.css';
import '@repo/ui/styles.css';

import {
  render,
  Tabs,
  TabsOption,
  useWindowResize,
} from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { ResizeWindowHandler } from '@repo/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import TabContent from './components/tab-content';

function VariantsManager(): h.JSX.Element {
  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize);
  }

  useWindowResize(onWindowResize, {
    maxHeight: 720,
    maxWidth: 720,
    minHeight: 320,
    minWidth: 320,
    resizeBehaviorOnDoubleClick: 'minimize',
  });

  const tabs: TabsOption[] = [
    { value: 'Find & Replace', children: <TabContent.FindReplace /> },
    { value: 'Lint', children: <TabContent.Lint /> },
  ];
  const [activeTab, setActiveTab] = useState(tabs[1].value);

  return (
    <Tabs
      options={tabs}
      value={activeTab}
      onChange={(e: any) => {
        setActiveTab(e.target.value);
      }}
    />
  );
}

export default render(VariantsManager);
