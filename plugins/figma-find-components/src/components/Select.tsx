import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { IComponent, ILocalInstance, ReplaceInstances } from '../types';

interface Props {
  options: Record<string, IComponent[]>;
  checkedInstances: ILocalInstance[];
}

export default function Select({
  options,
  checkedInstances,
}: Props): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<IComponent | null>(null);

  const handleSelect = (event: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const selectedId = event.currentTarget.value;
    const comp = Object.values(options)
      .flatMap((componentArr) => componentArr)
      .find((c) => c.id === selectedId);

    if (!comp) {
      console.log('this should never happen');
    } else {
      setSelectedOption(comp);
      emit<ReplaceInstances>('REPLACE_INSTANCES', {
        instances: checkedInstances,
        replaceWith: comp,
      });
      event.currentTarget.blur();
    }
  };

  return (
    <select
      value={selectedOption?.id || ''}
      onChange={(e) => handleSelect(e)}
      className="ml-2 flex w-full appearance-none rounded-lg border border-black border-opacity-10 bg-white py-2 pl-4 dark:border-white dark:border-opacity-20 dark:bg-black"
    >
      <option value="">Replace With</option>
      {Object.entries(options).map(([label, componentArr]) => (
        <optgroup key={label} label={label}>
          {componentArr.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
