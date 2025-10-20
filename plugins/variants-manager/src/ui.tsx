import '!./css/output.css';
import '@repo/ui/css/output.css';

import { render, useWindowResize } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { TabBar, TabItem } from '@repo/ui';
import { ResizeWindowHandler } from '@repo/utils';
import { h } from 'preact';

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

  const tabs: TabItem[] = [
    { label: 'Lint', content: <TabContent.Lint /> },
    { label: 'Find & Replace', content: <TabContent.FindReplace /> },
  ];

  return <TabBar tabs={tabs} />;
}

export default render(VariantsManager);
