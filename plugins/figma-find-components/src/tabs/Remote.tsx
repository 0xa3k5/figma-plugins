import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { emit, on } from '@create-figma-plugin/utilities';
import { Button, IconLayerComponent16 } from '@create-figma-plugin/ui';
import {
  TLibrary,
  GetLibraries,
  ILocalInstance,
  UpdateUserLibraries,
  ScanLibrary,
  GetRemoteMissing,
  ClearLibraries,
} from '../types';
import { groupByMain, groupByPage } from '../utils';
import InstanceDisplayer from '../components/InstanceDisplayer';

interface Props {
  libraries: TLibrary[];
  instances: ILocalInstance[];
}

export default function Remote({ libraries, instances }: Props): h.JSX.Element {
  useEffect(() => {
    emit<GetLibraries>('GET_LIBRARIES');
    emit<GetRemoteMissing>('GET_REMOTE_MISSING');
  }, []);
  const [checkedInstanceIds, setCheckedInstanceIds] = useState<{
    [key: string]: boolean;
  }>({});
  const isAnyInstanceChecked = Object.values(checkedInstanceIds).some(
    (isChecked) => isChecked
  );

  const handleGetUserLibraries = () => {
    emit<GetLibraries>('GET_LIBRARIES');
  };

  const handleScanLibrary = () => {
    emit<ScanLibrary>('SCAN_LIBRARY');
  };
  const handleClearLibraries = () => {
    emit<ClearLibraries>('CLEAR_LIBRARIES');
  };

  useEffect(() => {
    on<UpdateUserLibraries>(
      'UPDATE_USER_LIBRARIES',
      (data) => libraries === data
    );
  });

  if (libraries.length === 0) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4 py-8">
        <h2 className="">No User Libraries</h2>
        <Button onClick={handleScanLibrary}>Scan this file as library</Button>
        <Button onClick={handleGetUserLibraries}>Find User Libraries</Button>
        <Button onClick={handleClearLibraries}>CLEAR LIBRARIES</Button>
      </div>
    );
  }

  const grouped = groupByPage(groupByMain(instances));

  console.log('instance', instances);
  console.log(grouped, 'grouped');

  return (
    <div className="mt-12">
      <div className="">
        {Object.values(libraries).map((library) => (
          <div key={library.name}>
            <span>Lib: {library.name}</span>
          </div>
        ))}
      </div>
      {Object.keys(grouped).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex items-center gap-2 px-4 py-2 text-sm">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(grouped[mainCompName]).map((pageName) => {
            const instancessss = grouped[mainCompName][pageName];
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
      <Button onClick={handleScanLibrary}>Scan this file as library</Button>
      <Button onClick={handleGetUserLibraries}>Find User Libraries</Button>
      <Button onClick={handleClearLibraries}>CLEAR LIBRARIES</Button>
    </div>
  );
}
