import { Button } from '@create-figma-plugin/ui';
import { IconComponent } from '@repo/ui';
import { groupComponentsByParent, IComponent, IInstance } from '@repo/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import ActionBar from '../components/ActionBar';
import InstanceDisplayer from '../components/InstanceDisplayer';
import { groupByPage } from '../utils';

interface Props {
  localMissing: IInstance[];
  localMain: IComponent[];
  handleGetLocalMissing: () => void;
}

export default function Local({
  localMissing,
  localMain,
  handleGetLocalMissing,
}: Props): h.JSX.Element {
  const [checkedInstanceIds, setCheckedInstanceIds] = useState<{
    [key: string]: boolean;
  }>({});
  const groupedLocalMissing = groupByPage(
    groupComponentsByParent(localMissing)
  );

  const isAnyInstanceChecked = Object.values(checkedInstanceIds).some(
    (isChecked) => isChecked
  );

  if (localMissing.length === 0) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4 py-8">
        <h2 className="text-base">No Locally Missing</h2>
        <Button onClick={handleGetLocalMissing}>Find Local Missing</Button>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col gap-4">
      {Object.keys(groupedLocalMissing).map((mainCompId) => (
        <div className="flex flex-col items-start" key={mainCompId}>
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <IconComponent color="#9747FF" />
            <span>
              {
                Object.values(groupedLocalMissing[mainCompId])[0][0]
                  .mainComponent?.name
              }
            </span>
          </div>
          {Object.keys(groupedLocalMissing[mainCompId]).map((pageName) => {
            const instances = groupedLocalMissing[mainCompId][pageName];

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

      {isAnyInstanceChecked && (
        <ActionBar
          data={groupedLocalMissing}
          dropdownOptions={localMain}
          checkedInstanceIds={checkedInstanceIds}
        />
      )}
    </div>
  );
}
