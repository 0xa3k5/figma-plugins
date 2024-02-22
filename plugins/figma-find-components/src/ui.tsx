import '!./css/output.css';

import { render } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Layout from './components/Layout';
import TabBar from './components/TabBar';
import Tabs from './tabs';
import {
  ETabs,
  GetLocalMissing,
  IComponent,
  ILocalInstance,
  TLibrary,
  UpdateLocalMissing,
  UpdateRemoteComponents,
  UpdateUserLibraries,
} from './types';

function FindComponents(): h.JSX.Element {
  const [activeTab, setActiveTab] = useState(ETabs.LOCAL);

  const [localMissingInstances, setLocalMissingInstances] = useState<
    ILocalInstance[]
  >([]);
  const [localMainComponents, setLocalMainComponents] = useState<IComponent[]>(
    []
  );

  const [remoteMissingInstances, setRemoteMissingInstances] = useState<
    ILocalInstance[]
  >([]);
  const [userLibraries, setUserLibraries] = useState<TLibrary[]>([]);

  useEffect(() => {
    on<UpdateLocalMissing>(
      'UPDATE_LOCAL_MISSING',
      (data: { missing: ILocalInstance[]; components: IComponent[] }) => {
        setLocalMissingInstances(data.missing);
        setLocalMainComponents(data.components);
      }
    );
    on<UpdateRemoteComponents>(
      'UPDATE_REMOTE_COMPONENTS',
      (data: ILocalInstance[]) => {
        setRemoteMissingInstances(data);
      }
    );
    on<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', (data: TLibrary[]) => {
      setUserLibraries(data);
    });
  }, []);

  const handleGetLocalMissing = () => {
    emit<GetLocalMissing>('GET_LOCAL_MISSING');
  };

  return (
    <div className="flex flex-col gap-4 py-8">
      <TabBar
        handleLocal={handleGetLocalMissing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Layout>
        {activeTab === ETabs.LOCAL && (
          <Tabs.Local
            handleGetLocalMissing={handleGetLocalMissing}
            localMissing={localMissingInstances}
            localMain={localMainComponents}
          />
        )}
        {activeTab === ETabs.REMOTE && (
          <Tabs.Remote
            libraries={userLibraries}
            instances={remoteMissingInstances}
          />
        )}
      </Layout>
    </div>
  );
}

export default render(FindComponents);
