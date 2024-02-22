import { JSX, h } from 'preact';
import { emit } from '@create-figma-plugin/utilities';
import { StateUpdater } from 'preact/hooks';
import { ILocalInstance, SelectNodes } from '../types';
import { IconButton } from './button';
import { IconTarget } from '../icons';
import { IconInstance } from '../icons/Icons';
import Checkbox from './Checkbox';

interface Props {
  instances: ILocalInstance[];
  pageName: string;
  checkedInstanceIds: { [key: string]: boolean };
  setCheckedInstanceIds: StateUpdater<{ [key: string]: boolean }>;
  isAnyInstanceChecked: boolean;
}

export default function InstanceDisplayer({
  instances,
  pageName,
  checkedInstanceIds,
  setCheckedInstanceIds,
  isAnyInstanceChecked,
}: Props): h.JSX.Element {
  const handleSelect = () => {
    emit<SelectNodes>('SELECT_NODES', instances);
  };

  const handleCheckboxChange = (instanceId: string) => {
    setCheckedInstanceIds((prevState: { [key: string]: boolean }) => ({
      ...prevState,
      [instanceId]: !prevState[instanceId],
    }));
  };

  const handleGroupClick = (instanceId: string) => {
    handleSelect();
    handleCheckboxChange(instanceId);
  };

  return (
    <div className="group flex w-full items-center justify-between gap-3 px-4 py-1 text-sm">
      <Checkbox
        value={checkedInstanceIds[instances[0].id] || false}
        onChange={() => handleCheckboxChange(instances[0].id)}
        className={`${isAnyInstanceChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      />
      <button
        type="button"
        className="flex w-full items-center gap-1"
        onClick={() => handleGroupClick(instances[0].id)}
      >
        <IconInstance />
        <p>{instances[0].name}</p>
        <span className="opacity-40">{'->'}</span>
        <span className="">{`${instances.length} instances`}</span>
        <span className="opacity-40">on</span>
        <span className="">{pageName}</span>
      </button>
      <IconButton
        onClick={handleSelect}
        className="opacity-0 group-hover:opacity-100"
      >
        <IconTarget />
      </IconButton>
    </div>
  );
}
