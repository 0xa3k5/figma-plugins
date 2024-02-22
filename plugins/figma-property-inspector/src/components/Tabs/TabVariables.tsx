import { IconChevronDown16, IconLayerFrame16 } from '@create-figma-plugin/ui';
import { h } from 'preact';

import { IVariable, IVariableCollection, PropertyTypeValues } from '../../types';

interface Props {
  pageData: PropertyTypeValues | null;
  keyUsageCounts: { [key: string]: number };
  variables: IVariable[];
  variableCollections: IVariableCollection[];
}

export default function TabVariables({
  pageData,
  keyUsageCounts,
  variables,
  variableCollections,
}: Props): h.JSX.Element {
  // Group variables by collection
  const groupedVariables: { [collectionId: string]: IVariable[] } = variables.reduce(
    (acc, variable) => {
      const collectionId = variable.variableCollectionId;

      acc[collectionId] = acc[collectionId] || [];
      acc[collectionId].push(variable);
      return acc;
    },
    {} as { [collectionId: string]: IVariable[] }
  );

  const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  if (!pageData || isObjectEmpty(pageData)) {
    return <div className="">null</div>;
  }

  return (
    <div className="mb-24 flex flex-col">
      {Object.keys(groupedVariables).map((collectionId) => {
        const collectionName = variableCollections.find((c) => c.id === collectionId)?.name || '';

        return (
          <div key={collectionId} className="grid w-full grid-cols-6 gap-2">
            {/* Header */}
            <button
              className="col-span-6 inline-flex w-full items-center gap-2 py-2 duration-200"
              style={{
                borderTop: '1px solid var(--figma-color-border)',
              }}
              // onClick={() => handleSectionToggle(collectionId)}
            >
              <IconChevronDown16 />
              <h6 className="text-[0.25rem] font-normal tracking-widest">{collectionName}</h6>
            </button>
            {groupedVariables[collectionId].map((variable) => (
              <div className="col-span-full flex w-full justify-between py-2 pl-1 pr-2 text-left">
                <span className="col-span-2 flex gap-2">
                  <IconLayerFrame16 />
                  <span>{variable.name}</span>
                  <span>{variable.scopes}</span>
                </span>
                {/* <span className="col-span-1 opacity-40">
                  {Object.values(variable.valuesByMode)[0]}
                </span> */}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
