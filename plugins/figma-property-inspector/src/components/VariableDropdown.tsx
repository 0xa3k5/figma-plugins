import { IconLayerFrame16 } from '@create-figma-plugin/ui';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { VariableIcon } from '../icons';
import { IVariable, IVariableCollection, PropertyType } from '../types';
import { handleAssignVariable } from '../utils/event-handlers';

interface VariableDropdownProps {
  collections: IVariableCollection[];
  variables: IVariable[];
  propertyType: PropertyType;
  propertyKey: string;
}

const VariableDropdown: FunctionalComponent<VariableDropdownProps> = ({
  collections,
  variables,
  propertyType,
  propertyKey,
}: VariableDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const groupedVariables: { [collectionId: string]: IVariable[] } = variables.reduce(
    (acc, variable) => {
      const collectionId = variable.variableCollectionId;

      if (!acc[collectionId]) {
        acc[collectionId] = [];
      }
      acc[collectionId].push(variable);
      return acc;
    },
    {} as { [collectionId: string]: IVariable[] }
  );

  const options: h.JSX.Element[] = [];

  Object.keys(groupedVariables).forEach((key) => {
    options.push(
      <div class="w-full pb-2" style={{ borderBottom: '1px solid var(--figma-color-border)' }}>
        {collections.find((c) => c.id === key)?.name || ''}
      </div>
    );
    groupedVariables[key].forEach((variable) => {
      options.push(
        <button
          className="flex w-full justify-between py-2 pl-1 pr-2 text-left"
          onClick={() => handleAssignVariable(propertyKey, propertyType, variable)}
        >
          <span className="flex gap-2">
            <IconLayerFrame16 />
            {variable.name}
          </span>
          <span className="opacity-40">{Object.values(variable.valuesByMode)[0]}</span>
        </button>
      );
    });
  });

  return (
    <div class="relative inline-block">
      <button
        class="inline-flex items-center rounded-md"
        onClick={() => setSelectedValue(selectedValue === null ? variables[0]?.name : null)}
      >
        <VariableIcon />
      </button>
      {selectedValue !== null && (
        <div
          class="absolute right-0 z-10 mt-2 flex w-48 flex-col whitespace-nowrap p-2"
          style={{
            border: '1px solid var(--figma-color-border)',
            backgroundColor: 'var(--figma-color-bg-tertiary)',
            color: 'var(--figma-color-text)',
          }}
        >
          {options}
        </div>
      )}
    </div>
  );
};

export default VariableDropdown;
