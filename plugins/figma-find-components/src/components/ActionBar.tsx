import { h } from 'preact';
import { emit } from '@create-figma-plugin/utilities';
import {
  ILocalInstance,
  DetachInstances,
  DeleteInstances,
  IComponent,
} from '../types';
import { IconButton } from './button';
import { IconLinkBreak, IconTrash } from '../icons';
import Select from './Select';

interface Props {
  checkedInstanceIds: { [key: string]: boolean };
  data: Record<string, Record<string, ILocalInstance[]>>;
  dropdownOptions: IComponent[];
}

export default function ActionBar({
  checkedInstanceIds,
  data,
  dropdownOptions,
}: Props): h.JSX.Element {
  const checkedComponentInstances = Object.keys(data).reduce(
    (acc, mainCompName) => {
      Object.keys(data[mainCompName]).forEach((pageName) => {
        const instances = data[mainCompName][pageName];
        const isAnyInstanceCheckedInGroup = instances.some(
          (instance) => checkedInstanceIds[instance.id]
        );
        if (isAnyInstanceCheckedInGroup) {
          acc.push(...instances);
        }
      });
      return acc;
    },
    [] as ILocalInstance[]
  );

  const handleDetach = () => {
    emit<DetachInstances>('DETACH_INSTANCES', checkedComponentInstances);
  };
  const handleDelete = () => {
    emit<DeleteInstances>('DELETE_INSTANCES', checkedComponentInstances);
  };

  return (
    <div className="group fixed bottom-4 z-20 flex w-full items-center justify-center">
      <div className="flex w-64 gap-1 rounded-xl border border-black border-opacity-10 bg-white px-3 py-2 dark:border-white dark:border-opacity-10 dark:bg-black">
        <IconButton onClick={handleDetach}>
          <IconLinkBreak size={28} />
        </IconButton>
        <Select
          checkedInstances={checkedComponentInstances}
          options={{ local: dropdownOptions }}
        />
        <IconButton onClick={handleDelete}>
          <IconTrash size={28} />
        </IconButton>
      </div>
    </div>
  );
}
