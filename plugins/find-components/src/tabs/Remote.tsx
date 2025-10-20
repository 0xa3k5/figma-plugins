import { Button, IconLayerComponent16 } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { groupComponentsByParent, IInstance } from '@repo/utils';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import InstanceDisplayer from '../components/InstanceDisplayer';
import {
  ClearLibraries,
  FindAllInstances,
  GetLibraries,
  ScanLibrary,
  TLibrary,
  UpdateRemoteMissingInstances,
  UpdateUserLibraries,
} from '../types';
import { groupByPage } from '../utils';

export default function RemoteMissing(): h.JSX.Element {
  const [checkedInstanceIds, setCheckedInstanceIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [groupedInstances, setGroupedInstances] = useState<{
    [key: string]: Record<string, IInstance[]>;
  }>({});

  const [libraries, setLibraries] = useState<TLibrary[]>([]);

  on<UpdateRemoteMissingInstances>(
    'UPDATE_REMOTE_MISSING_INSTANCES',
    (instances: IInstance[]) => {
      setGroupedInstances(groupByPage(groupComponentsByParent(instances)));
    }
  );

  on<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', (libraries: TLibrary[]) => {
    setLibraries(libraries);
  });

  const isAnyInstanceChecked = Object.values(checkedInstanceIds).some(
    (isChecked) => isChecked
  );

  useEffect(() => {
    emit<GetLibraries>('GET_LIBRARIES');
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-2 border-b p-4">
        {libraries.map((lib) => {
          return (
            <div className="flex w-full items-center gap-2 text-sm">
              <IconLayerComponent16 />
              <span>{lib.name}</span>
              <span className="opacity-40">{lib.components.length}</span>
            </div>
          );
        })}
        <div className="flex gap-2">
          <Button secondary onClick={() => emit<ScanLibrary>('SCAN_LIBRARY')}>
            Scan this file as library
          </Button>
          <Button
            secondary
            onClick={() => emit<ClearLibraries>('CLEAR_LIBRARIES')}
          >
            Clear Libraries
          </Button>
        </div>
      </div>
      {Object.keys(groupedInstances).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex items-center gap-2 px-4 py-2 text-sm">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(groupedInstances[mainCompName]).map((pageName) => {
            const instances = groupedInstances[mainCompName][pageName];

            return (
              <InstanceDisplayer
                key={instances[0].id}
                instances={instances}
                pageName={pageName}
                checkedInstanceIds={checkedInstanceIds}
                setCheckedInstanceIds={setCheckedInstanceIds}
                isAnyInstanceChecked={isAnyInstanceChecked}
              />
            );
          })}
        </div>
      ))}
      <Button onClick={() => emit<FindAllInstances>('FIND_ALL_INSTANCES')}>
        Find Missing Components
      </Button>
    </div>
  );
}
