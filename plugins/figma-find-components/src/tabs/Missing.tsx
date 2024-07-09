import { Button, IconLayerComponent16 } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { groupComponentsByParent, IInstance } from '@repo/utils';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import InstanceDisplayer from '../components/InstanceDisplayer';
import {
  FindAllInstances,
  GetLibraries,
  GetNodeByID,
  GetThisInstance,
  ScanLibrary,
  TLibrary,
  UpdateInstances,
} from '../types';
import { groupByPage } from '../utils';

export default function Missing(): h.JSX.Element {
  const [checkedInstanceIds, setCheckedInstanceIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [groupedInstances, setGroupedInstances] = useState<{
    [key: string]: Record<string, IInstance[]>;
  }>({});

  on<UpdateInstances>('UPDATE_INSTANCES', (instances: IInstance[]) => {
    setGroupedInstances(groupByPage(groupComponentsByParent(instances)));
  });

  const isAnyInstanceChecked = Object.values(checkedInstanceIds).some(
    (isChecked) => isChecked
  );

  return (
    <div className="mt-12">
      {Object.keys(groupedInstances).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex items-center gap-2 px-4 py-2 text-sm">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(groupedInstances[mainCompName]).map((pageName) => {
            const instancessss = groupedInstances[mainCompName][pageName];

            return (
              <InstanceDisplayer
                key={instancessss[0].id}
                instances={instancessss}
                pageName={pageName}
                checkedInstanceIds={checkedInstanceIds}
                setCheckedInstanceIds={setCheckedInstanceIds}
                isAnyInstanceChecked={isAnyInstanceChecked}
              />
            );
          })}
        </div>
      ))}
      <Button onClick={() => emit<ScanLibrary>('SCAN_LIBRARY')}>
        Scan this file as library
      </Button>
      <Button onClick={() => emit<FindAllInstances>('FIND_ALL_INSTANCES')}>
        Find All Instances
      </Button>
    </div>
  );
}
