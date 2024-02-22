import { h } from 'preact';
import { StateUpdater } from 'preact/hooks';
import { ETabs } from '../types';
import { IconButton } from './button';
import { IconRefresh } from '../icons';

interface TabBarProps {
  activeTab: ETabs;
  setActiveTab: StateUpdater<ETabs>;
  handleLocal: () => void;
}

export default function TabBar({
  activeTab,
  setActiveTab,
  handleLocal,
}: TabBarProps): h.JSX.Element {
  const handleRefresh = () => {
    handleLocal();
  };

  return (
    <div className="bg-bg border-border fixed inset-x-0 top-0 z-10 flex items-center justify-between border px-3 py-1">
      <div className="flex items-center gap-4">
        {Object.values(ETabs).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <IconButton onClick={handleRefresh}>
        <IconRefresh />
      </IconButton>
    </div>
  );
}
