import { IconChevronDown16, IconTarget16 } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { IVariable, IVariableCollection, PropertyType, PropertyValues } from '../types';
import { getIcon } from '../utils';
import { handleValueSelect } from '../utils/event-handlers';
import VariableDropdown from './VariableDropdown';

interface Props {
  propertyKey: string;
  totalCount: number;
  value: PropertyValues;
  variables: IVariable[];
  collections: IVariableCollection[];
}

export default function ValueDisplay({
  propertyKey,
  totalCount,
  value,
  variables,
  collections,
}: Props): h.JSX.Element {
  const [isSectionExpanded, setIsSectionExpanded] = useState<{
    [propertyType: string]: boolean;
  }>(Object.fromEntries(Object.values(PropertyType).map((type) => [type, true])));

  const handleSectionToggle = (propertyType: PropertyType) => {
    setIsSectionExpanded((prevState) => ({
      ...prevState,
      [propertyType]: !prevState[propertyType],
    }));
  };

  const matchingVariables: IVariable[] = variables.filter((variable) => {
    const valuesByMode = variable.valuesByMode;

    return Object.values(valuesByMode).includes(parseFloat(propertyKey));
  });

  const renderValueSection = (section: PropertyType) => {
    const sectionData = value[section];

    return Object.keys(sectionData).length > 0 ? (
      <div className="size-full py-2 pl-2">
        <div className="flex w-full justify-between">
          <button
            className="inline-flex items-center gap-2"
            onClick={() => handleSectionToggle(section)}
          >
            <IconChevronDown16
              className={`${isSectionExpanded[section] ? null : '-rotate-90'} duration-200`}
            />
            <h6 className="text-[0.25rem] font-normal uppercase tracking-widest">{section}</h6>
            <span className="flex gap-2 text-xs opacity-60">
              <span>•</span>
              <span>
                (
                {Object.values(sectionData).reduce(
                  (sectionTotal, directionData) => sectionTotal + directionData.count,
                  0
                )}
                )
              </span>
            </span>
          </button>
          {matchingVariables.length > 0 && (
            <VariableDropdown
              propertyKey={propertyKey}
              propertyType={section}
              collections={collections}
              variables={matchingVariables}
            />
          )}
        </div>
        <div className="flex flex-col font-mono">
          {Object.entries(sectionData).map(
            ([direction, data], i) =>
              isSectionExpanded[section] && (
                <button
                  key={i}
                  className="group flex items-center justify-between py-2 pr-1 duration-200"
                  onClick={() => handleValueSelect(propertyKey, section, direction)}
                >
                  <span className="ml-4 flex items-center gap-2 text-xs opacity-60 group-hover:cursor-pointer group-hover:opacity-100">
                    <span className="group-hover:cursor-pointer">
                      {getIcon(section, direction.toLowerCase())}
                    </span>
                    <span className="group-hover:cursor-pointer">{`${section}-${direction.toLowerCase()}`}</span>
                    <span className="flex gap-1 text-xs opacity-60">
                      <span>•</span>
                      <span>({data.count})</span>
                    </span>
                  </span>
                  <span className="flex justify-center opacity-0 duration-100 hover:cursor-pointer group-hover:opacity-100">
                    <IconTarget16 />
                  </span>
                </button>
              )
          )}
        </div>
      </div>
    ) : null;
  };

  return (
    <div
      className="grid grid-cols-4"
      style={{
        borderTop: '1px solid var(--figma-color-border)',
      }}
    >
      <div
        className="col-span-1 flex items-start gap-2 py-4"
        style={{ borderRight: '1px solid var(--figma-color-border)' }}
      >
        <div className="sticky top-14 flex flex-wrap items-baseline gap-1 font-mono">
          <h1 className="text-sm font-semibold">{propertyKey.slice(0, 6)}px</h1>
          <span className="flex gap-1 text-xs opacity-60">
            <span>•</span>
            <span>({totalCount})</span>
          </span>
        </div>
      </div>
      <div className="col-span-3 flex flex-col gap-2 py-2">
        {Object.values(PropertyType).map((type) => renderValueSection(type))}
      </div>
    </div>
  );
}
